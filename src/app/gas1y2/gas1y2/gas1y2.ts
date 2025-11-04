import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Bill {
  id: number;
  month: string;
  consumption: {
    withoutSubsidy: number;
    withSubsidy: number;
    subsidy: number;
    adjustment: number;
  };
  sharedInsurance: {
    coosepark: number;
    accidentInsurance: number;
  };
  ownerOnly: {
    debtorLifeInsurance: number;
    financingInterest: number;
    lateInterest1: number;
    lateInterest2: number;
    vantiMobility: number;
  };
}

@Component({
    selector: 'app-gas1y2',
  imports: [CommonModule],
  templateUrl: './gas1y2.html',
  styleUrl: './gas1y2.css'
})
export class Gas1y2  {
  constructor(private router: Router) {}

  // Navegar al menú principal
  goToMenu(): void {
    this.router.navigate(['/']); // '/' es la ruta de tu menú principal
  }

  numTenants: number = 2;
  bills: Bill[] = [
    {
      id: Date.now(),
      month: '',
      consumption: {
        withoutSubsidy: 0,
        withSubsidy: 0,
        subsidy: 0,
        adjustment: 0
      },
      sharedInsurance: {
        coosepark: 0,
        accidentInsurance: 0
      },
      ownerOnly: {
        debtorLifeInsurance: 0,
        financingInterest: 0,
        lateInterest1: 0,
        lateInterest2: 0,
        vantiMobility: 0
      }
    }
  ];
  currentBillIndex: number = 0;
  showHistory: boolean = false;

  get currentBill(): Bill {
    return this.bills[this.currentBillIndex];
  }

  get totalConsumption(): number {
    return Object.values(this.currentBill.consumption).reduce((a, b) => a + b, 0);
  }

  get totalSharedInsurance(): number {
    return Object.values(this.currentBill.sharedInsurance).reduce((a, b) => a + b, 0);
  }

  get totalOwnerOnly(): number {
    return Object.values(this.currentBill.ownerOnly).reduce((a, b) => a + b, 0);
  }

  get totalBill(): number {
    return this.totalConsumption + this.totalSharedInsurance + this.totalOwnerOnly;
  }

  // Solo el consumo se divide entre inquilinos
  get perTenant(): number {
    return this.totalConsumption / this.numTenants;
  }

  get ownerOnlyPays(): number {
    return this.totalOwnerOnly;
  }

  // Nueva propiedad: lo que paga la persona de los seguros
  get insurancePersonPays(): number {
    return this.totalSharedInsurance;
  }

  updateConsumption(field: keyof Bill['consumption'], value: number): void {
    this.currentBill.consumption[field] = value;
  }

  updateSharedInsurance(field: keyof Bill['sharedInsurance'], value: number): void {
    this.currentBill.sharedInsurance[field] = value;
  }

  updateOwnerOnly(field: keyof Bill['ownerOnly'], value: number): void {
    this.currentBill.ownerOnly[field] = value;
  }

  updateMonth(value: string): void {
    this.currentBill.month = value;
  }

  addNewBill(): void {
    const newBill: Bill = {
      id: Date.now(),
      month: '',
      consumption: {
        withoutSubsidy: 0,
        withSubsidy: 0,
        subsidy: 0,
        adjustment: 0
      },
      sharedInsurance: {
        coosepark: 0,
        accidentInsurance: 0
      },
      ownerOnly: {
        debtorLifeInsurance: 0,
        financingInterest: 0,
        lateInterest1: 0,
        lateInterest2: 0,
        vantiMobility: 0
      }
    };
    this.bills = [newBill, ...this.bills];
    this.currentBillIndex = 0;
  }

  deleteBill(index: number): void {
    if (this.bills.length === 1) {
      alert('Debes mantener al menos una factura');
      return;
    }
    this.bills = this.bills.filter((_, i) => i !== index);
    if (this.currentBillIndex >= this.bills.length) {
      this.currentBillIndex = this.bills.length - 1;
    }
  }

