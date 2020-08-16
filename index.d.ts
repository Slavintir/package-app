import { AppOptions } from './src/interfaces/app';

export * from './src/errors'
export * from './src/interfaces/app';

declare module 'package-app' {
    export class App {
        run(): Promise<void>;

        static getInstance(options?: AppOptions): App;
    }
}
