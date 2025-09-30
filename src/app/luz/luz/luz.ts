import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 ESTA LÍNEA ES CLAVE
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


// Interfaces
export interface LuzCalculation {
  totalAmount: number;
  floors: number;
  amountPerFloor: number;
  floorBreakdown: FloorDetail[];
}

export interface FloorDetail {
  floorNumber: number;
  amount: number;
}

@Component({
  selector: 'app-luz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 AGREGA CommonModule
  templateUrl: './luz.html',
  styleUrls: ['./luz.css']
})
export class Luz implements OnInit {

  calculatorForm: FormGroup;
  calculation: LuzCalculation | null = null;
  showResults = false;
  isCalculating = false;

  constructor(private fb: FormBuilder,private router: Router) {
    this.calculatorForm = this.fb.group({
      totalAmount: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^\d+(\.\d{1,2})?$/)
        ]
      ],
      floors: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100),
          Validators.pattern(/^\d+$/)
        ]
      ]
    });
  }

  ngOnInit(): void {
    // Configuración inicial si es necesaria
  }

  onSubmit(): void {
    if (this.calculatorForm.valid) {
      this.isCalculating = true;

      const { totalAmount, floors } = this.calculatorForm.value;

      // Simular un pequeño delay para mostrar el loading
      setTimeout(() => {
        this.calculation = this.calculateLuzDivision(
          parseFloat(totalAmount),
          parseInt(floors)
        );
        this.showResults = true;
        this.isCalculating = false;
      }, 800);
    } else {
      this.markFormGroupTouched();
    }
  }

  private calculateLuzDivision(totalAmount: number, floors: number): LuzCalculation {
    const amountPerFloor = totalAmount / floors;
    const floorBreakdown: FloorDetail[] = [];

    for (let i = 1; i <= floors; i++) {
      floorBreakdown.push({
        floorNumber: i,
        amount: amountPerFloor
      });
    }

    return {
      totalAmount,
      floors,
      amountPerFloor,
      floorBreakdown
    };
  }

  private markFormGroupTouched(): void {
    Object.keys(this.calculatorForm.controls).forEach(key => {
      const control = this.calculatorForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.calculatorForm.get(fieldName);

    if (control?.errors && control?.touched) {
      if (control.errors['required']) {
        return `${fieldName === 'totalAmount' ? 'El monto' : 'El número de pisos'} es requerido`;
      }
      if (control.errors['min']) {
        return fieldName === 'totalAmount'
          ? 'El monto debe ser mayor a 0'
          : 'Debe ser al menos 1 piso';
      }
      if (control.errors['max']) {
        return 'Máximo 100 pisos permitidos';
      }
      if (control.errors['pattern']) {
        return fieldName === 'totalAmount'
          ? 'Ingrese un monto válido (ej: 150000.50)'
          : 'Ingrese solo números enteros';
      }
    }
    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.calculatorForm.get(fieldName);
    return !!(control?.errors && control?.touched);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  resetCalculator(): void {
    this.calculatorForm.reset();
    this.calculation = null;
    this.showResults = false;
    this.isCalculating = false;
  }

  // Métodos de validación adicionales
  validateAmount(amount: number): boolean {
    return amount > 0 && !isNaN(amount);
  }

  validateFloors(floors: number): boolean {
    return floors > 0 && floors <= 100 && Number.isInteger(floors);
  }
  goToMenu(): void {
    this.router.navigate(['/']); // '/' es la ruta de tu menú principal
  }
}


