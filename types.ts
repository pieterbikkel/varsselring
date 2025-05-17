// TypeScript types for Rider and Schedule
export type Rider = {
    number: number;
    firstName: string;
    lastName: string;
    country: string;
    bike: string;
    class: string;
};

export type ScheduleEntry = {
    day: "zaterdag" | "zondag";
    openTime: string;
    startTime: string;
    laps: number;
    class: string;
    raceNumber: number;
};

export type RiderWithSchedule = Rider & {
    schedule: ScheduleEntry[];
};
