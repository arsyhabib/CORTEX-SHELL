# 🎯 PROMPT REFINED: GENERATE KONTEN SET SOAL (v2.0)

**Berdasarkan:** PROMPT_2_GENERATE_SET_SOAL.md  
**Refinement:** Disesuaikan dengan CORTEX-SHELL 2-surface architecture (Quiz + Flashcard)  
**Target Surfaces:** 17 (Quiz), 18 (Flashcard)  
**Source Domains:** Domain Exam Asli, Domain Bank Soal AI  
**Output Format:** Markdown → JSON (otomatis parsed ke app)

---

## BAGIAN A: INSTRUKSI INTI (REFINED)

Anda adalah asisten medical exam specialist dengan task mengekstrak soal dari dokumen sumber (PDF exam, bank soal, slide latihan) untuk CORTEX-SHELL assessment app.

### A.1 Pengerjaan Soal (Dosen Mindset)

Untuk SETIAP soal yang diberikan:

**1. Salin soal murni** (tanpa modifikasi)

**2. Jawab seperti dosen** dengan format:
```
✅ Jawaban Benar: [A/B/C/D/E]

**Alasan Singkat (2 kalimat max):**
Penjelasan mengapa jawaban ini benar.

**Verifikasi Personal (1 kalimat):**
Gabungan konsep soal + jawaban dalam 1 kalimat logis.
```

**3. Jelaskan SEMUA opsi** dalam dot-point detail:
```
- **A. [teks]**: Mengapa salah adalah... [penjelasan 1-2 kalimat]
- **B. [teks]**: Mengapa salah adalah... [penjelasan 1-2 kalimat]
- **C. [teks]**: Mengapa benar adalah... [penjelasan detail]
- **D. [teks]**: Mengapa salah adalah... [penjelasan 1-2 kalimat]
- **E. [teks]**: Mengapa salah adalah... [penjelasan 1-2 kalimat]
```

**4. Materi Tambahan (MINIMAL 200 kata):**
Jelaskan konsep inti soal dengan gaya textbook kedokteran. Sertakan:
- Patofisiologi / mekanisme
- Epidemiologi (jika relevan)
- Klasifikasi / diferensiasi
- Penanganan klinis
- Prognosis
- Korelasi dengan soal lain yang mungkin keluar ujian

**5. Gunakan Format:**
- ***Jawaban benar*** untuk menekankan opsi yang benar
- **Konsep penting** untuk keywords
- <u>Data/angka penting</u> untuk numerik

### A.2 Kelengkapan Soal

Jika soal **INCOMPLETE** (kurang opsi atau tanpa jawaban):

**Lengkapi opsi** sampai 5 pilihan (A-E) jika hanya ada 2-3  
**Lengkapi jawaban** jika belum ada dengan logical reasoning  
**Verifikasi konsistensi** antara stem, opsi, dan jawaban

### A.3 Konten Gabungan

**JANGAN PISAHKAN** prompt 1-3. **GABUNGKAN** dalam output satu soal yang mencakup:
1. Soal asli + jawaban + alasan
2. Penjelasan per opsi
3. Materi textbook (200+ kata)
4. Formatting dengan emphasis

---

## BAGIAN B: STRUKTUR PER SOAL (WAJIB LENGKAP)

### SET METADATA
```
id: [ID unik set soal]
title: [Judul set soal]
year: [Tahun, jika ada]
batchId: batch_1
sourceLabel: [Nama sumber file]
questionCount: [Jumlah soal]
domain: [exam_asli atau bank_soal_ai]
confidence: [tinggi|medium|rendah] (jika ada keraguan)
```

---

### STRUKTUR SETIAP SOAL

#### SOAL N — [RINGKASAN SOAL]

**Stimulus (jika ada):**
```
[Kasus klinis / paragraf pengantar]
```

**Soal Asli:**
```
[Salin lengkap kalimat soal]
```

