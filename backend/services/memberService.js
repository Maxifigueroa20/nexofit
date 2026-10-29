const MemberModel = require('../models/memberModel');
const InstitutionModel = require('../models/institutionModel');
const SseService = require('./sseService');

class MemberService {
  static async getMembersByInstitution(institutionId, filters = {}) {
    let members = await MemberModel.findByInstitutionId(institutionId);

    const { search, status, source } = filters;

    if (search) {
      const q = search.toLowerCase();
      members = members.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.dni.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          (m.email && m.email.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'ALL') {
      members = members.filter((m) => m.paymentStatus === status);
    }

    if (source && source !== 'ALL') {
      members = members.filter((m) => m.source === source);
    }

    return members.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  }

  static async enrollMember(institutionId, memberData) {
    const inst = await InstitutionModel.findById(institutionId);
    if (!inst) {
      throw new Error('Institución no válida');
    }

    const { fullName, dni, phone, email, planName, monthlyAmount, source, notes } = memberData;

    if (!fullName || !dni || !planName) {
      throw new Error('Faltan campos obligatorios (nombre, DNI, plan)');
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const registeredAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const dueDateObj = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const dueDate = `${dueDateObj.getFullYear()}-${pad(dueDateObj.getMonth() + 1)}-${pad(dueDateObj.getDate())}`;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newMember = {
      id: `SOC-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(0, 1)}`,
      institutionId,
      registeredAt,
      source: source || 'NexoFit (Web Captación)',
      fullName: fullName.trim(),
      dni: dni.trim(),
      phone: phone ? phone.trim() : 'S/D',
      email: email ? email.trim() : 'S/D',
      planName,
      monthlyAmount: Number(monthlyAmount) || 20000,
      paymentStatus: 'Al día',
      lastPaymentDate: registeredAt.split(' ')[0],
      dueDate,
      attendancesThisMonth: 0,
      lastAttendance: '-',
      notes: notes ? notes.trim() : 'Inscripción procesada mediante la plataforma de captación NexoFit.'
    };

    await MemberModel.create(newMember);

    SseService.broadcast('NEW_MEMBER', {
      institutionId,
      institutionName: inst.name,
      member: newMember
    });

    return newMember;
  }

  static async togglePaymentStatus(memberId) {
    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw new Error('Socio no encontrado');
    }

    const states = ['Al día', 'Pendiente', 'Vencida'];
    const nextStatus = states[(states.indexOf(member.paymentStatus) + 1) % states.length];

    const updates = { paymentStatus: nextStatus };
    if (nextStatus === 'Al día') {
      updates.lastPaymentDate = new Date().toISOString().split('T')[0];
    }

    const updated = await MemberModel.update(memberId, updates);

    SseService.broadcast('PAYMENT_STATUS_CHANGED', { member: updated });

    return updated;
  }

  static async recordAttendance(memberId) {
    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw new Error('Socio no encontrado');
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const lastAttendance = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const updated = await MemberModel.update(memberId, {
      attendancesThisMonth: (member.attendancesThisMonth || 0) + 1,
      lastAttendance
    });

    SseService.broadcast('ATTENDANCE_RECORDED', { member: updated });

    return updated;
  }

  static async getMembersByDni(dni) {
    const clean = (v) => String(v || '').replace(/\D/g, '');
    const target = clean(dni);
    const all = await MemberModel.findAll();
    return all.filter((m) => (target ? clean(m.dni) === target : m.dni === dni));
  }

  static async resetDatabase() {
    await MemberModel.reset();
    SseService.broadcast('DB_RESET', {});
  }
}

module.exports = MemberService;
