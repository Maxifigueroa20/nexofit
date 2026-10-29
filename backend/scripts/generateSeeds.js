const fs = require('fs');
const path = require('path');
const { fakerES: faker } = require('@faker-js/faker');

const SEED_FILE = path.join(__dirname, '..', 'data', 'seed.json');

const jujuyNeighborhoods = [
  'Centro',
  'Los Perales',
  'Alto Comedero',
  'Ciudad de Nieva',
  'Cuyaya',
  'San Pedrito',
  'Bajo La Viña',
  'Chijra',
  'Coronel Arias',
  'Gorriti',
  'Huaico',
  'Moreno',
  'Santa Rosa',
  'Reyes',
  'Mariano Moreno'
];

const jujuyStreets = [
  'Av. Fascio',
  'Calle Belgrano',
  'Calle Alvear',
  'Calle Güemes',
  'Calle Senador Pérez',
  'Calle Ramírez de Velazco',
  'Av. Illia',
  'Av. Forestal',
  'Av. El Éxodo',
  'Av. 19 de Abril',
  'Calle Balcarce',
  'Calle Salta',
  'Calle Necochea',
  'Calle Lavalle',
  'Calle San Martín',
  'Calle Independencia',
  'Av. Córdoba',
  'Av. Santibáñez',
  'Av. Carrillo',
  'Av. España'
];

const sportsCategories = [
  'Gimnasio',
  'Pilates',
  'Yoga',
  'CrossFit',
  'Artes Marciales',
  'Natación',
  'Calistenia',
  'Spinning',
  'Pádel',
  'Danza'
];

const gymNamePrefixes = [
  'Gimnasio',
  'Centro de Entrenamiento',
  'Espacio Fitness',
  'Club Deportivo',
  'Academia',
  'Estudio',
  'CrossBox',
  'Dojo',
  'Complejo'
];

const gymNameConcepts = [
  'Titán',
  'Fuerza Viva',
  'Sparta',
  'Vanguardia',
  'Olympus',
  'Energía Pura',
  'Andes Fit',
  'Valle Extremo',
  'Norte Activo',
  'Equilibrio',
  'Zenith',
  'Impacto',
  'Potencia',
  'Movimiento',
  'Vitalidad',
  'Poder Real',
  'ProForm',
  'Alpha',
  'Apex',
  'Fénix'
];

function generateRandomDni() {
  const num = faker.number.int({ min: 28000000, max: 46000000 });
  const str = String(num);
  return `${str.slice(0, 2)}.${str.slice(2, 5)}.${str.slice(5)}`;
}

function generateRandomJujuyPhone() {
  const line = faker.number.int({ min: 1000, max: 9999 });
  const prefix = faker.helpers.arrayElement(['422', '423', '424', '425', '431', '491', '154', '155', '156']);
  return `+54 388 ${prefix}-${line}`;
}

