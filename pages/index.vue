<template>
    <div class="container mx-auto p-4">
        <div
class="flex"
            style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; justify-content: center;">
            <a href="https://www.hamove.nl/wegraces/circuit-de-varsselring" target="_blank">
                <img src="/hamove_logo.png" alt="Hamove_logo logo" style="max-width: 200px;">
            </a>
        </div>
        <br>
        <div class="real-container border rounded-lg p-4 mb-2 bg-white shadow">
            <h1 class="text-2xl font-bold mb-4">Zoek een rijder</h1>
            <form @submit.prevent="onSearch">
                <div class="search-items flex flex-col md:flex-row gap-4 mb-4">
                    <label for="">Voornaam</label>
                    <input v-model="search.firstName" placeholder="Voornaam" class="border rounded px-2 py-1">
                    <label for="">Achternaam</label>
                    <input v-model="search.lastName" placeholder="Achternaam" class="border rounded px-2 py-1">
                    <label for="">Rijdernummer</label>
                    <input v-model="search.number" placeholder="Rijdernummer" class="border rounded px-2 py-1" type="number" min="0">
                    <label for="">Klasse</label>
                    <select v-model="search.class" class="border rounded px-2 py-1">
                        <option value="">Alle klassen</option>
                        <option v-for="klasse in allClasses" :key="klasse" :value="klasse">{{ klasse }}</option>
                    </select>
                    <button
                        type="submit" :disabled="loading"
                        class="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50">
                        Zoeken
                    </button>
                </div>
            </form>
            <div v-if="loading" class="text-gray-500 mb-4">
                Data wordt geladen...
            </div>
            <div v-if="filteredRiders.length === 0 && searched" class="text-gray-500">
                Geen rijders gevonden.
            </div>
            <div v-for="rider in filteredRiders" :key="rider.number + '-' + rider.class" class="mb-8">
                <div class="border rounded-lg p-4 mb-2 bg-white shadow">
                    <div class="font-semibold">
                        #{{ rider.number }} - {{ rider.firstName }}
                        {{ rider.lastName }} ({{
                        rider.country || rider.nationality
                        }})
                    </div>
                    <div class="text-sm mb-2">
                        Motor: {{ rider.bike || rider.motor }} | Klasse:
                        {{ rider.class
                        }}<span v-if="rider.team">
                            | Team: {{ rider.team }}</span>
                        <span v-if="rider.isSidecar"> | Zijspan</span>
                    </div>
                    <div>
                        <h2 class="font-bold mt-2">Schema</h2>
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
                                    <tr
v-for="(
                                            row, idx
                                        ) in getScheduleForRider(rider)" :key="idx">
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
    </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref } from "vue";

const search = ref({ firstName: "", lastName: "", number: "", class: "" });
const searched = ref(false);
const loading = ref(true);

const deelnemers = ref<Record<string, unknown> | null>(null);
const rijschema = ref<Record<string, unknown> | null>(null);

async function loadData() {
    loading.value = true;
    if (!deelnemers.value) {
        const res = await fetch("/deelnemers_hamove_2025.json");
        deelnemers.value = (await res.json()).deelnemers;
    }
    if (!rijschema.value) {
        const res = await fetch("/rijschema.json");
        rijschema.value = await res.json();
    }
    loading.value = false;
}

onMounted(loadData);

const allClasses = computed(() => {
    if (!deelnemers.value) return [];
    return Object.keys(deelnemers.value);
});

