import { TransactionReceipt, Hash } from 'viem';
interface TextConfig {
    title?: Record<string, string>;
    lead?: Record<string, string>;
    action?: Record<string, string>;
}
type Step = 'idle' | 'confirm' | 'chain' | 'requesting' | 'waiting' | 'complete' | 'error';
type __VLS_Props = {
    text?: TextConfig;
    request?: () => Promise<Hash>;
    delayAfter?: number;
    delayAutoclose?: number;
    skipConfirmation?: boolean;
    autoCloseSuccess?: boolean;
    dismissable?: boolean;
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: Partial<Record<NonNullable<Step>, (_: {
        cancel: () => void;
    }) => any>> & {
        start?(_: {
            start: () => void;
            step: Step;
            open: boolean;
        }): any;
        before?(_: {}): any;
        actions?(_: {
            step: Step;
            cancel: () => void;
            execute: () => Promise<{
                blobGasPrice?: bigint | undefined;
                blobGasUsed?: bigint | undefined;
                blockHash: Hash;
                blockNumber: bigint;
                contractAddress: import('viem').Address | null | undefined;
                cumulativeGasUsed: bigint;
                effectiveGasPrice: bigint;
                from: import('viem').Address;
                gasUsed: bigint;
                logs: {
                    address: import('viem').Address;
                    blockHash: `0x${string}`;
                    blockNumber: bigint;
                    blockTimestamp?: bigint | undefined;
                    data: import('viem').Hex;
                    logIndex: number;
                    transactionHash: `0x${string}`;
                    transactionIndex: number;
                    removed: boolean;
                    topics: [import('viem').Hex, ...import('viem').Hex[]] | [];
                }[];
                logsBloom: import('viem').Hex;
                root?: `0x${string}` | undefined;
                status: "success" | "reverted";
                to: import('viem').Address | null;
                transactionHash: Hash;
                transactionIndex: number;
                type: import('viem').TransactionType;
            } | null | undefined>;
            txLink: string;
        }): any;
    };
    refs: {};
    rootEl: any;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {
    initializeRequest: (request?: (() => Promise<Hash>) | undefined) => Promise<{
        blobGasPrice?: bigint | undefined;
        blobGasUsed?: bigint | undefined;
        blockHash: Hash;
        blockNumber: bigint;
        contractAddress: import('viem').Address | null | undefined;
        cumulativeGasUsed: bigint;
        effectiveGasPrice: bigint;
        from: import('viem').Address;
        gasUsed: bigint;
        logs: {
            address: import('viem').Address;
            blockHash: `0x${string}`;
            blockNumber: bigint;
            blockTimestamp?: bigint | undefined;
            data: import('viem').Hex;
            logIndex: number;
            transactionHash: `0x${string}`;
            transactionIndex: number;
            removed: boolean;
            topics: [import('viem').Hex, ...import('viem').Hex[]] | [];
        }[];
        logsBloom: import('viem').Hex;
        root?: `0x${string}` | undefined;
        status: "success" | "reverted";
        to: import('viem').Address | null;
        transactionHash: Hash;
        transactionIndex: number;
        type: import('viem').TransactionType;
    } | null | undefined>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    complete: (receipt: TransactionReceipt) => any;
    cancel: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onComplete?: ((receipt: TransactionReceipt) => any) | undefined;
    onCancel?: (() => any) | undefined;
}>, {
    delayAfter: number;
    delayAutoclose: number;
    skipConfirmation: boolean;
    autoCloseSuccess: boolean;
    dismissable: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
