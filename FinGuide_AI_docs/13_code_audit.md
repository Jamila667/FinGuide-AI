# FinGuide AI — To'liq Kod Auditi
**Sana:** 2026-08-24  
**Maqsad:** Loyihadagi barcha xatolar, zaifliklar va yaxshilanishi kerak bo'lgan joylarni aniqlab chiqish. Hech narsa to'g'irlandi.

---

## 🔴 KRITIK XATOLAR

---

### XATO #1 — `next.config.mjs`: `experimental.serverComponentsExternalPackages` Next.js 14 da noto'g'ri joy
**Fayl:** `next.config.mjs` — 11-12-qatorlar

**Muammo:**
```js
experimental: {
  serverComponentsExternalPackages: ['pg', 'bcryptjs', '@prisma/adapter-pg'],
}
```
Bu kalit Next.js **14.2.35** da `experimental` ichida ham tan olinmaydi. Local build `⚠ Unrecognized key(s) in object: 'serverComponentsExternalPackages'` ogohlantirishi beradi. Bu kalit e'tiborsiz qolinadi, natijada `pg`, `bcryptjs` va adapter server tarafda to'g'ri yuklanmasligi mumkin. Vercel'da ham xuddi shunday ogohlantirish paydo bo'ladi.

---

### XATO #2 — `lib/prisma.ts`: Production muhitida har safar yangi `pg.Pool` yaratiladi (singleton yo'q)
**Fayl:** `lib/prisma.ts` — 9-12-qatorlar

**Muammo:**
```ts
if (process.env.NODE_ENV === "production") {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
}
```
Production muhitida `globalForPrisma` singleton ishlatilmaydi. Serverless funksiyalar har safar yangi ishga tushganda yangi `pool` va `PrismaClient` yaratiladi, eski ulanishlar yopilmay qoladi. Bu ma'lumotlar bazasidagi ulanish limitini (connection pool exhaustion) tezda to'ldirishi mumkin va DB ga ortiqcha yuklama beradi.

---

### XATO #3 — `lib/auth.ts`: `NEXTAUTH_SECRET` uchun xavfli fallback qiymati
**Fayl:** `lib/auth.ts` — 76-qator

**Muammo:**
```ts
secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_build_only",
```
Agar Vercel'da `NEXTAUTH_SECRET` o'rnatilmagan bo'lsa, barcha JWT tokenlar `"fallback_secret_for_build_only"` kaliti bilan imzolanadi. Bu jiddiy xavfsizlik zaifligi — ushbu kalit GitHub'da ochiq ko'rinib turadi. Har kim bu kalitni ishlatib, soxta token yaratishi va tizimga kirishi mumkin.

---

### XATO #4 — `lib/auth.ts`: Google provider bo'sh string fallback bilan sozlangan
**Fayl:** `lib/auth.ts` — 10-11-qatorlar

**Muammo:**
```ts
clientId: process.env.GOOGLE_CLIENT_ID || "",
clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
```
Muhit o'zgaruvchilari o'rnatilmagan bo'lsa, Google provider bo'sh string bilan ishga tushadi. Google login harakat qilinganda server 500 xatolik yoki OAuth xatolik beradi, lekin kod bu holat uchun hech qanday xabar ko'rsatmaydi.

---

## 🟠 MUHIM XATOLAR

---

### XATO #5 — `app/api/chat/route.ts`: `ANTHROPIC_API_KEY` mavjudligi tekshirilmaydi
**Fayl:** `app/api/chat/route.ts`

**Muammo:**
API kaliti mavjud yoki yo'qligini tekshiruvchi kod yo'q. Agar `ANTHROPIC_API_KEY` Vercel'da o'rnatilmagan bo'lsa, `streamText()` ichki xatolik bilan muvaffaqiyatsiz tugaydi, lekin frontend'ga faqat bo'sh stream qaytaradi. Foydalanuvchi faqat loading ko'radi, hech qachon aniq xatolik xabari olmaydi.

**Kerak bo'lgan tekshiruv:**
```ts
if (!process.env.ANTHROPIC_API_KEY) {
  return new Response("AI xizmat sozlanmagan", { status: 503 });
}
```

