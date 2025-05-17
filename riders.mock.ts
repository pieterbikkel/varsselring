import type { RiderWithSchedule } from "~/types";

// Mock data for demonstration
export const riders: RiderWithSchedule[] = [
    {
        number: 12,
        firstName: "Jan",
        lastName: "Jansen",
        country: "NL",
        bike: "Yamaha R6",
        class: "Supersport",
        schedule: [
            {
                day: "zaterdag",
                openTime: "09:00",
                startTime: "09:30",
                laps: 10,
                class: "Supersport",
                raceNumber: 1,
            },
            {
                day: "zondag",
                openTime: "11:00",
                startTime: "11:30",
                laps: 12,
                class: "Supersport",
                raceNumber: 3,
            },
        ],
    },
    {
        number: 34,
        firstName: "Piet",
        lastName: "Pietersen",
        country: "BE",
        bike: "Honda CBR600",
        class: "Superbike",
        schedule: [
            {
                day: "zaterdag",
                openTime: "10:00",
                startTime: "10:30",
                laps: 8,
                class: "Superbike",
                raceNumber: 2,
            },
            {
                day: "zondag",
                openTime: "12:00",
                startTime: "12:30",
                laps: 10,
                class: "Superbike",
                raceNumber: 4,
            },
        ],
    },
];
