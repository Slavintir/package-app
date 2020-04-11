import { AppOptions } from './src/interfaces/app';

export * from './src/decorators/actions';
export * from './src/errors/action'
export * from './src/interfaces/app';

declare module 'package-app' {
    export class App {
        start(): Promise<void>;

        static getInstance(options?: AppOptions): App;
    }
}
