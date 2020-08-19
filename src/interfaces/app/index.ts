import { ConnectionOptions } from 'mongoose';

export interface MongoDbConfig {
    uris: string;
    options: ConnectionOptions;
}

export enum ServiceName {
    Gateway = 'gateway'
}

export type AppConfig = {
    serviceName: string;
    transporter?: string;
    mongodb?: MongoDbConfig
}

export interface AppOptions {
    actionsDir: string;
}

export { ActionName, ActionHandler, Action } from './actions';