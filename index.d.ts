import { AppOptions, ServiceName, ActionName } from './src/interfaces/app';
import { CallingOptions } from 'moleculer';

export * from './src/errors'
export * from './src/interfaces/app';
export * from './src/interfaces/app/actions';

declare module 'package-app' {
    export class App {
        run(): Promise<void>;

        static getInstance(options?: AppOptions): App;
        static act<T, P>(service: ServiceName, action: ActionName, params: P, options?: CallingOptions): Promise<T>;
    }
}