function generatePlansForCategory(category) {
  switch (category) {
    case 'Gimnasio':
      return [
        { id: 'p-1', name: 'Musculación Libre', price: 24000, period: 'Mensual', desc: 'Acceso ilimitado a sala de pesas y máquinas.' },
        { id: 'p-2', name: 'Plan Total + Cardio', price: 30000, period: 'Mensual', desc: 'Musculación, zona aeróbica y lockers.' },
        { id: 'p-3', name: 'Pase Trimestral Ahorro', price: 68000, period: 'Trimestral', desc: '3 meses completos con arancel promocional.' }
      ];
    case 'Pilates':
      return [
        { id: 'p-1', name: 'Reformer 2 Clases/Semana', price: 34000, period: 'Mensual', desc: 'Clases grupales reducidas en reformer con seguimiento.' },
        { id: 'p-2', name: 'Reformer Intensivo 3 Clases/Semana', price: 44000, period: 'Mensual', desc: 'Plan avanzado de alineación postural y columna.' }
      ];
    case 'Yoga':
      return [
        { id: 'p-1', name: 'Pase Tradicional (8 Clases)', price: 26000, period: 'Mensual', desc: 'Prácticas de Hatha y Vinyasa guiadas.' },
        { id: 'p-2', name: 'Membresía Libre Shala', price: 36000, period: 'Mensual', desc: 'Acceso diario ilimitado a todos los turnos.' }
      ];
    case 'CrossFit':
      return [
        { id: 'p-1', name: 'WOD 3 Días/Semana', price: 32000, period: 'Mensual', desc: 'Entrenamiento funcional de alta intensidad.' },
        { id: 'p-2', name: 'Pase Ilimitado RX', price: 40000, period: 'Mensual', desc: 'Clases guiadas + Open Box ilimitado.' }
      ];
    case 'Natación':
      return [
        { id: 'p-1', name: 'Pileta Libre (2 veces por semana)', price: 32000, period: 'Mensual', desc: 'Carriles climatizados de 25m.' },
        { id: 'p-2', name: 'Escuela de Natación + AquaGym', price: 42000, period: 'Mensual', desc: 'Instrucción técnica y gimnasia acuática.' }
      ];
    case 'Pádel':
      return [
        { id: 'p-1', name: 'Abono Turnos Fijos Semanales', price: 28000, period: 'Mensual', desc: 'Canchas panorámicas de blindex con luz LED.' },
        { id: 'p-2', name: 'Clínica de Entrenamiento + Cancha Libre', price: 38000, period: 'Mensual', desc: 'Clases tácticas y derecho de juego preferente.' }
      ];
    default:
      return [
        { id: 'p-1', name: 'Pase Estándar', price: 25000, period: 'Mensual', desc: 'Acceso a clases regulares de la disciplina.' },
        { id: 'p-2', name: 'Pase Full', price: 35000, period: 'Mensual', desc: 'Acceso total y seguimiento personalizado.' }
      ];
  }
}

function generateTagline(category, neighborhood) {
  const templates = {
    Gimnasio: [
      `Sala de musculación completa, peso libre y entrenamiento funcional en ${neighborhood}.`,
      `Equipamiento biomecánico de última generación, rutinas a medida y ambiente motivador.`,
      `Entrenamiento de fuerza y acondicionamiento físico con instructores certificados en ${neighborhood}.`,
      `Tu espacio de alto rendimiento y superación en el corazón de ${neighborhood}.`,
      `Musculación, zona de cardio y asesoramiento constante para alcanzar tus metas.`
    ],
    Pilates: [
      `Estudio de reformer con grupos reducidos, enfoque postural y rehabilitación en ${neighborhood}.`,
      `Fortalecimiento de zona media, elasticidad y salud articular con atención personalizada.`,
      `Clases de pilates reformer y mat diseñadas para tu bienestar integral en ${neighborhood}.`,
      `Mejora tu postura, tono muscular y flexibilidad con instructores dedicados.`
    ],
    Yoga: [
      `Prácticas de Hatha, Vinyasa y meditación para conectar cuerpo y mente en ${neighborhood}.`,
      `Shala tradicional con sesiones guiadas, respiración consciente y relajación profunda.`,
      `Espacio de calma y armonía con clases para todos los niveles de experiencia en ${neighborhood}.`,
      `Encuentra tu equilibrio diario a través de la práctica consciente y la respiración.`
    ],
    CrossFit: [
      `Box oficial de alta intensidad: levantamiento olímpico, gimnásticos y WOD diarios en ${neighborhood}.`,
      `Comunidad, disciplina y superación constante sin rutinas monótonas en ${neighborhood}.`,
      `Entrenamiento funcional extremo adaptado a todos los niveles de condición física.`,
      `Desafía tus límites en cada sesión con coaches certificados y equipamiento profesional.`
    ],
    Natación: [
      `Natación formativa, pileta climatizada y programas de acondicionamiento acuático en ${neighborhood}.`,
      `Carriles de 25 metros climatizados, escuela para adultos y niños todo el año en ${neighborhood}.`,
      `Entrenamiento acuático de bajo impacto articular y alta quema calórica.`
    ],
    Pádel: [
      `Canchas panorámicas de blindex con iluminación LED y torneos semanales en ${neighborhood}.`,
      `Turnos fijos, alquiler de paletas y clínicas de perfeccionamiento técnico en ${neighborhood}.`,
      `El punto de encuentro para apasionados del pádel con canchas de primer nivel.`
    ],
    'Artes Marciales': [
      `Dojo especializado en técnica, defensa personal, respeto y acondicionamiento en ${neighborhood}.`,
      `Entrenamiento integral de combate, disciplina marcial y preparación física rigurosa.`
    ],
    Calistenia: [
      `Parque de barras cubierto, control del peso corporal y progresiones estáticas en ${neighborhood}.`,
      `Fuerza pura y dominio corporal con entrenamientos progresivos para todos los niveles.`
    ],
    Spinning: [
      `Sesiones de ciclismo indoor de alta intensidad con música y métricas en vivo en ${neighborhood}.`,
      `Cardio intensivo, intervalos y potencia pedaleando junto a un grupo motivador.`
    ],
    Danza: [
      `Clases de ritmos, expresión corporal y acondicionamiento dinámico en ${neighborhood}.`,
      `Muévete, diviértete y entrena al ritmo de la música con profesores especializados.`
    ]
  };

  const pool = templates[category] || [
    `Instalaciones profesionales dedicadas a la práctica deportiva y la salud en ${neighborhood}.`,
    `Espacio de entrenamiento, recreación y desarrollo deportivo integral en ${neighborhood}.`
  ];

  return faker.helpers.arrayElement(pool);
}

