export declare const useClipboard: () => {
    copy: (text: string) => Promise<boolean>;
    copied: import('vue').Ref<boolean, boolean>;
};