---

### XATO #6 — `app/dashboard/actions.ts`: Har bir server action da takroriy `getServerSession()` chaqiruvi
**Fayl:** `app/dashboard/actions.ts`

**Muammo:**
Har bir server action (`addIncome`, `deleteIncome`, `addExpense`, `deleteExpense`, `addSavingsGoal`, `deleteSavingsGoal`, `addCreditSimulation`, `deleteCreditSimulation`) ichida alohida `getServerSession()` chaqiriladi. Bu 8 ta alohida auth tekshiruvi demak. Har biri JWT tokenni tekshiradi — bu keraksiz ish.

---

### XATO #7 — `savings/page.tsx` va `credit/page.tsx`: Auth tekshiruvda `redirect` o'rniga `null` qaytariladi
**Fayl:** `app/dashboard/savings/page.tsx` — 11-qator  
**Fayl:** `app/dashboard/credit/page.tsx` — 10-qator

**Muammo:**
```ts
if (!user || !user.id) return null;
```
`null` qaytarilganda sahifa butunlay bo'sh ko'rinadi, foydalanuvchi nima bo'lganini tushunmaydi. Middleware ishlamay qolgan taqdirda foydalanuvchi login sahifasiga yuborilmaydi — faqat bo'sh sahifa ko'radi.

**Kerakli tuzatish:** `return null` o'rniga `redirect("/login")` ishlatish kerak.

---

### XATO #8 — `components/AddExpenseForm.tsx` va `components/AddIncomeForm.tsx`: Server tarafda validatsiya yo'q
**Fayl:** `components/AddExpenseForm.tsx`, `components/AddIncomeForm.tsx`

**Muammo:**
Formada faqat HTML `required` atributi bor — bu faqat brauzer tomonida ishlaydi. Agar kimdir API'ga to'g'ridan-to'g'ri so'rov yuborsa:
- `amount` manfiy yoki `NaN` bo'lishi mumkin
- `month` noto'g'ri format bilan kelishi mumkin
- `category` kutilmagan qiymat bo'lishi mumkin
- Bularning hech biri `actions.ts` da tekshirilmaydi

---

### XATO #9 — `app/dashboard/analytics/page.tsx`: `session.user` dan `id` olish TypeScript cast muammosi
**Fayl:** `app/dashboard/analytics/page.tsx` — 9-10-qatorlar

**Muammo:**
```ts
const user = session?.user as { id: string; email: string } | undefined;
```
NextAuth'ning standart tipida `session.user.id` mavjud emas — u `jwt` callback orqali qo'shiladi. TypeScript `as` bilan majburan cast qilinmoqda, bu kompilyatsiya vaqtida xatoni yashiradi. Agar `id` qandaydir sababdan undefined bo'lsa, DB ga so'rov `userId: undefined` bilan yuborilishi mumkin.

---

### XATO #10 — `app/dashboard/advisor/page.tsx`: Email orqali user qidirish — nomuvofiqlik
**Fayl:** `app/dashboard/advisor/page.tsx` — 14-16-qatorlar

**Muammo:**
```ts
const user = await prisma.user.findUnique({
  where: { email: session.user.email },
});
```
Bu yerda email orqali user qidirilmoqda. Boshqa sahifalarda esa `session.user.id` to'g'ridan-to'g'ri ishlatiladi (ya'ni JWT'dan `user.id` olinadi). Bu nomuvofiqlik (inconsistency) — barcha sahifalarda bir xil usul bo'lishi kerak. Bundan tashqari, bu yerda bitta ortiqcha DB so'rovi yuborilmoqda.

---

## 🟡 O'RTA DARAJALI MUAMMOLAR

---

### XATO #11 — `components/NavLinks.tsx`: Mobil menyu positioning muammosi va "click outside to close" yo'q
**Fayl:** `components/NavLinks.tsx` — 52-qator

