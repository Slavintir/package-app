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
    meta: EventMeta;
}

export type EventListenerHandler = (payload: EventPayload, meta: EventMeta) => Promise<void>;

export interface EventListener {
    readonly eventName: string;
    handler: EventListenerHandler;
}