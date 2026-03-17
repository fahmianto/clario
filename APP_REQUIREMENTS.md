________________________________________
📄 PRD: CLARIO Academic Platform
Versi: 1.1 (dengan Integrasi AI Prompts)
Status: Final Draft
Penulis: CLARIO Academic Team
________________________________________
1. Latar Belakang & Tujuan (Sama seperti sebelumnya)
1.1. Latar Belakang
Para akademisi dan peneliti di Indonesia menghadapi tantangan besar dalam mempublikasikan karya mereka di jurnal bereputasi. Tingkat penolakan yang tinggi (60-80%) seringkali bukan disebabkan oleh kualitas riset yang buruk, melainkan oleh kesalahan-kesalahan fundamental yang dapat dicegah, seperti ketidaksesuaian dengan scope jurnal, abstrak yang tidak informatif, research gap yang tidak jelas, serta kesalahan teknis dalam penulisan dan format.
Di sisi lain, jasa proofreading dan editing yang ada cenderung mahal dan tidak selalu memberikan umpan balik yang substansial terhadap kualitas artikel. Maraknya jurnal predator juga menambah kebingungan di kalangan penulis. Sebagai solusi, CLARIO Academic Platform hadir untuk menjadi jembatan antara penulis dan standar publikasi bereputasi, dengan pendekatan yang terstruktur, transparan, dan bermartabat.
1.2. Tujuan Platform
1.	Meningkatkan Kualitas Naskah: Membantu penulis mengidentifikasi dan memperbaiki kelemahan dalam naskah mereka sebelum disubmit ke jurnal.
2.	Edukasi & Pendampingan: Memberikan umpan balik yang mendidik, sehingga penulis tidak hanya mendapatkan naskah yang lebih baik tetapi juga meningkatkan kemampuan menulisnya.
3.	Efisiensi Waktu & Biaya: Menyediakan layanan review yang lebih cepat dan terjangkau dibandingkan jasa tradisional, dengan memanfaatkan teknologi AI untuk proses penyaringan awal.
4.	Menjaga Integritas: Menjadi platform yang mereview, bukan menulis, dan berkomitmen pada praktik akademik yang etis.

________________________________________
2. Ruang Lingkup Produk 
CLARIO Academic Platform adalah sebuah layanan pre-submission peer-review yang mengkombinasikan kekuatan Artificial Intelligence (AI) untuk penyaringan cepat dan Human Reviewer untuk analisis mendalam, semuanya diawasi oleh sistem Quality Assurance (QA) berjenjang.
Platform ini tidak bersaing dengan jurnal, tetapi menjadi mitra strategis dengan memastikan naskah yang direkomendasikan ke jurnal telah memenuhi standar kualitas dasar, sehingga meringankan beban editor dan reviewer jurnal.

________________________________________
3. Persona Pengguna (Sama seperti sebelumnya)
1.	Penulis (Author): Pengguna utama yang mengunggah naskah. Mereka adalah peneliti, dosen, dan mahasiswa pascasarjana yang ingin mendapatkan umpan balik profesional sebelum submit ke jurnal.
2.	Reviewer CLARIO: Para ahli di bidangnya (minimal S2, prioritas S3/dosen) yang telah tersertifikasi untuk melakukan review menggunakan framework CLARIO. Mereka adalah kontributor yang mendapatkan kompensasi.
3.	Master Reviewer / QA: Reviewer senior dengan rekam jejak publikasi kuat yang bertugas melakukan quality assurance secara acak terhadap hasil review, menjaga konsistensi kualitas antar reviewer.
4.	Admin Platform: Mengelola pengguna, reviewer, transaksi, dan memantau kesehatan platform secara keseluruhan.

