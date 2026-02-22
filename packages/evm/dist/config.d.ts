import { InjectionKey } from 'vue';
export interface EvmChainConfig {
    id: number;
    blockExplorer?: string;
}
export interface EvmConfig {
    title?: string;
    defaultChain?: string;
    chains: Record<string, EvmChainConfig>;
    ens?: {
        mode?: 'indexer' | 'chain';
        indexerUrls?: string[];
    };
    baseURL?: string;
}
export declare const EvmConfigKey: InjectionKey<EvmConfig>;
export declare const defaultEvmConfig: EvmConfig;
export declare const useEvmConfig: () => EvmConfig;
