import 'module-alias/register';

import { resolve } from 'path';

import { MoleculerTransport } from './transports/moleculer';

import { AppOptions, AppConfig } from './interfaces/app';

const cfg: AppConfig = require(resolve('dist', 'env', 'local.js')).default;

export class App {
    private static instance: App;
    private static serviceName: string;
    private static moleculerTransport: MoleculerTransport;

    constructor(options?: AppOptions) {
        App.serviceName = cfg.serviceName;
        App.moleculerTransport = new MoleculerTransport(options?.actionsDir);
    }

    static getInstance(options?: AppOptions): App {
        return App.instance ? App.instance : new App(options);
    }

    async run(): Promise<void> {
        await App.moleculerTransport?.start({ ...cfg, serviceName: App.serviceName });
    }
}