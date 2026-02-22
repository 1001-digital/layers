import { Ref } from 'vue';
export declare const useSeconds: () => Ref<number, number>;
export declare const useCountDown: (s: Ref<number | bigint>, showSecondsWithin?: number) => {
    seconds: import('vue').ComputedRef<number>;
    minutes: import('vue').ComputedRef<number>;
    hours: import('vue').ComputedRef<number>;
    days: import('vue').ComputedRef<number>;
    str: import('vue').ComputedRef<string>;
};
export declare const useTimeAgo: (time: Ref<string | undefined>) => Ref<string | undefined, string | undefined>;
/** @deprecated Use `useTimeAgo` instead. */
export declare const useSecondsAgo: (...args: Parameters<typeof useTimeAgo>) => Ref<string | undefined, string | undefined>;
