# APP_IDENTITY_SCHEMA.md
# CORTEX-SHELL — app_identity.json Complete Field Reference
# Version: 1.0 | Batch 5 | Date: 2026-06-10

---

## OVERVIEW

`app_identity.json` is the single configuration file that defines the complete identity of a CORTEX-SHELL deployment. Editing this file (or generating it from the questionnaire) fully customizes the app's branding, institution, colors, text, and domain structure — without touching any code.

**File Location:** `app_data/system/identity/app_identity.json`

---

## TOP-LEVEL STRUCTURE

```json
{
  "app":               { ... },   // Core app name and branding
  "institution":       { ... },   // University/faculty info
  "branding":          { ... },   // Colors, fonts, logo
  "welcome":           { ... },   // Welcome screen content
  "navigation":        { ... },   // Nav labels
  "content_domains":   [ ... ],   // Which subjects are active
  "target_audience":   { ... },   // Who uses the app
  "about":             { ... },   // About page text
  "help":              { ... },   // Help page text + FAQ
  "privacy":           { ... },   // Privacy policy text
  "settings":          { ... }    // Default app settings
}
```

---

## SECTION: `app`

Core identity of the application.

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | string | `"cortex"` | Internal app identifier. Lowercase, no spaces. |
| `name` | string | `"CORTEX"` | App display name. Shown on welcome screen and header. |
| `tagline` | string | `"Belajar Klinis. Lebih Dalam."` | Short tagline, shown on welcome/home. |
| `subtitle` | string | `"Medical Education Platform"` | Platform type descriptor. |
| `brand_note` | string | `"Powered by CORTEX-SHELL"` | Small credit note on welcome screen. |
| `version` | string | `"1.0.0"` | Semantic version string. |
| `loading_text` | string | `"Entering studio"` | Text shown during app loading. |

---

## SECTION: `institution`

Institutional affiliation and display information.

| Field | Type | Default | Description |
|---|---|---|---|
| `name` | string | `"Universitas Anda"` | Full institution name. Shown in About page. |
| `faculty` | string | `"Fakultas Kedokteran"` | Faculty or school name. |
| `department` | string | `""` | Optional department/division. |
| `city` | string | `"Jakarta"` | City of institution. |
| `country` | string | `"Indonesia"` | Country. |
| `year_founded` | string | `"2026"` | Year app was launched or institution founded. |
| `logo_description` | string | — | Natural language description for AI logo generation. |

---

## SECTION: `branding`

Visual identity: colors, fonts, icon style.

| Field | Type | Default | Description |
|---|---|---|---|
| `primary_color` | hex string | `"#7c3aed"` | Main brand color. Used for primary buttons, active states. |
| `primary_color_light` | hex string | `"#a855f7"` | Lighter variant of primary. Used for gradients. |
| `secondary_color` | hex string | `"#10b981"` | Secondary/success color. Used for callout pearls. |
| `accent_color` | hex string | `"#38bdf8"` | Accent/highlight color. Used for evidence callouts. |
| `danger_color` | hex string | `"#ef4444"` | Danger/error color. Used for danger callouts. |
| `warning_color` | hex string | `"#f59e0b"` | Warning color. Used for caution callouts. |
| `theme_default` | string | `"dark"` | Default theme. Options: `"dark"`, `"light"`, `"system"`. |
| `icon_style` | string | `"rounded"` | Icon style preference: `"rounded"`, `"sharp"`, `"filled"`. |
| `font_display` | string | `"system-ui"` | Display font for headings. |
| `logo_prompt` | string | — | Full AI image generation prompt for the app logo. |

### Color Usage Map

| Color Field | Where Used in App |
|---|---|
| `primary_color` | Primary buttons, selected nav, active module card border |
| `primary_color_light` | Welcome screen halo gradient, loading bar |
| `secondary_color` | Pearl callouts, progress indicators, success states |
| `accent_color` | Evidence callouts, links, search highlights |
| `danger_color` | Danger callouts, error states, contraindication markers |
| `warning_color` | Caution callouts, warning indicators |

---

## SECTION: `welcome`

Controls every text element on the welcome/splash screen.

| Field | Type | Default | Description |
|---|---|---|---|
| `headline` | string | `"CORTEX"` | Large app name shown center-screen. |
| `subtitle_badge` | string | `"Immersive launch"` | Small badge text below headline. |
| `tagline` | string | `"Ruang awal..."` | Descriptive tagline paragraph. |
| `cta_label` | string | `"Mulai"` | CTA button label (if manual advance is added). |
| `loading_text` | string | `"Entering studio"` | Text shown at bottom during auto-advance. |
| `auto_advance_ms` | integer | `3200` | Milliseconds before auto-advancing past welcome screen. |
| `show_feature_badges` | boolean | `true` | Whether to show the 3 feature badges. |
| `feature_badges` | string[3] | `["Aurora","Starfield","Glass"]` | Text for 3 decorative feature badges. |