const filteredRiders = computed(() => {
    if (!searched.value || !deelnemers.value) return [];
    
    const allRiders: Array<Record<string, unknown>> = [];
    for (const klasse in deelnemers.value) {
        for (const r of deelnemers.value[klasse] as Array<
            Record<string, unknown>
        >) {
            if (!r || typeof r !== "object") continue; // skip lege of foute entries
            // Sidecar/driver/passenger case
            if (r.firstName && r.lastName) {
                allRiders.push({ ...r, class: klasse });
            } else if (r.driver && r.passenger) {
                allRiders.push({
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
    const first = search.value.firstName.trim().toLowerCase();
    const last = search.value.lastName.trim().toLowerCase();
    const number = search.value.number.toString().trim();
    const klasse = search.value.class;
    const result = allRiders.filter((rider) => {
        return (
            (!first ||
                (typeof rider.firstName === "string" &&
                    rider.firstName.toLowerCase().includes(first))) &&
            (!last ||
                (typeof rider.lastName === "string" &&
                    rider.lastName.toLowerCase().includes(last))) &&
            (!number ||
                (rider.number !== undefined &&
                    rider.number !== null &&
                    rider.number.toString() === number)) &&
            (!klasse || rider.class === klasse)
        );
    });
    return result;
});

function getScheduleForRider(rider: Record<string, unknown>) {
    if (!rijschema.value) return [];
    const schedule: Array<Record<string, unknown>> = [];
    // Zaterdag (17 mei 2025)
    const zaterdag = rijschema.value["17_mei_2025"] as Record<
        string,
        Array<Record<string, unknown>>
    >;
    if (zaterdag) {
        for (const blok in zaterdag) {
            for (const sessie of zaterdag[blok]) {
                if (sessie.class === rider.class) {
                    schedule.push({
                        day: "zaterdag",
                        session: sessie.session || sessie.race || blok,
                        startTime: sessie.start,
                        endTime: sessie.end || sessie.pitlane || "",
                        laps: sessie.laps || "",
                        class: sessie.class,
                        raceNumber: sessie.race || "",
                        procedure: sessie.procedure || "",
                    });
                }
            }
        }
    }
    // Zondag (18 mei 2025)
    const zondag = rijschema.value["18_mei_2025"] as Record<
        string,
        Array<Record<string, unknown>>
    >;
    if (zondag && Array.isArray(zondag.wedstrijden)) {
        for (const sessie of zondag.wedstrijden) {
            if (sessie.class === rider.class) {
                schedule.push({
                    day: "zondag",
                    session: sessie.session || sessie.race || "",
                    startTime: sessie.start,
                    endTime: sessie.pitlane || "",
                    laps: sessie.laps || "",
                    class: sessie.class,
                    raceNumber: sessie.race || "",
                    procedure: sessie.procedure || "",
                });
            }
        }
    }
    return schedule;
}

function onSearch() {
    if (!deelnemers.value) return; // voorkom zoeken zonder data
    searched.value = true;
}

const columns = [
    { key: "day", label: "Dag" },
    { key: "session", label: "Sessie" },
    { key: "startTime", label: "Start tijd" },
    { key: "endTime", label: "Eindtijd / Pitlane" },
    { key: "laps", label: "Aantal rondes" },
    { key: "class", label: "Klasse" },
    { key: "raceNumber", label: "Race nr." },
    { key: "procedure", label: "Procedure" },
];
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");

body {
    margin: 0 !important;
    padding: 0;
    font-family: "Poppins", sans-serif;
    background: #f3f4f6;
}

.real-container {
    background: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 2px 8px 0 rgba(31, 41, 55, 0.08);
    padding: 1rem;
    max-width: 1000px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

p,
h1,
h2,
h3,
h4,
h5,
td,
th,
label,
h6 {
    font-family: "Poppins", sans-serif;
}
.container {
    margin-left: auto;
    margin-right: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.search-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

form {
    margin-bottom: 1.5rem;
}
input {
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    background: #f9fafb;
    transition: border 0.2s;
}
input:focus {
    outline: none;
    border-color: #2563eb;
    background: #fff;
}
button[type="submit"] {
    background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
    color: #fff;
    padding: 0.5rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
}
button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
.border {
    border: 1px solid #e5e7eb;
}
.rounded-lg {
    border-radius: 0.75rem;
}
.bg-white {
    background: #fff;
}
.shadow {
    box-shadow: 0 2px 8px 0 rgba(31, 41, 55, 0.08);
}
.font-semibold {
    font-weight: 600;
    font-size: 1.1rem;
}
.text-sm {
    font-size: 0.95rem;
    color: #374151;
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
    .table-responsive {
        width: 100vw;
        max-width: 100vw;
        margin-left: 50%;
        transform: translateX(-50%);
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }
    table {
        min-width: 500px;
        font-size: 0.85rem;
        width: max-content;
    }
}
</style>
