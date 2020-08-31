import { AppOptions, ServiceName, ActionName, AppConfig } from './src/interfaces/app';
import { CallingOptions } from 'moleculer';

export * from './src/errors'
export * from './src/interfaces/app';
export * from './src/interfaces/app/actions';

declare module 'package-app' {
    export class App {
        static config: AppConfig;

        run(): Promise<void>;

        static getConfig<T extends AppConfig>(): T;
        static getInstance(options?: AppOptions): App;
        static act<T, P>(service: ServiceName, action: ActionName, params: P, options?: CallingOptions): Promise<T>;
        static publish(queue: string, message: string): boolean | undefined;
        static createChannel(queue: string): Promise<void>;
    }
}
