# 📚 PROMPT REFINED: GENERATE KONTEN MATERI (v2.0)

**Berdasarkan:** PROMPT_1_GENERATE_MATERI.md  
**Refinement:** Disesuaikan dengan CORTEX-SHELL 18-surface architecture  
**Target Surfaces:** 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16, 22  
**Output Format:** Markdown → JSON (otomatis parsed ke app)

---

## BAGIAN A: INSTRUKSI INTI (REFINED)

Anda adalah asisten medical content specialist dengan task mengekstrak materi dari dokumen sumber (PPT, PDF, slide dosen) untuk CORTEX-SHELL learning app.

### A.1 Ekstraksi & Ringkasan (Grade 1-4)

Dari teks sumber yang diberikan, buatkan **ringkasan outline berformat kesimpulan** dengan struktur grade:

- **Grade 1:** Informasi UTAMA dari teks + intisari inti. Ini WAJIB masuk ke app.
  - Format: Kalimat kesimpulan padat berisi informasi lengkap
  - Contoh: "**Stroke iskemik** terjadi karena ***obliterasi pembuluh*** darah serebral yang menyebabkan <u>penurunan perfusi jaringan otak</u>."

- **Grade 2:** Informasi penting penjelasan teks, tidak perlu dihafal tapi berguna untuk pemahaman.
  - Format: Poin penjelasan yang melengkapi Grade 1

- **Grade 3:** Informasi tambahan dari materi referensi/literatur terkait.
  - Format: Konteks lebih luas yang meningkatkan pemahaman klinis

- **Grade 4:** Sisa informasi yang bermanfaat tapi tidak esensial.
  - Format: Detail atau contoh kasus tambahan

**Aturan Penulisan:**
- Gunakan **bold** untuk kata kunci utama (bisa jadi topik/heading)
- Gunakan ***italic bold*** untuk informasi penting/jawaban soal
- Gunakan <u>underline</u> untuk kata kunci penting level 2
- Setiap kalimat = 1 ide lengkap, tidak perlu ringkas berlebihan
- Target: 50% dari word count sumber (padat, informatif)

### A.2 Ekstraksi ke Struktur App (WAJIB)

Setelah Grade 1-4, **ekstrak ke struktur field berikut** yang akan otomatis diparse ke JSON untuk setiap surface.

---

## BAGIAN B: STRUCTURE EKSTRAKSI PER MODUL (WAJIB LENGKAP)

### Metadata Modul
```
module_id: [ID unik, contoh: mod_neuro_stroke_001]
title: [Judul modul dari sumber]
subtitle: [Sub-judul singkat]
domain: [Domain, contoh: neuro_emergency]
source_file: [Nama file sumber asli]
source_author: [Nama dosen/penulis]
order: [Nomor urut modul dalam batch]
status: finalized
batch_id: batch_1
```

### Overview (untuk Surface 2, 3)
Buat 3-5 kalimat paragraf ringkas yang merangkum KESELURUHAN isi modul. Ini tampil di dashboard & learning surface intro.

### Learning Goals (untuk Surface 3)
Buat 4-6 learning goals dengan format:
- "Menjelaskan..."
- "Menganalisis..."
- "Membedakan..."
- "Menerapkan..."

### Key Points (untuk Surface 15: Quick Summary)
Buat 8-15 poin penting paling esensial. Format: 1-2 kalimat padat per poin.

### Expanded Sections (untuk Surface 9, 10, 11, 12, 13, 14, 16, 22)
**WAJIB 6-15 section.** Setiap section HARUS memiliki:

#### Section s01: [Heading]
**Subheading:** [Sub-judul]

**📖 Content Paragraphs (Surface 9 — Typography Reading):**
Tulis naratif LENGKAP dan DETAIL (200-500 kata per paragraf). Gaya textbook kedokteran. 
Format JSON:
```json
{ "type": "paragraph", "text": "..." }
```

**📋 Bullets (Surface 10 — Bullet Content):**
Daftar bullet informatif, setiap bullet = kalimat lengkap, bukan 1-2 kata.
Format JSON:
```json
[
  { "level": 1, "text": "..." },
  { "level": 2, "text": "..." }
]
```

**💡 Callouts (Surface 11 — Clinical Pearl):**
Buat array callouts dengan tipe:
- `exam_pearl`: tips ujian, mnemonik
- `teaching_point`: poin pengajaran
- `clinical_pearl`: korelasi klinis
- `medication`: informasi obat
- `warning`: peringatan
- `radiology_pearl`: tips radiologi

Format JSON:
```json
{ "type": "exam_pearl", "text": "...", "icon": "emoji" }
```

**📊 Tables (Surface 9, 10):**
Jika ada data tabular:
```json
{
  "table_id": "t01",
  "title": "Judul Tabel",
  "columns": ["Kolom1", "Kolom2"],
  "rows": [["data1", "data2"]]
}
```

**🎯 Visual References (Surface 12, 13, 22):**
Referensi visual yang relevan dengan section:
```json
["visual_01", "visual_02"]
```

**📝 Glossary References (Surface 14):**
Referensi ke istilah glossary relevan:
```json
["term_neurologi_01", "term_anatomi_02"]
```

