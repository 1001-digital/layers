declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    options: {
        type: () => Record<string, any>[];
        default: () => never[];
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
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
        type: import('vue').PropType<string | string[]>;
    };
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string | string[]) => any;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    options: {
        type: () => Record<string, any>[];
        default: () => never[];
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
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
        type: import('vue').PropType<string | string[]>;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | string[]) => any) | undefined;
}>, {
    name: string;
    placeholder: string;
    disabled: boolean;
    options: Record<string, any>[];
    valueKey: string;
    labelKey: string;
    multiple: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
