export declare const useGasPrice: () => import('vue').ComputedRef<{
    wei: bigint;
    gwei: string;
    eth: string;
    formatted: {
        gwei: string | number;
        eth: string;
    };
}>;
