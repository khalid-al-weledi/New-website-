export default function Footer() {
  return (
    <footer className="mt-16 border-t border-royal-100 bg-royal-900 text-royal-50">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold text-gold-300">مقرأة الإمام الجزري</div>
          <p className="mt-2 text-sm text-royal-100">
            للإقراء والإجازة بالسند — عناية بالقرآن وروايته وأدائه.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-gold-300 mb-2">روابط</div>
          <ul className="space-y-1 text-royal-100">
            <li>الرئيسية</li>
            <li>البرامج</li>
            <li>الباقات</li>
            <li>الأسئلة الشائعة</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-gold-300 mb-2">تواصل</div>
          <p className="text-royal-100">سيتم إضافة بيانات التواصل المعتمدة من الإدارة.</p>
        </div>
      </div>
      <div className="border-t border-royal-800 py-4 text-center text-xs text-royal-300">
        © {new Date().getFullYear()} مقرأة الإمام الجزري — جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}