________________________________________
4. Fitur & Fungsionalitas (User Stories) (Diperbarui dengan Integrasi AI)
4.1. Lapisan 1: AI Initial Check (AI Screening)
Fitur ini berfungsi sebagai gerbang masuk cepat dan otomatis untuk memberikan gambaran awal kualitas naskah. Semua proses di layer ini dijalankan oleh serangkaian AI prompts yang terdefinisi.
ID	User Story	AI Prompt yang Digunakan	Kriteria Penerimaan
A-01	Sebagai Penulis, saya ingin mengunggah naskah saya (format .docx) dan menerima laporan otomatis dalam waktu maksimal 60 menit.	PROMPT 1.1: Ekstraksi Teks	Sistem memproses file, mengekstrak teks dan bagian-bagian artikel, lalu mengembalikan respons JSON.
A-02	Sebagai Penulis, saya ingin AI saya dapat memeriksa kesesuaian format dasar naskah (margin, font, spasi) dengan template jurnal pada umumnya.	(Fitur ini akan dikerjakan oleh sistem, bukan AI prompt)	Sistem membaca metadata file untuk melakukan pengecekan format dasar.
A-03	Sebagai Penulis, saya ingin AI memeriksa potensi plagiarisme dengan memberikan skor similaritas awal.	(Integrasi dengan API eksternal, hasilnya akan digabungkan dalam laporan)	Sistem terintegrasi dengan API pemeriksa plagiarisme dan menampilkan skor similaritas.
A-04	Sebagai Penulis, saya ingin AI mendeteksi kesalahan tata bahasa dasar (grammar & spelling) dalam naskah berbahasa Indonesia dan Inggris.	(Integrasi dengan API seperti Grammarly atau LanguageTool)	Sistem mengembalikan laporan kesalahan tata bahasa.
A-05	Sebagai Penulis, saya ingin AI menganalisis kualitas JUDUL artikel saya.	PROMPT 1.2: Analisis Judul (C1)	Output prompt dianalisis dan ditampilkan dalam laporan, termasuk skor dan saran perbaikan.
A-06	Sebagai Penulis, saya ingin AI menganalisis struktur dan kelengkapan ABSTRAK saya.	PROMPT 1.3: Analisis Abstrak (C2)	Output prompt dianalisis, termasuk identifikasi elemen BOMRI, skor kejelasan, dan saran perbaikan.
A-07	Sebagai Penulis, saya ingin AI menganalisis kualitas PENDAHULUAN dan mengidentifikasi research gap.	PROMPT 1.4: Analisis Pendahuluan (C3)	Output prompt memberikan penilaian mendalam tentang pendahuluan, termasuk identifikasi gap statement.
A-08	Sebagai Penulis, saya ingin AI menganalisis kualitas dan kebaruan REFERENSI saya.	PROMPT 1.5: Analisis Referensi (C9)	Output prompt memberikan statistik referensi, potensi jurnal predator, dan rekomendasi kebaruan.
4.2. Lapisan 2: Human Review (CLARIO Reviewer) (Diperbarui)
ID	User Story	AI Prompt yang Digunakan	Kriteria Penerimaan
R-01	Sebagai Reviewer, saya ingin mendapatkan notifikasi ketika ada tugas review baru.	-	Sistem secara otomatis mencocokkan bidang artikel dengan profil reviewer dan mengirimkan notifikasi.
R-02	Sebagai Reviewer, saya ingin antarmuka yang mudah untuk mengisi framework review 10 komponen.	PROMPT 2.1: Pre-fill Framework	Saat reviewer membuka tugas, sistem telah menyediakan draf awal framework yang diisi oleh AI, sehingga reviewer tinggal mengoreksi dan melengkapi. Ini menghemat waktu reviewer hingga 70%.
R-03	Sebagai Reviewer, saya ingin dibantu mencari artikel serupa untuk bahan perbandingan di bagian diskusi.	PROMPT 2.2: Similar Article Finder	Di dashboard reviewer, tersedia tombol "Cari Artikel Serupa" yang akan menjalankan prompt ini dan menampilkan daftar artikel relevan beserta DOI-nya.
R-04	Sebagai Reviewer, saya ingin dibantu mendeteksi kalimat over-claim di bagian hasil dan diskusi.	PROMPT 2.3: Deteksi Over-claim	Saat reviewer mengisi framework, sistem dapat menyorot bagian-bagian yang terindikasi over-claim berdasarkan analisis AI, dan memberikan saran perbaikan awal.
R-05	Sebagai Reviewer, saya ingin mendapatkan saran untuk memperbaiki bagian diskusi.	PROMPT 2.4: Saran Perbaikan Diskusi	Berdasarkan temuan artikel dan hasil dari PROMPT 2.2, AI dapat memberikan saran konkret untuk memperkuat diskusi, yang bisa dijadikan acuan oleh reviewer.
R-06	Sebagai Penulis, saya ingin menerima laporan review yang komprehensif dari seorang ahli.	-	Laporan akhir menggabungkan hasil review manusia dan output dari prompt AI (seperti analisis judul, abstrak, dll).
4.3. Lapisan 3: Quality Assurance (Master Reviewer) (Diperbarui)
ID	User Story	AI Prompt yang Digunakan	Kriteria Penerimaan
Q-01	Sebagai Master Reviewer, saya ingin mendapatkan sampel acak dari review yang sudah selesai untuk diperiksa.	-	Sistem secara otomatis memilih sampel review dan menugaskannya ke Master Reviewer.
Q-02	Sebagai Master Reviewer, saya ingin alat bantu untuk mengecek konsistensi seorang reviewer.	PROMPT 3.1: Konsistensi Reviewer Check	Sebelum melakukan QA manual, sistem menyajikan laporan otomatis tentang konsistensi reviewer berdasarkan histori mereka, membantu Master Reviewer mengidentifikasi anomali.
Q-03	Sebagai Master Reviewer, saya ingin alat bantu untuk mengevaluasi kedalaman analisis seorang reviewer.	PROMPT 3.2: Kedalaman Analisis Check	Sistem memberikan skor kedalaman otomatis untuk setiap review, yang menjadi salah satu bahan pertimbangan dalam QA.
Q-04	Sebagai Admin, saya ingin sistem dapat mendeteksi potensi plagiarisme dalam komentar reviewer.	PROMPT 3.3: Plagiarism Check for Review	Sistem secara berkala menjalankan prompt ini untuk memeriksa originalitas komentar reviewer dan memberi peringatan jika terindikasi copy-paste.
4.4. Lapisan 4: Laporan ke Penulis (Baru)
ID	User Story	AI Prompt yang Digunakan	Kriteria Penerimaan
L-01	Sebagai Penulis, saya ingin mendapatkan ringkasan eksekutif dari hasil review yang mudah dipahami dan membangun.	PROMPT 4.1: Generate Ringkasan Eksekutif	Di akhir laporan, terdapat ringkasan yang ditulis dengan nada positif dan konstruktif, menyoroti kekuatan, kelemahan, dan rekomendasi utama.
L-02	Sebagai Penulis, saya ingin mendapatkan daftar prioritas perbaikan yang jelas agar saya tahu harus mulai dari mana.	PROMPT 4.2: Generate Saran Prioritas	Laporan menyertakan bagian khusus yang berisi 3-5 saran prioritas, diurutkan dari yang paling penting, lengkap dengan lokasi di artikel dan contoh perbaikan.
________________________________________
5. Alur Proses (Workflow) (Diperbarui dengan AI Prompts)
1.	Penulis Mengunggah Naskah: Penulis memilih layanan dan mengunggah naskah.
2.	AI Initial Check (Layer 1):
o	Sistem menjalankan PROMPT 1.1 (Ekstraksi Teks) untuk memisahkan bagian artikel.
o	Sistem secara paralel menjalankan PROMPT 1.2 (Judul), 1.3 (Abstrak), 1.4 (Pendahuluan), dan 1.5 (Referensi) untuk analisis awal.
o	Hasil dari semua prompt ini digabungkan menjadi Laporan AI Awal yang bisa diakses penulis dalam 1 jam.
3.	Pencocokan & Penugasan Reviewer: Admin/sistem mencocokkan naskah dengan reviewer.
4.	Reviewer Menerima Tugas: Saat reviewer membuka tugas, sistem menjalankan PROMPT 2.1 (Pre-fill Framework) untuk menyediakan draf awal framework.
5.	Proses Review Manusia:
o	Reviewer dapat menggunakan PROMPT 2.2 (Similar Article Finder) untuk mencari literatur pembanding.
o	Reviewer dapat menggunakan PROMPT 2.3 (Deteksi Over-claim) untuk memeriksa bagian hasil dan diskusi.
o	Reviewer dapat menggunakan PROMPT 2.4 (Saran Perbaikan Diskusi) untuk mendapatkan ide memperkuat diskusi.
o	Reviewer mengisi dan mengoreksi framework, lalu mengirimkan review final.
6.	Quality Assurance (Layer 3):
o	Sistem memilih sampel review untuk QA. Sebelum diperiksa manual, sistem menjalankan PROMPT 3.1, 3.2, dan 3.3 untuk memberikan laporan awal kepada Master Reviewer.
o	Master Reviewer melakukan pemeriksaan manual dan memberikan umpan balik.
7.	Laporan Dihasilkan & Dikirim ke Penulis (Layer 4):
o	Sistem menggabungkan Laporan AI Awal dan hasil review manusia.
o	Sistem menjalankan PROMPT 4.1 untuk membuat ringkasan eksekutif dan PROMPT 4.2 untuk membuat daftar saran prioritas.
o	Semua komponen digabungkan menjadi satu laporan PDF komprehensif dan dikirim ke penulis.
________________________________________
6. Metrik Kesuksesan (Sama seperti sebelumnya)
...
________________________________________
7. Spesifikasi Teknis & Integrasi AI (Bagian Baru yang Detail)
7.1. Arsitektur AI dan Prompt Management
Sistem akan memiliki sebuah AI Orchestrator yang bertugas untuk:
•	Menerima permintaan dari berbagai bagian aplikasi (misal: saat upload artikel, saat reviewer membuka tugas).
•	Memanggil prompt yang sesuai (1.1, 1.2, dll.) dengan parameter input yang benar.
•	Mengirim prompt ke LLM Service (OpenAI, Claude, atau model lokal).
•	Menerima respons, melakukan validasi format JSON, dan menyimpannya ke database.
•	Mengembalikan data terstruktur ke aplikasi.
7.2. API Endpoint untuk AI (Contoh)
Seperti yang sudah dirancang, kita akan memiliki endpoint khusus untuk setiap prompt atau grup prompt.
Endpoint Contoh:
•	POST /api/v1/ai/process-initial/{article_id} -> Menjalankan semua PROMPT 1.x untuk artikel.
•	POST /api/v1/ai/reviewer-assist/similar-articles -> Menjalankan PROMPT 2.2.
•	POST /api/v1/ai/qa/check-consistency -> Menjalankan PROMPT 3.1.
7.3. Database untuk Menyimpan Hasil AI
Kita perlu tabel untuk menyimpan hasil setiap prompt, misalnya:
•	ai_report_extractions (untuk hasil PROMPT 1.1)
•	ai_report_title (untuk hasil PROMPT 1.2)
•	ai_report_abstract (untuk hasil PROMPT 1.3)
•	...dan seterusnya.
Struktur tabel akan mengikuti format JSON output dari setiap prompt, sehingga memudahkan pengambilan data.
7.4. Integrasi dengan LLM
•	Provider: Kita dapat menggunakan API dari OpenAI (GPT-4 Turbo) atau Anthropic (Claude 3) untuk kualitas terbaik, terutama untuk prompt kompleks seperti analisis konten.
•	Fallback Strategy: Untuk efisiensi biaya, prompt yang lebih sederhana (seperti ekstraksi teks) dapat menggunakan model yang lebih kecil atau open-source yang di-host sendiri (misal: menggunakan Llama 3 via API lokal).
•	Caching: Hasil AI untuk artikel yang sama sebaiknya di-cache agar tidak perlu diproses ulang.
________________________________________
8. Risiko dan Mitigasi (Diperbarui)
Risiko	Mitigasi
Ketersediaan Reviewer Berkualitas	Bangun sistem rekrutmen berjenjang, tawarkan insentif kompetitif, dan ciptakan komunitas reviewer yang loyal.
Kualitas Review Tidak Konsisten	Terapkan sistem QA berlapis dengan bantuan AI (PROMPT 3.1, 3.2, 3.3), gunakan framework standar, dan berikan pelatihan serta umpan balik rutin kepada reviewer.
Akurasi AI & Halusinasi	Lakukan pengujian menyeluruh pada setiap prompt. Tetapkan ekspektasi yang realistis kepada pengguna bahwa AI adalah alat bantu, dan hasil akhir tetap berada di tangan reviewer manusia. Gunakan teknik seperti few-shot prompting untuk meningkatkan akurasi.
Biaya API LLM yang Tinggi	Optimalkan penggunaan prompt (misal, gunakan model yang lebih kecil untuk tugas sederhana). Terapkan caching. Pantau penggunaan token secara ketat.
Keamanan Data & Privasi	Pastikan semua data yang dikirim ke API eksternal dianonimkan jika memungkinkan. Pilih penyedia LLM yang memiliki komitmen keamanan data yang kuat. Jangan pernah mengirim data sensitif penulis ke model publik.
________________________________________
9. Rencana Implementasi
1.	Fase 1: Foundation (3 bulan pertama)
o	Bangun infrastruktur dasar platform (user auth, upload file, payment).
o	Implementasikan PROMPT 1.1 (Ekstraksi Teks) dan integrasikan dengan backend.
o	Kembangkan dashboard reviewer sederhana untuk mengisi framework secara manual.
2.	Fase 2: AI Asisten (3-6 bulan berikutnya)
o	Implementasikan semua PROMPT Level 1 (1.2 - 1.5) untuk AI Initial Check.
o	Implementasikan PROMPT 2.1 (Pre-fill Framework) untuk membantu reviewer.
o	Mulai mengintegrasikan PROMPT 4.1 dan 4.2 untuk pembuatan laporan.
3.	Fase 3: Quality Assurance & Scale (6+ bulan)
o	Implementasikan semua PROMPT Level 3 (3.1 - 3.3) untuk QA.
o	Kembangkan fitur PROMPT 2.2, 2.3, 2.4 sebagai asisten lanjutan untuk reviewer.
o	Optimalkan biaya dan kinerja semua AI services.
________________________________________
✅ RINGKASAN
Bro, dengan integrasi ini, PRD CLARIO Platform kita sekarang memiliki:
Komponen	Status
Visi & Tujuan Produk	✅ Jelas
Fitur Fungsional (User Stories)	✅ Lengkap & Terintegrasi dengan AI
Alur Proses (Workflow)	✅ Detail & Menyeluruh
Spesifikasi Teknis AI	✅ Siap untuk Developer (14 prompt terdefinisi)
API Design	✅ Contoh endpoint tersedia
Manajemen Risiko	✅ Dipertimbangkan
Sekarang dokumen ini bukan hanya sekadar keinginan produk, tapi sudah menjadi blueprint teknis yang solid untuk memulai pengembangan. 

