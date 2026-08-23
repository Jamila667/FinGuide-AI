# Vercel Deployment Xatoliklari — Tahlil Natijalari

> Sana: 2026-08-23
> Maqsad: Vercel ga ulanishda paydo bo'layotgan xatolarning barcha sabablari

---

## XATO #1 — KRITIK: `next.config.mjs` — Noto'g'ri kalit ishlatilmoqda

**Fayl:** `next.config.mjs`, 11—13-qatorlar

**Hozirgi noto'g'ri kod:**
```js
experimental: {
  serverComponentsExternalPackages: ['pg', 'bcryptjs', '@prisma/adapter-pg'],
},
```

**Muammo:**
Bu konfiguratsiya Next.js 14 da `experimental` ostida emas. Loyiha `next@14.2.35` ishlatmoqda.
Vercel build qilayotganda konsol `Invalid next.config.mjs options detected` ogohlantirishi beradi va bu
sozlama e'tiborga olinmaydi. Buning natijasida `pg` kutubxonasi Webpack tomonidan noto'g'ri bundle
qilinadi va `pg-native` moduli topilmaganda `/api/auth/[...nextauth]` qulab tushadi.

**To'g'ri bo'lishi kerak (Next.js 14):**
```js
serverComponentsExternalPackages: ['pg', 'bcryptjs', '@prisma/adapter-pg'],
```

---

## XATO #2 — KRITIK: `lib/prisma.ts` — `pg.Pool` modul yuklangandayoq yaratilmoqda

**Fayl:** `lib/prisma.ts`, 7—8-qatorlar

**Hozirgi kod:**
```ts
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
```

**Muammo:**
Bu qatorlar faylning boshida — modul yuklangandayoq bajariladi. Vercel `next build` jarayonida
sahifalar tahlil qilinayotganda bu modulni import qiladi. O'sha paytda `DATABASE_URL` build muhitida
mavjud bo'lmasligi mumkin (faqat Runtime da mavjud). Natijada `pg.Pool` xato beradi yoki bo'sh
connection bilan ishga tushib, `/api/auth/[...nextauth]` dan ma'lumot yig'ish bosqichida (page
data collection) "Failed to collect page data" xatosiga sabab bo'ladi.

**To'g'ri yondashuv:** `pg.Pool` ni faqat so'rov kelganda (lazy) yaratish — funksiya ichida yoki
`DATABASE_URL` mavjudligi tekshirilgandan so'ng yaratish kerak.

---

## XATO #3 — MUHIM: `package.json` — `prisma` CLI `devDependencies` da turibdi

**Fayl:** `package.json`

**Hozirgi kod:**
```json
"scripts": {
  "postinstall": "prisma generate"
},
"devDependencies": {
  "prisma": "^7.9.1"
}
```

**Muammo:**
Vercel production build qilayotganda dev paketlarini o'rnatmasligi mumkin (`--omit=dev`).
Bu holda `prisma` CLI mavjud bo'lmaydi va `postinstall` skripti ishlamaydi.
Natijada Prisma Client generate qilinmaydi va barcha database so'rovlari xato beradi.

**To'g'rilash:** `prisma` paketini `devDependencies` dan `dependencies` ga ko'chirish kerak:
```json
"dependencies": {
  "prisma": "^7.9.1",
  ...
}
```

---

## XATO #4 — MUHIM: Google OAuth Vercel domeniga sozlanmagan (tashqi tizim)

**Fayl:** Google Cloud Console

**Muammo:**
`GOOGLE_CLIENT_ID` va `GOOGLE_CLIENT_SECRET` hozirda faqat `http://localhost:3000` domeniga
ruxsat beradi. Vercel loyihaga yangi domen beradi (masalan: `finguide-ai.vercel.app`).
Bu domen Google Cloud Console da ro'yxatdan o'tkazilmasa, Google bilan login qilish butunlay
ishlamaydi — foydalanuvchi `redirect_uri_mismatch` xatosini ko'radi.

**Google Cloud Console da qo'shish kerak bo'lgan manzillar:**
1. Authorized JavaScript origins: `https://[vercel-domen].vercel.app`
2. Authorized redirect URIs: `https://[vercel-domen].vercel.app/api/auth/callback/google`

---

## XATO #5 — O'RTA: `NEXTAUTH_URL` Vercel domeniga mos emas

**Fayl:** Vercel > Settings > Environment Variables

**Muammo:**
Agar `NEXTAUTH_URL=http://localhost:3000` deb kiritilgan bo'lsa, NextAuth production da barcha
auth redirect va callback URL larini `localhost:3000` ga qaratadi. Bu Google login'ni butunlay
buzib, credentials login da ham kutilmagan xatolarga olib keladi.

**To'g'ri qiymat:**
```
NEXTAUTH_URL=https://[vercel-domen].vercel.app
```

---

## XATO #6 — KICHIK: `test-pg.js` fayli GitHub da saqlanib qolgan

**Fayl:** `test-pg.js` (root papkada)

**Muammo:**
Test uchun vaqtinchalik yaratilgan `test-pg.js` fayli commit qilinib GitHub'ga yuborilgan.
Bu fayl `require('pg')` (CommonJS) sintaksisini ishlatadi va loyiha ESM konfiguratsiyasida
kutilmagan xatolarga sabab bo'lishi mumkin. Loyihada bo'lmasligi kerak.

---

## XULOSA — Ustuvorlik tartibi

| # | Xato | Jiddiylik | Asosiy oqibat |
|---|------|-----------|----------------|
| 1 | `next.config.mjs` noto'g'ri kalit | KRITIK | Build jarayonida `pg` to'g'ri konfiguratsiya qilinmaydi |
| 2 | `pg.Pool` module-level yaratilmoqda | KRITIK | Build vaqtida DB ulanishga urinadi, crash beradi |
| 3 | `prisma` devDependencies da | MUHIM | Production build da `prisma generate` ishlamaydi |
| 4 | Google OAuth domen sozlanmagan | MUHIM | Google login ishlamaydi |
| 5 | `NEXTAUTH_URL` noto'g'ri | O'RTA | Auth redirect xatolari |
| 6 | `test-pg.js` GitHub da qolgan | KICHIK | Keraksiz fayl, potensial muammo |
 
