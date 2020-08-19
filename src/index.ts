import { CallingOptions } from 'moleculer';
import { resolve } from 'path';

import { MoleculerTransport } from './transports/moleculer';

import { MongodbResource } from './resources/mongodb';

import { AppOptions, AppConfig, ServiceName, ActionName } from './interfaces/app';
import { UnexpectedError } from './errors';

export class App {
    private static instance: App;
    private config: AppConfig = require(resolve('dist', 'env', 'local.js')).default;
    private static moleculerTransport?: MoleculerTransport;
    private static mongoResource?: MongodbResource;

    constructor(options?: AppOptions) {
        const { serviceName, transporter } = this.config;

        if (options?.actionsDir && transporter) {
            App.moleculerTransport = new MoleculerTransport(transporter, serviceName, options.actionsDir);
        }

        if (this.config.mongodb) {
            App.mongoResource = new MongodbResource(this.config.mongodb);
        }
    }

    static getInstance(options?: AppOptions): App {
        return App.instance ? App.instance : new App(options);
    }

    static async act<T, P>(service: ServiceName, action: ActionName, params: P, options?: CallingOptions): Promise<T> {
        if (!this.moleculerTransport) {
            throw new UnexpectedError('Moleculer transport did not initialized', { service, action, params });
        }

        return this.moleculerTransport.act(service, action, params, options);
    }

    async run(): Promise<void> {
        const promises = [
            App.mongoResource?.connect(),
            App.moleculerTransport?.listen()
        ];

        Promise.all(promises);
    }
}