'use strict';

// Dövlət reyestri üçün məlumat keyfiyyəti auditoru.
// Yalnız Node.js-in daxili 'fs' modulundan istifadə edir.
const fs = require('fs');

const INPUT_FILE = __dirname + '/database.json';
const OUTPUT_FILE = __dirname + '/audit_report.json';
const ADULT_AGE = 18;
const NAME_FIELDS = ['ad', 'soyad', 'ata_adi'];

function isEmpty(value) {
  return value === null || value === undefined || String(value).trim() === '';
}

function parseDate(value) {
  if (isEmpty(value)) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function calculateAge(birthDate, today) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayPassed) age--;
  return age;
}

function summary(record) {
  return { id: record.id, ad: record.ad, soyad: record.soyad, ata_adi: record.ata_adi };
}

// 1. Entity Resolution: eyni FİN, fərqli ad / soyad / ata adı
function findDuplicates(records) {
  const groups = new Map();
  for (const record of records) {
    if (isEmpty(record.fin_kod)) continue;
    const fin = String(record.fin_kod).trim().toUpperCase();
    if (!groups.has(fin)) groups.set(fin, []);
    groups.get(fin).push(record);
  }

  const duplicates = [];
  for (const [fin, group] of groups) {
    if (group.length < 2) continue;

    const differences = {};
    for (const field of NAME_FIELDS) {
      const variants = [...new Set(group.map((r) => r[field]))];
      if (variants.length > 1) differences[field] = variants;
    }

    if (Object.keys(differences).length > 0) {
      duplicates.push({
        fin_kod: fin,
        qeyd_sayi: group.length,
        qeyd_idleri: group.map((r) => r.id),
        ferqlenen_saheler: differences,
        qeydler: group.map(summary),
      });
    }
  }
  return duplicates;
}

// 2. Logic Engine: məntiqi anomaliyalar
function findLogicalAnomalies(records, today) {
  const anomalies = [];
  for (const record of records) {
    const birth = parseDate(record.dogum_tarixi);
    if (!birth) continue;

    const age = calculateAge(birth, today);
    if (age < ADULT_AGE && record.suruculuk_vesiqesi === true) {
      anomalies.push({
        ...summary(record),
        qayda: 'YETKINLIK_YASINA_CATMAYAN_SURUCU',
        tesvir: `Vətəndaşın yaşı ${age}-dir (< ${ADULT_AGE}), lakin sürücülük vəsiqəsi var.`,
        dogum_tarixi: record.dogum_tarixi,
        yas: age,
        suruculuk_vesiqesi: record.suruculuk_vesiqesi,
      });
    }

    const marriage = parseDate(record.nikah_tarixi);
    if (marriage && marriage < birth) {
      anomalies.push({
        ...summary(record),
        qayda: 'NIKAH_DOGUMDAN_EVVEL',
        tesvir: 'Nikah tarixi doğum tarixindən əvvəldir.',
        dogum_tarixi: record.dogum_tarixi,
        nikah_tarixi: record.nikah_tarixi,
      });
    }
  }
  return anomalies;
}

// 3. Boş FİN kodları
function findMissingFin(records) {
  return records
    .filter((r) => isEmpty(r.fin_kod))
    .map((r) => ({
      ...summary(r),
      sahe: 'fin_kod',
      deyer: r.fin_kod === undefined ? 'undefined' : r.fin_kod,
    }));
}

function runAudit() {
  const records = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  if (!Array.isArray(records)) {
    throw new Error('database.json massiv (array) formatında olmalıdır.');
  }

  const today = new Date();
  const Dublikatlar = findDuplicates(records);
  const Mentiqi_Anomaliyalar = findLogicalAnomalies(records, today);
  const Bos_Melumatlar = findMissingFin(records);

  const report = {
    audit_tarixi: today.toISOString(),
    yoxlanilan_qeyd_sayi: records.length,
    xulase: {
      dublikat_qrup_sayi: Dublikatlar.length,
      mentiqi_anomaliya_sayi: Mentiqi_Anomaliyalar.length,
      bos_fin_sayi: Bos_Melumatlar.length,
    },
    Dublikatlar,
    Mentiqi_Anomaliyalar,
    Bos_Melumatlar,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2), 'utf8');
  return report;
}

module.exports = { runAudit, findDuplicates, findLogicalAnomalies, findMissingFin };

if (require.main === module) {
  try {
    const report = runAudit();
    console.log('Audit tamamlandı -> audit_report.json');
    console.log(report.xulase);
  } catch (err) {
    console.error('Audit xətası:', err.message);
    process.exit(1);
  }
}
