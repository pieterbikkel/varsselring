<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Alle rijders</h1>
    <div class="mb-4">
      <label for="klasse" class="mr-2">Filter op klasse:</label>
      <select id="klasse" v-model="selectedKlasse" class="border rounded px-2 py-1">
        <option value="">Alle klassen</option>
        <option v-for="klasse in klassen" :key="klasse" :value="klasse">{{ klasse }}</option>
      </select>
    </div>
    <div v-if="loading" class="text-gray-500 mb-4">Data wordt geladen...</div>
    <div v-if="filteredRiders.length === 0 && !loading" class="text-gray-500">Geen rijders gevonden.</div>
    <div class="rider-table">
      <table v-if="filteredRiders.length > 0" class="w-full border text-sm">
        <thead>
          <tr>
            <th v-for="col in tableColumns" :key="col.key" class="border px-2 py-1 text-left cursor-pointer select-none" @click="sortBy(col.key)">
              {{ col.label }}
              <span v-if="sortKey === col.key">
                <span v-if="sortAsc">▲</span>
                <span v-else>▼</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rider in sortedRiders" :key="rider.number + '-' + rider.class">
            <td class="border px-2 py-1">{{ rider.number }}</td>
            <td class="border px-2 py-1">{{ rider.firstName }}</td>
            <td class="border px-2 py-1">{{ rider.lastName }}</td>
            <td class="border px-2 py-1">{{ rider.country || rider.nationality }}</td>
            <td class="border px-2 py-1">{{ rider.bike || rider.motor }}</td>
            <td class="border px-2 py-1">{{ rider.class }}</td>
            <td class="border px-2 py-1">{{ rider.team || '' }}</td>
            <td class="border px-2 py-1">{{ rider.isSidecar ? 'Ja' : '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="filteredRiders.length > 0" class="mt-4 text-right text-sm text-gray-700">
      Totaal aantal rijders: <span class="font-bold">{{ filteredRiders.length }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const deelnemers = ref<Record<string, unknown> | null>(null);
const loading = ref(true);
const selectedKlasse = ref('');

async function loadData() {
  loading.value = true;
  if (!deelnemers.value) {
    const res = await fetch('/deelnemers_hamove_2025.json');
    deelnemers.value = (await res.json()).deelnemers;
  }
  loading.value = false;
}

onMounted(loadData);

const allRiders = computed(() => {
  if (!deelnemers.value) return [];
  const riders: Array<Record<string, unknown>> = [];
  for (const klasse in deelnemers.value) {
    for (const r of deelnemers.value[klasse] as Array<Record<string, unknown>>) {
      if (!r || typeof r !== 'object') continue;
      if (r.firstName && r.lastName) {
        riders.push({ ...r, class: klasse });
      } else if (r.driver && r.passenger) {
        riders.push({
          number: r.number,
          firstName: r.driver,
          lastName: r.passenger,
          country: r.nationality,
          bike: r.motor,
          class: klasse,
          team: r.team,
          isSidecar: true,
        });
      }
    }
  }
  return riders;
});

const klassen = computed(() => {
  if (!deelnemers.value) return [];
  return Object.keys(deelnemers.value);
});

const filteredRiders = computed(() => {
  if (!allRiders.value) return [];
  if (!selectedKlasse.value) return allRiders.value;
  return allRiders.value.filter(r => r.class === selectedKlasse.value);
});

const tableColumns = [
  { key: 'number', label: '#' },
  { key: 'firstName', label: 'Voornaam' },
  { key: 'lastName', label: 'Achternaam' },
  { key: 'country', label: 'Land' },
  { key: 'bike', label: 'Motor' },
  { key: 'class', label: 'Klasse' },
  { key: 'team', label: 'Team' },
  { key: 'isSidecar', label: 'Zijspan' },
];
const sortKey = ref('number');
const sortAsc = ref(true);
function sortBy(key: string) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}
const sortedRiders = computed(() => {
  const riders = [...filteredRiders.value];
  const key = sortKey.value;
  const asc = sortAsc.value;
  return riders.sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    // Normalize for undefined/null
    if (aVal === undefined || aVal === null) aVal = '';
    if (bVal === undefined || bVal === null) bVal = '';
    // For isSidecar, sort as boolean
    if (key === 'isSidecar') {
      return asc ? (aVal === bVal ? 0 : aVal ? -1 : 1) : (aVal === bVal ? 0 : aVal ? 1 : -1);
    }
    // Numeric sort for number
    if (key === 'number') {
      return asc ? (Number(aVal) - Number(bVal)) : (Number(bVal) - Number(aVal));
    }
    // Default: string sort
    return asc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
});
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px 0 rgba(31, 41, 55, 0.08);
  padding: 1rem;
}
.rider-table {
    width: 100%;
    overflow-x: scroll;
    margin-left: auto;
    margin-right: auto;
    max-width: 1000px;
}
</style>
