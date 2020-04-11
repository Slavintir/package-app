import { ActionHandler } from 'moleculer';

export interface AppAction {
    handler: ActionHandler;
}

export type AppConfig = {
    transporter: string;
    serviceName: ServiceName;
}

export enum ServiceName {
    Example = 'Example'
}

export interface AppOptions {
    actionsDir: string;
}

export type AppEntryPoint = () => Promise<void>;