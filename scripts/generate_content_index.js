#!/usr/bin/env node

/**
 * CORTEX Content Index Generator
 * Scans 3-domain structure and generates content_index.generated.json
 * Usage: node generate_content_index.js
 */

const fs = require('fs');
const path = require('path');

const APP_DATA_DIR = path.join(__dirname, '../app_data');
const DOMAINS_DIR = path.join(APP_DATA_DIR, 'domains');
const RUNTIME_DIR = path.join(APP_DATA_DIR, 'runtime');
const OUTPUT_FILE = path.join(RUNTIME_DIR, 'content_index.generated.json');

console.log('📊 CORTEX Content Index Generator\n');
console.log(`📁 Scanning: ${DOMAINS_DIR}\n`);

// Ensure runtime directory exists
if (!fs.existsSync(RUNTIME_DIR)) {
  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
}

const index = {
  generatedAt: new Date().toISOString(),
  version: '2.0.0',
  domains: [],
  stats: {
    totalDomains: 0,
    totalModules: 0,
    totalExamSets: 0,
    totalQuestionSets: 0,
    totalQuestions: 0,
    lastUpdate: new Date().toISOString()
  }
};

// Process each domain
const domainDirs = fs.readdirSync(DOMAINS_DIR).filter(f => {
  const stat = fs.statSync(path.join(DOMAINS_DIR, f));
  return stat.isDirectory() && ['materi', 'exam_asli', 'bank_soal_ai'].includes(f);
});

