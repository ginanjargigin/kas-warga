# KAS GANG WARGA — JSONBin + Vercel

Aplikasi web untuk pengelolaan kas warga RT 027 dengan sistem login admin, dashboard, data warga, pembayaran kas, pengeluaran, pencarian data, dan rekap transaksi.

## URL Aplikasi

Website:

https://kas-gang-warga.vercel.app/

---

## Fitur

- Login admin
- Dashboard saldo, pemasukan, dan pengeluaran
- Data warga
- Pembayaran kas warga
- Pencatatan denda
- Pencatatan pengeluaran
- Pencarian dan penyaringan data
- Rekap transaksi
- Rekap pemasukan dan pengeluaran berdasarkan periode
- Grafik pemasukan dan pengeluaran
- Penyimpanan data menggunakan JSONBin
- API serverless menggunakan Vercel
- Access Key JSONBin disimpan di server melalui Environment Variables
- Navigasi form menggunakan tombol `Enter` untuk berpindah ke kolom berikutnya
- Dukungan navigasi form pada komputer dan perangkat mobile

---

# Arsitektur

Aplikasi menggunakan struktur:

```text
Browser
   │
   ▼
Frontend HTML / CSS / JavaScript
   │
   ▼
Vercel Serverless API
   │
   ├── Login & autentikasi
   │
   └── Akses JSONBin
            │
            ▼
        JSONBin
