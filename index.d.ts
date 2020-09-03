import { CallingOptions } from 'moleculer';

import { EventPayload } from './src/interfaces/app/amqp';
import { AppOptions, ServiceName, ActionName, AppConfig } from './src/interfaces/app';

export * from './src/errors'
export * from './src/interfaces/app';
export * from './src/interfaces/app/actions';
export * from './src/interfaces/app/amqp';


declare module 'package-app' {
    export class App {
        static config: AppConfig;

        run(): Promise<void>;

        static getConfig<T extends AppConfig>(): T;
        static getInstance(options?: AppOptions): App;
        static act<T, P>(service: ServiceName, action: ActionName, params: P, options?: CallingOptions): Promise<T>;
        static publish(queueName: string, payload: EventPayload): Promise<boolean>;
        static createQueue(queueName: string): Promise<void>;
    }
}
