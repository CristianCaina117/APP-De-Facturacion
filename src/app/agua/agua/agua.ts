import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  async downloadPDF(): Promise<void> {
  if (!this.calculation) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const fecha = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const mesAnio = new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  // ─── HELPERS ───────────────────────────────────────────────
  const gold   = [201, 168, 76]  as [number,number,number];
  const dark   = [10,  10,  15]  as [number,number,number];
  const cream  = [245, 240, 232] as [number,number,number];
  const sand   = [248, 246, 240] as [number,number,number];
  const muted  = [180, 165, 130] as [number,number,number];
  const ink    = [40,  32,  12]  as [number,number,number];
  const subink = [100, 85,  50]  as [number,number,number];

  const drawRect = (x:number,y:number,w:number,h:number,r:number,fill:[number,number,number]) => {
    doc.setFillColor(...fill); doc.roundedRect(x,y,w,h,r,r,'F');
  };
  const hline = (y:number,x1=14,x2=pageW-14,color=gold,lw=0.3) => {
    doc.setDrawColor(...color); doc.setLineWidth(lw); doc.line(x1,y,x2,y);
  };

  // ─── PÁGINA 1 ──────────────────────────────────────────────

  // Header oscuro degradado simulado con rects
  doc.setFillColor(...dark); doc.rect(0,0,pageW,56,'F');
  doc.setFillColor(20,20,30); doc.rect(0,28,pageW,28,'F');

  // Franja dorada top
  doc.setFillColor(...gold); doc.rect(0,0,pageW,3,'F');

  // Logo/icono círculo
  doc.setFillColor(...gold);
  doc.circle(22, 22, 9, 'F');
  doc.setFillColor(...dark);
  doc.circle(22, 22, 7, 'F');
  doc.setFillColor(...gold);
  doc.circle(22, 22, 2, 'F');

  // Título principal
  doc.setFont('helvetica','bold');
  doc.setFontSize(22);
  doc.setTextColor(...cream);
  doc.text('FACTURA DE DISTRIBUCIÓN', 36, 16);

  doc.setFontSize(11);
  doc.setFont('helvetica','normal');
  doc.setTextColor(...gold);
  doc.text('SERVICIO DE AGUA — CASA', 36, 23);

  // Número de factura y fecha
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  const folio = `FAC-${Date.now().toString().slice(-6)}`;
  doc.text(`Folio: ${folio}`, 36, 30);
  doc.text(`Período: ${mesAnio}`, 36, 35);
  doc.text(`Emitido: ${fecha}`, 36, 40);

  // Badge estado
  drawRect(pageW-46, 8, 32, 10, 2, [30,40,20] as [number,number,number]);
  doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.setTextColor(120,200,100);
  doc.text('✓  LIQUIDADO', pageW-44, 14.5);

  // Subtítulo separador
  doc.setFillColor(30,28,40);
  doc.rect(0,45,pageW,11,'F');
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  doc.setTextColor(...muted);
  doc.text('Distribución proporcional por número de personas residentes por piso', pageW/2, 52, {align:'center'});

  // ─── BLOQUE RESUMEN 4 KPIs ─────────────────────────────────
  const kpiY = 62;
  const kpiW = (pageW-28-9)/4;
  const kpis = [
    { label:'TOTAL FACTURA',    value: this.formatCurrency(this.calculation.totalAmount),           icon:'$' },
    { label:'TOTAL PERSONAS',   value: `${this.calculation.totalPeople} pers.`,                     icon:'👤' },
    { label:'COSTO / PERSONA',  value: this.formatCurrency(this.calculation.baseAmountPerPerson),   icon:'÷' },
    { label:'PISOS',            value: `${this.calculation.floors.length} pisos`,                   icon:'▣' },
  ];

  kpis.forEach((k,i) => {
    const x = 14 + i*(kpiW+3);
    drawRect(x, kpiY, kpiW, 22, 3, sand);
    doc.setFillColor(...gold); doc.rect(x,kpiY,kpiW,1.5,'F');
    doc.setFontSize(7); doc.setFont('helvetica','bold');
    doc.setTextColor(...subink);
    doc.text(k.label, x+kpiW/2, kpiY+7, {align:'center'});
    doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.setTextColor(...ink);
    doc.text(k.value, x+kpiW/2, kpiY+15, {align:'center'});
  });

  // ─── GRÁFICO DE BARRAS (canvas → base64) ──────────────────
  const chartImg = await this.generateBarChartImage();
  const pieImg   = await this.generatePieChartImage();

  const chartY = kpiY + 28;
  doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.setTextColor(...subink);
  doc.text('DISTRIBUCIÓN POR PISO', 14, chartY);
  hline(chartY+2);

  // Barras izquierda
  doc.addImage(chartImg, 'PNG', 14, chartY+4, 110, 52);

  // Pie derecha
  doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.setTextColor(...subink);
  doc.text('PROPORCIÓN DEL TOTAL', pageW-68, chartY);
  doc.addImage(pieImg,   'PNG', pageW-68, chartY+4, 54, 52);

  // ─── TABLA DETALLADA ───────────────────────────────────────
  const tableY = chartY + 62;
  doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.setTextColor(...subink);
  doc.text('DESGLOSE DETALLADO POR PISO', 14, tableY);
  hline(tableY+2);

  const tableData = this.calculation.floors.map((floor, idx) => {
    const pct = ((floor.finalAmount / this.calculation!.totalAmount)*100).toFixed(1);
    const bar = '█'.repeat(Math.round(parseFloat(pct)/5));
    return [
      `${floor.floorNumber}`,
      `${floor.people}`,
      this.formatCurrency(floor.baseAmount),
      floor.adjustment !== 0 ? this.formatCurrency(floor.adjustment) : '—',
      (floor.redistributedAmount||0) > 0 ? `+${this.formatCurrency(floor.redistributedAmount!)}` : '—',
      this.formatCurrency(floor.finalAmount),
      `${pct}%`,
      floor.adjustmentReason || '—',
    ];
  });

  autoTable(doc, {
    startY: tableY+4,
    head: [['Piso','Pers.','Base','Ajuste','Redistrib.','TOTAL','%','Motivo']],
    body: tableData,
    theme: 'grid',
    styles: {
      font:'helvetica', fontSize:8.5, cellPadding:2.8,
      textColor: ink, lineColor:[220,205,170], lineWidth:0.18,
    },
    headStyles: {
      fillColor: dark, textColor: gold,
      fontStyle:'bold', fontSize:8, cellPadding:3.5,
    },
    alternateRowStyles: { fillColor: [251,249,244] },
    columnStyles: {
      0: { halign:'center', fontStyle:'bold', cellWidth:10 },
      1: { halign:'center', cellWidth:10 },
      2: { halign:'right',  cellWidth:25 },
      3: { halign:'right',  cellWidth:22, textColor:[180,80,40] as [number,number,number] },
      4: { halign:'right',  cellWidth:20, textColor:[60,140,70] as [number,number,number] },
      5: { halign:'right',  cellWidth:26, fontStyle:'bold', textColor:gold },
      6: { halign:'center', cellWidth:12 },
      7: { cellWidth:'auto', fontSize:7.5, textColor:subink },
    },
    margin:{ left:14, right:14 },
    didDrawCell: (data) => {
      // Resaltar fila de total más alto
      if (data.section === 'body' && data.column.index === 5) {
        const max = Math.max(...this.calculation!.floors.map(f=>f.finalAmount));
        const floor = this.calculation!.floors[data.row.index];
        if (floor && floor.finalAmount === max) {
          doc.setFillColor(255,248,220);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          doc.setFont('helvetica','bold');
          doc.setFontSize(8.5);
          doc.setTextColor(...gold);
          doc.text(
            this.formatCurrency(floor.finalAmount),
            data.cell.x + data.cell.width - 2,
            data.cell.y + data.cell.height/2 + 1,
            {align:'right'}
          );
        }
      }
    }
  });

  // ─── TOTALIZADOR FINAL ─────────────────────────────────────
  const totalY = (doc as any).lastAutoTable.finalY + 6;

  // Fila totales en tabla
  drawRect(14, totalY, pageW-28, 14, 2, dark);
  doc.setFillColor(...gold); doc.rect(14, totalY, 4, 14,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.setTextColor(...cream);
  doc.text('TOTAL DISTRIBUIDO:', 22, totalY+6);
  doc.setFontSize(13); doc.setTextColor(...gold);
  doc.text(this.formatCurrency(this.calculation.finalTotal), pageW-16, totalY+7.5, {align:'right'});

  const diff = Math.abs(this.getTotalDifference());
  doc.setFontSize(7.5); doc.setFont('helvetica','normal');
  doc.setTextColor(diff<=0.01 ? 80:200, diff<=0.01?160:80, diff<=0.01?90:30);
  doc.text(
    diff<=0.01
      ? `✓ Balance perfecto — suma idéntica al total de la factura (${this.formatCurrency(this.calculation.totalAmount)})`
      : `⚠ Diferencia por redondeo: ${this.formatCurrency(diff)}`,
    22, totalY+11.5
  );

  // ─── SECCIÓN REDISTRIBUCIÓN (si aplica) ────────────────────
  if ((this.calculation.redistributionDetails?.totalRedistributed||0) > 0) {
    const redY = totalY + 20;
    drawRect(14, redY, pageW-28, 18, 2, [240,248,235] as [number,number,number]);
    doc.setFillColor(80,160,90); doc.rect(14, redY, 3, 18,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(8);
    doc.setTextColor(40,100,50);
    doc.text('REDISTRIBUCIÓN AUTOMÁTICA', 21, redY+6);
    doc.setFont('helvetica','normal'); doc.setFontSize(8);
    doc.setTextColor(60,80,55);
    const rd = this.calculation.redistributionDetails!;
    doc.text(
      `${rd.floorsWithReductions} piso(s) con reducción aportaron `+
      `${this.formatCurrency(rd.totalRedistributed)} que se redistribuyeron entre `+
      `${rd.floorsReceivingRedistribution} piso(s) — `+
      `${this.formatCurrency(rd.redistributionPerFloor)} por piso.`,
      21, redY+12, { maxWidth: pageW-40 }
    );
  }

  // ─── PÁGINA 2: análisis y notas ────────────────────────────
  doc.addPage();
  doc.setFillColor(...dark); doc.rect(0,0,pageW,18,'F');
  doc.setFillColor(...gold); doc.rect(0,0,pageW,2,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(13);
  doc.setTextColor(...cream);
  doc.text('ANÁLISIS Y TRANSPARENCIA', pageW/2, 12, {align:'center'});

  // Tabla comparativa piso vs promedio
  const avgFinal = this.calculation.finalTotal / this.calculation.floors.length;
  const compData = this.calculation.floors.map(floor => {
    const diff2 = floor.finalAmount - avgFinal;
    const status = Math.abs(diff2) < 1000 ? 'Equitativo'
                  : diff2 > 0 ? 'Por encima del prom.' : 'Por debajo del prom.';
    return [
      `Piso ${floor.floorNumber}`,
      `${floor.people}`,
      this.formatCurrency(floor.finalAmount),
      this.formatCurrency(avgFinal),
      (diff2>=0?'+':'')+this.formatCurrency(diff2),
      `${((floor.finalAmount/this.calculation!.totalAmount)*100).toFixed(2)}%`,
      status,
    ];
  });

  doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.setTextColor(...subink);
  doc.text('COMPARATIVA PISO VS PROMEDIO', 14, 26);
  hline(28);

  autoTable(doc,{
    startY: 30,
    head:[['Piso','Pers.','Su cuota','Promedio','Diferencia','% Total','Estado']],
    body: compData,
    theme:'grid',
    styles:{ font:'helvetica', fontSize:8.5, cellPadding:3, textColor:ink, lineColor:[220,205,170], lineWidth:0.18 },
    headStyles:{ fillColor:dark, textColor:gold, fontStyle:'bold', fontSize:8, cellPadding:3.5 },
    alternateRowStyles:{ fillColor:[251,249,244] },
    columnStyles:{
      0:{ fontStyle:'bold', cellWidth:20 },
      1:{ halign:'center', cellWidth:14 },
      2:{ halign:'right',  cellWidth:30, fontStyle:'bold', textColor:gold },
      3:{ halign:'right',  cellWidth:30 },
      4:{ halign:'right',  cellWidth:28 },
      5:{ halign:'center', cellWidth:18 },
      6:{ cellWidth:'auto' },
    },
    margin:{left:14,right:14},
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {

        const val = String(data.cell.raw || '');

        const isPos = val.startsWith('+');
        const isNeg = val.startsWith('-') && !val.startsWith('-$0');

        if (isPos) {
          data.cell.styles.textColor = [180, 80, 40];
        }
        else if (isNeg) {
          data.cell.styles.textColor = [60, 140, 70];
        }
        else {
          data.cell.styles.textColor = ink;
        }

        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // Gráfico horizontal de barras comparativo
  const hbarImg = await this.generateHBarChartImage();
  const hbarY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(8); doc.setFont('helvetica','bold');
  doc.setTextColor(...subink);
  doc.text('VISUALIZACIÓN COMPARATIVA DE CUOTAS', 14, hbarY);
  hline(hbarY+2);
  doc.addImage(hbarImg,'PNG',14,hbarY+4,pageW-28,60);

  // ─── NOTA LEGAL / PIE ─────────────────────────────────────
  const noteY = hbarY + 70;
  drawRect(14, noteY, pageW-28, 30, 2, [248,246,240] as [number,number,number]);
  doc.setFillColor(...muted); doc.rect(14,noteY,3,30,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
  doc.setTextColor(...subink);
  doc.text('METODOLOGÍA DE CÁLCULO', 21, noteY+6);
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
  doc.setTextColor(80,70,50);
  const nota = [
    '1. Se calcula el monto base por persona dividiendo el total de la factura entre el número total de residentes.',
    '2. Cada piso paga proporcionalmente según sus residentes: Base Piso = (Personas Piso ÷ Total Personas) × Total Factura.',
    '3. Los ajustes manuales (+ o -) modifican la cuota individual del piso afectado.',
    '4. Si un ajuste es negativo, el monto reducido se redistribuye equitativamente entre los demás pisos.',
    '5. La suma de todas las cuotas finales es siempre igual al total original de la factura.',
  ];
  nota.forEach((line,i)=>{ doc.text(line, 21, noteY+12+(i*4.2), {maxWidth:pageW-44}); });

  // Footer todas las páginas
  const totalPages = doc.getNumberOfPages();
  for(let p=1; p<=totalPages; p++){
    doc.setPage(p);
    const fy = pageH-8;
    doc.setFillColor(...dark); doc.rect(0,fy-5,pageW,13,'F');
    doc.setFillColor(...gold); doc.rect(0,fy-5,pageW,0.5,'F');
    doc.setFontSize(7); doc.setFont('helvetica','normal');
    doc.setTextColor(...subink);
    doc.text(`Calculadora de Servicios por Piso  •  Folio ${folio}  •  ${fecha}`, pageW/2, fy, {align:'center'});
    doc.text(`Página ${p} de ${totalPages}`, pageW-15, fy, {align:'right'});
  }

  doc.save(`factura-agua-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    // ─── GENERADORES DE GRÁFICOS ───────────────────────────────────
    private generateBarChartImage(): Promise<string> {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = 700; canvas.height = 340;
        const ctx = canvas.getContext('2d')!;

        const floors = this.calculation!.floors;
        const labels = floors.map(f=>`Piso ${f.floorNumber}`);
        const values = floors.map(f=>f.finalAmount);
        const maxVal = Math.max(...values);

        // Fondo
        ctx.fillStyle = '#faf8f2';
        ctx.fillRect(0,0,700,340);

        const padL=60, padR=20, padT=30, padB=50;
        const chartW = 700-padL-padR;
        const chartH = 340-padT-padB;
        const barW = Math.min(chartW/floors.length*0.6, 60);
        const gap  = chartW/floors.length;

        // Grid lines
        for(let i=0;i<=5;i++){
          const y = padT + chartH - (i/5)*chartH;
          ctx.strokeStyle = '#e8e0cc';
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+chartW,y); ctx.stroke();
          ctx.fillStyle='#8a7848'; ctx.font='11px Arial';
          ctx.textAlign='right';
          const label = this.formatCurrency(maxVal*(i/5));
          ctx.fillText(label, padL-6, y+4);
        }

        // Barras
        floors.forEach((floor,i)=>{
          const x = padL + i*gap + gap/2 - barW/2;
          const barH = (floor.finalAmount/maxVal)*chartH;
          const y = padT + chartH - barH;

          // Sombra
          ctx.fillStyle='rgba(0,0,0,0.06)';
          ctx.fillRect(x+3,y+3,barW,barH);

          // Gradiente dorado
          const grad = ctx.createLinearGradient(x,y,x,y+barH);
          grad.addColorStop(0,'#e8d5a3');
          grad.addColorStop(1,'#c9a84c');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x,y,barW,barH,4);
          ctx.fill();

          // Línea top dorada oscura
          ctx.fillStyle='#a07830';
          ctx.fillRect(x,y,barW,3);

          // Valor encima
          ctx.fillStyle='#3a2a08';
          ctx.font='bold 11px Arial';
          ctx.textAlign='center';
          ctx.fillText(this.formatCurrency(floor.finalAmount), x+barW/2, y-6);

          // Label eje X
          ctx.fillStyle='#6a5828';
          ctx.font='12px Arial';
          ctx.fillText(labels[i], x+barW/2, padT+chartH+18);

          // Personas
          ctx.fillStyle='#9a8848';
          ctx.font='10px Arial';
          ctx.fillText(`${floor.people} pers.`, x+barW/2, padT+chartH+32);
        });

        // Eje Y
        ctx.strokeStyle='#c9a84c'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+chartH); ctx.stroke();

        // Título
        ctx.fillStyle='#3a2a08'; ctx.font='bold 13px Arial'; ctx.textAlign='center';
        ctx.fillText('Cuota por piso (COP)', 350, 18);

        resolve(canvas.toDataURL('image/png'));
      });
    }

    private generatePieChartImage(): Promise<string> {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = 340; canvas.height = 340;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle='#faf8f2'; ctx.fillRect(0,0,340,340);

        const floors = this.calculation!.floors;
        const values = floors.map(f=>f.finalAmount);
        const total  = values.reduce((a,b)=>a+b,0);
        const colors = ['#c9a84c','#e8d5a3','#a07830','#d4b870','#8a6020','#f0e0b0','#b89040','#785018'];

        let startAngle = -Math.PI/2;
        const cx=170, cy=160, r=110;

        values.forEach((val,i)=>{
          const slice = (val/total)*Math.PI*2;
          // Sombra
          ctx.save();
          ctx.shadowColor='rgba(0,0,0,0.15)'; ctx.shadowBlur=6;
          ctx.fillStyle = colors[i%colors.length];
          ctx.beginPath();
          ctx.moveTo(cx,cy);
          ctx.arc(cx,cy,r,startAngle,startAngle+slice);
          ctx.closePath(); ctx.fill();
          ctx.restore();

          // Borde
          ctx.strokeStyle='#faf8f2'; ctx.lineWidth=2;
          ctx.beginPath();
          ctx.moveTo(cx,cy);
          ctx.arc(cx,cy,r,startAngle,startAngle+slice);
          ctx.closePath(); ctx.stroke();

          // Porcentaje
          const midAngle = startAngle + slice/2;
          const lx = cx + Math.cos(midAngle)*(r*0.65);
          const ly = cy + Math.sin(midAngle)*(r*0.65);
          const pct = ((val/total)*100).toFixed(0);
          if(parseFloat(pct)>4){
            ctx.fillStyle='#3a2a08'; ctx.font='bold 11px Arial'; ctx.textAlign='center';
            ctx.fillText(`${pct}%`, lx, ly+4);
          }

          startAngle += slice;
        });

        // Círculo central
        ctx.fillStyle='#faf8f2';
        ctx.beginPath(); ctx.arc(cx,cy,r*0.38,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#8a6828'; ctx.font='bold 12px Arial'; ctx.textAlign='center';
        ctx.fillText('TOTAL', cx, cy-5);
        ctx.fillStyle='#3a2a08'; ctx.font='bold 11px Arial';
        ctx.fillText(this.formatCurrency(total), cx, cy+10);

        // Leyenda
        floors.forEach((f,i)=>{
          const ly = 300 + Math.floor(i/4)*14;
          const lx = 10 + (i%4)*82;
          ctx.fillStyle=colors[i%colors.length];
          ctx.fillRect(lx,ly-9,10,10);
          ctx.fillStyle='#6a5828'; ctx.font='9px Arial'; ctx.textAlign='left';
          ctx.fillText(`P${f.floorNumber}: ${((f.finalAmount/total)*100).toFixed(1)}%`, lx+13, ly);
        });

        resolve(canvas.toDataURL('image/png'));
      });
    }

    private generateHBarChartImage(): Promise<string> {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = 1140; canvas.height = 380;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle='#faf8f2'; ctx.fillRect(0,0,1140,380);

        const floors = this.calculation!.floors;
        const maxVal = Math.max(...floors.map(f=>f.finalAmount));
        const avg    = this.calculation!.finalTotal / floors.length;
        const padL=130, padR=160, padT=30, padB=30;
        const chartW = 1140-padL-padR;
        const rowH   = (380-padT-padB)/floors.length;

        // Línea promedio
        const avgX = padL + (avg/maxVal)*chartW;
        ctx.strokeStyle='#c9a84c'; ctx.lineWidth=1.5;
        ctx.setLineDash([5,4]);
        ctx.beginPath(); ctx.moveTo(avgX,padT); ctx.lineTo(avgX,padT+(rowH*floors.length)); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle='#a07830'; ctx.font='bold 11px Arial'; ctx.textAlign='center';
        ctx.fillText('Promedio', avgX, padT-6);

        floors.forEach((floor,i)=>{
          const y = padT + i*rowH + rowH*0.2;
          const bH = rowH*0.55;
          const bW = (floor.finalAmount/maxVal)*chartW;

          // Label piso
          ctx.fillStyle='#3a2a08'; ctx.font='bold 12px Arial'; ctx.textAlign='right';
          ctx.fillText(`Piso ${floor.floorNumber}`, padL-8, y+bH/2+4);
          ctx.fillStyle='#9a8848'; ctx.font='10px Arial';
          ctx.fillText(`${floor.people} pers.`, padL-8, y+bH/2+15);

          // Barra fondo
          ctx.fillStyle='#f0ece0';
          ctx.beginPath(); (ctx as any).roundRect(padL,y,chartW,bH,3); ctx.fill();

          // Barra valor
          const grad = ctx.createLinearGradient(padL,0,padL+bW,0);
          grad.addColorStop(0,'#c9a84c'); grad.addColorStop(1,'#e8d5a3');
          ctx.fillStyle = grad;
          ctx.beginPath(); (ctx as any).roundRect(padL,y,bW,bH,3); ctx.fill();

          // Valor al final de barra
          ctx.fillStyle='#3a2a08'; ctx.font='bold 12px Arial'; ctx.textAlign='left';
          ctx.fillText(this.formatCurrency(floor.finalAmount), padL+bW+8, y+bH/2+4);

          // Porcentaje
          ctx.fillStyle='#8a6828'; ctx.font='10px Arial';
          ctx.fillText(`${((floor.finalAmount/this.calculation!.totalAmount)*100).toFixed(1)}%`, padL+bW+8, y+bH/2+15);
        });

        // Eje X
        ctx.strokeStyle='#c9a84c'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+rowH*floors.length); ctx.stroke();

        // Título
        ctx.fillStyle='#3a2a08'; ctx.font='bold 13px Arial'; ctx.textAlign='center';
        ctx.fillText('Comparativa de cuotas por piso', 570, 18);

        resolve(canvas.toDataURL('image/png'));
      });
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
        console.log('CASA grande detectado, considera revisar la distribución');
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