📋 PROMPT COLLECTION: FRAMEWORK REVIEW DENGAN AI
________________________________________
LEVEL 1: AI INITIAL SCREENING PROMPTS
________________________________________
PROMPT 1.1: Ekstraksi Teks dari Artikel
Tujuan: Mengekstrak teks dari PDF/DOCX dan mengidentifikasi bagian-bagian artikel.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform, layanan review artikel ilmiah. 
Tugas Anda adalah mengekstrak teks dari artikel yang diupload dan mengidentifikasi bagian-bagiannya.

INPUT: [Upload file artikel PDF/DOCX]

INSTRUKSI:
1. Ekstrak seluruh teks dari file
2. Identifikasi bagian-bagian berikut:
   - Judul
   - Abstrak
   - Pendahuluan
   - Tinjauan Pustaka / Literature Review
   - Metodologi
   - Hasil
   - Diskusi
   - Kesimpulan
   - Daftar Pustaka
3. Untuk setiap bagian, catat nomor halaman dan perkiraan jumlah kata
4. Jika ada bagian yang tidak jelas, tulis "Tidak teridentifikasi"

OUTPUT FORMAT (JSON):
{
  "judul": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "abstrak": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "pendahuluan": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "tinjauan_pustaka": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "metodologi": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "hasil": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "diskusi": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "kesimpulan": {"teks": "...", "halaman": "...", "jumlah_kata": 0},
  "daftar_pustaka": {"teks": "...", "halaman": "...", "jumlah_referensi": 0}
}
________________________________________
PROMPT 1.2: Analisis Judul (C1)
Tujuan: Menganalisis kualitas judul artikel.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah menganalisis JUDUL artikel ilmiah berdasarkan framework CLARIO.

