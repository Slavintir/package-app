import { ServiceBroker, BrokerOptions } from 'moleculer';
import { resolve, extname, } from 'path'

import { RegisterActionError } from '../errors/action';

import { DirectoryHelper } from '../helpers/directory';

import { AppConfig } from '../interfaces/app/index';
import { existsSync, mkdirSync } from 'fs';

export class MoleculerTransport {
    private broker: ServiceBroker;
    private static actions: object = {};
    private static actionsDir: string;

    constructor(actionsDir: string = 'actions') {
        MoleculerTransport.actionsDir = actionsDir;
    }

    static registerAction(actionName: string, handler: Function, path: string): void {
        if (!(typeof actionName === 'string' && typeof handler === 'function')) {
            throw new RegisterActionError(path);
        }

        MoleculerTransport.actions[actionName] = handler;
        console.log('Success registered action: %s', actionName);
    }

    private async registerActions(actionsDir: string, expansions: string[] = ['.js']): Promise<object> {
        for await (const actionDir of DirectoryHelper.getFiles(actionsDir)) {
            if (expansions.includes(extname(actionDir))) {
                require(actionDir);
            }
        }

        return MoleculerTransport.actions;
    }

    private createService(name: string, actions: any, options: BrokerOptions): ServiceBroker {
        const broker: ServiceBroker = new ServiceBroker(options);
        broker.createService({ name, actions });

        return broker;
    }

    async start(cfg: AppConfig): Promise<void> {
        const { transporter, serviceName }: AppConfig = cfg;
        const actionDir: string = resolve('dist', MoleculerTransport.actionsDir);

        if (!existsSync(actionDir)) {
            mkdirSync(actionDir);
        }

        const actions: object = await this.registerActions(actionDir);

        this.broker = this.createService(serviceName, actions, {
            transporter
        });

        await this.broker.start();
    }
}