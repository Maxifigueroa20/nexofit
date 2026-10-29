const { query, isPostgres, getMemoryData } = require('./database');

function formatInstitution(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    tagline: row.tagline,
    address: row.address,
    phone: row.phone,
    isPremium: Boolean(row.is_premium),
    owner: typeof row.owner === 'string' ? JSON.parse(row.owner) : (row.owner || {}),
    plans: typeof row.plans === 'string' ? JSON.parse(row.plans) : (row.plans || []),
    stats: typeof row.stats === 'string' ? JSON.parse(row.stats) : (row.stats || {})
  };
}

class InstitutionModel {
  static async findAll() {
    if (isPostgres()) {
      const res = await query('SELECT * FROM institutions ORDER BY is_premium DESC, name ASC');
      return res.rows.map(formatInstitution);
    }
    const list = getMemoryData().institutions || [];
    return [...list].sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));
  }

  static async findById(id) {
    if (isPostgres()) {
      const res = await query('SELECT * FROM institutions WHERE id = $1', [id]);
      return res.rows[0] ? formatInstitution(res.rows[0]) : null;
    }
    return (getMemoryData().institutions || []).find((i) => i.id === id) || null;
  }

  static async create(institutionData) {
    if (isPostgres()) {
      await query(
        `INSERT INTO institutions (id, slug, name, category, tagline, address, phone, is_premium, owner, plans, stats)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          institutionData.id,
          institutionData.slug,
          institutionData.name,
          institutionData.category,
          institutionData.tagline,
          institutionData.address,
          institutionData.phone,
          Boolean(institutionData.isPremium),
          JSON.stringify(institutionData.owner || {}),
          JSON.stringify(institutionData.plans || []),
          JSON.stringify(institutionData.stats || {})
        ]
      );
      return institutionData;
    }
    const data = getMemoryData();
    if (!data.institutions) {
      data.institutions = [];
    }
    data.institutions.push(institutionData);
    return institutionData;
  }

  static async updatePremium(id, isPremium) {
    if (isPostgres()) {
      const res = await query(
        'UPDATE institutions SET is_premium = $1 WHERE id = $2 RETURNING *',
        [Boolean(isPremium), id]
      );
      return res.rows[0] ? formatInstitution(res.rows[0]) : null;
    }
    const inst = (getMemoryData().institutions || []).find((i) => i.id === id);
    if (!inst) return null;
    inst.isPremium = Boolean(isPremium);
    return inst;
  }
}

module.exports = InstitutionModel;
