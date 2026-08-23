# FinGuide AI — Loyiha Xatolari va Muammolar Royxati

> Sana: 2026-08-23
> Maqsad: Barcha fayllar tekshirildi. Quyida topilgan xatolar, xavflar va tavsiyalar keltirilgan.

---

## KRITIK XATOLAR (Tuzatilishi shart)

---

### 1. .env — NEXTAUTH_URL noto ghri port

Fayl: .env, 12-qator
Xato:
  NEXTAUTH_URL=http://localhost:3001

Muammo: Dev server haqiqatda 3000 portida ishlaydi.
NEXTAUTH_URL noto ghri bo lsa, Google OAuth callback ishlash mumkin emas.

To ghri qiymat:
  NEXTAUTH_URL=http://localhost:3000

---

### 2. .env — Supabase kalitlari keraksiz va xavfsizlik xavfi

Fayl: .env, 6-7-qatorlar
Xato:
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...

Muammo: Loyiha Supabase emas SQLite ishlatadi. NEXT_PUBLIC_ prefiksi bilan
boshlanadi ya ni brauzerda ham ko rinadi. Ular keraksiz va xavfsizlik xavfi.

To ghrilash: Bu 2 qatorni .env dan o chirib tashlash kerak.

---

### 3. .env — AUTH_SECRET hali to ldirilmagan

Fayl: .env, 3-qator
Xato:
  AUTH_SECRET=your_auth_secret

Muammo: Bu qiymat hali placeholder. NEXTAUTH_SECRET alohida to ghri, lekin
AUTH_SECRET kelajakda chalkashlik yaratishi mumkin.

To ghrilash: AUTH_SECRET qatorini o chiring yoki unga NEXTAUTH_SECRET bilan
bir xil qiymat bering.

---

### 4. lib/auth.ts — Login paytida name maydonini session ga qaytarmayapdi

Fayl: lib/auth.ts, 49-qator
Xato:
  return { id: user.id, email: user.email };  // name yo q!

Muammo: Foydalanuvchi credentials bilan kirganida name qaytarilmaydi.
Natijada session.user.name doim null bo ladi.

To ghrilash:
  return { id: user.id, email: user.email, name: user.name ?? undefined };

---

### 5. app/login/page.tsx — searchParams use client komponentda ishlatilmoqda

Fayl: app/login/page.tsx, 7-11-qatorlar
Xato:
  export default function LoginPage({ searchParams }: { searchParams: {...} })

Muammo: searchParams props sifatida faqat Server Component larda ishlaydi.
use client komponentida hydration xatosi chiqarishi mumkin.

To ghrilash: useSearchParams() hookidan foydalanish:
  import { useSearchParams } from  next/navigation;
  const searchParams = useSearchParams();
  const hasError = searchParams.get(error);
  const [error, setError] = useState(hasError ? Xatolik yuz berdi : );

Eslatma: useSearchParams() ni ishlatganda komponentni Suspense bilan o rash kerak.

---

### 6. app/dashboard/page.tsx — Google foydalanuvchi uchun findUnique({where:{id}}) noto ghri

Fayl: app/dashboard/page.tsx, 16-19-qatorlar
Xato:
 const localUser = await prisma.user.findUnique({ where: { id: user.id } });

Muammo: Google OAuth foydalanuvchisi uchun session.user.id = Google OAuth sub ID.
Lekin DB da foydalanuvchilar uuid() bilan yaratiladi. Bu farqlanadi va
email UNIQUE constraint buzilishiga olib kelishi mumkin.

To ghrilash:
 const localUser = await prisma.user.findUnique({ where: { email: user.email ||  } });
  if (!localUser && user.email) {
    await prisma.user.create({ data: { email: user.email } });
  }

---

## MUHIM MUAMMOLAR (Imkon bo lsa tuzatish kerak)

---

### 7. package.json — Keraksiz kutubxonalar o rnatilgan

Fayl: package.json
Xato:
  @auth/prisma-adapter    — ishlatilmaydi
  @supabase/ssr           — ishlatilmaydi
  @supabase/supabase-js   — ishlatilmaydi
  @ai-sdk/react           — ishlatilmaydi

To ghrilash:
  npm uninstall @auth/prisma-adapter @supabase/ssr @supabase/supabase-js @ai-sdk/react

---

### 8. components/IncomeList.tsx va ExpenseList.tsx — Dizayn nomuvofiq

Fayl: components/IncomeList.tsx (6, 13, 16-qatorlar)
Fayl: components/ExpenseList.tsx (6, 13, 17, 18-qatorlar)