---

## SECTION: `navigation`

Custom labels for all navigation items. Allows full language/terminology customization.

| Field | Default | Surface |
|---|---|---|
| `label_home` | `"Beranda"` | S2 Home |
| `label_materi` | `"Materi"` | S3/S9 Learning |
| `label_soal` | `"Soal Ujian"` | S17 Quiz |
| `label_bank_soal` | `"Bank Soal AI"` | S17 (AI type) |
| `label_glosarium` | `"Glosarium"` | S14 Glossary |
| `label_ringkasan` | `"Ringkasan"` | S11 Summary |
| `label_visual` | `"Visual"` | S13 Visuals |
| `label_flashcard` | `"Flashcard"` | S18 Flashcard |
| `label_progress` | `"Progres"` | S19 Progress |
| `label_search` | `"Cari"` | S6 Search |
| `label_settings` | `"Pengaturan"` | S20 Settings |

---

## SECTION: `content_domains`

Array of domain objects. Controls which medical subject domains are active in the app.

```json
{
  "id": "neuro_emergency",
  "display_name": "Neurologi Klinis",
  "icon": "🧠",
  "description": "Stroke, Neuroemergency, Manajemen Neurologis",
  "color": "#7c3aed",
  "active": true
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Must match `domainId` in content_index.kimi.json. |
| `display_name` | string | Human-readable domain name shown in app. |
| `icon` | emoji | Icon shown next to domain name. |
| `description` | string | Short description. 1 sentence. |
| `color` | hex string | Domain accent color for cards and labels. |
| `active` | boolean | `false` = domain hidden from navigation. |

---

## SECTION: `target_audience`

Defines who the app is built for. Used for AI content generation context.

| Field | Type | Description |
|---|---|---|
| `level` | string | Study level (e.g., "S1 Kedokteran / Profesi Dokter") |
| `year_of_study` | string | Target year (e.g., "Tahun 3–6") |
| `primary_language` | string | ISO code: `"id"` (Indonesian) or `"en"` (English) |
| `secondary_language` | string | ISO code for bilingual content |
| `bilingual_enabled` | boolean | Whether bilingual sections are shown |
| `specialty_focus` | string | Medical specialty or "Umum" |

---

## SECTION: `about` / `help` / `privacy`

Text content for informational pages. All strings support plain text or markdown-lite (bold with `**text**`).

### `about`
| Field | Description |
|---|---|
| `text` | Main about paragraph (2–4 sentences). |
| `developer_credit` | Small developer attribution line. |
| `version_label` | Human-readable version (e.g., "Versi 1.0"). |
| `contact_email` | Optional contact email. |
| `website_url` | Optional website URL. |

### `help`
| Field | Description |
|---|---|
| `intro_text` | First paragraph of help page. |
| `faq` | Array of `{q, a}` objects. 3–6 FAQ entries. |
| `support_contact` | Email or WhatsApp for support. |
| `data_handling` | 1 sentence about data storage. |

### `privacy`
| Field | Description |
|---|---|
| `text` | Full privacy policy paragraph. |
| `data_collected` | boolean — whether any data is collected. |
| `analytics_enabled` | boolean — whether analytics are used. |
| `local_storage_only` | boolean — whether data stays on device. |

---

## SECTION: `settings`

Default values for app settings. Users can override these in the Settings surface.

| Field | Type | Default | Description |
|---|---|---|---|
| `theme_options` | string[] | `["dark","light","system"]` | Available theme choices. |
| `default_theme` | string | `"dark"` | Which theme loads on first visit. |
| `exam_timer_enabled` | boolean | `false` | Whether quiz timer is on by default. |
| `exam_timer_minutes` | integer | `60` | Default exam timer duration. |
| `flashcard_auto_flip_ms` | integer | `0` | Auto-flip delay (0 = disabled). |
| `show_answer_evidence` | boolean | `true` | Show citation in quiz explanations. |
| `bilingual_default` | boolean | `false` | Show bilingual by default. |

---

## VALIDATION RULES

- All `*_color` fields must be valid 6-digit hex strings (`#rrggbb`)
- `primary_language` and `secondary_language` must be valid ISO 639-1 codes
- `content_domains[]` must have at least 1 entry with `active: true`
- `welcome.auto_advance_ms` must be between 2000 and 10000
- `feature_badges` must have exactly 3 entries
- `faq` array should have 3–8 entries for best UX

---

*Ground truth file: `app_data/system/identity/app_identity.json`*  
*Last updated: 2026-06-10 | Batch 5*
