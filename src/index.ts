import 'module-alias/register';

import { resolve } from 'path';

import { MoleculerTransport } from './transports/moleculer';

import { ServiceName, AppOptions } from './interfaces/app';

const cfg: any = require(resolve('env', 'local.js'));

export class App {
    private static instance: App;
    private static serviceName: ServiceName;
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

const app: App = App.getInstance({
    actionsDir: 'actions'
});

async function main(): Promise<void> {
    await app.run();
}

main();