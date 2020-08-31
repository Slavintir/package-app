import { Express } from 'express';
import { ConnectionOptions } from 'mongoose';
import { ServiceSettingSchema } from 'moleculer';
import { Options } from 'amqplib';

export interface MongoDbConfig {
    uris: string;
    options: ConnectionOptions;
}

export enum ServiceName {
    Gateway = 'gateway',
    Auth = 'auth'
}

export interface RabbitConfig {
    host: string;
    port: number;
}

export interface AppConfig {
    serviceName: string;
    transporter?: string;
    mongodb?: MongoDbConfig;
    rabbit?: RabbitConfig;
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