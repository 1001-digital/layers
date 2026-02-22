declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    options: {
        type: () => Record<string, any>[];
        default: () => never[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    orientation: {
        type: () => "horizontal" | "vertical";
        default: string;
    };
    valueKey: {
        type: StringConstructor;
        default: string;
    };
    labelKey: {
        type: StringConstructor;
        default: string;
    };
    name: {
        type: StringConstructor;
        default: undefined;
    };
    modelValue: {
        type: import('vue').PropType<string>;
    };
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    options: {
        type: () => Record<string, any>[];
        default: () => never[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    orientation: {
        type: () => "horizontal" | "vertical";
        default: string;
    };
    valueKey: {
        type: StringConstructor;
        default: string;
    };
    labelKey: {
        type: StringConstructor;
        default: string;
    };
    name: {
        type: StringConstructor;
        default: undefined;
    };
    modelValue: {
        type: import('vue').PropType<string>;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    name: string;
    disabled: boolean;
    options: Record<string, any>[];
    orientation: "horizontal" | "vertical";
    valueKey: string;
    labelKey: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