Xato: Bu komponentlar text-gray-* va bg-gray-* ishlatadi,
qolgan barcha komponentlar text-slate-* va bg-slate-* dan foydalanadi.

To ghrilash (barcha gray ni slate ga almashtiring):
  text-gray-500  ->  text-slate-500
  text-gray-600  ->  text-slate-600
  text-gray-400  ->  text-slate-400
  bg-gray-50     ->  bg-slate-50

---

### 9. AnalyticsCharts.tsx — total har iteratsiyada qayta hisoblanmoqda

Fayl: app/dashboard/analytics/AnalyticsCharts.tsx, 188-qator
Xato:
  {categoryData.map((cat, idx) => {
    const total = categoryData.reduce((s, c) => s + c.value, 0); // har satrda!

Muammo: total ni map ichida hisoblash har iteratsiyada reduce ishlatadi (O(n2)).

To ghrilash: total ni map dan tashqarida bir marta hisoblash:
  const total = categoryData.reduce((s, c) => s + c.value, 0);
  {categoryData.map((cat, idx) => {
    const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;
    ...

---

### 10. Savings va Credit formlarda min validatsiyasi yo q

Fayl: app/dashboard/savings/page.tsx, Credit/page.tsx

Muammo: Foydalanuvchi 0 yoki manfiy son kiritsa noto ghri hisob-kitob bo ladi.

To ghrilash (input larga min atributi qo shish):
  Savings:
    <input type=number name=targetAmount required min=1 ... />
    <input type=number name=currentAmount required min=0 ... />
    <input type=number name=monthlyContribution required min=1 ... />

  Credit:
    <input type=number name=principal required min=1 ... />
    <input type=number name=annualRate required min=0.01 step=0.01 ... />
    <input type=number name=termMonths required min=1 ... />

---

### 11. app/api/chat/route.ts — onFinish xato chiqarsa xabar DB ga saqlanmaydi

Fayl: app/api/chat/route.ts, 53-63-qatorlar

Muammo: Agar onFinish ichida prisma.advisorMessage.create xato chiqarsa,
assistant javobi DB ga saqlanmaydi. Foydalanuvchi uni UI da ko radi,
lekin sahifani yangilasa xabar yo qoladi.

Tavsiya: onFinish ichiga try/catch qo shish va xatoni console.error bilan log qilish.

---

## KICHIK ESLATMALAR

---

### 12. actions.ts — supabaseUserId parametr nomi chalg ituvchi

Fayl: app/dashboard/actions.ts, 9-qator
  async function ensureUserExists(supabaseUserId: string, email: string)

Loyiha Supabase ishlatmaydi. Parametr nomini userId ga o zgartiring.

---

### 13. prisma/schema.prisma — datasource da url yo q

Fayl: prisma/schema.prisma, 5-7-qatorlar
Xato:
  datasource db {
    provider = sqlite
    // url yo q!
  }

To ghrilash:
  datasource db {
    provider = sqlite
    url      = env(DATABASE_URL)
  }

---

### 14. app/dashboard/layout.tsx — Aktiv sahifa navda ajratilmaydi

Fayl: app/dashboard/layout.tsx

Muammo: Foydalanuvchi qaysi sahifada turishini nav dan anglab bo lmaydi.

Tavsiya: usePathname() hook bilan aktiv linkni ajratish:
  import { usePathname } from next/navigation;
  const pathname = usePathname();
  className={pathname === /dashboard ? text-slate-900 font-bold : text-slate-600}

---

### 15. app/dashboard/advisor/page.tsx — import yo li nomuvofiq

Fayl: app/dashboard/advisor/page.tsx, 1-qator
  import { getServerSession } from next-auth/next;   // /next bilan

Boshqa barcha sahifalar:
  import { getServerSession } from next-auth;        // /next siz

Tavsiya: Barcha faylda bir xil import ishlatish (masalan: next-auth)

---

## XULOSA

  Kritik  : 6 ta (tuzatilishi shart)
  Muhim   : 5 ta (imkon bo lsa tuzatish kerak)
  Kichik  : 4 ta (tavsiyalar)

Eng tezkor tuzatish (birinchi navbatda):
  1. .env -> NEXTAUTH_URL=http://localhost:3000
  2. .env -> Supabase kalitlari va AUTH_SECRET ni o chirish
  3. lib/auth.ts -> Login da name ni ham qaytarish
  4. app/login/page.tsx -> searchParams ni useSearchParams() ga o tkazish
  5. app/dashboard/page.tsx -> findUnique({ where: { email } }) ishlatish
  6. prisma/schema.prisma -> url = env(DATABASE_URL) qo shish
