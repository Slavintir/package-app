import { ServiceBroker, Context, CallingOptions, ServiceSettingSchema } from 'moleculer';
import { promises as fs, Stats } from 'fs';
import { resolve, extname } from 'path';
import { Express } from 'express';
import MoleculerWeb from 'moleculer-web';

import { DirectoryHelper } from '../helpers/directory';

import { ServiceName } from '../interfaces/app';
import { Action, Actions, ActionName } from '../interfaces/app/actions';

const DEFAULT_ACTION_DIR: string = 'actions';
const DEFAULT_API_URI: string = '/api';

export class MoleculerTransport {
    private broker!: ServiceBroker;

    constructor(
        private transporter: string,
        private serviceName: string,
        private actionsDir: string = DEFAULT_ACTION_DIR
    ) { }

    async act<T, P>(service: ServiceName, action: ActionName, params: P, options?: CallingOptions): Promise<T> {
        return this.broker.call(`${service}.${action}`, params, options);
    }

    async listen(express?: Express, settings?: ServiceSettingSchema): Promise<void> {
        const actionDir: string = resolve('dist', this.actionsDir);
        const stats: Stats = await fs.stat(actionDir);

        if (!stats.isDirectory()) {
            await fs.mkdir(actionDir);
        }

        const actions: Actions = await this.initActions(actionDir);
        this.broker = this.createService(this.serviceName, actions, settings);

        if (express?.use) {
            express.use(DEFAULT_API_URI, this.broker.express());
        }

        await this.broker.start();
        console.info('Listening actions: ', Object.keys(actions));
    }

    private async initActions(actionsDir: string, expansions: string[] = ['.js']): Promise<Actions> {
        const actions: Actions = {};

        for await (const actionDir of DirectoryHelper.recursiveFindFile(actionsDir)) {
            if (expansions.includes(extname(actionDir))) {
                const { actionName, handler }: Action = require(actionDir).default;
                actions[actionName] = async (ctx: Context<any, any>) => handler(ctx.params);
            }
        }

        return actions;
    }

    private createService(name: string, actions: Actions, settings?: ServiceSettingSchema): ServiceBroker {
        const broker: ServiceBroker = new ServiceBroker({ transporter: this.transporter });
        broker.createService({ mixins: MoleculerWeb.mixins, name, actions, settings });

        return broker;
    }
}