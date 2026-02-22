import { MaybeRefOrGetter } from 'vue';
import { EnsProfile } from '../utils/ens';
type EnsMode = 'indexer' | 'chain';
interface UseEnsOptions {
    mode?: MaybeRefOrGetter<EnsMode | undefined>;
}
export declare const useEns: (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) => import('@tanstack/vue-query').UseQueryReturnType<EnsProfile | null, Error>;
export declare const useEnsWithAvatar: (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) => import('@tanstack/vue-query').UseQueryReturnType<EnsProfile | null, Error>;
export declare const useEnsProfile: (identifier: MaybeRefOrGetter<string | undefined>, options?: UseEnsOptions) => import('@tanstack/vue-query').UseQueryReturnType<EnsProfile | null, Error>;
export {};
