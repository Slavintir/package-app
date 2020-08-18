import { resolve } from 'path';

import { MoleculerTransport } from './transports/moleculer';

import { MongodbResource } from './resources/mongodb';

import { AppOptions, AppConfig } from './interfaces/app';

export class App {
    private static instance: App;
    private config: AppConfig = require(resolve('dist', 'env', 'local.js')).default;
    private moleculerTransport?: MoleculerTransport;
    private mongoResource?: MongodbResource;

    constructor(options?: AppOptions) {
        const { serviceName, transporter } = this.config;

        if (options?.actionsDir && transporter) {
            this.moleculerTransport = new MoleculerTransport(transporter, serviceName, options.actionsDir);
        }

        if (this.config.mongodb) {
            this.mongoResource = new MongodbResource(this.config.mongodb);
        }
    }

    static getInstance(options?: AppOptions): App {
        return App.instance ? App.instance : new App(options);
    }

    async run(): Promise<void> {
        const promises = [
            this.mongoResource?.connect(),
            this.moleculerTransport?.listen()
        ];

        Promise.all(promises);
    }
}