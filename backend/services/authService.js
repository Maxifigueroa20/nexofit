const UserModel = require('../models/userModel');
const InstitutionModel = require('../models/institutionModel');
const SseService = require('./sseService');

class AuthService {
  static async login(username, password) {
    if (!username || !password) {
      throw new Error('Debe proporcionar usuario y contraseña.');
    }

    const user = await UserModel.findByUsername(username.trim());
    if (!user || user.password !== password) {
      throw new Error('Credenciales inválidas. Verifique usuario o contraseña.');
    }

    let institution = null;
    if (user.role === 'OWNER' && user.institutionId) {
      institution = await InstitutionModel.findById(user.institutionId);
    }

    const { password: _, ...userSafe } = user;
    return {
      user: userSafe,
      institution
    };
  }

  static async register(payload) {
    const {
      role = 'CLIENT',
      name,
      username,
      password,
      email,
      phone,
      dni,
      institutionData,
      termsAccepted
    } = payload;

    if (!termsAccepted) {
      throw new Error('Debe aceptar los Términos y Condiciones para poder registrarse en la plataforma.');
    }

    if (!name || !username || !password) {
      throw new Error('Nombre, nombre de usuario y contraseña son campos obligatorios.');
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = await UserModel.findByUsername(cleanUsername);
    if (existing) {
      throw new Error(`El nombre de usuario "${username}" ya se encuentra registrado.`);
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const termsAcceptedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    let institution = null;
    let institutionId = null;

    if (role === 'OWNER') {
      if (!institutionData || !institutionData.name || !institutionData.address) {
        throw new Error('Debe completar el nombre y la dirección de la sede deportiva.');
      }

      const allInstitutions = await InstitutionModel.findAll();
      const instNumber = allInstitutions.length + 1;
      institutionId = `inst-${String(instNumber).padStart(2, '0')}`;
      const slug = institutionData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      institution = {
        id: institutionId,
        slug,
        name: institutionData.name.trim(),
        category: institutionData.category || 'Gimnasio',
        tagline: institutionData.tagline?.trim() || 'Centro deportivo adherido a la red NexoFit.',
        address: institutionData.address.trim(),
        phone: institutionData.phone?.trim() || phone?.trim() || 'S/D',
        isPremium: false,
        owner: {
          username: cleanUsername,
          name: name.trim(),
          termsAccepted: true,
          termsAcceptedDate,
          commissionRate: '8% por captación NexoFit'
        },
        plans: [
          {
            id: `p-${Date.now().toString().slice(-4)}1`,
            name: 'Pase General Libre',
            price: 25000,
            period: 'Mensual',
            desc: 'Acceso a instalaciones y actividades regulares de la sede.'
          },
          {
            id: `p-${Date.now().toString().slice(-4)}2`,
            name: 'Pase Total Full',
            price: 32000,
            period: 'Mensual',
            desc: 'Acceso completo a todos los horarios y salas de entrenamiento.'
          }
        ],
        stats: {
          totalMembers: 0,
          nexoFitConverted: 0
        }
      };

      await InstitutionModel.create(institution);
      SseService.broadcast('INSTITUTION_UPDATED', { institution });
    }

    const allUsers = await UserModel.findAll();
    const userNumber = allUsers.length + 1;
    const userId = `usr-${String(userNumber).padStart(2, '0')}`;

    const newUser = {
      id: userId,
      username: cleanUsername,
      password,
      name: name.trim(),
      role: role === 'OWNER' ? 'OWNER' : 'CLIENT',
      dni: dni ? dni.trim() : 'S/D',
      phone: phone ? phone.trim() : 'S/D',
      email: email ? email.trim() : 'S/D',
      institutionId: role === 'OWNER' ? institutionId : undefined,
      termsAccepted: true,
      termsAcceptedDate
    };

    await UserModel.create(newUser);

    const { password: _, ...userSafe } = newUser;
    return {
      user: userSafe,
      institution
    };
  }

  static async getDemoUsers() {
    const users = await UserModel.findAll();
    return Promise.all(
      users.map(async (u) => {
        let inst = null;
        if (u.role === 'OWNER' && u.institutionId) {
          inst = await InstitutionModel.findById(u.institutionId);
        }
        return {
          id: u.id,
          username: u.username,
          name: u.name,
          role: u.role,
          institutionId: u.institutionId,
          institutionName: inst ? inst.name : null,
          hintPassword: 'password123'
        };
      })
    );
  }
}

module.exports = AuthService;
