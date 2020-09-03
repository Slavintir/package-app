import { CallingOptions } from 'moleculer';

import { EventPayload, EventListenerHandler } from './src/interfaces/app/amqp';
import { AppOptions, ServiceName, ActionName, AppConfig } from './src/interfaces/app';

export * from './src/errors'
export * from './src/interfaces/app';
export * from './src/interfaces/app/actions';
export * from './src/interfaces/app/amqp';


declare module 'package-app' {
    export class App {
        static config: AppConfig;

        run(): Promise<void>;
        // App methods
        static getConfig<T extends AppConfig>(): T;
        static getInstance(options?: AppOptions): App;
        
        // Moleculer
        static act<T, P>(service: ServiceName, action: ActionName, params: P, options?: CallingOptions): Promise<T>;
        
        // Rabbit MQ
        static createQueue(queueName: string): Promise<void>;
        static subscribe(queueName: string, eventName: string, handler: EventListenerHandler): Promise<void>;
        static publish(queueName: string, payload: EventPayload): Promise<boolean>;
    }
}
