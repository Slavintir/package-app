import { ConnectionOptions } from 'mongoose';
import { Express } from 'express';
import { ServiceSettingSchema } from 'moleculer';

export interface MongoDbConfig {
    uris: string;
    options: ConnectionOptions;
}

export enum ServiceName {
    Gateway = 'gateway',
    Auth = 'auth'
}

export interface AppConfig {
    serviceName: string;
    transporter?: string;
    mongodb?: MongoDbConfig;
}

export interface AppApiOptions {
    express: Express;
    settings: ServiceSettingSchema;
}

export interface AppOptions {
    actionsDir: string;
    api?: AppApiOptions;
}

export { ActionName, ActionHandler, Action } from './actions';