domainDirs.forEach(domainId => {
  const domainPath = path.join(DOMAINS_DIR, domainId);
  const metadataPath = path.join(domainPath, 'metadata.json');

  if (!fs.existsSync(metadataPath)) {
    console.warn(`⚠️  Missing metadata.json in ${domainId}`);
    return;
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const domainEntry = {
    id: metadata.domain_id,
    type: metadata.domain_type,
    title: metadata.display_name,
    icon: metadata.icon,
    color: metadata.color_hex,
    version: metadata.version
  };

  // Process modules for MATERI domain
  if (domainId === 'materi') {
    const modulesDir = path.join(domainPath, 'modules');
    if (fs.existsSync(modulesDir)) {
      const moduleDirs = fs.readdirSync(modulesDir)
        .filter(f => fs.statSync(path.join(modulesDir, f)).isDirectory())
        .sort();

      domainEntry.moduleCount = moduleDirs.length;
      domainEntry.modules = [];

      moduleDirs.forEach(moduleId => {
        const modulePath = path.join(modulesDir, moduleId);
        const moduleMetaPath = path.join(modulePath, 'metadata.json');

        if (fs.existsSync(moduleMetaPath)) {
          const moduleMeta = JSON.parse(fs.readFileSync(moduleMetaPath, 'utf8'));
          domainEntry.modules.push({
            id: moduleMeta.module_id,
            title: moduleMeta.title,
            order: moduleMeta.order,
            status: moduleMeta.status,
            durationMinutes: moduleMeta.metadata?.duration_minutes || 0,
            visualAssetCount: moduleMeta.structure?.visual_assets_count || 0,
            glossaryTermCount: moduleMeta.structure?.glossary_terms || 0
          });
          index.stats.totalModules++;
        }
      });

      metadata.metadata.total_modules = moduleDirs.length;
    }
  }

  // Process exam sets for EXAM_ASLI domain
  if (domainId === 'exam_asli') {
    const examsDir = path.join(domainPath, 'exam_sets');
    if (fs.existsSync(examsDir)) {
      const examDirs = fs.readdirSync(examsDir)
        .filter(f => fs.statSync(path.join(examsDir, f)).isDirectory())
        .sort();

      domainEntry.examSetCount = examDirs.length;
      domainEntry.examSets = [];
      let totalQuestions = 0;

      examDirs.forEach(examId => {
        const examPath = path.join(examsDir, examId);
        const examMetaPath = path.join(examPath, 'metadata.json');

        if (fs.existsSync(examMetaPath)) {
          const examMeta = JSON.parse(fs.readFileSync(examMetaPath, 'utf8'));
          const questionsPath = path.join(examPath, 'questions.json');
          let questionCount = examMeta.metadata?.total_questions || 0;

          if (fs.existsSync(questionsPath)) {
            const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
            questionCount = questions.questions?.length || 0;
          }

          totalQuestions += questionCount;
          domainEntry.examSets.push({
            id: examMeta.exam_set_id,
            title: examMeta.title,
            order: examMeta.order,
            questionCount: questionCount,
            durationMinutes: examMeta.metadata?.duration_minutes || 0,
            passingScore: examMeta.metadata?.passing_score || 70
          });
          index.stats.totalExamSets++;
        }
      });

      domainEntry.questionCount = totalQuestions;
      metadata.metadata.total_sets = examDirs.length;
      metadata.metadata.total_questions = totalQuestions;
      index.stats.totalQuestions += totalQuestions;
    }
  }

  // Process question sets for BANK_SOAL_AI domain
  if (domainId === 'bank_soal_ai') {
    const questionsDir = path.join(domainPath, 'question_sets');
    if (fs.existsSync(questionsDir)) {
      const questionDirs = fs.readdirSync(questionsDir)
        .filter(f => fs.statSync(path.join(questionsDir, f)).isDirectory())
        .sort();

      domainEntry.questionSetCount = questionDirs.length;
      domainEntry.questionSets = [];
      let totalQuestions = 0;

      questionDirs.forEach(questionSetId => {
        const qsetPath = path.join(questionsDir, questionSetId);
        const qsetMetaPath = path.join(qsetPath, 'metadata.json');

        if (fs.existsSync(qsetMetaPath)) {
          const qsetMeta = JSON.parse(fs.readFileSync(qsetMetaPath, 'utf8'));
          const questionsPath = path.join(qsetPath, 'questions.json');
          let questionCount = qsetMeta.metadata?.total_questions || 0;

          if (fs.existsSync(questionsPath)) {
            const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
            questionCount = questions.questions?.length || 0;
          }

          totalQuestions += questionCount;
          domainEntry.questionSets.push({
            id: qsetMeta.question_set_id,
            title: qsetMeta.title,
            order: qsetMeta.order,
            questionCount: questionCount,
            difficulty: qsetMeta.metadata?.difficulty || 'intermediate',
            sourceModule: qsetMeta.metadata?.source_module || null,
            sourceExam: qsetMeta.metadata?.source_exam_set || null
          });
          index.stats.totalQuestionSets++;
        }
      });

      domainEntry.questionCount = totalQuestions;
      metadata.metadata.total_sets = questionDirs.length;
      metadata.metadata.total_questions = totalQuestions;
      index.stats.totalQuestions += totalQuestions;
    }
  }

  domainEntry.metadata = metadata.metadata;
  index.domains.push(domainEntry);
  index.stats.totalDomains++;

  console.log(`✅ Processed: ${domainId}`);
  console.log(`   - Type: ${metadata.domain_type}`);
  if (domainEntry.moduleCount !== undefined) console.log(`   - Modules: ${domainEntry.moduleCount}`);
  if (domainEntry.examSetCount !== undefined) console.log(`   - Exam Sets: ${domainEntry.examSetCount}`);
  if (domainEntry.questionSetCount !== undefined) console.log(`   - Question Sets: ${domainEntry.questionSetCount}`);
  if (domainEntry.questionCount !== undefined) console.log(`   - Questions: ${domainEntry.questionCount}`);
  console.log();
});

// Write output file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

console.log('📊 SUMMARY');
console.log('='.repeat(50));
console.log(`Total Domains: ${index.stats.totalDomains}`);
console.log(`Total Modules: ${index.stats.totalModules}`);
console.log(`Total Exam Sets: ${index.stats.totalExamSets}`);
console.log(`Total Question Sets: ${index.stats.totalQuestionSets}`);
console.log(`Total Questions: ${index.stats.totalQuestions}`);
console.log('='.repeat(50));
console.log(`\n✅ Index generated: ${OUTPUT_FILE}`);
