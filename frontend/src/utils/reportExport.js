export function exportMonthlyReport({ institution, members = [] }) {
  const esc = (val) => String(val ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const totalMembers = members.length;
  const totalAttendances = members.reduce((sum, m) => sum + (Number(m.attendancesThisMonth) || 0), 0);
  const upToDate = members.filter((m) => m.paymentStatus === 'Al día').length;
  const pendingOrOverdue = totalMembers - upToDate;
  const nexoFitCount = members.filter((m) => String(m.source || '').includes('NexoFit')).length;
  const frontDeskCount = totalMembers - nexoFitCount;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  const periodStr = now.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  const rowsHtml = members.map((m) => {
    let statusClass = 'status-ok';
    if (m.paymentStatus === 'Pendiente') statusClass = 'status-warn';
    if (m.paymentStatus === 'Vencida') statusClass = 'status-err';

    const sourceLabel = String(m.source || '').includes('NexoFit') ? 'NexoFit' : 'Mostrador';
    const formattedAmount = Number(m.monthlyAmount || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `
      <tr>
        <td style="text-align: center;">${esc(m.id)}</td>
        <td style="text-align: center;">${esc(m.registeredAt || 'S/D')}</td>
        <td style="text-align: center;">${esc(sourceLabel)}</td>
        <td><strong>${esc(m.fullName)}</strong></td>
        <td style="text-align: center;">${esc(m.dni)}</td>
        <td>${esc(m.phone || 'S/D')}</td>
        <td>${esc(m.email || 'S/D')}</td>
        <td>${esc(m.planName || 'Plan Regular')}</td>
        <td style="text-align: right;">$ ${formattedAmount}</td>
        <td class="${statusClass}">${esc(m.paymentStatus || 'S/D')}</td>
        <td style="text-align: center;">${esc(m.dueDate || 'S/D')}</td>
        <td style="text-align: center; font-weight: bold;">${esc(m.attendancesThisMonth || 0)}</td>
        <td style="text-align: center;">${esc(m.lastAttendance || 'Sin registros')}</td>
        <td>${esc(m.notes || '')}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <style>
        body { font-family: Calibri, Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th { background-color: #0f172a; color: #ffffff; font-weight: bold; font-size: 10pt; border: 1px solid #475569; padding: 8px 6px; }
        td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 9pt; }
        .title-banner { background-color: #1e3a8a; color: #ffffff; font-size: 14pt; font-weight: bold; padding: 12px; text-align: left; }
        .meta-cell { background-color: #f8fafc; font-size: 9pt; color: #334155; padding: 6px 10px; }
        .kpi-header { background-color: #0284c7; color: #ffffff; font-weight: bold; font-size: 10pt; text-align: center; padding: 8px; border: 1px solid #0369a1; }
        .kpi-val { background-color: #f0f9ff; font-weight: bold; font-size: 12pt; text-align: center; color: #0369a1; padding: 10px; border: 1px solid #bae6fd; }
        .status-ok { background-color: #dcfce7; color: #166534; font-weight: bold; text-align: center; }
        .status-warn { background-color: #fef9c3; color: #854d0e; font-weight: bold; text-align: center; }
        .status-err { background-color: #fee2e2; color: #991b1b; font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="14" class="title-banner">
            NexoFit &bull; Reporte Mensual de Uso y Padrón de Asociados
          </td>
        </tr>
        <tr>
          <td colspan="4" class="meta-cell"><strong>Institución:</strong> ${esc(institution?.name || 'Sede Deportiva')}</td>
          <td colspan="4" class="meta-cell"><strong>Disciplina / Categoría:</strong> ${esc(institution?.category || 'S/D')}</td>
          <td colspan="3" class="meta-cell"><strong>Período Auditado:</strong> ${esc(periodStr)}</td>
          <td colspan="3" class="meta-cell"><strong>Fecha de Emisión:</strong> ${esc(dateStr)} ${esc(timeStr)}</td>
        </tr>
        <tr>
          <td colspan="7" class="meta-cell"><strong>Ubicación:</strong> ${esc(institution?.neighborhood ? `${institution.neighborhood} • ` : '')}${esc(institution?.address || 'S/D')}</td>
          <td colspan="7" class="meta-cell"><strong>Contacto:</strong> ${esc(institution?.phone || 'S/D')}</td>
        </tr>
      </table>

      <table>
        <tr>
          <td colspan="3" class="kpi-header">Total de Asociados</td>
          <td colspan="3" class="kpi-header">Ingresos Registrados en Sala</td>
          <td colspan="3" class="kpi-header">Cuotas al Día</td>
          <td colspan="3" class="kpi-header">Cuotas Pendientes / Vencidas</td>
          <td colspan="2" class="kpi-header">Captación NexoFit / Mostrador</td>
        </tr>
        <tr>
          <td colspan="3" class="kpi-val">${totalMembers}</td>
          <td colspan="3" class="kpi-val">${totalAttendances}</td>
          <td colspan="3" class="kpi-val" style="color: #166534; background-color: #f0fdf4;">${upToDate}</td>
          <td colspan="3" class="kpi-val" style="color: #991b1b; background-color: #fef2f2;">${pendingOrOverdue}</td>
          <td colspan="2" class="kpi-val" style="font-size: 10pt;">${nexoFitCount} digital / ${frontDeskCount} mostrador</td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th>ID Socio</th>
            <th>Fecha Alta</th>
            <th>Canal</th>
            <th>Nombre y Apellido</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Plan Contratado</th>
            <th>Arancel Mensual</th>
            <th>Estado Cuota</th>
            <th>Vencimiento</th>
            <th>Asistencias Mes</th>
            <th>Último Ingreso</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="14" style="text-align: center; padding: 20px;">No se registraron socios en el padrón.</td></tr>'}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF', html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (institution?.name || 'centro').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
  const monthName = now.toISOString().slice(0, 7);
  a.href = url;
  a.download = `reporte_mensual_${safeName}_${monthName}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