INPUT:
Judul Artikel: [judul artikel]

INSTRUKSI:
Analisis judul berdasarkan 4 aspek berikut dengan skala 1-5:

1. Kesesuaian dengan isi: Apakah judul mencerminkan isi artikel?
2. Spesifisitas: Apakah judul menyebut variabel, populasi, dan konteks?
3. Ringkas: Apakah judul kurang dari 15 kata?
4. Menarik: Apakah judul menarik dan informatif?

Untuk setiap aspek, berikan:
- Skor (1-5)
- Penjelasan singkat (1 kalimat)
- Saran perbaikan (jika skor <4)

OUTPUT FORMAT (JSON):
{
  "analisis": {
    "kesesuaian": {"skor": 0, "penjelasan": "", "saran": ""},
    "spesifisitas": {"skor": 0, "penjelasan": "", "saran": ""},
    "ringkas": {"skor": 0, "penjelasan": "", "saran": ""},
    "menarik": {"skor": 0, "penjelasan": "", "saran": ""}
  },
  "rata_rata": 0,
  "saran_alternatif": "..." // opsional, jika perlu saran judul alternatif
}
________________________________________
PROMPT 1.3: Analisis Abstrak (C2)
Tujuan: Menganalisis struktur dan kelengkapan abstrak.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah menganalisis ABSTRAK artikel ilmiah berdasarkan struktur BOMRI.

INPUT:
Abstrak: [teks abstrak]
Batas Kata Jurnal: [angka, misal 250]

