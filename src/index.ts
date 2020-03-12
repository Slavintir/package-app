import { ServiceBroker, BrokerOptions } from 'moleculer';
import { resolve, extname } from 'path'

import localConfig from './env/local';

import { DirectoryHelper } from './helpers/directory';

import { AppConfig } from './interfaces/app/config';
import { AppAction } from './interfaces/app/action';

class App {
    private broker: ServiceBroker;

    private async createActions(actionsDir: string, extensions: string[] = []): Promise<object> {
        const actions: any = {};
        for await (const actionDir of DirectoryHelper.getFiles(actionsDir)) {
            if (!extensions.includes(extname(actionDir))) {
                const action: AppAction = require(actionDir).default;
                actions[`${action.getName()}`] = action.handler;
            }
        }

        return actions;
    }

    private createService(name: string, actions: any, options: BrokerOptions): ServiceBroker {
        const broker: ServiceBroker = new ServiceBroker(options);
        broker.createService({ name, actions });

        return broker;
    }

    async start(): Promise<void> {
        const { actionsDir, serviceName, transporter }: AppConfig = localConfig;
        const actions: object = await this.createActions(resolve('dist', actionsDir), ['.map']);

        this.broker = this.createService(serviceName, actions, {
            transporter
        });

        await this.broker.start();
    }
}

async function main(): Promise<void> {
    const main: App = new App();

    await main.start();
}

main();