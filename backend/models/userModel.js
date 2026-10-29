const { query, isPostgres, getMemoryData } = require('./database');

function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    name: row.name,
    role: row.role,
    institutionId: row.institution_id || row.institutionId,
    dni: row.dni,
    phone: row.phone,
    email: row.email,
    neighborhood: row.neighborhood || 'Centro',
    preferredShift: row.preferred_shift || row.preferredShift || 'Noche',
    termsAccepted: Boolean(row.terms_accepted != null ? row.terms_accepted : row.termsAccepted),
    termsAcceptedDate: row.terms_accepted_date || row.termsAcceptedDate
  };
}

class UserModel {
  static async findAll() {
    if (isPostgres()) {
      const res = await query('SELECT * FROM users');
      return res.rows.map(formatUser);
    }
    return (getMemoryData().users || []).map(formatUser);
  }

  static async findByUsername(username) {
    if (!username) return null;
    if (isPostgres()) {
      const res = await query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
      return res.rows[0] ? formatUser(res.rows[0]) : null;
    }
    const users = getMemoryData().users || [];
    const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    return found ? formatUser(found) : null;
  }

  static async findById(id) {
    if (!id) return null;
    if (isPostgres()) {
      const res = await query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0] ? formatUser(res.rows[0]) : null;
    }
    const users = getMemoryData().users || [];
    const found = users.find((u) => u.id === id);
    return found ? formatUser(found) : null;
  }

  static async create(userData) {
    if (isPostgres()) {
      await query(
        `INSERT INTO users (id, username, password, name, role, institution_id, dni, phone, email, neighborhood, preferred_shift, terms_accepted, terms_accepted_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          userData.id,
          userData.username,
          userData.password,
          userData.name,
          userData.role,
          userData.institutionId,
          userData.dni,
          userData.phone,
          userData.email,
          userData.neighborhood || 'Centro',
          userData.preferredShift || 'Noche',
          Boolean(userData.termsAccepted),
          userData.termsAcceptedDate
        ]
      );
      return userData;
    }
    const data = getMemoryData();
    if (!data.users) {
      data.users = [];
    }
    data.users.push(userData);
    return userData;
  }
}

module.exports = UserModel;
