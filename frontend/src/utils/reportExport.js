export function exportMonthlyReport({ institution, members = [] }) {
  const esc = (val) => String(val ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  const rowsHtml = members.map((m) => {
    let statusColor = '#166534';
    let statusBg = '#dcfce7';
    if (m.paymentStatus === 'Pendiente') {
      statusColor = '#854d0e';
      statusBg = '#fef9c3';
    } else if (m.paymentStatus === 'Vencida') {
      statusColor = '#991b1b';
      statusBg = '#fee2e2';
    }

    const sourceLabel = String(m.source || '').includes('NexoFit') ? 'NexoFit' : 'Mostrador';
    const formattedAmount = Number(m.monthlyAmount || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `
      <tr>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.id)}</td>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.registeredAt || 'S/D')}</td>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(sourceLabel)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px;"><strong>${esc(m.fullName)}</strong></td>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.dni)}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.phone || 'S/D')}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.email || 'S/D')}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.planName || 'Plan Regular')}</td>
        <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 8px;">$ ${formattedAmount}</td>
        <td style="text-align: center; font-weight: bold; color: ${statusColor}; background-color: ${statusBg}; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.paymentStatus || 'S/D')}</td>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.dueDate || 'S/D')}</td>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.lastPaymentDate || 'S/D')}</td>
        <td style="text-align: center; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.attendancesThisMonth || 0)}</td>
        <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.lastAttendance || 'Sin registros')}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${esc(m.notes || '')}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 10pt; }
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #3b5998; color: #ffffff; font-weight: bold; font-size: 10pt; border: 1px solid #2d4373; padding: 8px 6px; }
        .banner { background-color: #3b5998; color: #ffffff; font-size: 14pt; font-weight: bold; padding: 10px; }
        .meta { background-color: #f7f7f7; font-size: 9pt; color: #333333; padding: 6px 8px; border: 1px solid #d8dfea; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="15" class="banner">
            NexoFit &bull; Padrón de Asociados &bull; ${esc(institution?.name || 'Sede Deportiva')}
          </td>
        </tr>
        <tr>
          <td colspan="5" class="meta"><strong>Institución:</strong> ${esc(institution?.name || 'S/D')}</td>
          <td colspan="5" class="meta"><strong>Categoría:</strong> ${esc(institution?.category || 'S/D')}</td>
          <td colspan="5" class="meta"><strong>Emisión:</strong> ${esc(dateStr)} ${esc(timeStr)}</td>
        </tr>
        <tr>
          <td colspan="5" class="meta"><strong>Ubicación:</strong> ${esc(institution?.neighborhood ? `${institution.neighborhood} • ` : '')}${esc(institution?.address || 'S/D')}</td>
          <td colspan="5" class="meta"><strong>Contacto:</strong> ${esc(institution?.phone || 'S/D')}</td>
          <td colspan="5" class="meta"><strong>Total Socios:</strong> ${members.length}</td>
        </tr>
        <tr><td colspan="15" style="height: 10px;"></td></tr>
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
            <th>Último Pago</th>
            <th>Ingresos Mes</th>
            <th>Último Ingreso</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="15" style="text-align: center; padding: 20px; border: 1px solid #cbd5e1;">No hay socios registrados en el padrón.</td></tr>'}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF', html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (institution?.name || 'centro')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '');
  const dateFile = now.toISOString().slice(0, 10);
  a.href = url;
  a.download = `reporte_${safeName}_${dateFile}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
