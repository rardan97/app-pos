interface SnapEmbedOptions {
    embedId: string;
    onSuccess?: (result: Record<string, unknown>) => void;
    onPending?: (result: Record<string, unknown>) => void;
    onError?: (result: Record<string, unknown>) => void;
    onClose?: () => void;
}

interface Snap {
    embed: (token: string, options: SnapEmbedOptions) => void;
}

interface Window {
    snap: Snap;
}