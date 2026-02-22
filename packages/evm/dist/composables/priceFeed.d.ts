export declare const usePriceFeed: () => {
    ethUSDRaw: import('vue').ComputedRef<bigint | null>;
    ethUSD: import('vue').ComputedRef<bigint>;
    ethUSC: import('vue').ComputedRef<bigint>;
    ethUSDFormatted: import('vue').ComputedRef<string>;
    weiToUSD: (wei: bigint) => string;
    fetchPrice: () => Promise<void>;
};
