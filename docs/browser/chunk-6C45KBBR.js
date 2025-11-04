import{$ as S,B as v,F as f,G as e,H as t,I as d,L as C,M as s,N as b,P as O,Q as r,R as y,S as u,T as P,U as M,aa as k,ba as T,ea as I,l as h,m as x,n as m,o as p,u as l,w,x as _}from"./chunk-PLDO6J7J.js";function $(g,i){if(g&1){let o=C();e(0,"div",80),s("click",function(){let a=h(o).index,c=b(2);return x(c.selectBill(a))}),e(1,"div")(2,"p",81),r(3),t(),e(4,"p",82),r(5),t()(),e(6,"button",83),s("click",function(a){let c=h(o).index;return b(2).deleteBill(c),x(a.stopPropagation())}),m(),e(7,"svg",23),d(8,"polyline",84)(9,"path",85),t()()()}if(g&2){let o=i.$implicit,n=i.index,a=b(2);O("active",n===a.currentBillIndex),l(3),y(o.month||"Sin nombre"),l(2),u("Total: $",a.formatCurrency(a.getBillTotal(o)))}}function B(g,i){if(g&1&&(e(0,"div",78),v(1,$,10,4,"div",79),t()),g&2){let o=b();l(),f("ngForOf",o.bills)}}var E=class g{constructor(i){this.router=i}goToMenu(){this.router.navigate(["/"])}numTenants=2;bills=[{id:Date.now(),month:"",consumption:{withoutSubsidy:0,withSubsidy:0,subsidy:0,adjustment:0},sharedInsurance:{coosepark:0,accidentInsurance:0},ownerOnly:{debtorLifeInsurance:0,financingInterest:0,lateInterest1:0,lateInterest2:0,vantiMobility:0}}];currentBillIndex=0;showHistory=!1;get currentBill(){return this.bills[this.currentBillIndex]}get totalConsumption(){return Object.values(this.currentBill.consumption).reduce((i,o)=>i+o,0)}get totalSharedInsurance(){return Object.values(this.currentBill.sharedInsurance).reduce((i,o)=>i+o,0)}get totalOwnerOnly(){return Object.values(this.currentBill.ownerOnly).reduce((i,o)=>i+o,0)}get totalBill(){return this.totalConsumption+this.totalSharedInsurance+this.totalOwnerOnly}get perTenant(){return this.totalConsumption/this.numTenants}get ownerOnlyPays(){return this.totalOwnerOnly}get insurancePersonPays(){return this.totalSharedInsurance}updateConsumption(i,o){this.currentBill.consumption[i]=o}updateSharedInsurance(i,o){this.currentBill.sharedInsurance[i]=o}updateOwnerOnly(i,o){this.currentBill.ownerOnly[i]=o}updateMonth(i){this.currentBill.month=i}addNewBill(){let i={id:Date.now(),month:"",consumption:{withoutSubsidy:0,withSubsidy:0,subsidy:0,adjustment:0},sharedInsurance:{coosepark:0,accidentInsurance:0},ownerOnly:{debtorLifeInsurance:0,financingInterest:0,lateInterest1:0,lateInterest2:0,vantiMobility:0}};this.bills=[i,...this.bills],this.currentBillIndex=0}deleteBill(i){if(this.bills.length===1){alert("Debes mantener al menos una factura");return}this.bills=this.bills.filter((o,n)=>n!==i),this.currentBillIndex>=this.bills.length&&(this.currentBillIndex=this.bills.length-1)}selectBill(i){this.currentBillIndex=i}toggleHistory(){this.showHistory=!this.showHistory}incrementTenants(){this.numTenants++}decrementTenants(){this.numTenants=Math.max(1,this.numTenants-1)}getBillTotal(i){return Object.values(i.consumption).reduce((o,n)=>o+n,0)+Object.values(i.sharedInsurance).reduce((o,n)=>o+n,0)+Object.values(i.ownerOnly).reduce((o,n)=>o+n,0)}formatCurrency(i){return i.toLocaleString("es-CO",{minimumFractionDigits:2})}downloadBill(){this.generatePDF()}generatePDF(){let i=this.currentBill,o=new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"}),n=window.open("","_blank");if(!n){alert("Por favor permite las ventanas emergentes para descargar el PDF");return}let a=`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Factura ${i.month||"Sin periodo"}</title>
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
            <div class="info-value">${i.month||"Sin especificar"}</div>
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
              <td>Con subsidio</td>
              <td>${this.formatCurrency(i.consumption.withSubsidy)}</td>
            </tr>
            <tr>
              <td>Subsidio</td>
              <td>${this.formatCurrency(i.consumption.subsidy)}</td>
            </tr>
            <tr>
              <td>Ajuste decena</td>
              <td>${this.formatCurrency(i.consumption.adjustment)}</td>
            </tr>
          </table>
          <div class="subtotal-row green">
            <span>Total Consumo</span>
            <span>${this.formatCurrency(this.totalConsumption)}</span>
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
        `;n.document.write(a),n.document.close()}generateBillText(){let i=this.currentBill,o=new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});return`
    \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
    \u2551                    DIVISI\xD3N DE FACTURA DE GAS                      \u2551
    \u2551                     Gesti\xF3n de Servicios P\xFAblicos                  \u2551
    \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

    Periodo: ${i.month||"Sin especificar"}
    Fecha de emisi\xF3n: ${o}
    N\xFAmero de Pisos/Inquilinos: ${this.numTenants}

    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

                        DETALLE DE CONSUMO DE GAS
                      (Se divide entre inquilinos)


      Con subsidio:                    $${this.formatCurrency(i.consumption.withSubsidy)}
      Subsidio:                        $${this.formatCurrency(i.consumption.subsidy)}
      Ajuste decena:                   $${this.formatCurrency(i.consumption.adjustment)}
      \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
      TOTAL CONSUMO:                   $${this.formatCurrency(this.totalConsumption)}

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



    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

    VERIFICACI\xD3N:
    Inquilinos (${this.numTenants} \xD7 $${this.formatCurrency(this.perTenant)})

    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

    Nota: Esta es una divisi\xF3n autom\xE1tica de la factura de gas.
    Los inquilinos pagan \xFAnicamente el consumo dividido.
    Los seguros son responsabilidad de otra persona.
    El propietario asume cr\xE9ditos, seguros de vida e intereses.

    \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    Generado autom\xE1ticamente por Sistema de Divisi\xF3n de Factura
    ${o}
    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
    `}static \u0275fac=function(o){return new(o||g)(w(I))};static \u0275cmp=_({type:g,selectors:[["app-gas3y4"]],decls:158,vars:18,consts:[["autoplay","","muted","","loop","","playsinline","",1,"video-background"],["src","assets/principal.mp4","type","video/mp4"],[1,"back-menu-btn",3,"click"],[1,"container"],[1,"content-wrapper"],[1,"header"],[1,"header-icon"],["xmlns","http://www.w3.org/2000/svg","width","32","height","32","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["d","M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"],["points","14 2 14 8 20 8"],["x1","16","y1","13","x2","8","y2","13"],["x1","16","y1","17","x2","8","y2","17"],["points","10 9 9 9 8 9"],[1,"card"],[1,"card-header"],[1,"card-header-left"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["x","3","y","4","width","18","height","18","rx","2","ry","2"],["x1","16","y1","2","x2","16","y2","6"],["x1","8","y1","2","x2","8","y2","6"],["x1","3","y1","10","x2","21","y2","10"],[1,"button-group"],[1,"btn-primary",3,"click"],["xmlns","http://www.w3.org/2000/svg","width","20","height","20","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["x1","12","y1","5","x2","12","y2","19"],["x1","5","y1","12","x2","19","y2","12"],[1,"btn-download",3,"click"],["d","M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"],["points","7 10 12 15 17 10"],["x1","12","y1","15","x2","12","y2","3"],[1,"btn-secondary",3,"click"],[1,"period-input"],["type","text","placeholder","Ej: Noviembre 2025",3,"input","value"],["class","history-list",4,"ngIf"],[1,"tenants-control"],[1,"tenants-label"],["d","m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],["points","9 22 9 12 15 12 15 22"],[1,"tenants-buttons"],[3,"click"],[1,"section-title"],["xmlns","http://www.w3.org/2000/svg","width","28","height","28","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"green-icon"],["d","M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"],["cx","9","cy","7","r","4"],["d","M23 21v-2a4 4 0 0 0-3-3.87"],["d","M16 3.13a4 4 0 0 1 0 7.75"],[1,"card-green"],[1,"card-icon-header"],[1,"icon-wrapper","green"],["points","13 2 3 14 12 14 11 22 21 10 12 10 13 2"],[1,"input-group"],[1,"input-field"],[1,"input-wrapper"],[1,"currency"],["type","number","step","0.01",3,"input","value"],[1,"total-row"],[1,"total-value","green"],[1,"summary-card"],[1,"summary-header"],["x","4","y","2","width","16","height","20","rx","2","ry","2"],["x1","8","y1","6","x2","16","y2","6"],["x1","8","y1","10","x2","16","y2","10"],["x1","8","y1","14","x2","12","y2","14"],["x1","8","y1","18","x2","12","y2","18"],[1,"summary-stats"],[1,"stat-card"],[1,"stat-label"],[1,"stat-value"],[1,"summary-details"],[1,"detail-card"],[1,"detail-header"],["xmlns","http://www.w3.org/2000/svg","width","24","height","24","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round",1,"green-icon"],[1,"detail-content"],[1,"detail-row"],[1,"detail-total"],[1,"green"],[1,"detail-verification"],[1,"verification-box"],[1,"history-list"],["class","history-item",3,"active","click",4,"ngFor","ngForOf"],[1,"history-item",3,"click"],[1,"history-month"],[1,"history-total"],[1,"btn-delete",3,"click"],["points","3 6 5 6 21 6"],["d","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]],template:function(o,n){o&1&&(e(0,"video",0),d(1,"source",1),r(2,` Tu navegador no soporta video HTML5.
`),t(),e(3,"button",2),s("click",function(){return n.goToMenu()}),r(4,` \u2190 Men\xFA
`),t(),e(5,"div",3)(6,"div",4)(7,"div",5)(8,"div",6),m(),e(9,"svg",7),d(10,"path",8)(11,"polyline",9)(12,"line",10)(13,"line",11)(14,"polyline",12),t()(),p(),e(15,"h1"),r(16,"Divisi\xF3n de Factura"),t(),e(17,"p"),r(18,"Gesti\xF3n mensual de servicios p\xFAblicos"),t()(),e(19,"div",13)(20,"div",14)(21,"div",15),m(),e(22,"svg",16),d(23,"rect",17)(24,"line",18)(25,"line",19)(26,"line",20),t(),p(),e(27,"h2"),r(28,"Factura Actual"),t()(),e(29,"div",21)(30,"button",22),s("click",function(){return n.addNewBill()}),m(),e(31,"svg",23),d(32,"line",24)(33,"line",25),t(),r(34," Nueva Factura "),t(),p(),e(35,"button",26),s("click",function(){return n.downloadBill()}),m(),e(36,"svg",23),d(37,"path",27)(38,"polyline",28)(39,"line",29),t(),r(40," Descargar "),t(),p(),e(41,"button",30),s("click",function(){return n.toggleHistory()}),r(42),t()()(),e(43,"div",31)(44,"label"),r(45,"Periodo:"),t(),e(46,"input",32),s("input",function(c){return n.updateMonth(c.target.value)}),t()(),v(47,B,2,1,"div",33),t(),e(48,"div",13)(49,"div",34)(50,"div",35),m(),e(51,"svg",16),d(52,"path",36)(53,"polyline",37),t(),p(),e(54,"label"),r(55,"N\xFAmero de Pisos/Inquilinos"),t()(),e(56,"div",38)(57,"button",39),s("click",function(){return n.decrementTenants()}),r(58,"-"),t(),e(59,"span"),r(60),t(),e(61,"button",39),s("click",function(){return n.incrementTenants()}),r(62,"+"),t()()()(),e(63,"div")(64,"div",40),m(),e(65,"svg",41),d(66,"path",42)(67,"circle",43)(68,"path",44)(69,"path",45),t(),p(),e(70,"h3"),r(71,"Consumo (Se divide entre inquilinos)"),t()(),e(72,"div",46)(73,"div",47)(74,"div",48),m(),e(75,"svg",16),d(76,"polygon",49),t()(),p(),e(77,"h2"),r(78,"Consumo de Gas"),t()(),e(79,"div",50)(80,"div",51)(81,"label"),r(82,"Con subsidio"),t(),e(83,"div",52)(84,"span",53),r(85,"$"),t(),e(86,"input",54),s("input",function(c){return n.updateConsumption("withSubsidy",+c.target.value||0)}),t()()(),e(87,"div",51)(88,"label"),r(89,"Subsidio"),t(),e(90,"div",52)(91,"span",53),r(92,"$"),t(),e(93,"input",54),s("input",function(c){return n.updateConsumption("subsidy",+c.target.value||0)}),t()()(),e(94,"div",51)(95,"label"),r(96,"Ajuste decena"),t(),e(97,"div",52)(98,"span",53),r(99,"$"),t(),e(100,"input",54),s("input",function(c){return n.updateConsumption("adjustment",+c.target.value||0)}),t()()(),e(101,"div",55)(102,"span"),r(103,"Total Consumo:"),t(),e(104,"span",56),r(105),t()()()()(),e(106,"div",57)(107,"div",58),m(),e(108,"svg",7),d(109,"rect",59)(110,"line",60)(111,"line",61)(112,"line",62)(113,"line",63),t(),p(),e(114,"h2"),r(115,"Resumen de Divisi\xF3n"),t()(),e(116,"div",64)(117,"div",65)(118,"p",66),r(119,"Total Factura"),t(),e(120,"p",67),r(121),t()(),e(122,"div",65)(123,"p",66),r(124,"Por Piso/Inquilino"),t(),e(125,"p",67),r(126),t()()(),e(127,"div",68)(128,"div",69)(129,"div",70),m(),e(130,"svg",71),d(131,"path",42)(132,"circle",43)(133,"path",44)(134,"path",45),t(),p(),e(135,"h3"),r(136,"Cada Inquilino/Piso Paga"),t()(),e(137,"div",72)(138,"div",73)(139,"span"),r(140,"Consumo de gas:"),t(),e(141,"span"),r(142),t()(),e(143,"div",74)(144,"span"),r(145,"Total por Piso:"),t(),e(146,"span",75),r(147),t()(),e(148,"div",76)(149,"p")(150,"strong"),r(151),t(),r(152),t()()()(),e(153,"div",77)(154,"p")(155,"strong"),r(156,"Verificaci\xF3n:"),t(),r(157),t()()()()()()),o&2&&(l(42),P(" ",n.showHistory?"Ocultar":"Ver"," Historial (",n.bills.length,") "),l(4),f("value",n.currentBill.month),l(),f("ngIf",n.showHistory),l(13),y(n.numTenants),l(26),f("value",n.currentBill.consumption.withSubsidy),l(7),f("value",n.currentBill.consumption.subsidy),l(7),f("value",n.currentBill.consumption.adjustment),l(5),u("$",n.formatCurrency(n.totalConsumption)),l(16),u("$",n.formatCurrency(n.totalBill)),l(5),u("$",n.formatCurrency(n.perTenant)),l(16),u("$",n.formatCurrency(n.totalConsumption/n.numTenants)),l(5),u("$",n.formatCurrency(n.perTenant)),l(4),u("Total ",n.numTenants," pisos:"),l(),u(" $",n.formatCurrency(n.perTenant*n.numTenants)),l(5),M(" Inquilinos (",n.numTenants," \xD7 $",n.formatCurrency(n.perTenant)," = $",n.formatCurrency(n.perTenant*n.numTenants),") "))},dependencies:[T,S,k],styles:[".video-background[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100vw;height:100vh;object-fit:cover;z-index:0}.back-menu-btn[_ngcontent-%COMP%]{position:fixed;top:20px;left:20px;background-color:#0061a8;color:#fff;border:none;border-radius:8px;padding:10px 16px;font-size:16px;cursor:pointer;z-index:10;box-shadow:0 2px 6px #0000004d;transition:background-color .3s,transform .3s;animation:_ngcontent-%COMP%_slideIn .5s ease-out forwards;opacity:0}.back-menu-btn[_ngcontent-%COMP%]:hover{background-color:#004c7a;transform:scale(1.1)}@keyframes _ngcontent-%COMP%_slideIn{0%{transform:translate(-30px);opacity:0}to{transform:translate(0);opacity:1}}.container[_ngcontent-%COMP%]{position:relative;min-height:100vh;padding:2rem 1rem;z-index:5}@media (min-width: 768px){.container[_ngcontent-%COMP%]{padding:2rem}}.content-wrapper[_ngcontent-%COMP%]{max-width:1152px;margin:0 auto}.header[_ngcontent-%COMP%]{text-align:center;margin-bottom:2rem}.header-icon[_ngcontent-%COMP%]{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:linear-gradient(135deg,#2563eb,#4f46e5);border-radius:1rem;margin-bottom:1rem;box-shadow:0 10px 15px -3px #0000001a;color:#fff}.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:2.25rem;font-weight:700;color:#fff;margin-bottom:.5rem}.header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fefefe}.card[_ngcontent-%COMP%]{background:#fff;border-radius:1rem;box-shadow:0 20px 25px -5px #0000001a;padding:1.5rem;margin-bottom:1.5rem}.card-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:1rem}.card-header-left[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;color:#4f46e5}.card-header-left[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700;color:#1f2937}.button-group[_ngcontent-%COMP%]{display:flex;gap:.5rem;flex-wrap:wrap}.btn-primary[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:.5rem;font-weight:600;cursor:pointer;transition:all .3s}.btn-primary[_ngcontent-%COMP%]:hover{box-shadow:0 10px 15px -3px #0000001a}.period-input[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem}.period-input[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{color:#374151;font-weight:500}.period-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;padding:.5rem 1rem;border:2px solid #e5e7eb;border-radius:.5rem;transition:border-color .3s}.period-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{outline:none;border-color:#4f46e5}.history-list[_ngcontent-%COMP%]{margin-top:1rem;max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem}.history-item[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:.75rem;border-radius:.5rem;cursor:pointer;transition:all .3s;border:2px solid transparent;background:#f9fafb}.history-item[_ngcontent-%COMP%]:hover{background:#f3f4f6}.history-item.active[_ngcontent-%COMP%]{background:#e0e7ff;border-color:#4f46e5}.history-month[_ngcontent-%COMP%]{font-weight:600;color:#1f2937;margin:0}.history-total[_ngcontent-%COMP%]{font-size:.875rem;color:#4b5563;margin:0}.btn-delete[_ngcontent-%COMP%]{padding:.5rem;color:#ef4444;background:transparent;border:none;border-radius:.5rem;cursor:pointer;transition:all .3s}.btn-delete[_ngcontent-%COMP%]:hover{background:#fef2f2}.tenants-control[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}.tenants-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;color:#4f46e5}.tenants-label[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:1.125rem;font-weight:600;color:#374151}.tenants-buttons[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1rem}.tenants-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:40px;height:40px;background:#e0e7ff;color:#4f46e5;border:none;border-radius:.5rem;font-weight:700;cursor:pointer;transition:all .3s}.tenants-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:#c7d2fe}.tenants-buttons[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;color:#1f2937;width:48px;text-align:center}.section-title[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem}.section-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;color:#fff}.green-icon[_ngcontent-%COMP%]{color:#10b981}.blue-icon[_ngcontent-%COMP%]{color:#3b82f6}.purple-icon[_ngcontent-%COMP%]{color:#a855f7}.grid[_ngcontent-%COMP%]{display:grid;gap:1.5rem;margin-bottom:2rem}@media (min-width: 768px){.grid[_ngcontent-%COMP%]{grid-template-columns:repeat(2,1fr)}}.grid-two[_ngcontent-%COMP%]{display:grid;gap:1rem}@media (min-width: 768px){.grid-two[_ngcontent-%COMP%]{grid-template-columns:repeat(2,1fr)}}.card-green[_ngcontent-%COMP%]{border-left:4px solid #10b981}.card-blue[_ngcontent-%COMP%]{border-left:4px solid #3b82f6}.card-purple[_ngcontent-%COMP%]{border-left:4px solid #a855f7}.card-icon-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}.icon-wrapper[_ngcontent-%COMP%]{width:48px;height:48px;border-radius:.75rem;display:flex;align-items:center;justify-content:center;color:#fff}.icon-wrapper.green[_ngcontent-%COMP%]{background:linear-gradient(135deg,#10b981,#059669)}.icon-wrapper.blue[_ngcontent-%COMP%]{background:linear-gradient(135deg,#3b82f6,#2563eb)}.icon-wrapper.purple[_ngcontent-%COMP%]{background:linear-gradient(135deg,#a855f7,#ec4899)}.card-icon-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700;color:#1f2937}.input-group[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem}.input-field[_ngcontent-%COMP%]{display:flex;flex-direction:column}.input-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.875rem;font-weight:500;color:#4b5563;margin-bottom:.25rem}.input-wrapper[_ngcontent-%COMP%]{position:relative}.currency[_ngcontent-%COMP%]{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:#9ca3af}.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:90%;padding:.5rem .75rem .5rem 2rem;border:2px solid #e5e7eb;border-radius:.5rem;transition:border-color .3s}.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{outline:none;border-color:#4f46e5}.total-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:2px solid #f3f4f6;margin-top:.75rem}.total-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{font-weight:600;color:#374151}.total-value[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700}.total-value.green[_ngcontent-%COMP%]{color:#10b981}.total-value.blue[_ngcontent-%COMP%]{color:#3b82f6}.total-value.purple[_ngcontent-%COMP%]{color:#a855f7}.summary-card[_ngcontent-%COMP%]{background:linear-gradient(135deg,#4f46e5,#a855f7);border-radius:1rem;box-shadow:0 25px 50px -12px #00000040;padding:2rem;color:#fff;margin-top:2rem}.summary-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem}.summary-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700}.summary-stats[_ngcontent-%COMP%]{display:grid;gap:1rem;margin-bottom:1.5rem}@media (min-width: 768px){.summary-stats[_ngcontent-%COMP%]{grid-template-columns:repeat(4,1fr)}}.stat-card[_ngcontent-%COMP%]{background:#ffffff1a;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:.75rem;padding:1rem}.stat-label[_ngcontent-%COMP%]{font-size:.75rem;color:#c7d2fe;margin-bottom:.25rem}.stat-value[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;margin:0}.summary-details[_ngcontent-%COMP%]{display:grid;gap:1.5rem;margin-bottom:1.5rem}@media (min-width: 768px){.summary-details[_ngcontent-%COMP%]{grid-template-columns:repeat(3,1fr)}}.detail-card[_ngcontent-%COMP%]{background:#fff;border-radius:.75rem;padding:1.5rem;color:#1f2937}.detail-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}.detail-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:700}.detail-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.5rem}.detail-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.detail-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{color:#4b5563}.detail-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child{font-weight:600}.detail-total[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:2px solid #f3f4f6;margin-top:.75rem}.detail-total[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child{font-weight:700;font-size:1.125rem}.detail-total[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child{font-size:1.5rem;font-weight:700}.detail-total[_ngcontent-%COMP%]   .green[_ngcontent-%COMP%]{color:#10b981}.detail-total[_ngcontent-%COMP%]   .blue[_ngcontent-%COMP%]{color:#3b82f6}.detail-total[_ngcontent-%COMP%]   .purple[_ngcontent-%COMP%]{color:#a855f7}.detail-verification[_ngcontent-%COMP%]{margin-top:1rem;padding:.75rem;background:#f0fdf4;border-radius:.5rem}.detail-verification[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:.875rem;color:#374151;margin:0}.verification-box[_ngcontent-%COMP%]{background:#ffffff1a;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:.75rem;padding:1rem}.verification-box[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:.875rem;text-align:center;color:#e0e7ff;margin:0}.cards-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:flex-start;gap:40px;flex-wrap:wrap;margin-bottom:2rem}.cards-container[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{flex:1;min-width:400px;max-width:600px}.card-green[_ngcontent-%COMP%], .card-blue[_ngcontent-%COMP%]{background:#fff;border-radius:1rem;box-shadow:0 15px 25px -8px #0000001a;padding:1.5rem;transition:transform .3s ease,box-shadow .3s ease}.card-green[_ngcontent-%COMP%]:hover, .card-blue[_ngcontent-%COMP%]:hover{transform:translateY(-5px);box-shadow:0 20px 30px -10px #00000026}.btn-download[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;border-radius:.5rem;font-weight:600;cursor:pointer;transition:all .3s}.btn-download[_ngcontent-%COMP%]:hover{box-shadow:0 10px 15px -3px #f59e0b4d}.btn-secondary[_ngcontent-%COMP%]{padding:.5rem 1rem;background:#e0e7ff;color:#4f46e5;border:none;border-radius:.5rem;font-weight:600;cursor:pointer;transition:all .3s}.btn-secondary[_ngcontent-%COMP%]:hover{background:#c7d2fe}"]})};export{E as Gas3y4};
