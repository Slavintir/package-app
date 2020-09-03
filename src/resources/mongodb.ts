import { MongoError } from 'mongodb';
import { connect, connection } from 'mongoose';

import { MongoDbConfig } from '../interfaces/app';

export class MongodbResource {
    async connect(config?: MongoDbConfig): Promise<void> {
        if (!config) {
            return;
        }

        await connect(config.uri, config.options);

        connection.on('open', () => {
            console.info('Open connection to mongo server.');
        });

        connection.on('connected', () => {
            console.info('Connected to mongo server.');
        });

        connection.on('reconnect', () => {
            console.log('Reconnect to mongo server.');
        });

        connection.on('error', (err: MongoError) => {
            console.error('Error connection to mongo server!', err);
        });
    }
}
