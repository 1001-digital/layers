type __VLS_Props = {
    className?: string;
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
        connected?(_: {
            address: `0x${string}` | undefined;
        }): any;
    };
    refs: {};
    rootEl: any;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    connected: (args_0: {
        address: `0x${string}` | undefined;
    }) => any;
    disconnected: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onConnected?: ((args_0: {
        address: `0x${string}` | undefined;
    }) => any) | undefined;
    onDisconnected?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
