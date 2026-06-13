const fs = require('fs');

const ids = [];
for (let i = 1; i <= 48; i++) ids.push(i);
for (let i = 65; i <= 88; i++) ids.push(i);

// 72 items exactly
const schedule = [
  // June 11 (2 matches)
  { date: '2026-06-11 12:00:00-06' }, { date: '2026-06-11 16:00:00-06' },
  // June 12 (2 matches)
  { date: '2026-06-12 15:00:00-06' }, { date: '2026-06-12 18:00:00-06' },
];

// June 13 to June 23 (11 days, 4 matches per day)
for (let day = 13; day <= 23; day++) {
  const dStr = `2026-06-${day.toString().padStart(2, '0')}`;
  schedule.push({ date: `${dStr} 12:00:00-06` });
  schedule.push({ date: `${dStr} 15:00:00-06` });
  schedule.push({ date: `${dStr} 18:00:00-06` });
  schedule.push({ date: `${dStr} 21:00:00-06` });
}

// June 24 to June 27 (4 days, 6 matches per day - simultaneous)
for (let day = 24; day <= 27; day++) {
  const dStr = `2026-06-${day.toString().padStart(2, '0')}`;
  schedule.push({ date: `${dStr} 12:00:00-06` });
  schedule.push({ date: `${dStr} 12:00:00-06` });
  schedule.push({ date: `${dStr} 15:00:00-06` });
  schedule.push({ date: `${dStr} 15:00:00-06` });
  schedule.push({ date: `${dStr} 18:00:00-06` });
  schedule.push({ date: `${dStr} 18:00:00-06` });
}

if (ids.length !== schedule.length) {
  console.error("Mismatch:", ids.length, schedule.length);
  process.exit(1);
}

// Generate the SQL migration for the user
let sqlMigration = '-- Corregir el calendario completo de la fase de grupos (72 partidos)\n\n';
for (let i = 0; i < ids.length; i++) {
  sqlMigration += `UPDATE public.quiniela_matches SET match_date = '${schedule[i].date}' WHERE match_number = ${ids[i]};\n`;
}

fs.writeFileSync('supabase/migrations/005_fix_full_group_schedule.sql', sqlMigration);
console.log('Migration generated.');

// Update the seed file in-place
const seedFile = 'supabase/migrations/002_quiniela_seed.sql';
let content = fs.readFileSync(seedFile, 'utf8');

for (let i = 0; i < ids.length; i++) {
  const id = ids[i];
  const date = schedule[i].date;
  const regex = new RegExp(`^\\(${id},\\s*'GROUP',([^,]+),([^,]+),([^,]+),'[^']+',(.*)$`, 'm');
  content = content.replace(regex, `(${id},  'GROUP',$1,$2,$3,'${date}',$4`);
}

fs.writeFileSync(seedFile, content);
console.log('Seed updated.');
