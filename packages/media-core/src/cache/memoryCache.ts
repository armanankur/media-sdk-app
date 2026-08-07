export class MemoryCache<T> {

    private cache = new Map<string, T>();

    set(key: string, value: T) {
        this.cache.set(key, value);
    }

    get(key: string) {
        return this.cache.get(key);
    }

    has(key: string) {
        return this.cache.has(key);
    }

    delete(key: string) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}