**Muammo:**
```tsx
<div className="absolute top-16 left-0 right-0 bg-white ...">
```
1. Mobil menyu `absolute` joylashtirilgan, lekin uning ota elementi header `position: relative` emas — bu menyuni noto'g'ri joyda ko'rsatishi mumkin.
2. Menyu ochiq turgan holda sahifaning boshqa joyiga bossangiz, menyu yopilmaydi (click outside handler yo'q).

---

### XATO #12 — `app/api/chat/route.ts`: Muvaffaqiyatsiz AI javobida ham foydalanuvchi xabari DB da qoladi
**Fayl:** `app/api/chat/route.ts` — 47-54 va 30-42-qatorlar

**Muammo:**
Tartib: avval rate limit tekshiriladi → foydalanuvchi xabari DB ga saqlanadi → AI'ga so'rov yuboriladi. Agar AI so'rovi muvaffaqiyatsiz tugasa (API kalit xato, tarmoq muammosi), foydalanuvchi xabari DB da saqlanib qoladi. Keyingi so'rovda bu xabar rate limit hisobiga kiradi va foydalanuvchi real limitidan tezroq bloklanishi mumkin.

---

### XATO #13 — `app/dashboard/actions.ts`: Barcha server action'larda input validatsiya yo'q
**Fayl:** `app/dashboard/actions.ts`

**Muammo:**
- `addIncome`: `amount` NaN, Infinity yoki manfiy bo'lsa ham saqlanadi
- `addIncome`: `month` noto'g'ri format (`"noto'g'ri"`) bilan kelsa DB ga yoziladi
- `addExpense`: `amount` manfiy bo'lsa ham saqlanadi
- `addCreditSimulation`: `annualRate` manfiy, `termMonths` 0 bo'lsa ham `calculateCreditSimulation` ga uzatiladi (u o'zi tekshiradi, lekin server action darajasida ham tekshiruv bo'lishi kerak)
- Hech bir server action uchun `zod` yoki boshqa validatsiya kutubxonasi ishlatilmagan

---

### XATO #14 — `app/page.tsx`: `text-indigo-600` dizayn tizimiga mos emas
**Fayl:** `app/page.tsx` — 113-qator

**Muammo:**
```tsx
<h2 className="text-base font-semibold leading-7 text-indigo-600">Imkoniyatlar</h2>
```
Butun loyiha `slate` rang sxemasida ishlaydi. Faqat shu bitta joyda `indigo-600` rang ishlatilgan — bu dizayn nomuvofiqligidir.

---

### XATO #15 — `prisma/schema.prisma`: `Income` modelida `description` maydoni yo'q
**Fayl:** `prisma/schema.prisma`

**Muammo:**
`Expense` modelida `description` maydoni bor (`description String?`), lekin `Income` modelida yo'q. Foydalanuvchi daromad manbasini (ish haqi, freelance, ijara va h.k.) yozib qo'yolmaydi. Bu asimmetrik yondashuv (xarajatga izoh qo'shsa bo'ladi, daromadga qo'yib bo'lmaydi).

---

## 🔵 KICHIK MUAMMOLAR

---

### XATO #16 — `app/api/auth/[...nextauth]/route.ts`: `export const dynamic` import'lardan oldin yozilgan
**Fayl:** `app/api/auth/[...nextauth]/route.ts` — 1-qator

**Muammo:**
```ts
export const dynamic = "force-dynamic";
import NextAuth from "next-auth";
```
Import'lar doimo faylning eng boshida bo'lishi kerak. Bu texnik jihatdan ishlaydi, lekin kod yozish uslubiga (code style) mos emas va ba'zi linter'lar bu haqida ogohlantirishi mumkin.

---

### XATO #17 — `utils/finance.ts`: `annualRate = 0` holati noto'g'ri ishlov beradi
**Fayl:** `utils/finance.ts` — 2-qator

**Muammo:**
```ts
if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
  return { monthlyPayment: 0, totalRepayment: 0, totalInterest: 0 };
}
```
Foizsiz kredit (`annualRate = 0`) uchun `monthlyPayment = principal / termMonths` bo'lishi kerak. Lekin bu holat ham chekib qo'yilgan va `{0, 0, 0}` qaytariladi. Agar bu tekshiruv bo'lmaganida esa `r = 0` holida formula `0/0 = NaN` qaytaradi.

---

### XATO #18 — `AnalyticsCharts.tsx`: `key={idx}` — index bilan key ishlatish
**Fayl:** `app/dashboard/analytics/AnalyticsCharts.tsx` — 174-qator

**Muammo:**
```tsx
{categoryData.map((_, idx) => (
  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
))}
```
React'da `key` sifatida index ishlatish re-render paytida ulanish (reconciliation) muammolariga olib kelishi mumkin. `cat.name` bilan key ishlatish to'g'riroq bo'lar edi.

---

### XATO #19 — `app/page.tsx`: Landing page'dagi ilova mockup juda sodda
**Fayl:** `app/page.tsx` — 75-105-qatorlar

**Muammo:**
Landing page'dagi "ilova ko'rinishi" mockup faqat kulrang to'rtburchaklardan iborat. Bu professional ko'rinmaydi va foydalanuvchilar dastlab nima ekanligini tushunmaydi.

---

### XATO #20 — `@types/better-sqlite3` package.json da qolgan lekin SQLite olib tashlangan
**Fayl:** `package.json` — `devDependencies`

**Muammo:**
```json
"@types/better-sqlite3": "^9.6.0",
```
Loyiha SQLite'dan PostgreSQL'ga o'tkazildi, lekin `@types/better-sqlite3` turi hali `devDependencies` da turibdi. Bu keraksiz paket bo'lib, tozalanishi kerak.

---

## 📋 Xatolar Jadvali

| # | Joylashuv | Muammo | Darajasi |
|---|-----------|---------|----------|
| 1 | `next.config.mjs` | `experimental.serverComponentsExternalPackages` noto'g'ri kalit | 🔴 Kritik |
| 2 | `lib/prisma.ts` | Production'da singleton yo'q, har safar yangi pool yaratiladi | 🔴 Kritik |
| 3 | `lib/auth.ts` | `NEXTAUTH_SECRET` uchun xavfli fallback | 🔴 Kritik |
| 4 | `lib/auth.ts` | Google provider bo'sh string fallback | 🔴 Kritik |
| 5 | `api/chat/route.ts` | `ANTHROPIC_API_KEY` tekshirilmaydi | 🟠 Muhim |
| 6 | `dashboard/actions.ts` | Har bir action da takroriy `getServerSession()` | 🟠 Muhim |
| 7 | `savings/page.tsx`, `credit/page.tsx` | Auth yo'q bo'lsa `null` qaytariladi, `redirect` emas | 🟠 Muhim |
| 8 | `AddExpenseForm.tsx`, `AddIncomeForm.tsx` | Server tarafda input validatsiya yo'q | 🟠 Muhim |
| 9 | `analytics/page.tsx` | `session.user.id` TypeScript cast muammosi | 🟠 Muhim |
| 10 | `advisor/page.tsx` | Email orqali user qidirish — ortiqcha DB so'rov | 🟠 Muhim |
| 11 | `NavLinks.tsx` | Mobil menyu `absolute` positioning muammosi, "click outside" yo'q | 🟡 O'rta |
| 12 | `api/chat/route.ts` | Muvaffaqiyatsiz AI javobda ham xabar DB da qoladi | 🟡 O'rta |
| 13 | `actions.ts` | Barcha server action'larda input validatsiya yo'q | 🟡 O'rta |
| 14 | `app/page.tsx` | `text-indigo-600` dizayn tizimiga mos emas | 🟡 O'rta |
| 15 | `schema.prisma` | `Income` modelida `description` maydoni yo'q | 🟡 O'rta |
| 16 | `[...nextauth]/route.ts` | `export const dynamic` import'dan oldin yozilgan | 🔵 Kichik |
| 17 | `utils/finance.ts` | `annualRate = 0` holati noto'g'ri ishlov beradi | 🔵 Kichik |
| 18 | `AnalyticsCharts.tsx` | `key={idx}` — index bilan key ishlatish | 🔵 Kichik |
| 19 | `app/page.tsx` | Landing page mockup juda sodda | 🔵 Kichik |
| 20 | `package.json` | `@types/better-sqlite3` keraksiz qolgan | 🔵 Kichik |