**Pilihan Jawaban:**
```
A. [Teks opsi A]
B. [Teks opsi B]
C. [Teks opsi C]
D. [Teks opsi D]
E. [Teks opsi E, atau "-" jika tidak ada]
```

---

#### PENYELESAIAN SOAL

**✅ Jawaban Benar:** [A/B/C/D/E]

**Alasan Singkat:**
[1-2 kalimat penjelasan inti]

**Verifikasi Personal:**
[1 kalimat menyatukan soal + jawaban]

---

#### PENJELASAN PER OPSI (Dot-Point Detail)

```
**Analisis Opsi:**

- **A. [Teks Opsi]**
  - Mengapa salah: [Penjelasan logis 1-2 kalimat]
  - Konsep terkait: [Kekeliruan umum yang dimuat]

- **B. [Teks Opsi]**
  - Mengapa salah: [Penjelasan logis]
  - Bisa terjadi jika: [Kondisi alternatif]

- **C. [Teks Opsi]** ← BENAR
  - Mengapa benar: [Penjelasan detail 2-3 kalimat]
  - Patofisiologi: [Mekanisme yang mendukung]
  - Bukti klinis: [Evidensi medis]

- **D. [Teks Opsi]**
  - Mengapa salah: [Penjelasan]
  - Distractor: [Mengapa opsi ini dipilih calon salah]

- **E. [Teks Opsi]**
  - Mengapa salah: [Penjelasan]
  - Related concept: [Konsep yang seharusnya]
```

---

#### MATERI PEMBELAJARAN (MINIMAL 200 KATA)

**Topik:** [Judul topik soal]

**Pembahasan Lengkap:**
Jelaskan dengan format dot-point detail:

- **Konsep Inti:**
  - Definisi / patofisiologi
  - Mekanisme yang mendasari
  
- **Klasifikasi / Diferensiasi:**
  - Jenis-jenis / subtipe (jika ada)
  - Ciri pembeda masing-masing

- **Presentasi Klinis:**
  - Gejala / tanda
  - Faktor risiko
  - Epidemiologi

- **Diagnosis:**
  - Metode diagnostik
  - Temuan khas (lab, imaging, dll)
  
- **Manajemen:**
  - Tatalaksana farmakologi
  - Tatalaksana non-farmakologi
  - Monitoring / prognosis

- **Korelasi Ujian:**
  - Soal serupa yang mungkin keluar
  - Pola pertanyaan umum
  - Traps / distractor yang sering digunakan

**Sumber:** Textbook / jurnal medis standar (gunakan terminology konsisten)

---

#### DATA UNTUK FLASHCARD (Surface 18)

**FlashcardQ:** [Pertanyaan versi card — bisa berdiri sendiri, 1 kalimat]
Contoh: "Pada stroke iskemik, gejala yang paling awal adalah apa?"

**FlashcardA:** [Jawaban versi card — frasa singkat / kalimat pendek]
Contoh: "Kelemahan unilateral mendadak (hemiparesis) dan bicara tidak lancar"

---

#### METADATA UNTUK APP

**TingkatKesulitan:** [mudah|sedang|sulit]
- mudah: soal langsung dari slide, konsep dasar
- sedang: aplikasi konsep, inference minimal
- sulit: reasoning kompleks, multiple concept integration

**Sumber:** [Referensi slide / pustaka asal]
Contoh: "Slide Dr. Adi Harsono - Stroke, hal 15-20" atau "Harrison's Internal Medicine, Chapter X"

**ReferensiVisual:** [ID visual_target yang relevan, jika ada]
Contoh: ["visual_stroke_mri_01", "visual_cta_01"] atau "Tidak ada"

**KorelasiKlinis:** [Hubungan dengan praktik klinis nyata]
Contoh: "Pada pasien datang dengan keluhan pusing + nistagmus, dokter perlu membedakan stroke serebelar dari BPPV untuk memastikan manajemen yang tepat."

