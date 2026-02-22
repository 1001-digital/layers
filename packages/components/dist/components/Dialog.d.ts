type __VLS_Props = {
    title?: string;
    class?: string | string[] | Record<string, boolean>;
    clickOutside?: boolean;
    closable?: boolean;
    compat?: boolean;
    large?: boolean;
};
type __VLS_PublicProps = {
    'open': boolean;
} & __VLS_Props;
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
        footer?(_: {}): any;
    };
    refs: {
        dialog: unknown;
    };
    rootEl: any;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    closed: () => any;
    "update:open": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onClosed?: (() => any) | undefined;
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    clickOutside: boolean;
    closable: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    dialog: unknown;
}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
