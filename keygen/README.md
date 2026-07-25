# Keygen — Monster MathArena

Skrip ni jana kod lesen untuk versi Vercel (`vercel-licensed/`). Jalankan **tempatan sahaja** — jangan deploy folder ni.

## Setup (sekali sahaja)

1. Jana satu rahsia yang kuat (simpan selamat, JANGAN commit ke git):
   ```
   openssl rand -hex 32
   ```
2. Set nilai tu sebagai environment variable `MMA_LICENSE_SECRET` di **Vercel Project Settings → Environment Variables** (untuk projek `vercel-licensed/`).
3. Guna **rahsia yang sama** setiap kali nak jana kod lesen tempatan (langkah di bawah).

## Jana kod lesen

```
MMA_LICENSE_SECRET="rahsia-yang-sama-macam-vercel" node generate-key.js 10
```

`10` = bilangan kod nak jana (boleh tukar ikut keperluan). Setiap kod format:
`MMA-XXXXXXXX-XXXXXX` — sah selama-lamanya (tiada expiry/database), disahkan cuma guna checksum. Kalau nak revoke kod tertentu kelak, sistem perlu di-upgrade tambah senarai blocklist (belum ada sekarang).
