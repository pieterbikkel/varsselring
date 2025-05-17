<template>
  <div class="container mx-auto p-4">
    <div class="real-container border rounded-lg p-4 mb-2 bg-white shadow">
      <h1 class="text-2xl font-bold mb-4">Volledig Schema</h1>
      <div v-if="loading" class="text-gray-500 mb-4">
        Data wordt geladen...
      </div>
      <div v-else>
        <div v-for="(day, dayKey) in days" :key="dayKey" class="mb-8">
          <h2 class="font-bold text-lg mb-2">{{ day.label }}</h2>
          <div class="table-responsive">
            <table class="w-full border text-sm">
              <thead>
                <tr>
                  <th v-for="col in columns" :key="col.key" class="border px-2 py-1 text-left">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in getRowsForDay(dayKey)" :key="idx">
                  <td v-for="col in columns" :key="col.key" class="border px-2 py-1">
                    {{ row[col.key] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const rijschema = ref<Record<string, unknown> | null>(null);
const loading = ref(true);

const days = {
  '17_mei_2025': { label: 'Zaterdag 17 mei 2025' },
  '18_mei_2025': { label: 'Zondag 18 mei 2025' },
};

const columns = [
  { key: 'session', label: 'Sessie' },
  { key: 'start', label: 'Start tijd' },
  { key: 'end', label: 'Eindtijd / Pitlane' },
  { key: 'class', label: 'Klasse' },
  { key: 'laps', label: 'Aantal rondes' },
  { key: 'race', label: 'Race nr.' },
  { key: 'procedure', label: 'Procedure' },
];

async function loadData() {
  loading.value = true;
  const res = await fetch('/rijschema.json');
  rijschema.value = await res.json();
  loading.value = false;
}

onMounted(loadData);

function getRowsForDay(dayKey: string) {
  if (!rijschema.value || !rijschema.value[dayKey]) return [];
  const dayData = rijschema.value[dayKey];
  const rows: Array<Record<string, unknown>> = [];
  if (dayKey === '17_mei_2025') {
    // Zaterdag: elk blok bevat array van sessies
    for (const blok in dayData as Record<string, Array<Record<string, unknown>>>) {
      for (const sessie of (dayData as Record<string, Array<Record<string, unknown>>>)[blok]) {
        rows.push({
          session: sessie.session || sessie.race || blok,
          start: sessie.start,
          end: sessie.end || sessie.pitlane || '',
          class: sessie.class,
          laps: sessie.laps || '',
          race: sessie.race || '',
          procedure: sessie.procedure || '',
        });
      }
    }
  } else if (dayKey === '18_mei_2025') {
    // Zondag: wedstrijden is array van sessies
    if (Array.isArray((dayData as Record<string, unknown>).wedstrijden)) {
      for (const sessie of (dayData as Record<string, any>).wedstrijden) {
        rows.push({
          session: sessie.session || sessie.race || '',
          start: sessie.start,
          end: sessie.pitlane || '',
          class: sessie.class,
          laps: sessie.laps || '',
          race: sessie.race || '',
          procedure: sessie.procedure || '',
        });
      }
    }
  }
  return rows;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.real-container {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px 0 rgba(31, 41, 55, 0.08);
  padding: 1rem;
}
h1 {
  color: #1e293b;
}
h2 {
  color: #1e40af;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.table-responsive {
  overflow-x: scroll;
}
table {
  width: max-content;
  min-width: 600px;
  border-collapse: collapse;
  margin-top: 0.5rem;
  background: #f8fafc;
}
th,
td {
  border: 1px solid #e5e7eb;
  padding: 0.4rem 0.7rem;
}
th {
  background: #e0e7ef;
  color: #1e293b;
  font-weight: 600;
}
tr:nth-child(even) td {
  background: #f1f5f9;
}
@media (max-width: 900px) {
  .container {
    max-width: 98vw;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
@media (max-width: 600px) {
  .container {
    max-width: 100vw;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
  /* .table-responsive {
    width: 100vw;
    max-width: 100vw;
    margin-left: 50%;
    transform: translateX(-50%);
    overflow-x: auto;
    padding-bottom: 0.5rem;
  } */
  table {
    min-width: 500px;
    font-size: 0.85rem;
    width: max-content;
  }
}
</style>
