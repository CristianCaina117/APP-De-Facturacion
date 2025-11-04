import{$ as M,B as y,F as g,G as e,H as t,I as m,L as _,M as d,N as h,P as S,Q as i,R as x,S as c,T as O,V as P,aa as I,ba as k,ea as E,l as v,m as b,n as p,o as u,u as a,w,x as C}from"./chunk-PLDO6J7J.js";function T(f,r){if(f&1){let o=_();e(0,"div",98),d("click",function(){let l=v(o).index,s=h(2);return b(s.selectBill(l))}),e(1,"div")(2,"p",99),i(3),t(),e(4,"p",100),i(5),t()(),e(6,"button",101),d("click",function(l){let s=v(o).index;return h(2).deleteBill(s),b(l.stopPropagation())}),p(),e(7,"svg",23),m(8,"polyline",102)(9,"path",103),t()()()}if(f&2){let o=r.$implicit,n=r.index,l=h(2);S("active",n===l.currentBillIndex),a(3),x(o.month||"Sin nombre"),a(2),c("Total: $",l.formatCurrency(l.getBillTotal(o)))}}function B(f,r){if(f&1&&(e(0,"div",96),y(1,T,10,4,"div",97),t()),f&2){let o=h();a(),g("ngForOf",o.bills)}}var $=class f{constructor(r){this.router=r}goToMenu(){this.router.navigate(["/"])}numTenants=2;bills=[{id:Date.now(),month:"",consumption:{withoutSubsidy:0,withSubsidy:0,subsidy:0,adjustment:0},sharedInsurance:{coosepark:0,accidentInsurance:0},ownerOnly:{debtorLifeInsurance:0,financingInterest:0,lateInterest1:0,lateInterest2:0,vantiMobility:0}}];currentBillIndex=0;showHistory=!1;get currentBill(){return this.bills[this.currentBillIndex]}get totalConsumption(){return Object.values(this.currentBill.consumption).reduce((r,o)=>r+o,0)}get totalSharedInsurance(){return Object.values(this.currentBill.sharedInsurance).reduce((r,o)=>r+o,0)}get totalOwnerOnly(){return Object.values(this.currentBill.ownerOnly).reduce((r,o)=>r+o,0)}get totalBill(){return this.totalConsumption+this.totalSharedInsurance+this.totalOwnerOnly}get perTenant(){return this.totalConsumption/this.numTenants}get ownerOnlyPays(){return this.totalOwnerOnly}get insurancePersonPays(){return this.totalSharedInsurance}updateConsumption(r,o){this.currentBill.consumption[r]=o}updateSharedInsurance(r,o){this.currentBill.sharedInsurance[r]=o}updateOwnerOnly(r,o){this.currentBill.ownerOnly[r]=o}updateMonth(r){this.currentBill.month=r}addNewBill(){let r={id:Date.now(),month:"",consumption:{withoutSubsidy:0,withSubsidy:0,subsidy:0,adjustment:0},sharedInsurance:{coosepark:0,accidentInsurance:0},ownerOnly:{debtorLifeInsurance:0,financingInterest:0,lateInterest1:0,lateInterest2:0,vantiMobility:0}};this.bills=[r,...this.bills],this.currentBillIndex=0}deleteBill(r){if(this.bills.length===1){alert("Debes mantener al menos una factura");return}this.bills=this.bills.filter((o,n)=>n!==r),this.currentBillIndex>=this.bills.length&&(this.currentBillIndex=this.bills.length-1)}selectBill(r){this.currentBillIndex=r}toggleHistory(){this.showHistory=!this.showHistory}incrementTenants(){this.numTenants++}decrementTenants(){this.numTenants=Math.max(1,this.numTenants-1)}getBillTotal(r){return Object.values(r.consumption).reduce((o,n)=>o+n,0)+Object.values(r.sharedInsurance).reduce((o,n)=>o+n,0)+Object.values(r.ownerOnly).reduce((o,n)=>o+n,0)}formatCurrency(r){return r.toLocaleString("es-CO",{minimumFractionDigits:2})}downloadBill(){this.generatePDF()}generatePDF(){let r=this.currentBill,o=new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"}),n=window.open("","_blank");if(!n){alert("Por favor permite las ventanas emergentes para descargar el PDF");return}let l=`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Factura ${r.month||"Sin periodo"}</title>
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
          <h1>Divisi\xF3n de Factura de Gas</h1>
          <p>Gesti\xF3n de Servicios P\xFAblicos</p>
        </div>

        <!-- Invoice Info -->
        <div class="invoice-info">
          <div class="info-block">
            <div class="info-label">Periodo</div>
            <div class="info-value">${r.month||"Sin especificar"}</div>
          </div>
          <div class="info-block">
            <div class="info-label">Fecha de Emisi\xF3n</div>
            <div class="info-value">${o}</div>
          </div>
          <div class="info-block">
            <div class="info-label">N\xFAmero de Pisos</div>
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
              <td>${this.formatCurrency(r.consumption.withoutSubsidy)}</td>
            </tr>
            <tr>
              <td>Con subsidio</td>
              <td>${this.formatCurrency(r.consumption.withSubsidy)}</td>
            </tr>
            <tr>
              <td>Subsidio</td>
              <td>${this.formatCurrency(r.consumption.subsidy)}</td>
            </tr>
            <tr>
              <td>Ajuste decena</td>
              <td>${this.formatCurrency(r.consumption.adjustment)}</td>
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
              <td>Coosepark Protecci\xF3n</td>
              <td>${this.formatCurrency(r.sharedInsurance.coosepark)}</td>
            </tr>
            <tr>
              <td>Prima Seguro Accidentes</td>
              <td>${this.formatCurrency(r.sharedInsurance.accidentInsurance)}</td>
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
              <td>${this.formatCurrency(r.ownerOnly.debtorLifeInsurance)}</td>
            </tr>
            <tr>
              <td>Intereses Financiamiento</td>
              <td>${this.formatCurrency(r.ownerOnly.financingInterest)}</td>
            </tr>
            <tr>
              <td>Inter\xE9s Mora 1 (1.83%)</td>
              <td>${this.formatCurrency(r.ownerOnly.lateInterest1)}</td>
            </tr>
            <tr>
              <td>Inter\xE9s Mora 2 (1.83%)</td>
              <td>${this.formatCurrency(r.ownerOnly.lateInterest2)}</td>
            </tr>
            <tr>
              <td>1.83% V-Movilidad Vanti</td>
              <td>${this.formatCurrency(r.ownerOnly.vantiMobility)}</td>
            </tr>
          </table>
          <div class="subtotal-row purple">
            <span>Total Propietario</span>
            <span>${this.formatCurrency(this.totalOwnerOnly)}</span>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
          <h2 style="margin-bottom: 25px; font-size: 28px; text-align: center;">Resumen de Divisi\xF3n</h2>

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
                <span>${this.formatCurrency(this.totalConsumption/this.numTenants)}</span>
              </div>
              <div class="detail-total green">
                <span>Total por Piso</span>
                <span>${this.formatCurrency(this.perTenant)}</span>
              </div>
              <div style="margin-top: 15px; padding: 10px; background: #f0fdf4; border-radius: 8px; font-size: 12px; color: #166534;">
                <strong>Verificaci\xF3n:</strong> ${this.numTenants} pisos \xD7 ${this.formatCurrency(this.perTenant)} = ${this.formatCurrency(this.perTenant*this.numTenants)}
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
                <span>${this.formatCurrency(r.sharedInsurance.coosepark)}</span>
              </div>
              <div class="detail-row">
                <span>Prima Accidentes:</span>
                <span>${this.formatCurrency(r.sharedInsurance.accidentInsurance)}</span>
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
                <span>${this.formatCurrency(r.ownerOnly.debtorLifeInsurance)}</span>
              </div>
              <div class="detail-row">
                <span>Intereses:</span>
                <span>${this.formatCurrency(r.ownerOnly.financingInterest+r.ownerOnly.lateInterest1+r.ownerOnly.lateInterest2)}</span>
              </div>
              <div class="detail-row">
                <span>V-Movilidad:</span>
                <span>${this.formatCurrency(r.ownerOnly.vantiMobility)}</span>
              </div>
              <div class="detail-total purple">
                <span>Total</span>
                <span>${this.formatCurrency(this.ownerOnlyPays)}</span>
              </div>
            </div>
          </div>

          <div class="verification-box">
            <strong>Verificaci\xF3n Total:</strong> Inquilinos (${this.numTenants} \xD7 ${this.formatCurrency(this.perTenant)}) + Seguros (${this.formatCurrency(this.insurancePersonPays)}) + Propietario (${this.formatCurrency(this.ownerOnlyPays)}) = ${this.formatCurrency(this.totalBill)}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Sistema de Divisi\xF3n de Factura de Gas</strong></p>
          <p>Documento generado autom\xE1ticamente el ${o}</p>
          <p style="margin-top: 10px;">Este documento es una divisi\xF3n autom\xE1tica de la factura de servicios p\xFAblicos</p>
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
      <\/script>
    </body>
    </html>
        `;n.document.write(l),n.document.close()}generateBillText(){let r=this.currentBill,o=new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});return`
    \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
    \u2551                    DIVISI\xD3N DE FACTURA DE GAS                      \u2551
    \u2551                     Gesti\xF3n de Servicios P\xFAblicos                  \u2551
    \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

    Periodo: ${r.month||"Sin especificar"}
    Fecha de emisi\xF3n: ${o}
    N\xFAmero de Pisos/Inquilinos: ${this.numTenants}

    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

                        DETALLE DE CONSUMO DE GAS
                      (Se divide entre inquilinos)

      Sin subsidio:                    $${this.formatCurrency(r.consumption.withoutSubsidy)}
      Con subsidio:                    $${this.formatCurrency(r.consumption.withSubsidy)}
      Subsidio:                        $${this.formatCurrency(r.consumption.subsidy)}
      Ajuste decena:                   $${this.formatCurrency(r.consumption.adjustment)}
      \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      TOTAL CONSUMO:                   $${this.formatCurrency(this.totalConsumption)}

    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

                            SEGUROS
                      (Paga otra persona)

      Coosepark Protecci\xF3n:            $${this.formatCurrency(r.sharedInsurance.coosepark)}
      Prima Seguro Accidentes:         $${this.formatCurrency(r.sharedInsurance.accidentInsurance)}
      \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      TOTAL SEGUROS:                   $${this.formatCurrency(this.totalSharedInsurance)}

    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

                        GASTOS DEL PROPIETARIO

      Seguro Vida Deudor:              $${this.formatCurrency(r.ownerOnly.debtorLifeInsurance)}
      Intereses Financiamiento:        $${this.formatCurrency(r.ownerOnly.financingInterest)}
      Inter\xE9s Mora 1 (1.83%):          $${this.formatCurrency(r.ownerOnly.lateInterest1)}
      Inter\xE9s Mora 2 (1.83%):          $${this.formatCurrency(r.ownerOnly.lateInterest2)}
      1.83% V-Movilidad Vanti:         $${this.formatCurrency(r.ownerOnly.vantiMobility)}
      \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      TOTAL PROPIETARIO:               $${this.formatCurrency(this.totalOwnerOnly)}

    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

                            RESUMEN DE DIVISI\xD3N

      Total Factura:                   $${this.formatCurrency(this.totalBill)}

      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
      \u2502  CADA INQUILINO/PISO PAGA:                                   \u2502
      \u2502                                                              \u2502
      \u2502  Consumo de gas dividido:      $${this.formatCurrency(this.perTenant)}              \u2502
      \u2502                                                              \u2502
      \u2502  Total por Piso:

      $${this.formatCurrency(this.perTenant)}              \u2502
      \u2502  (Verificaci\xF3n ${this.numTenants} pisos):            $${this.formatCurrency(this.perTenant*this.numTenants)}              \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
      \u2502  PERSONA DE SEGUROS PAGA:                                    \u2502
      \u2502                                                              \u2502
      \u2502  Total Seguros:

      $${this.formatCurrency(this.insurancePersonPays)}              \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
      \u2502  PROPIETARIO PAGA:                                           \u2502
      \u2502                                                              \u2502
      \u2502  Total Propietario:

      $${this.formatCurrency(this.ownerOnlyPays)}              \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

    VERIFICACI\xD3N:
    Inquilinos (${this.numTenants} \xD7 $${this.formatCurrency(this.perTenant)}) + Seguros ($${this.formatCurrency(this.insurancePersonPays)}) +
    Propietario ($${this.formatCurrency(this.ownerOnlyPays)}) = $${this.formatCurrency(this.totalBill)}

    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

    Nota: Esta es una divisi\xF3n autom\xE1tica de la factura de gas.
    Los inquilinos pagan \xFAnicamente el consumo dividido.
    Los seguros son responsabilidad de otra persona.
    El propietario asume cr\xE9ditos, seguros de vida e intereses.

    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    Generado autom\xE1ticamente por Sistema de Divisi\xF3n de Factura
    ${o}
    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
    `}static \u0275fac=function(o){return new(o||f)(w(E))};static \u0275cmp=C({type:f,selectors:[["app-gas1y2"]],decls:321,vars:41,consts:[["autoplay","","muted","","loop","","playsinline","",1,"video-background"],["src","assets/principal.mp4","type","video/mp4"],[1,"back-menu-btn",3,"click"],[1,"container"],[1,"content-wrapper"],[1,"header"],[1,"header-icon"],["xmlns","http://www.w3.org/2000/svg","width","32","height","32","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["d","M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"],["points","14 2 14 8 20 8"],["x1","16","y1","13","x2","8","y2","13"],["x1","16","y1","17","x2","8","y2","17"],["points","10 9 9 9 8 9"],[1,"card"],[1,"card-header"],[1,"card-header-left"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["x","3","y","4","width","18","height","18","rx","2","ry","2"],["x1","16","y1","2","x2","16","y2","6"],["x1","8","y1","2","x2","8","y2","6"],["x1","3","y1","10","x2","21","y2","10"],[1,"button-group"],[1,"btn-primary",3,"click"],["xmlns","http://www.w3.org/2000/svg","width","20","height","20","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["x1","12","y1","5","x2","12","y2","19"],["x1","5","y1","12","x2","19","y2","12"],[1,"btn-download",3,"click"],["d","M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"],["points","7 10 12 15 17 10"],["x1","12","y1","15","x2","12","y2","3"],[1,"btn-secondary",3,"click"],[1,"period-input"],["type","text","placeholder","Ej: Noviembre 2025",3,"input","value"],["class","history-list",4,"ngIf"],[1,"tenants-control"],[1,"tenants-label"],["d","m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],["points","9 22 9 12 15 12 15 22"],[1,"tenants-buttons"],[3,"click"],[1,"cards-container"],[1,"section-title"],["xmlns","http://www.w3.org/2000/svg","width","28","height","28","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"green-icon"],["d","M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"],["cx","9","cy","7","r","4"],["d","M23 21v-2a4 4 0 0 0-3-3.87"],["d","M16 3.13a4 4 0 0 1 0 7.75"],[1,"card-green"],[1,"card-icon-header"],[1,"icon-wrapper","green"],["points","13 2 3 14 12 14 11 22 21 10 12 10 13 2"],[1,"input-group"],[1,"input-field"],[1,"input-wrapper"],[1,"currency"],["type","number","step","0.01",3,"input","value"],[1,"total-row"],[1,"total-value","green"],["xmlns","http://www.w3.org/2000/svg","width","28","height","28","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"blue-icon"],["d","M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],[1,"card-blue"],[1,"icon-wrapper","blue"],[1,"total-row",2,"margin-top","32px"],[1,"total-value","blue"],["xmlns","http://www.w3.org/2000/svg","width","28","height","28","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"purple-icon"],["x","1","y","4","width","22","height","16","rx","2","ry","2"],["x1","1","y1","10","x2","23","y2","10"],[1,"card","card-purple"],[1,"icon-wrapper","purple"],[1,"grid-two"],[1,"total-value","purple"],[1,"summary-card"],[1,"summary-header"],["x","4","y","2","width","16","height","20","rx","2","ry","2"],["x1","8","y1","6","x2","16","y2","6"],["x1","8","y1","10","x2","16","y2","10"],["x1","8","y1","14","x2","12","y2","14"],["x1","8","y1","18","x2","12","y2","18"],[1,"summary-stats"],[1,"stat-card"],[1,"stat-label"],[1,"stat-value"],[1,"summary-details"],[1,"detail-card"],[1,"detail-header"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"green-icon"],[1,"detail-content"],[1,"detail-row"],[1,"detail-total"],[1,"green"],[1,"detail-verification"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"blue-icon"],[1,"blue"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"purple-icon"],[1,"purple"],[1,"verification-box"],[1,"history-list"],["class","history-item",3,"active","click",4,"ngFor","ngForOf"],[1,"history-item",3,"click"],[1,"history-month"],[1,"history-total"],[1,"btn-delete",3,"click"],["points","3 6 5 6 21 6"],["d","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]],template:function(o,n){o&1&&(e(0,"video",0),m(1,"source",1),i(2,` Tu navegador no soporta video HTML5.
`),t(),e(3,"button",2),d("click",function(){return n.goToMenu()}),i(4,` \u2190 Men\xFA
`),t(),e(5,"div",3)(6,"div",4)(7,"div",5)(8,"div",6),p(),e(9,"svg",7),m(10,"path",8)(11,"polyline",9)(12,"line",10)(13,"line",11)(14,"polyline",12),t()(),u(),e(15,"h1"),i(16,"Divisi\xF3n de Factura"),t(),e(17,"p"),i(18,"Gesti\xF3n mensual de servicios p\xFAblicos"),t()(),e(19,"div",13)(20,"div",14)(21,"div",15),p(),e(22,"svg",16),m(23,"rect",17)(24,"line",18)(25,"line",19)(26,"line",20),t(),u(),e(27,"h2"),i(28,"Factura Actual"),t()(),e(29,"div",21)(30,"button",22),d("click",function(){return n.addNewBill()}),p(),e(31,"svg",23),m(32,"line",24)(33,"line",25),t(),i(34," Nueva Factura "),t(),u(),e(35,"button",26),d("click",function(){return n.downloadBill()}),p(),e(36,"svg",23),m(37,"path",27)(38,"polyline",28)(39,"line",29),t(),i(40," Descargar "),t(),u(),e(41,"button",30),d("click",function(){return n.toggleHistory()}),i(42),t()()(),e(43,"div",31)(44,"label"),i(45,"Periodo:"),t(),e(46,"input",32),d("input",function(s){return n.updateMonth(s.target.value)}),t()(),y(47,B,2,1,"div",33),t(),e(48,"div",13)(49,"div",34)(50,"div",35),p(),e(51,"svg",16),m(52,"path",36)(53,"polyline",37),t(),u(),e(54,"label"),i(55,"N\xFAmero de Pisos/Inquilinos"),t()(),e(56,"div",38)(57,"button",39),d("click",function(){return n.decrementTenants()}),i(58,"-"),t(),e(59,"span"),i(60),t(),e(61,"button",39),d("click",function(){return n.incrementTenants()}),i(62,"+"),t()()()(),e(63,"div",40)(64,"div")(65,"div",41),p(),e(66,"svg",42),m(67,"path",43)(68,"circle",44)(69,"path",45)(70,"path",46),t(),u(),e(71,"h3"),i(72,"Consumo (Se divide entre inquilinos)"),t()(),e(73,"div",47)(74,"div",48)(75,"div",49),p(),e(76,"svg",16),m(77,"polygon",50),t()(),u(),e(78,"h2"),i(79,"Consumo de Gas"),t()(),e(80,"div",51)(81,"div",52)(82,"label"),i(83,"Sin subsidio"),t(),e(84,"div",53)(85,"span",54),i(86,"$"),t(),e(87,"input",55),d("input",function(s){return n.updateConsumption("withoutSubsidy",+s.target.value||0)}),t()()(),e(88,"div",52)(89,"label"),i(90,"Con subsidio"),t(),e(91,"div",53)(92,"span",54),i(93,"$"),t(),e(94,"input",55),d("input",function(s){return n.updateConsumption("withSubsidy",+s.target.value||0)}),t()()(),e(95,"div",52)(96,"label"),i(97,"Subsidio"),t(),e(98,"div",53)(99,"span",54),i(100,"$"),t(),e(101,"input",55),d("input",function(s){return n.updateConsumption("subsidy",+s.target.value||0)}),t()()(),e(102,"div",52)(103,"label"),i(104,"Ajuste decena"),t(),e(105,"div",53)(106,"span",54),i(107,"$"),t(),e(108,"input",55),d("input",function(s){return n.updateConsumption("adjustment",+s.target.value||0)}),t()()(),e(109,"div",56)(110,"span"),i(111,"Total Consumo:"),t(),e(112,"span",57),i(113),t()()()()(),e(114,"div")(115,"div",41),p(),e(116,"svg",58),m(117,"path",59),t(),u(),e(118,"h3"),i(119,"Seguros (Los paga otra persona)"),t()(),e(120,"div",60)(121,"div",48)(122,"div",61),p(),e(123,"svg",16),m(124,"path",59),t()(),u(),e(125,"h2"),i(126,"Seguros"),t()(),e(127,"div",51)(128,"div",52)(129,"label"),i(130,"Coosepark Protecci\xF3n"),t(),e(131,"div",53)(132,"span",54),i(133,"$"),t(),e(134,"input",55),d("input",function(s){return n.updateSharedInsurance("coosepark",+s.target.value||0)}),t()()(),e(135,"div",52)(136,"label"),i(137,"Prima Seguro Accidentes"),t(),e(138,"div",53)(139,"span",54),i(140,"$"),t(),e(141,"input",55),d("input",function(s){return n.updateSharedInsurance("accidentInsurance",+s.target.value||0)}),t()()(),e(142,"div",62)(143,"span"),i(144,"Total Seguros:"),t(),e(145,"span",63),i(146),t()()()()()(),e(147,"div",41),p(),e(148,"svg",64),m(149,"rect",65)(150,"line",66),t(),u(),e(151,"h3"),i(152,"Gastos del Propietario"),t()(),e(153,"div",67)(154,"div",48)(155,"div",68),p(),e(156,"svg",16),m(157,"rect",65)(158,"line",66),t()(),u(),e(159,"h2"),i(160,"Cr\xE9dito, Seguro de Vida e Intereses"),t()(),e(161,"div",69)(162,"div",52)(163,"label"),i(164,"Seguro Vida Deudor"),t(),e(165,"div",53)(166,"span",54),i(167,"$"),t(),e(168,"input",55),d("input",function(s){return n.updateOwnerOnly("debtorLifeInsurance",+s.target.value||0)}),t()()(),e(169,"div",52)(170,"label"),i(171,"Intereses Financiamiento"),t(),e(172,"div",53)(173,"span",54),i(174,"$"),t(),e(175,"input",55),d("input",function(s){return n.updateOwnerOnly("financingInterest",+s.target.value||0)}),t()()(),e(176,"div",52)(177,"label"),i(178,"Inter\xE9s Mora 1 (1.83%)"),t(),e(179,"div",53)(180,"span",54),i(181,"$"),t(),e(182,"input",55),d("input",function(s){return n.updateOwnerOnly("lateInterest1",+s.target.value||0)}),t()()(),e(183,"div",52)(184,"label"),i(185,"Inter\xE9s Mora 2 (1.83%)"),t(),e(186,"div",53)(187,"span",54),i(188,"$"),t(),e(189,"input",55),d("input",function(s){return n.updateOwnerOnly("lateInterest2",+s.target.value||0)}),t()()(),e(190,"div",52)(191,"label"),i(192,"1.83% V-Movilidad Vanti"),t(),e(193,"div",53)(194,"span",54),i(195,"$"),t(),e(196,"input",55),d("input",function(s){return n.updateOwnerOnly("vantiMobility",+s.target.value||0)}),t()()()(),e(197,"div",56)(198,"span"),i(199,"Total Propietario:"),t(),e(200,"span",70),i(201),t()()(),e(202,"div",71)(203,"div",72),p(),e(204,"svg",7),m(205,"rect",73)(206,"line",74)(207,"line",75)(208,"line",76)(209,"line",77),t(),u(),e(210,"h2"),i(211,"Resumen de Divisi\xF3n"),t()(),e(212,"div",78)(213,"div",79)(214,"p",80),i(215,"Total Factura"),t(),e(216,"p",81),i(217),t()(),e(218,"div",79)(219,"p",80),i(220,"Por Piso/Inquilino"),t(),e(221,"p",81),i(222),t()(),e(223,"div",79)(224,"p",80),i(225,"Seguros (Otra persona)"),t(),e(226,"p",81),i(227),t()(),e(228,"div",79)(229,"p",80),i(230,"Propietario"),t(),e(231,"p",81),i(232),t()()(),e(233,"div",82)(234,"div",83)(235,"div",84),p(),e(236,"svg",85),m(237,"path",43)(238,"circle",44)(239,"path",45)(240,"path",46),t(),u(),e(241,"h3"),i(242,"Cada Inquilino/Piso Paga"),t()(),e(243,"div",86)(244,"div",87)(245,"span"),i(246,"Consumo de gas:"),t(),e(247,"span"),i(248),t()(),e(249,"div",88)(250,"span"),i(251,"Total por Piso:"),t(),e(252,"span",89),i(253),t()(),e(254,"div",90)(255,"p")(256,"strong"),i(257),t(),i(258),t()()()(),e(259,"div",83)(260,"div",84),p(),e(261,"svg",91),m(262,"path",59),t(),u(),e(263,"h3"),i(264,"Persona de Seguros Paga"),t()(),e(265,"div",86)(266,"div",87)(267,"span"),i(268,"Coosepark Protecci\xF3n:"),t(),e(269,"span"),i(270),t()(),e(271,"div",87)(272,"span"),i(273,"Prima Seguro Accidentes:"),t(),e(274,"span"),i(275),t()(),e(276,"div",88)(277,"span"),i(278,"Total Seguros:"),t(),e(279,"span",92),i(280),t()()()(),e(281,"div",83)(282,"div",84),p(),e(283,"svg",93),m(284,"path",8)(285,"polyline",9)(286,"line",10)(287,"line",11),t(),u(),e(288,"h3"),i(289,"Propietario Paga"),t()(),e(290,"div",86)(291,"div",87)(292,"span"),i(293,"Seguro Vida Deudor:"),t(),e(294,"span"),i(295),t()(),e(296,"div",87)(297,"span"),i(298,"Intereses Cr\xE9dito:"),t(),e(299,"span"),i(300),t()(),e(301,"div",87)(302,"span"),i(303,"Intereses Mora:"),t(),e(304,"span"),i(305),t()(),e(306,"div",87)(307,"span"),i(308,"V-Movilidad Vanti:"),t(),e(309,"span"),i(310),t()(),e(311,"div",88)(312,"span"),i(313,"Total Propietario:"),t(),e(314,"span",94),i(315),t()()()()(),e(316,"div",95)(317,"p")(318,"strong"),i(319,"Verificaci\xF3n:"),t(),i(320),t()()()()()),o&2&&(a(42),O(" ",n.showHistory?"Ocultar":"Ver"," Historial (",n.bills.length,") "),a(4),g("value",n.currentBill.month),a(),g("ngIf",n.showHistory),a(13),x(n.numTenants),a(27),g("value",n.currentBill.consumption.withoutSubsidy),a(7),g("value",n.currentBill.consumption.withSubsidy),a(7),g("value",n.currentBill.consumption.subsidy),a(7),g("value",n.currentBill.consumption.adjustment),a(5),c("$",n.formatCurrency(n.totalConsumption)),a(21),g("value",n.currentBill.sharedInsurance.coosepark),a(7),g("value",n.currentBill.sharedInsurance.accidentInsurance),a(5),c("$",n.formatCurrency(n.totalSharedInsurance)),a(22),g("value",n.currentBill.ownerOnly.debtorLifeInsurance),a(7),g("value",n.currentBill.ownerOnly.financingInterest),a(7),g("value",n.currentBill.ownerOnly.lateInterest1),a(7),g("value",n.currentBill.ownerOnly.lateInterest2),a(7),g("value",n.currentBill.ownerOnly.vantiMobility),a(5),c("$",n.formatCurrency(n.totalOwnerOnly)),a(16),c("$",n.formatCurrency(n.totalBill)),a(5),c("$",n.formatCurrency(n.perTenant)),a(5),c("$",n.formatCurrency(n.insurancePersonPays)),a(5),c("$",n.formatCurrency(n.ownerOnlyPays)),a(16),c("$",n.formatCurrency(n.totalConsumption/n.numTenants)),a(5),c("$",n.formatCurrency(n.perTenant)),a(4),c("Total ",n.numTenants," pisos:"),a(),c(" $",n.formatCurrency(n.perTenant*n.numTenants)),a(12),c("$",n.formatCurrency(n.currentBill.sharedInsurance.coosepark)),a(5),c("$",n.formatCurrency(n.currentBill.sharedInsurance.accidentInsurance)),a(5),c("$",n.formatCurrency(n.insurancePersonPays)),a(15),c("$",n.formatCurrency(n.currentBill.ownerOnly.debtorLifeInsurance)),a(5),c("$",n.formatCurrency(n.currentBill.ownerOnly.financingInterest)),a(5),c("$",n.formatCurrency(n.currentBill.ownerOnly.lateInterest1+n.currentBill.ownerOnly.lateInterest2)),a(5),c("$",n.formatCurrency(n.currentBill.ownerOnly.vantiMobility)),a(5),c("$",n.formatCurrency(n.ownerOnlyPays)),a(5),P(" Inquilinos (",n.numTenants," \xD7 $",n.formatCurrency(n.perTenant)," = $",n.formatCurrency(n.perTenant*n.numTenants),") + Seguros ($",n.formatCurrency(n.insurancePersonPays),") + Propietario ($",n.formatCurrency(n.ownerOnlyPays),") = $",n.formatCurrency(n.totalBill)," "))},dependencies:[k,M,I],styles:[".video-background[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100vw;height:100vh;object-fit:cover;z-index:0}.back-menu-btn[_ngcontent-%COMP%]{position:fixed;top:20px;left:20px;background-color:#0061a8;color:#fff;border:none;border-radius:8px;padding:10px 16px;font-size:16px;cursor:pointer;z-index:10;box-shadow:0 2px 6px #0000004d;transition:background-color .3s,transform .3s;animation:_ngcontent-%COMP%_slideIn .5s ease-out forwards;opacity:0}.back-menu-btn[_ngcontent-%COMP%]:hover{background-color:#004c7a;transform:scale(1.1)}@keyframes _ngcontent-%COMP%_slideIn{0%{transform:translate(-30px);opacity:0}to{transform:translate(0);opacity:1}}.container[_ngcontent-%COMP%]{position:relative;min-height:100vh;padding:2rem 1rem;z-index:5}@media (min-width: 768px){.container[_ngcontent-%COMP%]{padding:2rem}}.content-wrapper[_ngcontent-%COMP%]{max-width:1152px;margin:0 auto}.header[_ngcontent-%COMP%]{text-align:center;margin-bottom:2rem}.header-icon[_ngcontent-%COMP%]{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:linear-gradient(135deg,#2563eb,#4f46e5);border-radius:1rem;margin-bottom:1rem;box-shadow:0 10px 15px -3px #0000001a;color:#fff}.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:2.25rem;font-weight:700;color:#fff;margin-bottom:.5rem}.header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fefefe}.card[_ngcontent-%COMP%]{background:#fff;border-radius:1rem;box-shadow:0 20px 25px -5px #0000001a;padding:1.5rem;margin-bottom:1.5rem}.card-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:1rem}.card-header-left[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;color:#4f46e5}.card-header-left[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700;color:#1f2937}.button-group[_ngcontent-%COMP%]{display:flex;gap:.5rem;flex-wrap:wrap}.btn-primary[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:.5rem;font-weight:600;cursor:pointer;transition:all .3s}.btn-primary[_ngcontent-%COMP%]:hover{box-shadow:0 10px 15px -3px #0000001a}.period-input[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem}.period-input[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{color:#374151;font-weight:500}.period-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;padding:.5rem 1rem;border:2px solid #e5e7eb;border-radius:.5rem;transition:border-color .3s}.period-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{outline:none;border-color:#4f46e5}.history-list[_ngcontent-%COMP%]{margin-top:1rem;max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem}.history-item[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:.75rem;border-radius:.5rem;cursor:pointer;transition:all .3s;border:2px solid transparent;background:#f9fafb}.history-item[_ngcontent-%COMP%]:hover{background:#f3f4f6}.history-item.active[_ngcontent-%COMP%]{background:#e0e7ff;border-color:#4f46e5}.history-month[_ngcontent-%COMP%]{font-weight:600;color:#1f2937;margin:0}.history-total[_ngcontent-%COMP%]{font-size:.875rem;color:#4b5563;margin:0}.btn-delete[_ngcontent-%COMP%]{padding:.5rem;color:#ef4444;background:transparent;border:none;border-radius:.5rem;cursor:pointer;transition:all .3s}.btn-delete[_ngcontent-%COMP%]:hover{background:#fef2f2}.tenants-control[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}.tenants-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;color:#4f46e5}.tenants-label[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:1.125rem;font-weight:600;color:#374151}.tenants-buttons[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1rem}.tenants-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:40px;height:40px;background:#e0e7ff;color:#4f46e5;border:none;border-radius:.5rem;font-weight:700;cursor:pointer;transition:all .3s}.tenants-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:#c7d2fe}.tenants-buttons[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;color:#1f2937;width:48px;text-align:center}.section-title[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem}.section-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;color:#fff}.green-icon[_ngcontent-%COMP%]{color:#10b981}.blue-icon[_ngcontent-%COMP%]{color:#3b82f6}.purple-icon[_ngcontent-%COMP%]{color:#a855f7}.grid[_ngcontent-%COMP%]{display:grid;gap:1.5rem;margin-bottom:2rem}@media (min-width: 768px){.grid[_ngcontent-%COMP%]{grid-template-columns:repeat(2,1fr)}}.grid-two[_ngcontent-%COMP%]{display:grid;gap:1rem}@media (min-width: 768px){.grid-two[_ngcontent-%COMP%]{grid-template-columns:repeat(2,1fr)}}.card-green[_ngcontent-%COMP%]{border-left:4px solid #10b981}.card-blue[_ngcontent-%COMP%]{border-left:4px solid #3b82f6}.card-purple[_ngcontent-%COMP%]{border-left:4px solid #a855f7}.card-icon-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}.icon-wrapper[_ngcontent-%COMP%]{width:48px;height:48px;border-radius:.75rem;display:flex;align-items:center;justify-content:center;color:#fff}.icon-wrapper.green[_ngcontent-%COMP%]{background:linear-gradient(135deg,#10b981,#059669)}.icon-wrapper.blue[_ngcontent-%COMP%]{background:linear-gradient(135deg,#3b82f6,#2563eb)}.icon-wrapper.purple[_ngcontent-%COMP%]{background:linear-gradient(135deg,#a855f7,#ec4899)}.card-icon-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700;color:#1f2937}.input-group[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem}.input-field[_ngcontent-%COMP%]{display:flex;flex-direction:column}.input-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.875rem;font-weight:500;color:#4b5563;margin-bottom:.25rem}.input-wrapper[_ngcontent-%COMP%]{position:relative}.currency[_ngcontent-%COMP%]{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:#9ca3af}.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:90%;padding:.5rem .75rem .5rem 2rem;border:2px solid #e5e7eb;border-radius:.5rem;transition:border-color .3s}.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{outline:none;border-color:#4f46e5}.total-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:2px solid #f3f4f6;margin-top:.75rem}.total-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{font-weight:600;color:#374151}.total-value[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700}.total-value.green[_ngcontent-%COMP%]{color:#10b981}.total-value.blue[_ngcontent-%COMP%]{color:#3b82f6}.total-value.purple[_ngcontent-%COMP%]{color:#a855f7}.summary-card[_ngcontent-%COMP%]{background:linear-gradient(135deg,#4f46e5,#a855f7);border-radius:1rem;box-shadow:0 25px 50px -12px #00000040;padding:2rem;color:#fff}.summary-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem}.summary-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700}.summary-stats[_ngcontent-%COMP%]{display:grid;gap:1rem;margin-bottom:1.5rem}@media (min-width: 768px){.summary-stats[_ngcontent-%COMP%]{grid-template-columns:repeat(4,1fr)}}.stat-card[_ngcontent-%COMP%]{background:#ffffff1a;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:.75rem;padding:1rem}.stat-label[_ngcontent-%COMP%]{font-size:.75rem;color:#c7d2fe;margin-bottom:.25rem}.stat-value[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;margin:0}.summary-details[_ngcontent-%COMP%]{display:grid;gap:1.5rem;margin-bottom:1.5rem}@media (min-width: 768px){.summary-details[_ngcontent-%COMP%]{grid-template-columns:repeat(3,1fr)}}.detail-card[_ngcontent-%COMP%]{background:#fff;border-radius:.75rem;padding:1.5rem;color:#1f2937}.detail-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}.detail-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700}.detail-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.5rem}.detail-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.detail-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{color:#4b5563}.detail-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child{font-weight:600}.detail-total[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:2px solid #f3f4f6;margin-top:.75rem}.detail-total[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{font-weight:700;font-size:1.125rem}.detail-total[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child{font-size:1.5rem;font-weight:700}.detail-total[_ngcontent-%COMP%]   .green[_ngcontent-%COMP%]{color:#10b981}.detail-total[_ngcontent-%COMP%]   .blue[_ngcontent-%COMP%]{color:#3b82f6}.detail-total[_ngcontent-%COMP%]   .purple[_ngcontent-%COMP%]{color:#a855f7}.detail-verification[_ngcontent-%COMP%]{margin-top:1rem;padding:.75rem;background:#f0fdf4;border-radius:.5rem}.detail-verification[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:.875rem;color:#374151;margin:0}.verification-box[_ngcontent-%COMP%]{background:#ffffff1a;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:.75rem;padding:1rem}.verification-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:.875rem;text-align:center;color:#e0e7ff;margin:0}.cards-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:flex-start;gap:40px;flex-wrap:wrap;margin-bottom:2rem}.cards-container[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{flex:1;min-width:400px;max-width:600px}.card-green[_ngcontent-%COMP%], .card-blue[_ngcontent-%COMP%]{background:#fff;border-radius:1rem;box-shadow:0 15px 25px -8px #0000001a;padding:1.5rem;transition:transform .3s ease,box-shadow .3s ease}.card-green[_ngcontent-%COMP%]:hover, .card-blue[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 20px 30px -10px #00000026}.btn-download[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:.5rem;font-weight:600;cursor:pointer;transition:all .3s}.btn-download[_ngcontent-%COMP%]:hover{box-shadow:0 10px 15px -3px #f59e0b4d}.btn-secondary[_ngcontent-%COMP%]{padding:.5rem 1rem;background:#e0e7ff;color:#4f46e5;border:none;border-radius:.5rem;font-weight:600;cursor:pointer;transition:all .3s}.btn-secondary[_ngcontent-%COMP%]:hover{background:#c7d2fe}"]})};export{$ as Gas1y2};