**SoalSerupa:** [Contoh soal dengan topik yang sama yang mungkin keluar]
Contoh: "Pasien laki-laki 55 tahun datang dengan kelumpuhan lengan kanan mendadak. Apa struktur vaskular yang kemungkinan tersumbat?"

---

## BAGIAN C: OUTPUT FORMAT MARKDOWN

Tuliskan output akhir dengan format:

```markdown
# SET SOAL: [Nama Set — Contoh: "MCQ 6.E 2025 - Original Exam"]

## METADATA SET
- id: mcq_6e_2025_original
- title: MCQ 6.E 2025 Original Exam
- year: 2025
- batchId: batch_1
- sourceLabel: "6.E Block Exam 2025"
- questionCount: 60
- domain: exam_asli
- confidence: tinggi

---

## SOAL 1 — [Ringkasan Kasus]

**Stimulus:**
[Kasus klinis jika ada]

**Soal:**
[Salin soal lengkap]

**Opsi:**
A. ...
B. ...
C. ...
D. ...
E. ...

**✅ Jawaban:** C

**Alasan:**
[1-2 kalimat]

**Verifikasi:**
[1 kalimat]

**Analisis Opsi:**
- **A**: Mengapa salah: ...
- **B**: Mengapa salah: ...
- **C**: Mengapa benar: ...
- **D**: Mengapa salah: ...
- **E**: Mengapa salah: ...

**Materi Pembelajaran:**

**Topik: [Judul]**

- **Konsep Inti:**
  - Definisi: ...
  - Patofisiologi: ...

- **Diagnosis:**
  - Temuan khas: ...

- **Manajemen:**
  - Farmakologi: ...
  - Monitoring: ...

- **Korelasi Ujian:**
  - Soal serupa: ...
  - Pola pertanyaan: ...

**FlashcardQ:** [Pertanyaan untuk card]
**FlashcardA:** [Jawaban untuk card]

**TingkatKesulitan:** sedang
**Sumber:** Slide Dr. X, Textbook Y
**ReferensiVisual:** ["visual_01"]
**KorelasiKlinis:** [Penjelasan praktik klinis]
**SoalSerupa:** [Contoh soal lain]

---

## SOAL 2
[Ulangi struktur untuk setiap soal]

---

[Dst sampai semua soal selesai]
```

---

## BAGIAN D: VALIDASI SEBELUM SUBMIT

Sebelum menyelesaikan, pastikan:
- [ ] Semua soal memiliki jawaban yang jelas
- [ ] Opsi lengkap (minimal 4 opsi, maksimal 5)
- [ ] Penjelasan per opsi ≥ 1 kalimat
- [ ] Materi pembelajaran ≥ 200 kata
- [ ] FlashcardQ dan A untuk semua soal
- [ ] Tingkat kesulitan ter-assign
- [ ] Sumber tercantum
- [ ] Word count per soal: 400-700 kata (padat informatif)

---

## CATATAN PENTING

✅ Tujuan: Konten soal siap langsung untuk 2 surfaces (Quiz 17 + Flashcard 18)  
✅ Format: Markdown terstruktur = mudah di-convert ke JSON  
✅ Kompletude: HARUS LENGKAP (tidak boleh ada field kosong)  
✅ Kualitas: Explanasi setara level ujian nasional / board exam  

❌ JANGAN:
- Shortcut alasan
- Lewatkan analisis opsi
- Buat flashcard yang ambigu
- Abaikan konteks klinis

---

## Siap untuk Batch 1?

Gunakan prompt ini untuk setiap set soal dari:
- Domain Exam Asli: app_data/domains/exam_asli/exam_sets/[exam_id]/questions.md
- Domain Bank Soal AI: app_data/domains/bank_soal_ai/question_sets/[qset_id]/questions.md

Output akan otomatis di-parse ke JSON untuk:
- **Surface 17 (Quiz)**: Soal + opsi + penjelasan + materi
- **Surface 18 (Flashcard)**: FlashcardQ & A
