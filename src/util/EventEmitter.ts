
export type EventEmitterCallback = (event: any) => void;

export class EventEmitter {
    private listeners: Map<string, EventEmitterCallback[]> = new Map();


    on(event: string, cb: EventEmitterCallback): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(cb);
    }

    emit(event: string, data: any): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event)?.forEach(cb => cb(data));
    }
}

