interface ChainConfig {
    id: number;
    blockExplorer: string;
}
export declare const useChainConfig: (key?: string) => ChainConfig;
export declare const useMainChainId: () => number;
export declare const useBlockExplorer: (key?: string) => string;
export declare const useEnsureChainIdCheck: () => () => Promise<boolean>;
export {};
