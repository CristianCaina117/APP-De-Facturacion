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
  selector: 'app-gas3y4',
  imports: [CommonModule],
  templateUrl: './gas3y4.html',
  styleUrl: './gas3y4.css'
})
export class Gas3y4 {
  constructor(private router: Router) {}

  goToMenu(): void { this.router.navigate(['/']); }

  numTenants: number = 2;

  getCurrentMonthYear(): string {
    return new Date().toLocaleDateString('es-CO', {
      month: 'long',
      year: 'numeric'
    });
  }

  bills: Bill[] = [{
    id: Date.now(),
    month: this.getCurrentMonthYear(),
    consumption: { withoutSubsidy: 0, withSubsidy: 0, subsidy: 0, adjustment: 0 },
    sharedInsurance: { coosepark: 0, accidentInsurance: 0 },
    ownerOnly: { debtorLifeInsurance: 0, financingInterest: 0, lateInterest1: 0, lateInterest2: 0, vantiMobility: 0 }
  }];

  currentBillIndex: number = 0;
  showHistory: boolean = false;

  get currentBill(): Bill { return this.bills[this.currentBillIndex]; }

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
  get perTenant(): number { return this.numTenants > 0 ? this.totalConsumption / this.numTenants : 0; }
  get ownerOnlyPays(): number { return this.totalOwnerOnly; }
  get insurancePersonPays(): number { return this.totalSharedInsurance; }

  updateConsumption(field: keyof Bill['consumption'], value: number): void { this.currentBill.consumption[field] = value; }
  updateSharedInsurance(field: keyof Bill['sharedInsurance'], value: number): void { this.currentBill.sharedInsurance[field] = value; }
  updateOwnerOnly(field: keyof Bill['ownerOnly'], value: number): void { this.currentBill.ownerOnly[field] = value; }
  updateMonth(value: string): void { this.currentBill.month = value; }

  addNewBill(): void {
    const newBill: Bill = {
      id: Date.now(),
      month: this.getCurrentMonthYear(),
      consumption: { withoutSubsidy: 0, withSubsidy: 0, subsidy: 0, adjustment: 0 },
      sharedInsurance: { coosepark: 0, accidentInsurance: 0 },
      ownerOnly: { debtorLifeInsurance: 0, financingInterest: 0, lateInterest1: 0, lateInterest2: 0, vantiMobility: 0 }
    };
    this.bills = [newBill, ...this.bills];
    this.currentBillIndex = 0;
  }

  deleteBill(index: number): void {
    if (this.bills.length === 1) { alert('Debes mantener al menos una factura'); return; }
    this.bills = this.bills.filter((_, i) => i !== index);
    if (this.currentBillIndex >= this.bills.length) this.currentBillIndex = this.bills.length - 1;
  }

  selectBill(index: number): void { this.currentBillIndex = index; }
  toggleHistory(): void { this.showHistory = !this.showHistory; }
  incrementTenants(): void { this.numTenants++; }
  decrementTenants(): void { this.numTenants = Math.max(1, this.numTenants - 1); }

