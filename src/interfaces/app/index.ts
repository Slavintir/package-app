import { ActionHandler } from 'moleculer';
import { ConnectionOptions } from 'mongoose';

export interface AppAction {
    handler: ActionHandler;
}

export interface MongoDbConfig {
    uris: string;
    options: ConnectionOptions;
}

export type AppConfig = {
    serviceName: string;
    transporter?: string;
    mongodb?: MongoDbConfig
}

export interface AppOptions {
    actionsDir: string;
}

export type AppEntryPoint = () => Promise<void>;