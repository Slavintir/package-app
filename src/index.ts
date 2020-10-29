import { CallingOptions } from 'moleculer';
import { resolve } from 'path';

import { UnexpectedError } from './errors';

import { MoleculerTransport } from './transports/moleculer';
import { RabbitMqTransport } from './transports/rabbitmq';

import { MongodbResource } from './resources/mongodb';

import { AppOptions, AppConfig, ServiceName, ActionName } from './interfaces/app';
import { Event, EventListenerHandler } from './interfaces/app/amqp';

export class App {
    private static instance: App;
    private static moleculerTransport: MoleculerTransport;
    private static amqpTransport: RabbitMqTransport;
    private static mongoResource: MongodbResource;
    private static config: AppConfig = require(resolve('dist', 'env', 'local.js')).default;

    constructor(private options: AppOptions) {
        const { serviceName, transporter } = App.config;

        if (options?.actionsDir && transporter) {
            App.moleculerTransport = new MoleculerTransport(transporter, serviceName, options.actionsDir);
        }

        if (App.config.mongodb) {
            App.mongoResource = new MongodbResource();
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
        if (this.moleculerTransport) {
            return this.moleculerTransport.act(service, action, params, options);
        }
        
        throw new UnexpectedError('Amqp transport setting not pointed. Update config along config.transporter');
    }

    static createQueue(queueName: string): Promise<void> {
        if (App.amqpTransport) {
            return App.amqpTransport.createQueue(queueName);
        }

        throw new UnexpectedError('Amqp transport setting not pointed. Update config along config.rabbit');
    }

    static publish(queueName: string, event: Event): boolean {
        if (App.amqpTransport) {
            return App.amqpTransport.publish(queueName, event);
        }

        throw new UnexpectedError('Amqp transport setting not pointed. Update config along config.rabbit');
    }

    static async subscribe(queueName: string, eventName: string, handler: EventListenerHandler): Promise<void> {
        if (App.amqpTransport) {
            return App.amqpTransport.subscribe(queueName, eventName, handler);
        }

        throw new UnexpectedError('Amqp transport setting not pointed. Update config along config.rabbit');
    }

    async run(): Promise<void> {
        const promises = [
            App.mongoResource?.connect(App.config.mongodb),
            App.moleculerTransport?.listen(this.options.api?.express, this.options.api?.settings),
            App.amqpTransport?.listen(App.config.rabbit)
        ];

        await Promise.all(promises);
    }
}