  getBillTotal(bill: Bill): number {
    return Object.values(bill.consumption).reduce((a, b) => a + b, 0)
      + Object.values(bill.sharedInsurance).reduce((a, b) => a + b, 0)
      + Object.values(bill.ownerOnly).reduce((a, b) => a + b, 0);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  downloadBill(): void { this.generatePDF(); }

  private generatePDF(): void {
    const bill = this.currentBill;
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const invoiceNum = `GAS-${bill.id.toString().slice(-8).toUpperCase()}`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('Por favor permite las ventanas emergentes para descargar el PDF'); return; }

    const pct = (val: number) => this.totalBill > 0 ? ((val / this.totalBill) * 100).toFixed(1) : '0.0';
    const hasMora = (bill.ownerOnly.lateInterest1 + bill.ownerOnly.lateInterest2) > 0;
    const interesesMora = bill.ownerOnly.lateInterest1 + bill.ownerOnly.lateInterest2;

    const statusBadge = hasMora
      ? `<div class="status-badge status-mora">⚠ Mora Registrada</div>`
      : `<div class="status-badge status-ok">✓ Todo al Corriente</div>`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factura Gas Vanti — ${bill.month || 'Sin periodo'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    :root {
      --gold: #c9a84c; --gold-light: #e8d5a3; --dark: #0d0d0d; --dark2: #1a1208;
      --cream: #f4f1eb; --cream2: #fffbf0; --text: #1a1510; --text-mid: #4a3d20;
      --text-dim: #8a7a5a; --border: #e8e0d0;
      --green: #059669; --green-bg: rgba(5,150,105,0.07); --green-border: rgba(5,150,105,0.2);
      --blue: #2563eb; --blue-bg: rgba(37,99,235,0.07); --blue-border: rgba(37,99,235,0.2);
      --purple: #7c3aed; --purple-bg: rgba(124,58,237,0.07); --purple-border: rgba(124,58,237,0.2);
      --red: #dc2626; --red-bg: rgba(220,38,38,0.07); --red-border: rgba(220,38,38,0.2);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Outfit', sans-serif; background: var(--cream); color: var(--text); font-size: 13px; line-height: 1.5; }

    .header { background: linear-gradient(150deg, #0a0a0f 0%, #1a1208 55%, #0d0d0d 100%); color: #f0ead6; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 90% 70% at 50% -10%, rgba(201,168,76,0.22) 0%, transparent 60%), repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201,168,76,0.02) 40px, rgba(201,168,76,0.02) 41px); }
    .header-inner { position: relative; padding: 36px 48px 28px; }
    .header-top-bar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 20px; }
    .brand-service { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
    .brand-service::before { content: ''; display: inline-block; width: 20px; height: 1.5px; background: var(--gold); }
    .brand-name { font-size: 32px; font-weight: 900; line-height: 1; color: #f0ead6; }
    .brand-name span { color: var(--gold); }
    .brand-tagline { font-size: 11px; font-weight: 300; color: rgba(240,234,214,0.4); margin-top: 6px; letter-spacing: 0.05em; }
    .invoice-meta { text-align: right; flex-shrink: 0; }
    .invoice-num { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: var(--gold); text-transform: uppercase; margin-bottom: 4px; }
    .invoice-period { font-size: 22px; font-weight: 800; color: #f0ead6; line-height: 1.1; }
    .invoice-dates { margin-top: 8px; display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
    .invoice-dates span { font-size: 10px; color: rgba(240,234,214,0.4); }
    .status-strip { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .status-badge { display: inline-flex; align-items: center; gap: 7px; padding: 7px 18px; border-radius: 30px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    .status-ok { background: rgba(5,150,105,0.2); border: 1px solid rgba(5,150,105,0.5); color: #6ee7b7; }
    .status-mora { background: rgba(220,38,38,0.2); border: 1px solid rgba(220,38,38,0.5); color: #fca5a5; }
    .header-kpis { display: flex; gap: 10px; flex-wrap: wrap; }
    .hkpi { background: rgba(255,255,255,0.05); border: 0.5px solid rgba(201,168,76,0.2); border-radius: 10px; padding: 10px 16px; text-align: center; min-width: 110px; }
    .hkpi-label { font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(201,168,76,0.55); margin-bottom: 4px; }
    .hkpi-value { font-size: 17px; font-weight: 800; color: var(--gold); line-height: 1; }
    .hkpi-value.white { color: #f0ead6; } .hkpi-value.green { color: #6ee7b7; } .hkpi-value.blue { color: #93c5fd; } .hkpi-value.purple { color: #c4b5fd; }
    .hkpi-sub { font-size: 9px; color: rgba(240,234,214,0.3); margin-top: 2px; }
    .divider-gold { height: 3px; background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent); }

    .body { padding: 32px 48px 48px; background: var(--cream); }

    .explainer { background: var(--cream2); border: 1px solid var(--border); border-left: 4px solid var(--gold); border-radius: 0 10px 10px 0; padding: 16px 20px; margin-bottom: 28px; display: flex; gap: 14px; align-items: flex-start; }
    .explainer-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
    .explainer h3 { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #8a6d00; margin-bottom: 6px; }
    .explainer p { font-size: 12px; color: var(--text-mid); line-height: 1.7; }
    .explainer strong { color: var(--text); }

    .section-block { margin-bottom: 28px; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
    .section-header-row { padding: 14px 18px; display: flex; align-items: center; gap: 12px; }
    .section-header-row.green  { background: linear-gradient(90deg, rgba(5,150,105,0.08), transparent); border-bottom: 1px solid var(--green-border); }
    .section-header-row.blue   { background: linear-gradient(90deg, rgba(37,99,235,0.08), transparent); border-bottom: 1px solid var(--blue-border); }
    .section-header-row.purple { background: linear-gradient(90deg, rgba(124,58,237,0.08), transparent); border-bottom: 1px solid var(--purple-border); }
    .section-header-row.red    { background: linear-gradient(90deg, rgba(220,38,38,0.08), transparent); border-bottom: 1px solid var(--red-border); }
    .section-title-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
    .section-title-icon.green  { background: var(--green-bg);  border: 1px solid var(--green-border);  color: var(--green); }
    .section-title-icon.blue   { background: var(--blue-bg);   border: 1px solid var(--blue-border);   color: var(--blue); }
    .section-title-icon.purple { background: var(--purple-bg); border: 1px solid var(--purple-border); color: var(--purple); }
    .section-title-text h2 { font-size: 15px; font-weight: 700; color: var(--text); }
    .section-title-text p  { font-size: 10px; color: var(--text-dim); font-weight: 400; margin-top: 1px; }
    .section-title-badge { margin-left: auto; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; }
    .badge-green  { background: var(--green-bg);  border: 1px solid var(--green-border);  color: var(--green); }
    .badge-blue   { background: var(--blue-bg);   border: 1px solid var(--blue-border);   color: var(--blue); }
    .badge-purple { background: var(--purple-bg); border: 1px solid var(--purple-border); color: var(--purple); }

    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #faf8f3; }
    thead th { padding: 9px 16px; font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); text-align: left; border-bottom: 1px solid var(--border); }
    thead th.right { text-align: right; } thead th.center { text-align: center; }
    tbody tr { border-top: 1px solid #f5f0e8; }
    tbody tr:hover { background: #fdfaf5; }
    tbody td { padding: 11px 16px; font-size: 12px; color: var(--text); vertical-align: middle; }
    tbody td.right { text-align: right; } tbody td.center { text-align: center; } tbody td.dim { color: var(--text-dim); font-size: 11px; } tbody td.amount { font-weight: 600; font-size: 13px; }
    .concept-name { font-weight: 600; font-size: 12px; }
    .concept-desc { font-size: 10px; color: var(--text-dim); margin-top: 2px; font-weight: 300; }
    .pill { display: inline-block; font-size: 8px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 7px; border-radius: 20px; margin-left: 6px; vertical-align: middle; white-space: nowrap; }
    .pill-green  { background: rgba(5,150,105,0.1);  color: #047857; border: 0.5px solid rgba(5,150,105,0.25); }
    .pill-blue   { background: rgba(37,99,235,0.1);  color: #1d4ed8; border: 0.5px solid rgba(37,99,235,0.25); }
    .pill-purple { background: rgba(124,58,237,0.1); color: #6d28d9; border: 0.5px solid rgba(124,58,237,0.25); }
    .pill-red    { background: rgba(220,38,38,0.1);  color: #b91c1c; border: 0.5px solid rgba(220,38,38,0.25); }
    .pill-gold   { background: rgba(201,168,76,0.12);color: #92600a; border: 0.5px solid rgba(201,168,76,0.3); }
    .pct-bar-wrap { display: flex; align-items: center; gap: 8px; min-width: 90px; }
    .pct-bar-bg { flex: 1; height: 5px; background: #f0ead6; border-radius: 3px; overflow: hidden; }
    .pct-bar-fill { height: 100%; border-radius: 3px; }
    .pct-text { font-size: 10px; font-weight: 600; color: var(--text-dim); min-width: 35px; text-align: right; }
    .subtotal-row td { background: #f9f6ef; border-top: 2px solid var(--border) !important; font-weight: 700; }
    .subtotal-label { font-size: 12px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; }
    .subtotal-amount { font-size: 18px; font-weight: 800; }
    .subtotal-amount.green { color: var(--green); } .subtotal-amount.blue { color: var(--blue); } .subtotal-amount.purple { color: var(--purple); }
    .per-floor-row td { background: rgba(5,150,105,0.04); border-top: 1px dashed rgba(5,150,105,0.2) !important; }
    .per-floor-label { font-size: 11px; color: var(--green); font-weight: 600; display: flex; align-items: center; gap: 6px; }
    .per-floor-amount { font-size: 20px; font-weight: 800; color: var(--green); }

    .mora-warning { display: flex; align-items: flex-start; gap: 12px; background: var(--red-bg); border: 1px solid var(--red-border); border-radius: 10px; padding: 14px 18px; margin-bottom: 28px; }
    .mora-warning-icon { font-size: 20px; flex-shrink: 0; }
    .mora-warning h4 { font-size: 12px; font-weight: 700; color: var(--red); margin-bottom: 4px; }
    .mora-warning p  { font-size: 11px; color: var(--text-mid); line-height: 1.6; }

    .estado-block { background: white; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 28px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
    .estado-header { padding: 14px 20px; background: linear-gradient(90deg, #faf8f3, var(--cream2)); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
    .estado-header h3 { font-size: 12px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }
    .estado-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #f5f0e8; gap: 12px; }
    .estado-who { display: flex; align-items: center; gap: 10px; flex: 1; }
    .estado-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .estado-dot.green { background: var(--green); } .estado-dot.blue { background: var(--blue); } .estado-dot.purple { background: var(--purple); }
    .estado-name { font-size: 12px; font-weight: 600; color: var(--text); }
    .estado-detail { font-size: 10px; color: var(--text-dim); margin-top: 1px; }
    .estado-amount { font-size: 16px; font-weight: 800; }
    .estado-amount.green { color: var(--green); } .estado-amount.blue { color: var(--blue); } .estado-amount.purple { color: var(--purple); }
    .estado-status { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; flex-shrink: 0; }
    .status-green  { background: rgba(5,150,105,0.1); color: var(--green); border: 0.5px solid rgba(5,150,105,0.3); }
    .status-blue   { background: rgba(37,99,235,0.1); color: var(--blue);  border: 0.5px solid rgba(37,99,235,0.3); }
    .status-purple { background: rgba(124,58,237,0.1);color: var(--purple);border: 0.5px solid rgba(124,58,237,0.3); }
    .estado-total-row { padding: 14px 20px; background: #faf8f3; border-top: 2px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .estado-total-label { font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; }
    .estado-total-amount { font-size: 24px; font-weight: 900; color: var(--text); }

    .verificacion { background: linear-gradient(135deg, #0d0d0d, #1a1208); border-radius: 12px; padding: 24px 28px; color: #f0ead6; margin-bottom: 28px; position: relative; overflow: hidden; }
    .verificacion::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 65%); }
    .verificacion-title { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; position: relative; display: flex; align-items: center; gap: 8px; }
    .verificacion-title::after { content: ''; flex: 1; height: 1px; background: rgba(201,168,76,0.2); }
    .verificacion-formula { position: relative; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .vf-block { background: rgba(255,255,255,0.05); border: 0.5px solid rgba(201,168,76,0.15); border-radius: 8px; padding: 10px 14px; text-align: center; }
    .vf-who  { font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(240,234,214,0.4); margin-bottom: 4px; }
    .vf-amt  { font-size: 15px; font-weight: 800; line-height: 1; }
    .vf-amt.green { color: #6ee7b7; } .vf-amt.blue { color: #93c5fd; } .vf-amt.purple { color: #c4b5fd; }
    .vf-sub  { font-size: 9px; color: rgba(240,234,214,0.3); margin-top: 2px; }
    .vf-op   { font-size: 20px; color: rgba(201,168,76,0.4); font-weight: 300; }
    .vf-eq   { font-size: 20px; color: var(--gold); font-weight: 700; }
    .vf-total { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 8px; padding: 10px 18px; text-align: center; }
    .vf-total-label { font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(201,168,76,0.55); margin-bottom: 3px; }
    .vf-total-amount { font-size: 22px; font-weight: 900; color: var(--gold); line-height: 1; }
    .verificacion-note { position: relative; font-size: 10px; color: rgba(240,234,214,0.35); font-style: italic; padding-top: 12px; border-top: 0.5px solid rgba(201,168,76,0.1); }

    .footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px solid var(--border); gap: 20px; flex-wrap: wrap; }
    .footer-left p { font-size: 9px; color: var(--text-dim); line-height: 1.7; }
    .footer-left p strong { color: var(--text-mid); }
    .footer-seal { background: var(--cream2); border: 1px dashed var(--gold); border-radius: 10px; padding: 12px 20px; text-align: center; flex-shrink: 0; }
    .footer-seal-title { font-size: 10px; font-weight: 700; color: #8a6d00; margin-bottom: 4px; }
    .footer-seal-line  { font-size: 9px; color: var(--text-dim); line-height: 1.6; }
    .footer-seal-num   { font-size: 11px; font-weight: 600; color: var(--gold); margin-top: 4px; }

    @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } body { background: white; } }
  </style>
</head>
<body>

<div class="header">
  <div class="header-inner">
    <div class="header-top-bar">
      <div class="brand-block">
        <div class="brand-service">Gas Natural Vanti — Servicios Públicos</div>
        <div class="brand-name">División de <span>Factura</span></div>
        <div class="brand-tagline">Documento oficial de distribución de costos por unidad habitacional</div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-num">${invoiceNum}</div>
        <div class="invoice-period">${bill.month || 'Sin periodo'}</div>
        <div class="invoice-dates">
          <span>Emitido: ${dateStr} · ${timeStr}</span>
          <span>Pisos registrados: ${this.numTenants} unidades</span>
        </div>
      </div>
    </div>
    <div class="status-strip">
      ${statusBadge}
      <div class="header-kpis">
        <div class="hkpi">
          <div class="hkpi-label">Total Factura</div>
          <div class="hkpi-value">$${this.formatCurrency(this.totalBill)}</div>
          <div class="hkpi-sub">Vanti Gas Natural</div>
        </div>
        <div class="hkpi">
          <div class="hkpi-label">Cada Piso Paga</div>
          <div class="hkpi-value green">$${this.formatCurrency(this.perTenant)}</div>
          <div class="hkpi-sub">÷ ${this.numTenants} pisos</div>
        </div>
      </div>
    </div>
  </div>
  <div class="divider-gold"></div>
</div>

<div class="body">

  <div class="explainer">
    <div class="explainer-icon">💡</div>
    <div>
      <h3>¿Cómo se divide esta factura?</h3>
      <p>
        Esta factura de <strong>Gas Natural Vanti</strong> contiene tres tipos de cargos con <strong>responsabilidades distintas</strong>.
        El <strong>consumo de gas</strong> se divide en partes iguales entre los <strong>${this.numTenants} pisos</strong>.
        Los <strong>seguros</strong> (Coosepark y Prima Accidentes) son pagados por una persona designada.
        Los <strong>gastos del propietario</strong> (crédito hipotecario, seguro de vida e intereses) son obligaciones exclusivas del propietario.
        <strong>Ningún valor ha sido modificado respecto a la factura original de Vanti.</strong>
      </p>
    </div>
  </div>

  <!-- CONSUMO -->
  <div class="section-block">
    <div class="section-header-row green">
      <div class="section-title-icon green">🔥</div>
      <div class="section-title-text">
        <h2>Consumo de Gas Natural</h2>
        <p>Cargos por consumo real — se divide en partes iguales entre los ${this.numTenants} pisos</p>
      </div>
      <span class="section-title-badge badge-green">Se divide ÷ ${this.numTenants}</span>
    </div>
    <table>
      <thead><tr>
        <th style="width:30%">Concepto</th>
        <th style="width:38%">Descripción</th>
        <th class="center" style="width:16%">% del Total</th>
        <th class="right" style="width:16%">Valor</th>
      </tr></thead>
      <tbody>
        <tr>
          <td><div class="concept-name">Sin subsidio <span class="pill pill-green">Consumo</span></div><div class="concept-desc">Tarifa plena sin beneficio de subsidio</div></td>
          <td class="dim">Consumo facturado a tarifa plena. Aplica cuando el consumo supera el límite subsidiado o no hay subsidio asignado.</td>
          <td class="center"><div class="pct-bar-wrap"><div class="pct-bar-bg"><div class="pct-bar-fill" style="width:${pct(bill.consumption.withoutSubsidy)}%;background:var(--green)"></div></div><span class="pct-text">${pct(bill.consumption.withoutSubsidy)}%</span></div></td>
          <td class="right amount">$${this.formatCurrency(bill.consumption.withoutSubsidy)}</td>
        </tr>
        <tr>
          <td><div class="concept-name">Con subsidio <span class="pill pill-green">Consumo</span></div><div class="concept-desc">Tarifa con descuento de subsidio aplicado</div></td>
          <td class="dim">Consumo con descuento subsidiado según estrato socioeconómico. Este valor ya incluye el beneficio aplicado por Vanti.</td>
          <td class="center"><div class="pct-bar-wrap"><div class="pct-bar-bg"><div class="pct-bar-fill" style="width:${pct(bill.consumption.withSubsidy)}%;background:var(--green)"></div></div><span class="pct-text">${pct(bill.consumption.withSubsidy)}%</span></div></td>
          <td class="right amount">$${this.formatCurrency(bill.consumption.withSubsidy)}</td>
        </tr>
        <tr>
          <td><div class="concept-name">Subsidio <span class="pill pill-gold">Beneficio</span></div><div class="concept-desc">Aporte estatal al costo del servicio</div></td>
          <td class="dim">Contribución del Estado para usuarios de estratos 1, 2 y 3. Se refleja como descuento directo en la factura de gas.</td>
          <td class="center"><div class="pct-bar-wrap"><div class="pct-bar-bg"><div class="pct-bar-fill" style="width:${pct(bill.consumption.subsidy)}%;background:#c9a84c"></div></div><span class="pct-text">${pct(bill.consumption.subsidy)}%</span></div></td>
          <td class="right amount">$${this.formatCurrency(bill.consumption.subsidy)}</td>
        </tr>
        <tr>
          <td><div class="concept-name">Ajuste decena <span class="pill pill-gold">Ajuste</span></div><div class="concept-desc">Redondeo por diferencia entre lecturas</div></td>
          <td class="dim">Diferencia de lectura entre el período actual y el anterior. Puede ser positivo o negativo según el medidor.</td>
          <td class="center"><div class="pct-bar-wrap"><div class="pct-bar-bg"><div class="pct-bar-fill" style="width:${pct(bill.consumption.adjustment)}%;background:#c9a84c"></div></div><span class="pct-text">${pct(bill.consumption.adjustment)}%</span></div></td>
          <td class="right amount">$${this.formatCurrency(bill.consumption.adjustment)}</td>
        </tr>
        <tr class="subtotal-row">
          <td colspan="2"><span class="subtotal-label">Subtotal Consumo de Gas</span></td>
          <td class="center dim" style="font-size:10px">100% consumo</td>
          <td class="right"><span class="subtotal-amount green">$${this.formatCurrency(this.totalConsumption)}</span></td>
        </tr>
        <tr class="per-floor-row">
          <td colspan="2"><span class="per-floor-label">▸ Corresponde a cada uno de los ${this.numTenants} pisos / inquilinos</span></td>
          <td class="center dim" style="font-size:10px">÷ ${this.numTenants} pisos</td>
          <td class="right"><span class="per-floor-amount">$${this.formatCurrency(this.perTenant)}</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ESTADO DE CUENTA -->
  <div class="estado-block">
    <div class="estado-header">
      <h3>📋 Estado de Cuenta — Resumen por Responsable</h3>
      <span style="font-size:9px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(201,168,76,0.1);border:0.5px solid rgba(201,168,76,0.3);color:#8a6d00;letter-spacing:0.08em;text-transform:uppercase;">Período: ${bill.month || 'Sin especificar'}</span>
    </div>
    <div class="estado-row">
      <div class="estado-who">
        <div class="estado-dot green"></div>
        <div>
          <div class="estado-name">Cada Piso / Inquilino</div>
          <div class="estado-detail">Consumo de gas ÷ ${this.numTenants} pisos · ${this.numTenants} × $${this.formatCurrency(this.perTenant)} = $${this.formatCurrency(this.perTenant * this.numTenants)}</div>
        </div>
      </div>
      <div class="estado-amount green">$${this.formatCurrency(this.perTenant)}</div>
      <span class="estado-status status-green">Por piso</span>
    </div>
    <div class="estado-total-row">
      <div class="estado-total-label">Total General de la Factura Vanti</div>
      <div class="estado-total-amount">$${this.formatCurrency(this.totalBill)}</div>
    </div>
  </div>

  <!-- VERIFICACIÓN -->
  <div class="verificacion">
    <div class="verificacion-title">✓ Verificación Matemática</div>
    <div class="verificacion-formula">
      <div class="vf-block">
        <div class="vf-who">${this.numTenants} Pisos</div>
        <div class="vf-amt green">$${this.formatCurrency(this.perTenant * this.numTenants)}</div>
        <div class="vf-sub">${this.numTenants} × $${this.formatCurrency(this.perTenant)}</div>
      </div>
      <div class="vf-eq">=</div>
      <div class="vf-total">
        <div class="vf-total-label">Total Factura</div>
        <div class="vf-total-amount">$${this.formatCurrency(this.totalBill)}</div>
      </div>
    </div>
    <div class="verificacion-note">✦ Todos los valores fueron tomados directamente de la factura original de Vanti sin ninguna modificación. Documento de transparencia para distribución equitativa de costos.</div>
  </div>

  <div class="footer">
    <div class="footer-left">
      <p><strong>Sistema de División de Factura de Gas Natural</strong></p>
      <p>Documento generado automáticamente el ${dateStr} a las ${timeStr}</p>
      <p>Proveedor: <strong>Vanti S.A. E.S.P.</strong> — Gas Natural Domiciliario</p>
      <p>Los valores corresponden exactamente a la factura original. Ningún concepto ha sido modificado.</p>
    </div>
    <div class="footer-seal">
      <div class="footer-seal-title">División Verificada y Transparente</div>
      <div class="footer-seal-line">Período: ${bill.month || 'Sin especificar'}</div>
      <div class="footer-seal-line">Total: $${this.formatCurrency(this.totalBill)} · Pisos: ${this.numTenants}</div>
      <div class="footer-seal-num">${invoiceNum}</div>
    </div>
  </div>

</div>
<script>
  window.onload = function() { setTimeout(function() { window.print(); }, 700); };
  window.onafterprint = function() { window.close(); };
</script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  }
}
