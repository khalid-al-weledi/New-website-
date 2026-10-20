import { PrismaClient, Gender, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

const PACKAGES = [
  { minutes: 100,  priceETB: 500  },
  { minutes: 200,  priceETB: 1000 },
  { minutes: 250,  priceETB: 1225 },
  { minutes: 300,  priceETB: 1470 },
  { minutes: 400,  priceETB: 1960 },
  { minutes: 500,  priceETB: 2450 },
  { minutes: 600,  priceETB: 2940 },
  { minutes: 700,  priceETB: 3430 },
  { minutes: 800,  priceETB: 3920 },
  { minutes: 900,  priceETB: 4410 },
  { minutes: 1000, priceETB: 4900 },
];

const PROGRAMS = [
  { slug: 'talqeen', title: 'التلقين وتصحيح الأداء',
    description: 'برنامج تأسيسي لتصحيح مخارج الحروف والأداء القرآني.', sortOrder: 1 },
  { slug: 'hifz-intensive', title: 'حفظ القرآن المكثف',
    description: 'برنامج حفظ متدرج بإشراف مباشر من المقرئ.', sortOrder: 2 },
  { slug: 'hafs-ijazah', title: 'الإعداد لإجازة حفص عن عاصم',
    description: 'مسار متخصص للوصول إلى الإجازة بالسند في رواية حفص.', sortOrder: 3 },
  { slug: 'seven-qiraat', title: 'القراءات السبع',
    description: 'دراسة القراءات السبع وفق منهج تحقيقي.', sortOrder: 4 },
];

const GROUPS = [
  { name: 'ذكور صباحي',  gender: Gender.MALE,   period: 'morning', daysOfWeek: '2,3,4', startTime: '09:00', endTime: '12:30' },
  { name: 'ذكور مسائي',  gender: Gender.MALE,   period: 'evening', daysOfWeek: '2,3,4', startTime: '14:00', endTime: '15:30' },
  { name: 'ذكور ليلي',   gender: Gender.MALE,   period: 'night',   daysOfWeek: '2,3,4', startTime: '21:00', endTime: '23:00' },
  { name: 'إناث صباحي',  gender: Gender.FEMALE, period: 'morning', daysOfWeek: '6,0,1', startTime: '09:00', endTime: '12:30' },
  { name: 'إناث مسائي',  gender: Gender.FEMALE, period: 'evening', daysOfWeek: '6,0,1', startTime: '14:00', endTime: '15:30' },
  { name: 'إناث ليلي',   gender: Gender.FEMALE, period: 'night',   daysOfWeek: '6,0,1', startTime: '21:00', endTime: '23:00' },
];

const PAYMENT_SETTINGS = [
  { method: PaymentMethod.CBE,      instructions: 'أدخل رقم الحساب المعتمد من الإدارة قبل التفعيل.' },
  { method: PaymentMethod.BOA,      instructions: 'أدخل رقم الحساب المعتمد من الإدارة قبل التفعيل.' },
  { method: PaymentMethod.TELEBIRR, instructions: 'أدخل رقم المحفظة المعتمد من الإدارة قبل التفعيل.' },
  { method: PaymentMethod.MPESA,    instructions: 'أدخل رقم المحفظة المعتمد من الإدارة قبل التفعيل.' },
];

async function main() {
  for (const p of PACKAGES) {
    await prisma.package.upsert({
      where: { minutes: p.minutes },
      update: { priceETB: p.priceETB, name: `${p.minutes} دقيقة` },
      create: { minutes: p.minutes, priceETB: p.priceETB, name: `${p.minutes} دقيقة`, sortOrder: p.minutes },
    });
  }

  for (const p of PROGRAMS) {
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: { title: p.title, description: p.description, sortOrder: p.sortOrder },
      create: p,
    });
  }

  for (const g of GROUPS) {
    const existing = await prisma.group.findFirst({ where: { name: g.name } });
    if (!existing) await prisma.group.create({ data: g });
  }

  for (const s of PAYMENT_SETTINGS) {
    await prisma.paymentSetting.upsert({
      where: { method: s.method },
      update: {},
      create: { method: s.method, isActive: false, instructions: s.instructions },
    });
  }

  const faqs = [
    { question: 'كيف أسجل في المقرأة؟', answer: 'املأ استمارة التسجيل من صفحة التسجيل وسيتواصل معك المشرف.', sortOrder: 1 },
    { question: 'ما هي طرق الدفع المتاحة؟', answer: 'CBE، BOA، Telebirr، M-Pesa. تُفعَّل بعد اعتماد بيانات الحساب من الإدارة.', sortOrder: 2 },
    { question: 'هل الإجازة بالسند متاحة؟', answer: 'نعم، ضمن برنامج الإعداد لإجازة حفص عن عاصم بعد اجتياز الشروط.', sortOrder: 3 },
  ];
  for (const f of faqs) {
    const exists = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!exists) await prisma.fAQ.create({ data: f });
  }

  const settings: Record<string, string> = {
    'site.name': 'مقرأة الإمام الجزري للإقراء والإجازة بالسند',
    'site.tagline': 'إقراء متقن وإجازة بالسند',
    'site.defaultMinutePrice': '5',
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());