function getScheduleAndShifts(category) {
  const profileOptions = [
    {
      weight: 15,
      schedule: faker.helpers.arrayElement([
        'Lun a Sáb 07:00 a 12:30',
        'Lun a Vie 06:30 a 12:00',
        'Lun a Sáb 08:00 a 13:00'
      ]),
      shifts: ['Mañana']
    },
    {
      weight: 15,
      schedule: faker.helpers.arrayElement([
        'Lun a Vie 15:00 a 20:30',
        'Lun a Vie 14:00 a 19:30',
        'Lun a Vie 16:00 a 21:00'
      ]),
      shifts: ['Tarde']
    },
    {
      weight: 15,
      schedule: faker.helpers.arrayElement([
        'Lun a Vie 19:30 a 23:30',
        'Lun a Vie 20:00 a 00:00',
        'Lun a Sáb 20:00 a 23:00'
      ]),
      shifts: ['Noche']
    },
    {
      weight: 20,
      schedule: faker.helpers.arrayElement([
        'Lun a Vie 08:00 a 12:30 y 16:00 a 20:30',
        'Lun a Vie 07:30 a 12:00 y 15:30 a 20:00',
        'Lun a Sáb 08:00 a 13:00 y 16:00 a 20:00'
      ]),
      shifts: ['Mañana', 'Tarde']
    },
    {
      weight: 20,
      schedule: faker.helpers.arrayElement([
        'Lun a Vie 16:00 a 23:30',
        'Lun a Vie 17:00 a 23:00 | Sáb 16:00 a 22:00',
        'Lun a Dom 18:00 a 00:00'
      ]),
      shifts: ['Tarde', 'Noche']
    },
    {
      weight: 5,
      schedule: faker.helpers.arrayElement([
        'Lun a Vie 07:00 a 11:30 y 19:30 a 22:30',
        'Lun a Vie 06:30 a 11:00 y 20:00 a 23:00'
      ]),
      shifts: ['Mañana', 'Noche']
    },
    {
      weight: 10,
      schedule: faker.helpers.arrayElement([
        'Lun a Vie 07:00 a 23:00 | Sáb 09:00 a 14:00',
        'Lun a Dom 07:30 a 23:30',
        'Lun a Vie 06:30 a 23:00 | Sáb 08:00 a 20:00'
      ]),
      shifts: ['Mañana', 'Tarde', 'Noche']
    }
  ];

  const chosen = faker.helpers.weightedArrayElement(
    profileOptions.map((opt) => ({ weight: opt.weight, value: opt }))
  );
  return {
    schedule: chosen.schedule,
    shifts: [...chosen.shifts]
  };
}

