import { ActionHandler } from 'moleculer';

export interface AppAction {
    handler: ActionHandler;
}

export type AppConfig = {
    transporter: string;
    serviceName: string;
}

export interface AppOptions {
    actionsDir: string;
}

export type AppEntryPoint = () => Promise<void>;