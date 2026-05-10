Berikut adalah isi file issue.md:

Markdown
# [Task] Implementasi Fitur Login User & Session Management

## 📝 Deskripsi
Tiket ini bertujuan untuk mengimplementasikan fitur autentikasi pengguna (Login) dan pencatatan sesi (Session Management) menggunakan framework Elysia.js. Proses ini akan memvalidasi kredensial user dan menghasilkan UUID token untuk manajemen sesi.

## 🗄️ Database Schema
Buat tabel baru dengan spesifikasi berikut:

**Tabel: `sessions`**
- `id`: Integer, Primary Key, Auto Increment
- `token`: Varchar(255), Not Null (Wajib menggunakan UUID untuk token ini)
- `user_id`: Integer, Foreign Key (mengacu ke `id` pada tabel `users`)
- `created_at`: Timestamp, Default `CURRENT_TIMESTAMP`

## 📂 Standar Struktur Direktori & File
Pekerjaan harus dilakukan di dalam direktori `src` dengan standar penamaan file menggunakan *kebab-case* dan berakhiran `-route.ts` atau `-service.ts`:
- `src/routes/`: Tempat meletakkan routing API (Contoh: `users-route.ts`)
- `src/services/`: Tempat meletakkan business logic / fungsi query (Contoh: `users-service.ts`)

---

## 🔌 API Endpoint Specification

**Endpoint:** `POST /api/users/login`

**Request Body (JSON):**
```json
{
    "email": "wahyu@localhost",
    "password": "rahasia"
}
Response Body (Success - 200 OK):

JSON
{
    "data": "token_uuid_yang_tergenerate"
}
Response Body (Error - 400/401):

JSON
{
    "error": "Email Atau password salah"
}
🛠️ Tahapan Implementasi (Step-by-Step Guide)
Ikuti tahapan berikut secara berurutan untuk menyelesaikan implementasi fitur ini:

1. Persiapan Database (Migration)
Buat skema/migrasi untuk tabel sessions sesuai dengan struktur yang diminta.

Pastikan relasi Foreign Key dari user_id di tabel sessions terhubung dengan benar ke tabel users.

Jalankan migrasi ke database.

2. Implementasi Business Logic (src/services/users-service.ts)
Buat sebuah fungsi (contoh: loginUser) yang menerima parameter email dan password.

Lakukan pengecekan ke database: cari data user di tabel users berdasarkan email.

Jika user tidak ditemukan, langsung throw error.

Jika user ditemukan, bandingkan password dari input dengan password hash yang ada di database (gunakan bcrypt atau library hash bawaan aplikasi).

Jika password tidak cocok, throw error.

Jika kredensial valid:

Generate sebuah UUID v4 baru (misalnya menggunakan crypto.randomUUID()).

Lakukan Insert data ke tabel sessions berisi token (UUID tersebut) dan user_id.

Return nilai token tersebut.

3. Implementasi Routing (src/routes/users-route.ts)
Import fungsi loginUser dari users-service.ts.

Definisikan endpoint POST menggunakan Elysia: app.post('/api/users/login', ...)

Tambahkan validasi Request Body bawaan Elysia (t.Object) untuk memastikan payload berisi email (string/email) dan password (string).

Di dalam handler, panggil fungsi loginUser dalam blok try...catch.

Penanganan Response:

Jika berhasil (try), kembalikan response sukses sesuai spesifikasi di atas dengan HTTP Status 200.

Jika gagal (catch), tangkap error dan kembalikan response JSON { "error": "Email Atau password salah" } dengan HTTP Status 401 (Unauthorized) atau 400 (Bad Request).

4. Registrasi Route Utama
Buka file entry point utama aplikasi Elysia (biasanya src/index.ts atau file setup utama).

Pastikan users-route.ts di-import dan di-daftarkan menggunakan method .use().

5. Pengujian (Testing)
Gunakan Postman, cURL, atau Swagger untuk melakukan HTTP POST request.

Lakukan uji coba menggunakan kredensial yang salah untuk memastikan response Error muncul dengan benar.

Lakukan uji coba menggunakan kredensial yang benar. Pastikan response Success memunculkan token, dan cek langsung ke dalam database apakah token dan user_id berhasil tersimpan di tabel sessions.