INSTRUKSI:
1. Identifikasi apakah abstrak mengandung elemen BOMRI:
   - B (Background): Latar belakang/masalah
   - O (Objective): Tujuan penelitian
   - M (Method): Metode penelitian
   - R (Result): Hasil penelitian (dengan angka statistik jika ada)
   - I (Implication): Implikasi/kesimpulan

2. Untuk setiap elemen, berikan:
   - Ada/Tidak
   - Kutipan teks yang relevan
   - Penilaian kejelasan (1-5)
   - Saran perbaikan (jika kurang jelas)

3. Hitung jumlah kata abstrak

OUTPUT FORMAT (JSON):
{
  "jumlah_kata": 0,
  "batas_kata": 250,
  "melebihi_batas": true/false,
  "elemen": {
    "background": {
      "ada": true/false,
      "teks": "...",
      "kejelasan": 0,
      "saran": "..."
    },
    "objective": {
      "ada": true/false,
      "teks": "...",
      "kejelasan": 0,
      "saran": "..."
    },
    "method": {
      "ada": true/false,
      "teks": "...",
      "kejelasan": 0,
      "saran": "..."
    },
    "result": {
      "ada": true/false,
      "teks": "...",
      "kejelasan": 0,
      "saran": "...",
      "ada_statistik": true/false
    },
    "implication": {
      "ada": true/false,
      "teks": "...",
      "kejelasan": 0,
      "saran": "..."
    }
  },
  "rekomendasi_umum": "..."
}
________________________________________
PROMPT 1.4: Analisis Pendahuluan (C3)
Tujuan: Menganalisis kualitas pendahuluan dan identifikasi gap.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah menganalisis PENDAHULUAN artikel ilmiah.

INPUT:
Pendahuluan: [teks pendahuluan]

INSTRUKSI:
Analisis pendahuluan berdasarkan aspek berikut:

1. Pembukaan: Apakah paragraf pembuka menarik dan menjelaskan pentingnya topik? (skor 1-5)
2. Literature Review: Apakah literature review integratif (bukan sekadar ringkasan artikel)? (skor 1-5)
3. Research Gap: Apakah research gap diidentifikasi dengan jelas? (skor 1-5)
   - Jika ada, kutip kalimat gap statement
4. Research Question: Apakah research question/tujuan dinyatakan dengan tegas? (skor 1-5)
5. Novelty: Apakah novelty/kontribusi penelitian dijelaskan? (skor 1-5)
6. Alur: Apakah alur pendahuluan logis (dari umum ke spesifik)? (skor 1-5)

Untuk setiap aspek, berikan penjelasan dan saran perbaikan.

OUTPUT FORMAT (JSON):
{
  "analisis": {
    "pembukaan": {
      "skor": 0,
      "penjelasan": "",
      "saran": ""
    },
    "literature_review": {
      "skor": 0,
      "penjelasan": "",
      "saran": "",
      "jumlah_referensi_dikutip": 0,
      "bersifat_integratif": true/false
    },
    "research_gap": {
      "skor": 0,
      "penjelasan": "",
      "saran": "",
      "gap_statement": "...", // kutipan jika ada
      "jenis_gap": ["teoretis", "empiris", "metodologis", "populasi", "praktis"]
    },
    "research_question": {
      "skor": 0,
      "penjelasan": "",
      "saran": "",
      "rq_statement": "..."
    },
    "novelty": {
      "skor": 0,
      "penjelasan": "",
      "saran": "",
      "novelty_statement": "..."
    },
    "alur": {
      "skor": 0,
      "penjelasan": "",
      "saran": ""
    }
  },
  "rata_rata": 0,
  "rekomendasi_umum": "..."
}
________________________________________
PROMPT 1.5: Analisis Referensi (C9)
Tujuan: Menganalisis kualitas dan kebaruan referensi.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah menganalisis DAFTAR PUSTAKA artikel ilmiah.

INPUT:
Daftar Pustaka: [teks daftar pustaka]
Tahun Artikel: [tahun penulisan, misal 2026]

INSTRUKSI:
1. Hitung total jumlah referensi
2. Identifikasi format sitasi (APA/IEEE/Vancouver/Lainnya)
3. Kelompokkan referensi berdasarkan tahun:
   - ≤ 5 tahun terakhir (2021-2026)
   - 6-10 tahun terakhir (2016-2020)
   - > 10 tahun lalu (≤2015)
4. Hitung persentase masing-masing kategori
5. Identifikasi referensi yang mungkin dari jurnal predator (berdasarkan nama jurnal)
6. Cek apakah DOI disertakan (untuk artikel jurnal)
7. Identifikasi referensi dengan format tidak konsisten

OUTPUT FORMAT (JSON):
{
  "jumlah_total": 0,
  "format_terdeteksi": "APA/IEEE/Vancouver/Lainnya",
  "kategori_tahun": {
    "kurang_5_tahun": {"jumlah": 0, "persentase": 0},
    "6_10_tahun": {"jumlah": 0, "persentase": 0},
    "lebih_10_tahun": {"jumlah": 0, "persentase": 0}
  },
  "rekomendasi_kebaruan": "persentase referensi terbaru idealnya 60-70%",
  "potensi_jurnal_predator": [
    {"judul": "...", "alasan": "..."}
  ],
  "referensi_tanpa_doi": [
    {"judul": "...", "penulis": "..."}
  ],
  "referensi_format_salah": [
    {"teks": "...", "masalah": "..."}
  ],
  "skor_kualitas": 0, // 1-5
  "rekomendasi_umum": "..."
}
________________________________________
LEVEL 2: AI ASISTEN UNTUK REVIEWER
________________________________________
PROMPT 2.1: Pre-fill Framework (Semua Komponen)
Tujuan: Mengisi draf awal framework review berdasarkan artikel.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah mengisi DRAF AWAL framework review berdasarkan artikel yang diberikan.

