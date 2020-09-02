import { CallingOptions } from 'moleculer';
import { resolve } from 'path';

import { UnexpectedError } from './errors';

import { MoleculerTransport } from './transports/moleculer';
import { RabbitMqTransport } from './transports/rabbitmq';

import { MongodbResource } from './resources/mongodb';

import { AppOptions, AppConfig, ServiceName, ActionName } from './interfaces/app';

export class App {
    private static instance: App;
    private static moleculerTransport?: MoleculerTransport;
    private static amqpTransport?: RabbitMqTransport;
    private static mongoResource?: MongodbResource;
    private static config: AppConfig = require(resolve('dist', 'env', 'local.js')).default;

    constructor(private options: AppOptions) {
        const { serviceName, transporter } = App.config;

        if (options?.actionsDir && transporter) {
            App.moleculerTransport = new MoleculerTransport(transporter, serviceName, options.actionsDir);
        }

        if (App.config.mongodb) {
            App.mongoResource = new MongodbResource(App.config.mongodb);
        }

        if (App.config.rabbit) {
            App.amqpTransport = new RabbitMqTransport();
        }
    }

    static getConfig<T extends AppConfig>(): T {
        return <T>App.config;
    }

    static getInstance(options: AppOptions): App {
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
            App.moleculerTransport?.listen(this.options.api?.express, this.options.api?.settings),
            App.amqpTransport?.listen(App.config.rabbit)
        ];

        Promise.all(promises);
    }
}