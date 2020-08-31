import { connect } from 'mongoose';

import { MongoDbConfig } from '../interfaces/app';

const DEFAULT_RECONNECT_INTERVAL: number = 5000;

export class MongodbResource {
    constructor(
        private config: MongoDbConfig,
        private interval: number = DEFAULT_RECONNECT_INTERVAL
    ) {}

    async connect(): Promise<void> {
        const interval = setInterval(
            async () => {
                if (await this.init()) {
                    console.info('Connected to mongodb. ', { uris: this.config.uris });
                    clearInterval(interval);

                    return;
                }

                console.info(`Next try connect to mongodb through ${this.interval}ms`);
            },
            this.interval
        );
    }

    private async init(): Promise<boolean> {
        try {
            const { uris, options } = this.config;
            const connection = await connect(uris, options);

            return Boolean(connection);
        } catch (err) {
            console.error(err);

            return false;
        }
    }
}