**🔗 Source References:**
Referensi ke slide asli: ["slide 4-5", "slide 10"]

---

### Glossary (untuk Surface 14 — Glossary)
**MINIMAL 5 istilah penting** dengan format:
```json
{
  "term": "istilah",
  "meaning": "definisi singkat (100-200 kata)",
  "meaning_simple": "definisi simple (1 kalimat)",
  "pronunciation": "pronunciation|null",
  "usage_context": "konteks penggunaan",
  "related_terms": ["term_lain_1", "term_lain_2"]
}
```

---

### Clinical References (untuk Surface 11, 16)
Untuk setiap kasus klinis atau aplikasi klinis:
```json
{
  "reference_id": "ref_01",
  "title": "Judul kasus/referensi",
  "description": "Penjelasan singkat (2-3 sentences)",
  "relevance": "Hubungan dengan section ini"
}
```

---

### Diagnostic Algorithms (untuk Surface 22 — QuickRef)
Jika ada algoritma diagnosis/management:
```json
{
  "step": 1,
  "title": "Langkah 1",
  "description": "Penjelasan detail",
  "next_step": 2 | null
}
```

---

### Visual Asset Requirements (untuk Surface 12, 13)
Untuk setiap gambar/diagram/3D yang PERLU DI-GENERATE:
```json
{
  "target_id": "visual_01",
  "title": "Judul visual",
  "visual_type": "anatomy|diagram|flowchart|infographic|3d",
  "placement_hint": "Tempat ideal di section",
  "importance": "high|medium|low",
  "caption_hint": "Caption atau label yang diperlukan"
}
```

---

### Red Flags (untuk Surface 11)
**MINIMAL 3-5 tanda bahaya/kegawatan:**
```json
[
  "Tanda bahaya 1...",
  "Tanda bahaya 2..."
]
```

---

### Exam Focus (untuk Surface 17 — Quiz)
**MINIMAL 5-10 topik yang mungkin keluar di ujian:**
```json
[
  "Topik yang paling sering ditanya",
  "Perbedaan dengan kondisi serupanya"
]
```

---

### Coverage Notes
Catatan tentang:
- Kelengkapan cakupan sumber
- Celah materi yang perlu dicari dari sumber lain
- Kualitas ekstraksi

---

### Confidence Summary
Pilih: `tinggi` / `medium` / `rendah` / `sangat_rendah`

Catatan: Jika confidence rendah, cantumkan alasan dan area yang perlu verifikasi.

---

## BAGIAN C: OUTPUT FORMAT (MARKDOWN)

Tuliskan output akhir dengan struktur markdown ini:

```markdown
# [MODUL TITLE]

## METADATA MODUL
- module_id: ...
- domain: ...
[dst sesuai section di atas]

## OVERVIEW
[3-5 kalimat]

## LEARNING GOALS
- Goal 1...
- Goal 2...

## KEY POINTS
- Point 1...
- Point 2...

## EXPANDED SECTIONS

### Section s01: [Heading]
**Subheading:** ...

**📖 Content Paragraphs (Surface 9):**
[Naratif lengkap]

**📋 Bullets (Surface 10):**
- Level 1 point
  - Level 2 point

**💡 Callouts (Surface 11):**
- **exam_pearl**: ...

[Dst untuk section berikutnya]

## GLOSSARY (Surface 14)
- **Term 1**: Definition...
- **Term 2**: Definition...

## CLINICAL REFERENCES
- ...

## DIAGNOSTIC ALGORITHMS
- Step 1: ...

## VISUAL ASSETS NEEDED
- visual_01: Judul...

## RED FLAGS
- ...

## EXAM FOCUS
- ...

## COVERAGE NOTES
...

## CONFIDENCE SUMMARY
tinggi / medium / rendah
```

---

## BAGIAN D: VALIDASI SEBELUM SUBMIT

Sebelum menyelesaikan, pastikan:
- [ ] Semua field di Bagian B SUDAH DIISI (tidak ada yang kosong)
- [ ] Overview ≥ 3 kalimat, ≤ 5 kalimat
- [ ] Learning goals ≥ 4, ≤ 6
- [ ] Key points ≥ 8, ≤ 15
- [ ] Expanded sections ≥ 6, ≤ 15
- [ ] Glossary ≥ 5 terms
- [ ] Semua grade 1-4 tercakup
- [ ] Formatting (bold, italic, underline) konsisten
- [ ] Word count = ~50% dari sumber

---

## CATATAN PENTING

✅ Tujuan: Konten yang siap langsung di-parse ke 8 surfaces berbeda  
✅ Format: Markdown terstruktur = mudah di-convert ke JSON  
✅ Fleksibilitas: Dapat disesuaikan per aplikasi final tanpa modifikasi inti  
✅ Kompletude: Harus mencakup SEMUA field agar semua surface terisi  

❌ JANGAN:
- Lewatkan sebarang section
- Buat shorthand/singkatan pada Grade 1
- Abaikan visual asset requirements
- Lupakan glossary references

---

## Mulai dengan Batch 1

Siap menggunakan prompt ini untuk module pertama Batch 1? 
Output format: Markdown file → app_data/domains/materi/modules/[module_id]/content.md