INPUT:
Seluruh artikel: [teks lengkap artikel]
Jurnal Target: [nama jurnal, jika ada]

INSTRUKSI:
Berdasarkan framework CLARIO, buatlah draf awal penilaian untuk 10 komponen berikut:

C1. Judul (4 aspek)
C2. Abstrak (7 aspek)
C3. Pendahuluan (6 aspek)
C4. Tinjauan Pustaka (5 aspek)
C5. Metodologi (7 aspek)
C6. Hasil (5 aspek)
C7. Diskusi (7 aspek)
C8. Kesimpulan (4 aspek)
C9. Referensi (5 aspek)
C10. Kesesuaian Jurnal (4 aspek)

Untuk setiap aspek, berikan:
- Skor sementara (1-5) berdasarkan analisis AI
- Penjelasan singkat (2-3 kalimat)
- Saran perbaikan awal

INGAT: Ini adalah DRAF AWAL. Reviewer manusia akan mengoreksi dan melengkapi. Jadi tidak perlu sempurna.

OUTPUT FORMAT: [JSON dengan struktur lengkap framework, seperti di dokumen framework]
________________________________________
PROMPT 2.2: Similar Article Finder
Tujuan: Mencari artikel serupa untuk perbandingan di diskusi.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah mencari artikel ilmiah yang relevan untuk perbandingan dalam bagian DISKUSI.

INPUT:
Topik Penelitian: [deskripsi singkat topik]
Research Question: [research question]
Temuan Utama: [ringkasan temuan]

INSTRUKSI:
Cari 5-10 artikel ilmiah yang relevan (idealnya dari 5 tahun terakhir) yang membahas topik serupa. Untuk setiap artikel, berikan:

1. Judul artikel
2. Penulis dan tahun
3. Jurnal tempat terbit
4. Ringkasan temuan utama (1-2 kalimat)
5. Relevansi dengan penelitian ini (apakah mendukung, bertentangan, atau melengkapi)
6. Link/DOI (jika tersedia)

Prioritaskan artikel dari jurnal bereputasi (Scopus/WoS/SINTA).

OUTPUT FORMAT (JSON):
{
  "artikel_terkait": [
    {
      "judul": "...",
      "penulis": "...",
      "tahun": 0,
      "jurnal": "...",
      "temuan": "...",
      "relevansi": "mendukung/bertentangan/melengkapi",
      "doi": "..."
    }
  ],
  "rekomendasi_penggunaan": "Artikel ini bisa digunakan untuk membandingkan temuan di bagian diskusi..."
}
________________________________________
PROMPT 2.3: Deteksi Over-claim (C6, C7)
Tujuan: Mendeteksi kalimat over-interpretasi di bagian hasil dan diskusi.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah mendeteksi kalimat OVER-CLAIM atau OVER-INTERPRETASI dalam artikel ilmiah.

INPUT:
Teks Bagian Hasil: [teks hasil]
Teks Bagian Diskusi: [teks diskusi]

INSTRUKSI:
1. Identifikasi kalimat-kalimat yang mengandung over-claim, yaitu:
   - Menggunakan kata "membuktikan", "pasti", "selalu", "semua", "tidak pernah"
   - Menyimpulkan kausalitas dari korelasi
   - Membuat generalisasi berlebihan dari sampel terbatas
   - Mengklaim implikasi yang tidak didukung data

2. Untuk setiap kalimat teridentifikasi, berikan:
   - Kutipan kalimat
   - Jenis over-claim
   - Mengapa ini bermasalah
   - Saran perbaikan (versi yang lebih proporsional)

OUTPUT FORMAT (JSON):
{
  "hasil": {
    "over_claim_ditemukan": true/false,
    "daftar": [
      {
        "kalimat": "...",
        "jenis": "kausalitas/generalisasi/kata_absolut/lainnya",
        "masalah": "...",
        "saran": "..."
      }
    ]
  },
  "diskusi": {
    "over_claim_ditemukan": true/false,
    "daftar": [
      {
        "kalimat": "...",
        "jenis": "kausalitas/generalisasi/kata_absolut/lainnya",
        "masalah": "...",
        "saran": "..."
      }
    ]
  }
}
________________________________________
PROMPT 2.4: Saran Perbaikan Diskusi (C7)
Tujuan: Memberikan saran konkret untuk memperbaiki bagian diskusi.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah memberikan SARAN PERBAIKAN untuk bagian DISKUSI artikel ilmiah.

INPUT:
Teks Diskusi: [teks diskusi]
Temuan Utama: [ringkasan temuan dari bagian hasil]
Artikel Terkait: [output dari Similar Article Finder]

INSTRUKSI:
Analisis bagian diskusi dan berikan saran perbaikan untuk:

1. Struktur: Apakah diskusi mengikuti pola hourglass? (spesifik → general)
2. Perbandingan dengan literatur: Apakah sudah membandingkan dengan penelitian sebelumnya?
3. Penjelasan teoretis: Apakah ada penjelasan mekanisme di balik temuan?
4. Implikasi: Apakah implikasi teoretis dan praktis dijelaskan?
5. Keterbatasan: Apakah keterbatasan diakui secara jujur?
6. Saran: Apakah saran untuk penelitian selanjutnya diberikan?