function buildSeeds() {
  const existingRaw = fs.readFileSync(SEED_FILE, 'utf8');
  const existing = JSON.parse(existingRaw);

  const baseInstitutions = existing.institutions.slice(0, 4).map((inst, idx) => {
    const schedules = [
      { neighborhood: 'Centro', schedule: 'Lun a Vie 07:00 a 23:00 | Sáb 09:00 a 18:00', shifts: ['Mañana', 'Tarde', 'Noche'] },
      { neighborhood: 'Centro', schedule: 'Lun a Vie 08:00 a 12:00 y 16:00 a 20:30', shifts: ['Mañana', 'Tarde'] },
      { neighborhood: 'Los Perales', schedule: 'Lun a Vie 17:00 a 21:30', shifts: ['Tarde', 'Noche'] },
      { neighborhood: 'San Pedrito', schedule: 'Lun a Vie 07:00 a 11:30 y 19:30 a 22:30', shifts: ['Mañana', 'Noche'] }
    ];
    return {
      ...inst,
      ...schedules[idx]
    };
  });

  const baseUsers = existing.users.slice(0, 7).map((u) => {
    let neighborhood = 'Centro';
    let preferredShift = 'Noche';
    if (u.username === 'valeria_cliente') {
      neighborhood = 'Los Perales';
      preferredShift = 'Tarde';
    } else if (u.username === 'lucas_cliente') {
      neighborhood = 'San Pedrito';
      preferredShift = 'Mañana';
    } else if (u.username === 'mariano_cliente') {
      neighborhood = 'Centro';
      preferredShift = 'Noche';
    } else if (u.username === 'carlos_titan') {
      neighborhood = 'Centro';
      preferredShift = 'Mañana';
    } else if (u.username === 'marcela_pilates') {
      neighborhood = 'Centro';
      preferredShift = 'Tarde';
    } else if (u.username === 'esteban_yoga') {
      neighborhood = 'Los Perales';
      preferredShift = 'Tarde';
    } else if (u.username === 'rodrigo_cross') {
      neighborhood = 'San Pedrito';
      preferredShift = 'Noche';
    }
    return {
      ...u,
      neighborhood,
      preferredShift
    };
  });
  const baseMembers = existing.members.slice(0, 10);

  const institutions = [...baseInstitutions];
  const users = [...baseUsers];
  const members = [...baseMembers];

  for (let i = 5; i <= 100; i++) {
    const id = `inst-${String(i).padStart(2, '0')}`;
    const category = faker.helpers.arrayElement(sportsCategories);
    const prefix = faker.helpers.arrayElement(gymNamePrefixes);
    const concept = faker.helpers.arrayElement(gymNameConcepts);
    const neighborhood = faker.helpers.arrayElement(jujuyNeighborhoods);
    const street = faker.helpers.arrayElement(jujuyStreets);
    const streetNumber = faker.number.int({ min: 100, max: 2400 });

    const name = `${prefix} ${concept} ${neighborhood}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const address = `${street} ${streetNumber}, ${neighborhood}, San Salvador de Jujuy`;
    const phone = generateRandomJujuyPhone();
    const isPremium = i <= 12;

    const ownerFirstName = faker.person.firstName();
    const ownerLastName = faker.person.lastName();
    const ownerName = `${ownerFirstName} ${ownerLastName}`;
    const username = `owner_${slug.slice(0, 15).replace(/-/g, '_')}_${i}`;

    const ownerUser = {
      id: `usr-${String(i + 10).padStart(2, '0')}`,
      username,
      password: 'password123',
      name: ownerName,
      role: 'OWNER',
      institutionId: id,
      neighborhood,
      preferredShift: faker.helpers.arrayElement(['Mañana', 'Tarde', 'Noche'])
    };
    users.push(ownerUser);

    const plans = generatePlansForCategory(category).map((p, pIdx) => ({
      ...p,
      id: `p-${i}-${pIdx + 1}`
    }));

    const scheduleData = getScheduleAndShifts(category);

    const instObj = {
      id,
      slug,
      name,
      category,
      tagline: generateTagline(category, neighborhood),
      address,
      phone,
      isPremium,
      neighborhood,
      schedule: scheduleData.schedule,
      shifts: scheduleData.shifts,
      owner: {
        username,
        name: ownerName,
        termsAccepted: true,
        termsAcceptedDate: '2024-04-10',
        commissionRate: '8% por captación NexoFit'
      },
      plans,
      stats: {
        totalMembers: 0,
        nexoFitConverted: 0
      }
    };

    institutions.push(instObj);
  }

  const existingMemberIds = new Set(members.map((m) => m.id));
  let memberSeq = 100;

  for (let instIdx = 0; instIdx < institutions.length; instIdx++) {
    const inst = institutions[instIdx];
    const memberCount = instIdx < 4 ? 20 : faker.number.int({ min: 1, max: 5 });

    for (let k = 0; k < memberCount; k++) {
      memberSeq++;
      const mId = `SOC-${String(memberSeq).padStart(4, '0')}`;
      if (existingMemberIds.has(mId)) continue;
      existingMemberIds.add(mId);

      const plan = faker.helpers.arrayElement(inst.plans);
      const isOnline = Math.random() < 0.65;
      const statusRoll = Math.random();
      const paymentStatus = statusRoll < 0.72 ? 'Al día' : statusRoll < 0.90 ? 'Pendiente' : 'Vencida';

      const regMonth = faker.number.int({ min: 1, max: 10 });
      const regDay = faker.number.int({ min: 1, max: 28 });
      const regDateStr = `2026-${String(regMonth).padStart(2, '0')}-${String(regDay).padStart(2, '0')}`;

      const dueMonth = regMonth === 12 ? 1 : regMonth + 1;
      const dueYear = regMonth === 12 ? 2027 : 2026;
      const dueDateStr = `${dueYear}-${String(dueMonth).padStart(2, '0')}-${String(regDay).padStart(2, '0')}`;

      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      const phone = generateRandomJujuyPhone();
      const dni = generateRandomDni();

      members.push({
        id: mId,
        institutionId: inst.id,
        registeredAt: `${regDateStr} 10:30:00`,
        source: isOnline ? 'NexoFit (Web Captación)' : 'Directo (Mostrador)',
        fullName,
        dni,
        phone,
        email,
        planName: plan.name,
        monthlyAmount: plan.price,
        paymentStatus,
        lastPaymentDate: paymentStatus === 'Vencida' ? '2026-08-10' : regDateStr,
        dueDate: dueDateStr,
        attendancesThisMonth: faker.number.int({ min: 0, max: 16 }),
        lastAttendance: `${regDateStr} 18:30`,
        notes: isOnline ? 'Inscripción procesada mediante la plataforma de captación NexoFit.' : 'Alta realizada de forma presencial en mostrador.'
      });
    }
  }

  institutions.forEach((inst) => {
    const instMembers = members.filter((m) => m.institutionId === inst.id);
    const nexoFitCount = instMembers.filter((m) => m.source?.includes('NexoFit')).length;
    inst.stats = {
      totalMembers: instMembers.length,
      nexoFitConverted: nexoFitCount
    };
  });

  const output = {
    institutions,
    members,
    users
  };

  fs.writeFileSync(SEED_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`[Seed Generator] Generadas ${institutions.length} instituciones, ${members.length} socios y ${users.length} usuarios.`);
}

buildSeeds();

