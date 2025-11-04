import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

// Interfaces corregidas
export interface FloorDetail {
  floorNumber: number;
  people: number;
  baseAmount: number;
  adjustment: number;
  finalAmount: number;
  adjustmentReason?: string;
  redistributedAmount?: number;
}

export interface RedistributionDetails {
  totalReduced: number;
  totalRedistributed: number;
  floorsWithReductions: number;
  floorsReceivingRedistribution: number;
  redistributionPerFloor: number;
}

export interface AguaCalculation {
  totalAmount: number;
  totalPeople: number;
  baseAmountPerPerson: number;
  floors: FloorDetail[];
  totalAdjustments: number;
  finalTotal: number;
  redistributionDetails?: RedistributionDetails;
}

@Component({
  selector: 'app-agua',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agua.html',
  styleUrls: ['./agua.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        query('.floor-card', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AguaComponent implements OnInit, OnDestroy {

  aguaForm: FormGroup;
  calculation: AguaCalculation | null = null;
  showResults = false;
  isCalculating = false;
  currentStep = 1;
  maxSteps = 3;
  private debounceTimeout: any;

  constructor(private fb: FormBuilder, private router: Router) {
    this.aguaForm = this.fb.group({
      totalAmount: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          this.currencyValidator
        ]
      ],
      numberOfFloors: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(20),
          Validators.pattern(/^\d+$/)
        ]
      ],
      floors: this.fb.array([])
    });
  }


  ngOnInit(): void {
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }

  private setupFormSubscriptions(): void {
    // Validar automáticamente cuando cambien los valores
    this.aguaForm.get('totalAmount')?.valueChanges.subscribe(() => {
      if (this.currentStep === 3 && this.calculation) {
        this.debounceCalculation();
      }
    });

    // Suscripción para el número de pisos
    this.aguaForm.get('numberOfFloors')?.valueChanges.subscribe(() => {
      if (this.currentStep === 1) {
        this.onFieldChange('numberOfFloors');
      }
    });

    // Suscripción para cambios en ajustes de pisos
    this.floorsFormArray.valueChanges.subscribe(() => {
      if (this.currentStep === 3 && this.calculation) {
        this.debounceCalculation();
      }
    });
  }

  private debounceCalculation(): void {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      if (this.isStep2Valid()) {
        this.calculateWaterBill();
      }
    }, 300);
  }

  // Validador personalizado para moneda
  private currencyValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value.toString()) ? null : { invalidCurrency: true };
  }

  // Validador personalizado para ajustes
  private adjustmentValidator(control: any) {
    const value = control.value;
    if (value === null || value === '' || value === 0) return null;

    const regex = /^-?\d+(\.\d{1,2})?$/;
    return regex.test(value.toString()) ? null : { invalidAdjustment: true };
  }

  get floorsFormArray(): FormArray {
    return this.aguaForm.get('floors') as FormArray;
  }

  get floorFormGroups(): FormGroup[] {
    return this.floorsFormArray.controls as FormGroup[];
  }

  get Math() {
    return Math;
  }

  // Navegación entre pasos
  onNextStep(): void {
    if (this.currentStep === 1 && this.isStep1Valid()) {
      this.generateFloorForms();
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.isStep2Valid()) {
      this.calculateWaterBill();
      this.currentStep = 3;
    }
  }

  onPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      if (this.currentStep === 1) {
        this.showResults = false;
        this.calculation = null;
      }
    }
  }

  // Validación de pasos
  isStep1Valid(): boolean {
    const totalAmountControl = this.aguaForm.get('totalAmount');
    const floorsControl = this.aguaForm.get('numberOfFloors');
    return !!(totalAmountControl?.valid && floorsControl?.valid);
  }

  isStep2Valid(): boolean {
    if (this.floorsFormArray.length === 0) return false;

    return this.floorsFormArray.controls.every(control => {
      const peopleControl = control.get('people');
      const adjustmentControl = control.get('adjustment');
      return peopleControl?.valid && adjustmentControl?.valid;
    });
  }

  // Generación de formularios dinámicos para pisos
  generateFloorForms(): void {
    const numberOfFloors = parseInt(this.aguaForm.get('numberOfFloors')?.value);

    // Limpiar array existente
    while (this.floorsFormArray.length !== 0) {
      this.floorsFormArray.removeAt(0);
    }

    // Generar formularios para cada piso
    for (let i = 1; i <= numberOfFloors; i++) {
      const floorGroup = this.fb.group({
        floorNumber: [i],
        people: [
          null,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(20),
            Validators.pattern(/^\d+$/)
          ]
        ],
        adjustment: [0, [this.adjustmentValidator]],
        adjustmentReason: ['', [Validators.maxLength(100)]]
      });

      this.floorsFormArray.push(floorGroup);
    }
  }

  // Función de cálculo con redistribución automática - CORREGIDA
  private calculateWithRedistribution(
    totalAmount: number,
    floorsData: any[]
  ): { floors: FloorDetail[], redistributionDetails: RedistributionDetails } {

    // Calcular total de personas
    const totalPeople = floorsData.reduce((sum: number, floor: any) =>
      sum + parseInt(floor.people), 0);

    // Calcular ajustes positivos totales (se suman al total a distribuir)
    const totalPositiveAdjustments = floorsData.reduce((sum: number, floor: any) => {
      const adjustment = parseFloat(floor.adjustment) || 0;
      return sum + (adjustment > 0 ? adjustment : 0);
    }, 0);

    // El monto base se reduce por los ajustes positivos (ya que estos se suman aparte)
    const baseForDistribution = totalAmount - totalPositiveAdjustments;

    // Calcular monto base por persona (del monto reducido)
    const baseAmountPerPerson = baseForDistribution / totalPeople;

    // Calcular montos base sin ajustes
    const floors: FloorDetail[] = floorsData.map((floor: any) => {
      const people = parseInt(floor.people);
      const baseAmount = baseAmountPerPerson * people;
      const adjustment = parseFloat(floor.adjustment) || 0;

      return {
        floorNumber: floor.floorNumber,
        people,
        baseAmount,
        adjustment,
        finalAmount: baseAmount, // Se calculará después
        adjustmentReason: floor.adjustmentReason?.trim() || '',
        redistributedAmount: 0
      };
    });

    // Calcular reducciones totales (solo ajustes negativos)
    const totalReductions = floors.reduce((sum, floor) => {
      return sum + (floor.adjustment < 0 ? Math.abs(floor.adjustment) : 0);
    }, 0);

    // Pisos que recibirán redistribución (todos los que NO tienen ajustes negativos)
    const floorsForRedistribution = floors.filter(floor => floor.adjustment >= 0);
    const redistributionPerFloor = floorsForRedistribution.length > 0
      ? totalReductions / floorsForRedistribution.length
      : 0;

    // Aplicar redistribución
    floors.forEach(floor => {
      if (floor.adjustment < 0) {
        // Piso con reducción: aplicar solo el ajuste negativo
        floor.finalAmount = Math.max(0, floor.baseAmount + floor.adjustment);
        floor.redistributedAmount = 0;
      } else if (floor.adjustment > 0) {
        // Piso con ajuste positivo: base + ajuste positivo + redistribución
        floor.redistributedAmount = redistributionPerFloor;
        floor.finalAmount = floor.baseAmount + floor.adjustment + redistributionPerFloor;
      } else {
        // Piso sin ajuste: base + redistribución
        floor.redistributedAmount = redistributionPerFloor;
        floor.finalAmount = floor.baseAmount + redistributionPerFloor;
      }
    });



    // Crear objeto redistributionDetails con tipo correcto
    const redistributionDetails: RedistributionDetails = {
      totalReduced: totalReductions,
      totalRedistributed: totalReductions,
      floorsWithReductions: floors.filter(f => f.adjustment < 0).length,
      floorsReceivingRedistribution: floorsForRedistribution.length,
      redistributionPerFloor
    };

    return { floors, redistributionDetails };
  }

  // Cálculo principal de la distribución de agua
  calculateWaterBill(): void {
    if (!this.isStep2Valid()) return;

    this.isCalculating = true;

    setTimeout(() => {
      try {
        const totalAmount = parseFloat(this.aguaForm.get('totalAmount')?.value);
        const floorsData = this.floorsFormArray.value;

        // Calcular total de personas
        const totalPeople = floorsData.reduce((sum: number, floor: any) =>
          sum + parseInt(floor.people), 0);

        if (totalPeople === 0) {
          throw new Error('Debe haber al menos una persona');
        }

        // Calcular ajustes positivos totales
        const totalPositiveAdjustments = floorsData.reduce((sum: number, floor: any) => {
          const adjustment = parseFloat(floor.adjustment) || 0;
          return sum + (adjustment > 0 ? adjustment : 0);
        }, 0);

        // Calcular monto base por persona
        const baseForDistribution = totalAmount - totalPositiveAdjustments;
        const baseAmountPerPerson = baseForDistribution / totalPeople;

        // Usar la función de redistribución
        const { floors, redistributionDetails } = this.calculateWithRedistribution(
          totalAmount,
          floorsData
        );

        // Calcular totales
        const totalAdjustments = floors.reduce((sum, floor) => sum + floor.adjustment, 0);
        const finalTotal = floors.reduce((sum, floor) => sum + floor.finalAmount, 0);

        this.calculation = {
          totalAmount,
          totalPeople,
          baseAmountPerPerson,
          floors,
          totalAdjustments,
          finalTotal,
          redistributionDetails
        };

        this.showResults = true;

        // Verificar que el total final sea igual al inicial
        const difference = Math.abs(finalTotal - totalAmount);
        if (difference > 0.01) {
          console.warn('Diferencia detectada en el total:', difference);
        }

      } catch (error) {
        console.error('Error en el cálculo:', error);
        this.showErrorMessage('Error en el cálculo. Por favor, verifica los datos ingresados.');
      } finally {
        this.isCalculating = false;
      }
    }, 800);
  }

  private showErrorMessage(message: string): void {
    console.error(message);
    // Implementar toast/snackbar aquí si tienes uno
  }

  // Manejo de errores de validación
  getErrorMessage(fieldName: string, floorIndex?: number): string {
    let control;

    if (floorIndex !== undefined) {
      control = this.floorsFormArray.at(floorIndex)?.get(fieldName);
    } else {
      control = this.aguaForm.get(fieldName);
    }

    if (control?.errors && (control?.touched || control?.dirty)) {
      if (control.errors['required']) {
        return this.getRequiredMessage(fieldName);
      }
      if (control.errors['min']) {
        return this.getMinMessage(fieldName, control.errors['min'].min);
      }
      if (control.errors['max']) {
        return this.getMaxMessage(fieldName, control.errors['max'].max);
      }
      if (control.errors['pattern']) {
        return this.getPatternMessage(fieldName);
      }
      if (control.errors['invalidCurrency']) {
        return 'Ingrese un monto válido (ej: 150000.50)';
      }
      if (control.errors['invalidAdjustment']) {
        return 'Ingrese un valor numérico válido';
      }
      if (control.errors['maxlength']) {
        return 'Máximo 100 caracteres permitidos';
      }
    }
    return '';
  }

  private getRequiredMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      'totalAmount': 'El monto total es requerido',
      'numberOfFloors': 'El número de pisos es requerido',
      'people': 'La cantidad de personas es requerida'
    };
    return messages[fieldName] || 'Este campo es requerido';
  }

  private getMinMessage(fieldName: string, minValue: number): string {
    const messages: { [key: string]: string } = {
      'totalAmount': `El monto debe ser mayor a $${minValue}`,
      'numberOfFloors': `Debe ser al menos ${minValue} piso`,
      'people': `Debe haber al menos ${minValue} persona`
    };
    return messages[fieldName] || `Valor mínimo: ${minValue}`;
  }

  private getMaxMessage(fieldName: string, maxValue: number): string {
    const messages: { [key: string]: string } = {
      'numberOfFloors': `Máximo ${maxValue} pisos permitidos`,
      'people': `Máximo ${maxValue} personas por piso`
    };
    return messages[fieldName] || `Valor máximo: ${maxValue}`;
  }

  private getPatternMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      'totalAmount': 'Ingrese un monto válido (ej: 150000.50)',
      'numberOfFloors': 'Ingrese solo números enteros',
      'people': 'Ingrese solo números enteros',
      'adjustment': 'Ingrese un valor numérico válido'
    };
    return messages[fieldName] || 'Formato inválido';
  }

  hasError(fieldName: string, floorIndex?: number): boolean {
    let control;

    if (floorIndex !== undefined) {
      control = this.floorsFormArray.at(floorIndex)?.get(fieldName);
    } else {
      control = this.aguaForm.get(fieldName);
    }

    return !!(control?.errors && (control?.touched || control?.dirty));
  }

  formatCurrency(amount: number): string {
    if (isNaN(amount) || amount === null || amount === undefined) return '$0';

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  resetCalculator(): void {
    const hasData = this.aguaForm.dirty || this.calculation;

    if (hasData) {
      const confirmed = confirm('¿Estás seguro de que quieres reiniciar la calculadora? Se perderán todos los datos.');
      if (confirmed) {
        this.performReset();
      }
    } else {
      this.performReset();
    }
  }

  private performReset(): void {
    this.aguaForm.reset();
    this.calculation = null;
    this.showResults = false;
    this.isCalculating = false;
    this.currentStep = 1;

    // Limpiar array de pisos
    while (this.floorsFormArray.length !== 0) {
      this.floorsFormArray.removeAt(0);
    }

    this.aguaForm.patchValue({
      totalAmount: null,
      numberOfFloors: null
    });

    this.aguaForm.markAsUntouched();
    this.aguaForm.markAsPristine();
  }

  getTotalDifference(): number {
    if (!this.calculation) return 0;
    return this.calculation.finalTotal - this.calculation.totalAmount;
  }

  getProgressPercentage(): number {
    return Math.round((this.currentStep / this.maxSteps) * 100);
  }

  exportResults(): void {
    if (!this.calculation) return;

    try {
      const exportData = {
        fecha: new Date().toISOString(),
        timestamp: Date.now(),
        calculo: this.calculation,
        resumen: {
          totalFactura: this.formatCurrency(this.calculation.totalAmount),
          totalPersonas: this.calculation.totalPeople,
          promedioPorPersona: this.formatCurrency(this.calculation.baseAmountPerPerson),
          totalAjustes: this.formatCurrency(this.calculation.totalAdjustments),
          totalFinal: this.formatCurrency(this.calculation.finalTotal),
          redistribucionTotal: this.calculation.redistributionDetails ?
            this.formatCurrency(this.calculation.redistributionDetails.totalRedistributed) : '$0'
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `calculo-agua-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Datos exportados:', exportData);
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos. Por favor, intenta nuevamente.');
    }
  }

  onFieldChange(fieldName: string, floorIndex?: number): void {
    setTimeout(() => {
      if (floorIndex !== undefined) {
        const control = this.floorsFormArray.at(floorIndex)?.get(fieldName);
        control?.markAsTouched();
        this.validateFloorLogic(floorIndex);
      } else {
        const control = this.aguaForm.get(fieldName);
        control?.markAsTouched();
        this.validateStep1Logic(fieldName);
      }
    }, 150);
  }

  private validateFloorLogic(floorIndex: number): void {
    const floorGroup = this.floorsFormArray.at(floorIndex);
    if (!floorGroup) return;

    const people = floorGroup.get('people')?.value;
    const adjustment = floorGroup.get('adjustment')?.value;

    if (people && adjustment && this.aguaForm.get('totalAmount')?.value) {
      const totalAmount = parseFloat(this.aguaForm.get('totalAmount')?.value);
      const basePerPerson = totalAmount / (this.getCurrentTotalPeople() || 1);
      const baseForFloor = basePerPerson * people;

      if (Math.abs(adjustment) > baseForFloor * 0.5) {
        console.warn(`Ajuste alto detectado en piso ${floorIndex + 1}`);
      }
    }
  }

  private validateStep1Logic(fieldName: string): void {
    if (fieldName === 'numberOfFloors') {
      const floors = this.aguaForm.get('numberOfFloors')?.value;
      if (floors && floors > 10) {
        console.log('Edificio grande detectado, considera revisar la distribución');
      }
    }

    if (fieldName === 'totalAmount') {
      const amount = this.aguaForm.get('totalAmount')?.value;
      if (amount && amount > 1000000) {
        console.log('Monto alto detectado, verifica la cifra');
      }
    }
  }

  private getCurrentTotalPeople(): number {
    return this.floorsFormArray.controls.reduce((total, control) => {
      const people = parseInt(control.get('people')?.value) || 0;
      return total + people;
    }, 0);
  }

  getSuggestion(): string {
    if (!this.calculation) return '';

    const difference = Math.abs(this.getTotalDifference());

    if (difference <= 1) {
      return '✅ La distribución está perfectamente balanceada con redistribución automática';
    } else {
      return `⚠️ Diferencia mínima de ${this.formatCurrency(difference)} debido a redondeos`;
    }
  }

  getRedistributionInfo(): string {
    if (!this.calculation?.redistributionDetails) return '';

    const details = this.calculation.redistributionDetails;

    if (details.totalReduced === 0) {
      return 'Sin redistribuciones necesarias';
    }

    return `${this.formatCurrency(details.totalReduced)} redistribuidos entre ${details.floorsReceivingRedistribution} pisos (${this.formatCurrency(details.redistributionPerFloor)} c/u)`;
  }

  getCalculationStats(): any {
    if (!this.calculation) return null;

    const floors = this.calculation.floors;
    const adjustments = floors.map(f => f.adjustment).filter(a => a !== 0);

    return {
      floorsWithAdjustments: floors.filter(f => f.adjustment !== 0).length,
      floorsWithReductions: floors.filter(f => f.adjustment < 0).length,
      floorsReceivingRedistribution: floors.filter(f => (f.redistributedAmount || 0) > 0).length,
      averageAdjustment: adjustments.length > 0
        ? adjustments.reduce((sum, adj) => sum + adj, 0) / adjustments.length
        : 0,
      maxAdjustment: adjustments.length > 0 ? Math.max(...adjustments) : 0,
      minAdjustment: adjustments.length > 0 ? Math.min(...adjustments) : 0,
      totalPositiveAdjustments: floors.filter(f => f.adjustment > 0)
        .reduce((sum, f) => sum + f.adjustment, 0),
      totalNegativeAdjustments: floors.filter(f => f.adjustment < 0)
        .reduce((sum, f) => sum + Math.abs(f.adjustment), 0),
      totalRedistributed: this.calculation.redistributionDetails?.totalRedistributed || 0
    };
  }

  getFloorBreakdown(floor: FloorDetail): string {
    let breakdown = `Base: ${this.formatCurrency(floor.baseAmount)}`;

    if (floor.adjustment !== 0) {
      const sign = floor.adjustment > 0 ? '+' : '';
      breakdown += ` | Ajuste: ${sign}${this.formatCurrency(floor.adjustment)}`;
    }

    if (floor.redistributedAmount && floor.redistributedAmount > 0) {
      breakdown += ` | Redistribución: +${this.formatCurrency(floor.redistributedAmount)}`;
    }


    return breakdown;
  }
  // Navegar al menú principal
  goToMenu(): void {
    this.router.navigate(['/']); // '/' es la ruta de tu menú principal
  }
}
