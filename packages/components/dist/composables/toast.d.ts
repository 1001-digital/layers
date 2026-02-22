export interface ToastAction {
    label: string;
    onClick: () => void;
}
export type ToastVariant = 'info' | 'success' | 'error';
export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    action?: ToastAction;
    duration?: number;
}
export declare const useToast: () => {
    toasts: import('vue').Ref<{
        id: string;
        title?: string | undefined;
        description?: string | undefined;
        variant?: ToastVariant | undefined;
        action?: {
            label: string;
            onClick: () => void;
        } | undefined;
        duration?: number | undefined;
    }[], Toast[] | {
        id: string;
        title?: string | undefined;
        description?: string | undefined;
        variant?: ToastVariant | undefined;
        action?: {
            label: string;
            onClick: () => void;
        } | undefined;
        duration?: number | undefined;
    }[]>;
    add: (toast: Omit<Toast, "id">) => void;
    dismiss: (id: string) => void;
};