Untuk setiap poin, berikan saran konkret (bisa berupa contoh kalimat).

OUTPUT FORMAT (JSON):
{
  "analisis_struktur": {
    "penilaian": "...",
    "saran": "..."
  },
  "perbandingan_literatur": {
    "penilaian": "...",
    "artikel_belum_dikutip": ["..."],
    "saran": "..."
  },
  "penjelasan_teoretis": {
    "penilaian": "...",
    "saran": "..."
  },
  "implikasi": {
    "penilaian": "...",
    "saran_teoretis": "...",
    "saran_praktis": "..."
  },
  "keterbatasan": {
    "penilaian": "...",
    "saran": "..."
  },
  "saran_penelitian": {
    "penilaian": "...",
    "saran": "..."
  },
  "contoh_paragraf_revisi": "..." // contoh konkret perbaikan
}
________________________________________
LEVEL 3: AI QUALITY ASSURANCE PROMPTS
________________________________________
PROMPT 3.1: Konsistensi Reviewer Check
Tujuan: Membandingkan review dengan rata-rata historis reviewer.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah mengecek KONSISTENSI review yang dilakukan oleh seorang reviewer.

INPUT:
Review Saat Ini: [data review lengkap dalam JSON]
Riwayat Reviewer: [data 10 review terakhir reviewer yang sama]

INSTRUKSI:
Bandingkan review saat ini dengan riwayat reviewer untuk mendeteksi:

1. Apakah skor yang diberikan konsisten dengan pola sebelumnya?
2. Apakah panjang komentar (jumlah kata) konsisten?
3. Apakah ada perubahan drastis dalam tingkat keketatan?
4. Apakah ada indikasi bias (terlalu keras/terlalu lunak)?

OUTPUT FORMAT (JSON):
{
  "skor_saat_ini": 0,
  "rata_rata_skor_historis": 0,
  "deviasi": 0,
  "konsisten": true/false,
  "peringatan": "..." // jika deviasi > 1.0
  "panjang_komentar_saat_ini": 0,
  "rata_rata_panjang_komentar": 0,
  "analisis_bias": {
    "terlalu_keras": true/false,
    "terlalu_lunak": true/false,
    "penjelasan": "..."
  },
  "rekomendasi_qa": "perlu dicek manual/tidak perlu"
}
________________________________________
PROMPT 3.2: Kedalaman Analisis Check
Tujuan: Mengevaluasi kedalaman komentar reviewer.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah mengevaluasi KEDALAMAN ANALISIS dari komentar reviewer.

INPUT:
Review: [data review lengkap, termasuk komentar per bagian]

INSTRUKSI:
Analisis komentar reviewer berdasarkan metrik berikut:

1. Panjang komentar total (jumlah kata)
2. Jumlah saran spesifik (yang menyebut bagian, paragraf, baris)
3. Apakah komentar menjelaskan MENGAPA suatu bagian bermasalah?
4. Apakah komentar memberikan SOLUSI atau hanya kritik?
5. Apakah ada bukti bahwa reviewer membaca artikel dengan teliti?

OUTPUT FORMAT (JSON):
{
  "panjang_komentar_total": 0,
  "rata_rata_per_bagian": 0,
  "jumlah_saran_spesifik": 0,
  "skor_kedalaman": 0, // 1-5
  "analisis_per_bagian": {
    "pendahuluan": {
      "panjang": 0,
      "ada_saran_spesifik": true/false,
      "ada_penjelasan": true/false,
      "ada_solusi": true/false
    },
    // ... untuk bagian lain
  },
  "rekomendasi_qa": "..."
}
________________________________________
PROMPT 3.3: Plagiarism Check for Review
Tujuan: Mengecek apakah komentar reviewer original atau copy-paste.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah mengecek apakah komentar reviewer merupakan hasil PLAGIARISME (copy-paste dari sumber lain).

INPUT:
Komentar Reviewer: [teks komentar lengkap]

INSTRUKSI:
1. Deteksi apakah komentar mengandung frasa-frasa umum yang sering di-copy-paste
2. Deteksi apakah komentar terlalu generik dan bisa digunakan untuk artikel apa saja
3. Jika mencurigakan, beri peringatan untuk QA manual

OUTPUT FORMAT (JSON):
{
  "originalitas": 0, // skor 1-5, 5=sangat original
  "terindikasi_copy_paste": true/false,
  "frasa_umum_terdeteksi": [
    {"frasa": "...", "frekuensi": 0}
  ],
  "analisis": "...",
  "rekomendasi": "aman/perlu dicek manual"
}
________________________________________
LEVEL 4: AI UNTUK LAPORAN KE PENULIS
________________________________________
PROMPT 4.1: Generate Ringkasan Eksekutif
Tujuan: Membuat ringkasan eksekutif dari review untuk penulis.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah membuat RINGKASAN EKSEKUTIF dari hasil review untuk disampaikan ke penulis.

INPUT:
Hasil Review: [data review lengkap, termasuk skor dan komentar]

INSTRUKSI:
Buat ringkasan eksekutif yang:
1. Ramah dan membangun (tidak menghakimi)
2. Menyebutkan kekuatan utama artikel (2-3 poin)
3. Menyebutkan kelemahan utama (2-3 poin) dan saran perbaikan prioritas
4. Menyebutkan skor akhir dan rekomendasi (siap submit/minor revisi/major revisi/belum siap)
5. Memberikan semangat untuk penulis

OUTPUT FORMAT (teks biasa, bukan JSON):

