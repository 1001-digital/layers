export declare function createCache<T>(ttl: number, max: number): {
    get: (key: string) => T | undefined;
    fetch: (key: string, fn: () => Promise<T>) => Promise<T>;
};
