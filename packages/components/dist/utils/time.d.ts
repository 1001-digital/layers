import { DateTime } from 'luxon';
export declare const delay: (ms: number) => Promise<void>;
export declare const daysInSeconds: (days: number) => number;
export declare const nowInSeconds: () => number;
export declare const asUTCDate: (date: Date | null) => DateTime<true> | DateTime<false> | null;
