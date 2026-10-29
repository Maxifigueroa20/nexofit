const { query, isPostgres, getMemoryData, resetDatabase } = require('./database');

function formatMember(row) {
  if (!row) return null;
  return {
    id: row.id,
    institutionId: row.institution_id || row.institutionId,
    registeredAt: row.registered_at || row.registeredAt,
    source: row.source,
    fullName: row.full_name || row.fullName,
    dni: row.dni,
    phone: row.phone,
    email: row.email,
    planName: row.plan_name || row.planName,
    monthlyAmount: Number(row.monthly_amount != null ? row.monthly_amount : row.monthlyAmount),
    paymentStatus: row.payment_status || row.paymentStatus,
    lastPaymentDate: row.last_payment_date || row.lastPaymentDate,
    dueDate: row.due_date || row.dueDate,
    attendancesThisMonth: Number(row.attendances_this_month != null ? row.attendances_this_month : (row.attendancesThisMonth || 0)),
    lastAttendance: row.last_attendance || row.lastAttendance,
    notes: row.notes
  };
}

class MemberModel {
  static async findAll() {
    if (isPostgres()) {
      const res = await query('SELECT * FROM members ORDER BY registered_at DESC');
      return res.rows.map(formatMember);
    }
    return (getMemoryData().members || []).map(formatMember);
  }

  static async findById(id) {
    if (isPostgres()) {
      const res = await query('SELECT * FROM members WHERE id = $1', [id]);
      return res.rows[0] ? formatMember(res.rows[0]) : null;
    }
    const m = (getMemoryData().members || []).find((x) => x.id === id);
    return m ? formatMember(m) : null;
  }

  static async findByInstitutionId(institutionId) {
    if (isPostgres()) {
      const res = await query('SELECT * FROM members WHERE institution_id = $1 ORDER BY registered_at DESC', [institutionId]);
      return res.rows.map(formatMember);
    }
    return (getMemoryData().members || []).filter((m) => m.institutionId === institutionId).map(formatMember);
  }

  static async findByDni(dni) {
    if (isPostgres()) {
      const res = await query('SELECT * FROM members WHERE dni = $1 ORDER BY registered_at DESC', [dni]);
      return res.rows.map(formatMember);
    }
    return (getMemoryData().members || []).filter((m) => m.dni === dni).map(formatMember);
  }

  static async create(memberData) {
    if (isPostgres()) {
      await query(
        `INSERT INTO members (id, institution_id, registered_at, source, full_name, dni, phone, email, plan_name, monthly_amount, payment_status, last_payment_date, due_date, attendances_this_month, last_attendance, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          memberData.id,
          memberData.institutionId,
          memberData.registeredAt,
          memberData.source,
          memberData.fullName,
          memberData.dni,
          memberData.phone,
          memberData.email,
          memberData.planName,
          memberData.monthlyAmount,
          memberData.paymentStatus,
          memberData.lastPaymentDate,
          memberData.dueDate,
          memberData.attendancesThisMonth || 0,
          memberData.lastAttendance,
          memberData.notes
        ]
      );
      return memberData;
    }
    getMemoryData().members.unshift(memberData);
    return memberData;
  }

  static async update(id, updates) {
    if (isPostgres()) {
      const current = await MemberModel.findById(id);
      if (!current) return null;
      const updated = { ...current, ...updates };

      const res = await query(
        `UPDATE members SET
          payment_status = $1,
          last_payment_date = $2,
          due_date = $3,
          attendances_this_month = $4,
          last_attendance = $5,
          notes = $6
         WHERE id = $7
         RETURNING *`,
        [
          updated.paymentStatus,
          updated.lastPaymentDate,
          updated.dueDate,
          updated.attendancesThisMonth,
          updated.lastAttendance,
          updated.notes,
          id
        ]
      );
      return res.rows[0] ? formatMember(res.rows[0]) : null;
    }

    const member = (getMemoryData().members || []).find((m) => m.id === id);
    if (!member) return null;
    Object.assign(member, updates);
    return formatMember(member);
  }

  static async reset() {
    await resetDatabase();
  }
}

module.exports = MemberModel;
