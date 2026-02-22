import { PublicClient } from 'viem';
export interface EnsProfile {
    address: string;
    ens: string | null;
    data: {
        avatar: string;
        header: string;
        description: string;
        links: {
            url: string;
            email: string;
            twitter: string;
            github: string;
        };
    } | null;
}
export declare const ENS_KEYS_AVATAR: readonly ["avatar"];
export declare const ENS_KEYS_PROFILE: ("description" | "avatar" | "header" | "url" | "email" | "com.twitter" | "com.github")[];
export declare const ensCache: {
    get: (key: string) => EnsProfile | undefined;
    fetch: (key: string, fn: () => Promise<EnsProfile>) => Promise<EnsProfile>;
};
export declare function fetchEnsFromIndexer(identifier: string, urls: string[]): Promise<EnsProfile>;
export declare function fetchEnsFromChain(identifier: string, client: PublicClient, keys?: string[]): Promise<EnsProfile>;