  selectBill(index: number): void {
    this.currentBillIndex = index;
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  incrementTenants(): void {
    this.numTenants++;
  }

  decrementTenants(): void {
    this.numTenants = Math.max(1, this.numTenants - 1);
  }

  getBillTotal(bill: Bill): number {
    return Object.values(bill.consumption).reduce((a, b) => a + b, 0) +
      Object.values(bill.sharedInsurance).reduce((a, b) => a + b, 0) +
      Object.values(bill.ownerOnly).reduce((a, b) => a + b, 0);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', { minimumFractionDigits: 2 });
  }

  downloadBill(): void {
    this.generatePDF();
  }

  private generatePDF(): void {
    const bill = this.currentBill;
    const date = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create a new window for the PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor permite las ventanas emergentes para descargar el PDF');
      return;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Factura ${bill.month || 'Sin periodo'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .invoice-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          color: white;
          text-align: center;
          position: relative;
        }

        .logo {
          width: 120px;
          height: 120px;
          margin: 0 auto 20px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .logo img {
          max-width: 80%;
          max-height: 80%;
          object-fit: contain;
        }

        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .header p {
          font-size: 16px;
          opacity: 0.9;
        }

        .invoice-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 30px 40px;
          background: #f8f9fa;
          border-bottom: 3px solid #667eea;
        }

        .info-block {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .info-label {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 18px;
          color: #212529;
          font-weight: 700;
        }

        .section {
          padding: 30px 40px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e9ecef;
        }

        .section-title.green {
          color: #10b981;
          border-bottom-color: #10b981;
        }

        .section-title.blue {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .section-title.purple {
          color: #a855f7;
          border-bottom-color: #a855f7;
        }

        .icon {
          width: 24px;
          height: 24px;
        }

        .items-table {
          width: 100%;
          margin-bottom: 20px;
        }

        .items-table tr {
          border-bottom: 1px solid #e9ecef;
        }

        .items-table td {
          padding: 12px 0;
        }

        .items-table td:first-child {
          color: #6c757d;
          font-size: 14px;
        }

        .items-table td:last-child {
          text-align: right;
          font-weight: 600;
          font-size: 16px;
        }

        .subtotal-row {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subtotal-row span:first-child {
          font-weight: 700;
          font-size: 16px;
        }

        .subtotal-row span:last-child {
          font-size: 22px;
          font-weight: 700;
        }

        .subtotal-row.green span:last-child {
          color: #10b981;
        }

        .subtotal-row.blue span:last-child {
          color: #3b82f6;
        }

        .subtotal-row.purple span:last-child {
          color: #a855f7;
        }

        .summary-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          color: white;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        .summary-card-label {
          font-size: 11px;
          text-transform: uppercase;
          opacity: 0.8;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .summary-card-value {
          font-size: 24px;
          font-weight: 700;
        }

        .detail-boxes {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .detail-box {
          background: white;
          border-radius: 12px;
          padding: 25px;
          color: #212529;
        }

        .detail-box-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 700;
        }

        .detail-box-header.green {
          color: #10b981;
        }

        .detail-box-header.blue {
          color: #3b82f6;
        }

        .detail-box-header.purple {
          color: #a855f7;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }

        .detail-row span:first-child {
          color: #6c757d;
        }

        .detail-row span:last-child {
          font-weight: 600;
        }

        .detail-total {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-total span:first-child {
          font-weight: 700;
          font-size: 15px;
        }

        .detail-total span:last-child {
          font-size: 22px;
          font-weight: 700;
        }

        .detail-total.green span:last-child {
          color: #10b981;
        }

        .detail-total.blue span:last-child {
          color: #3b82f6;
        }

        .detail-total.purple span:last-child {
          color: #a855f7;
        }

        .verification-box {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          font-size: 14px;
        }

        .footer {
          padding: 30px 40px;
          background: #f8f9fa;
          text-align: center;
          color: #6c757d;
          font-size: 12px;
        }

        @media print {
          body {
            padding: 0;
            background: white;
          }

          .invoice-container {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="logo">
            <img src="https://e7.pngegg.com/pngimages/896/729/png-clipart-jumpman-air-jordan-air-melo-line-logo-athlete-wall-logo-leaf-text.png" alt="Logo" onerror="this.style.display='none'">
          </div>
          <h1>División de Factura de Gas</h1>
          <p>Gestión de Servicios Públicos</p>
        </div>

        <!-- Invoice Info -->
        <div class="invoice-info">
          <div class="info-block">
            <div class="info-label">Periodo</div>
            <div class="info-value">${bill.month || 'Sin especificar'}</div>
          </div>
          <div class="info-block">
            <div class="info-label">Fecha de Emisión</div>
            <div class="info-value">${date}</div>
          </div>
          <div class="info-block">
            <div class="info-label">Número de Pisos</div>
            <div class="info-value">${this.numTenants} Inquilinos</div>
          </div>
          <div class="info-block">
            <div class="info-label">Total Factura</div>
            <div class="info-value">${this.formatCurrency(this.totalBill)}</div>
          </div>
        </div>

        <!-- Consumo Section -->
        <div class="section">
          <div class="section-title green">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Consumo de Gas (Se divide entre inquilinos)
          </div>
          <table class="items-table">
            <tr>
              <td>Sin subsidio</td>
              <td>${this.formatCurrency(bill.consumption.withoutSubsidy)}</td>
            </tr>
            <tr>
              <td>Con subsidio</td>
              <td>${this.formatCurrency(bill.consumption.withSubsidy)}</td>
            </tr>
            <tr>
              <td>Subsidio</td>
              <td>${this.formatCurrency(bill.consumption.subsidy)}</td>
            </tr>
            <tr>
              <td>Ajuste decena</td>
              <td>${this.formatCurrency(bill.consumption.adjustment)}</td>
            </tr>
          </table>
          <div class="subtotal-row green">
            <span>Total Consumo</span>
            <span>${this.formatCurrency(this.totalConsumption)}</span>
          </div>
        </div>

        <!-- Seguros Section -->
        <div class="section">
          <div class="section-title blue">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Seguros (Los paga otra persona)
          </div>
          <table class="items-table">
            <tr>
              <td>Coosepark Protección</td>
              <td>${this.formatCurrency(bill.sharedInsurance.coosepark)}</td>
            </tr>
            <tr>
              <td>Prima Seguro Accidentes</td>
              <td>${this.formatCurrency(bill.sharedInsurance.accidentInsurance)}</td>
            </tr>
          </table>
          <div class="subtotal-row blue">
            <span>Total Seguros</span>
            <span>${this.formatCurrency(this.totalSharedInsurance)}</span>
          </div>
        </div>

        <!-- Propietario Section -->
        <div class="section">
          <div class="section-title purple">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Gastos del Propietario
          </div>
          <table class="items-table">
            <tr>
              <td>Seguro Vida Deudor</td>
              <td>${this.formatCurrency(bill.ownerOnly.debtorLifeInsurance)}</td>
            </tr>
            <tr>
              <td>Intereses Financiamiento</td>
              <td>${this.formatCurrency(bill.ownerOnly.financingInterest)}</td>
            </tr>
            <tr>
              <td>Interés Mora 1 (1.83%)</td>
              <td>${this.formatCurrency(bill.ownerOnly.lateInterest1)}</td>
            </tr>
            <tr>
              <td>Interés Mora 2 (1.83%)</td>
              <td>${this.formatCurrency(bill.ownerOnly.lateInterest2)}</td>
            </tr>
            <tr>
              <td>1.83% V-Movilidad Vanti</td>
              <td>${this.formatCurrency(bill.ownerOnly.vantiMobility)}</td>
            </tr>
          </table>
          <div class="subtotal-row purple">
            <span>Total Propietario</span>
            <span>${this.formatCurrency(this.totalOwnerOnly)}</span>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
          <h2 style="margin-bottom: 25px; font-size: 28px; text-align: center;">Resumen de División</h2>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="summary-card-label">Total Factura</div>
              <div class="summary-card-value">${this.formatCurrency(this.totalBill)}</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-label">Por Inquilino</div>
              <div class="summary-card-value">${this.formatCurrency(this.perTenant)}</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-label">Seguros</div>
              <div class="summary-card-value">${this.formatCurrency(this.insurancePersonPays)}</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-label">Propietario</div>
              <div class="summary-card-value">${this.formatCurrency(this.ownerOnlyPays)}</div>
            </div>
          </div>

          <div class="detail-boxes">
            <div class="detail-box">
              <div class="detail-box-header green">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                Cada Inquilino Paga
              </div>
              <div class="detail-row">
                <span>Consumo dividido:</span>
                <span>${this.formatCurrency(this.totalConsumption / this.numTenants)}</span>
              </div>
              <div class="detail-total green">
                <span>Total por Piso</span>
                <span>${this.formatCurrency(this.perTenant)}</span>
              </div>
              <div style="margin-top: 15px; padding: 10px; background: #f0fdf4; border-radius: 8px; font-size: 12px; color: #166534;">
                <strong>Verificación:</strong> ${this.numTenants} pisos × ${this.formatCurrency(this.perTenant)} = ${this.formatCurrency(this.perTenant * this.numTenants)}
              </div>
            </div>

            <div class="detail-box">
              <div class="detail-box-header blue">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Persona de Seguros
              </div>
              <div class="detail-row">
                <span>Coosepark:</span>
                <span>${this.formatCurrency(bill.sharedInsurance.coosepark)}</span>
              </div>
              <div class="detail-row">
                <span>Prima Accidentes:</span>
                <span>${this.formatCurrency(bill.sharedInsurance.accidentInsurance)}</span>
              </div>
              <div class="detail-total blue">
                <span>Total Seguros</span>
                <span>${this.formatCurrency(this.insurancePersonPays)}</span>
              </div>
            </div>

            <div class="detail-box">
              <div class="detail-box-header purple">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Propietario
              </div>
              <div class="detail-row">
                <span>Seguro Vida:</span>
                <span>${this.formatCurrency(bill.ownerOnly.debtorLifeInsurance)}</span>
              </div>
              <div class="detail-row">
                <span>Intereses:</span>
                <span>${this.formatCurrency(bill.ownerOnly.financingInterest + bill.ownerOnly.lateInterest1 + bill.ownerOnly.lateInterest2)}</span>
              </div>
              <div class="detail-row">
                <span>V-Movilidad:</span>
                <span>${this.formatCurrency(bill.ownerOnly.vantiMobility)}</span>
              </div>
              <div class="detail-total purple">
                <span>Total</span>
                <span>${this.formatCurrency(this.ownerOnlyPays)}</span>
              </div>
            </div>
          </div>

          <div class="verification-box">
            <strong>Verificación Total:</strong> Inquilinos (${this.numTenants} × ${this.formatCurrency(this.perTenant)}) + Seguros (${this.formatCurrency(this.insurancePersonPays)}) + Propietario (${this.formatCurrency(this.ownerOnlyPays)}) = ${this.formatCurrency(this.totalBill)}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Sistema de División de Factura de Gas</strong></p>
          <p>Documento generado automáticamente el ${date}</p>
          <p style="margin-top: 10px;">Este documento es una división automática de la factura de servicios públicos</p>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };

        window.onafterprint = function() {
          window.close();
        };
      </script>
    </body>
    </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
      }

      private generateBillText(): string {
        const bill = this.currentBill;
        const date = new Date().toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        return `
    ╔════════════════════════════════════════════════════════════════════╗
    ║                    DIVISIÓN DE FACTURA DE GAS                      ║
    ║                     Gestión de Servicios Públicos                  ║
    ╚════════════════════════════════════════════════════════════════════╝

    Periodo: ${bill.month || 'Sin especificar'}
    Fecha de emisión: ${date}
    Número de Pisos/Inquilinos: ${this.numTenants}

    ────────────────────────────────────────────────────────────────────

                        DETALLE DE CONSUMO DE GAS
                      (Se divide entre inquilinos)

      Sin subsidio:                    $${this.formatCurrency(bill.consumption.withoutSubsidy)}
      Con subsidio:                    $${this.formatCurrency(bill.consumption.withSubsidy)}
      Subsidio:                        $${this.formatCurrency(bill.consumption.subsidy)}
      Ajuste decena:                   $${this.formatCurrency(bill.consumption.adjustment)}
      ─────────────────────────────────────────────────────────────
      TOTAL CONSUMO:                   $${this.formatCurrency(this.totalConsumption)}

    ────────────────────────────────────────────────────────────────────

                            SEGUROS
                      (Paga otra persona)

      Coosepark Protección:            $${this.formatCurrency(bill.sharedInsurance.coosepark)}
      Prima Seguro Accidentes:         $${this.formatCurrency(bill.sharedInsurance.accidentInsurance)}
      ─────────────────────────────────────────────────────────────
      TOTAL SEGUROS:                   $${this.formatCurrency(this.totalSharedInsurance)}

    ────────────────────────────────────────────────────────────────────

                        GASTOS DEL PROPIETARIO

      Seguro Vida Deudor:              $${this.formatCurrency(bill.ownerOnly.debtorLifeInsurance)}
      Intereses Financiamiento:        $${this.formatCurrency(bill.ownerOnly.financingInterest)}
      Interés Mora 1 (1.83%):          $${this.formatCurrency(bill.ownerOnly.lateInterest1)}
      Interés Mora 2 (1.83%):          $${this.formatCurrency(bill.ownerOnly.lateInterest2)}
      1.83% V-Movilidad Vanti:         $${this.formatCurrency(bill.ownerOnly.vantiMobility)}
      ─────────────────────────────────────────────────────────────
      TOTAL PROPIETARIO:               $${this.formatCurrency(this.totalOwnerOnly)}

    ════════════════════════════════════════════════════════════════════

                            RESUMEN DE DIVISIÓN

      Total Factura:                   $${this.formatCurrency(this.totalBill)}

      ┌──────────────────────────────────────────────────────────────┐
      │  CADA INQUILINO/PISO PAGA:                                   │
      │                                                              │
      │  Consumo de gas dividido:      $${this.formatCurrency(this.perTenant)}              │
      │                                                              │
      │  Total por Piso:

      $${this.formatCurrency(this.perTenant)}              │
      │  (Verificación ${this.numTenants} pisos):            $${this.formatCurrency(this.perTenant * this.numTenants)}              │
      └──────────────────────────────────────────────────────────────┘

      ┌──────────────────────────────────────────────────────────────┐
      │  PERSONA DE SEGUROS PAGA:                                    │
      │                                                              │
      │  Total Seguros:

      $${this.formatCurrency(this.insurancePersonPays)}              │
      └──────────────────────────────────────────────────────────────┘

      ┌──────────────────────────────────────────────────────────────┐
      │  PROPIETARIO PAGA:                                           │
      │                                                              │
      │  Total Propietario:

      $${this.formatCurrency(this.ownerOnlyPays)}              │
      └──────────────────────────────────────────────────────────────┘

    ────────────────────────────────────────────────────────────────────

    VERIFICACIÓN:
    Inquilinos (${this.numTenants} × $${this.formatCurrency(this.perTenant)}) + Seguros ($${this.formatCurrency(this.insurancePersonPays)}) +
    Propietario ($${this.formatCurrency(this.ownerOnlyPays)}) = $${this.formatCurrency(this.totalBill)}

    ════════════════════════════════════════════════════════════════════

    Nota: Esta es una división automática de la factura de gas.
    Los inquilinos pagan únicamente el consumo dividido.
    Los seguros son responsabilidad de otra persona.
    El propietario asume créditos, seguros de vida e intereses.

    ────────────────────────────────────────────────────────────────────
    Generado automáticamente por Sistema de División de Factura
    ${date}
    ════════════════════════════════════════════════════════════════════
    `;
      }
}