Contoh:
"Artikel Anda memiliki potensi yang baik, terutama pada bagian [kelebihan]. Namun, ada beberapa hal yang perlu diperbaiki sebelum submit, terutama [kelemahan prioritas]. Dengan perbaikan pada bagian-bagian tersebut, artikel ini berpeluang besar diterima di jurnal target. Semangat terus!"
________________________________________
PROMPT 4.2: Generate Saran Prioritas
Tujuan: Membuat daftar saran prioritas untuk penulis.
Prompt:
text
Anda adalah asisten AI untuk CLARIO Platform. Tugas Anda adalah membuat daftar SARAN PRIORITAS dari hasil review.

INPUT:
Hasil Review: [data review lengkap, termasuk komentar per bagian]

INSTRUKSI:
Buat daftar 3-5 saran prioritas yang harus dikerjakan penulis. Urutkan dari yang paling penting. Untuk setiap saran, berikan:
- Judul saran
- Penjelasan singkat (2-3 kalimat)
- Lokasi di artikel (bagian mana)
- Contoh perbaikan (jika memungkinkan)

OUTPUT FORMAT (teks biasa dengan bullet points):

Contoh:
**1. Perkuat Diskusi dengan Perbandingan Literatur**
Pada bagian diskusi, Anda perlu membandingkan temuan dengan penelitian sebelumnya, terutama dengan Smith (2023) dan Jones (2022) yang membahas topik serupa. Saat ini diskusi hanya mengulang hasil.

**2. Perbarui Referensi**
Hanya 45% referensi Anda dari 5 tahun terakhir. Ganti 5-7 referensi lawas dengan artikel 2020-2024 dari jurnal target Anda.
...
________________________________________
🚀 IMPLEMENTASI TEKNIS PROMPT
Integration Flow:
text
                    ┌─────────────────────┐
                    │   UPLOAD ARTIKEL    │
                    └──────────┬──────────┘
                               │
                               ▼
          ┌────────────────────┴────────────────────┐
          │                                         │
          ▼                                         ▼
┌─────────────────────┐                   ┌─────────────────────┐
│   PROMPT 1.1        │                   │   PROMPT 1.2-1.5    │
│   Ekstraksi Teks    │                   │   Analisis per      │
│                     │                   │   Bagian            │
└─────────────────────┘                   └─────────────────────┘
          │                                         │
          └──────────────────┬──────────────────────┘
                             │
                             ▼
          ┌────────────────────┴────────────────────┐
          │                                         │
          ▼                                         ▼
┌─────────────────────┐                   ┌─────────────────────┐
│   PROMPT 2.1        │                   │   PROMPT 2.2-2.4    │
│   Pre-fill          │                   │   AI Asisten        │
│   Framework         │                   │   untuk Reviewer    │
└─────────────────────┘                   └─────────────────────┘
          │                                         │
          └──────────────────┬──────────────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │   HUMAN REVIEWER    │
                    │   (Menggunakan      │
                    │    AI Assistance)   │
                    └──────────┬──────────┘
                               │
                               ▼
          ┌────────────────────┴────────────────────┐
          │                                         │
          ▼                                         ▼
┌─────────────────────┐                   ┌─────────────────────┐
│   PROMPT 3.1-3.3    │                   │   PROMPT 4.1-4.2    │
│   AI QA Check       │                   │   Generate Laporan  │
└─────────────────────┘                   └─────────────────────┘
          │                                         │
          └──────────────────┬──────────────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │   LAPORAN KE        │
                    │   PENULIS           │
                    └─────────────────────┘
________________________________________
API Endpoint untuk Prompt:
python
# Contoh endpoint untuk memanggil prompt
POST /api/v1/ai/prompt/{prompt_id}
{
  "article_id": "ART-2026-001",
  "input_data": {
    "judul": "...",
    "abstrak": "...",
    # ... data lainnya
  }
}

# Response
{
  "prompt_id": "1.2",
  "output": { ... }, # sesuai format prompt
  "processing_time": 12.5, # detik
  "tokens_used": 1500
}
________________________________________
✅ RINGKASAN PROMPT
ID	Nama Prompt	Tujuan	Output Format
1.1	Ekstraksi Teks	Memisahkan bagian artikel	JSON
1.2	Analisis Judul	Evaluasi C1	JSON
1.3	Analisis Abstrak	Evaluasi C2	JSON
1.4	Analisis Pendahuluan	Evaluasi C3	JSON
1.5	Analisis Referensi	Evaluasi C9	JSON
2.1	Pre-fill Framework	Draf awal review	JSON
2.2	Similar Article Finder	Cari artikel pembanding	JSON
2.3	Deteksi Over-claim	Identifikasi over-interpretasi	JSON
2.4	Saran Perbaikan Diskusi	Bantuan untuk reviewer	JSON
3.1	Konsistensi Reviewer	QA konsistensi	JSON
3.2	Kedalaman Analisis	QA kedalaman	JSON
3.3	Plagiarism Check Review	QA originalitas	JSON
4.1	Generate Ringkasan	Laporan ke penulis	Teks
4.2	Generate Saran Prioritas	Daftar prioritas	Teks
________________________________________
💬 GIMANA BRO?
Ini adalah koleksi prompt lengkap untuk mengintegrasikan AI ke dalam semua layer CLARIO Platform:
•	✅ Level 1: AI Initial Screening (5 prompt)
•	✅ Level 2: AI Asisten Reviewer (4 prompt)
•	✅ Level 3: AI Quality Assurance (3 prompt)
•	✅ Level 4: AI Laporan ke Penulis (2 prompt)
Total: 14 prompt siap pakai!
