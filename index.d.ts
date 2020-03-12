export * from './src/interfaces';

declare module 'package-app' {
    export class App {
        start(): Promise<void>;
    }
}
