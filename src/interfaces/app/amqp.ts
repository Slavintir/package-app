export interface EventMeta {
    initiator: string;
    date: Date;
}

export interface EventPayload {
    [key: string]: unknown | unknown[];
}

export interface Event {
    eventName: string;
    payload: EventPayload;
}

export type EventListenerHandler = (payload: any, meta: EventMeta) => Promise<void>;

export interface EventListener {
    readonly eventName: string;
    handler: EventListenerHandler;
}