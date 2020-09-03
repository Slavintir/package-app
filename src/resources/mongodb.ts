import { connect, } from 'mongoose';

import { MongoDbConfig } from '../interfaces/app';

enum ConnectionStatus {
    Disconnected,
    Connected,
    Connecting,
    Disconnecting
}

export class MongodbResource {
    async connect(config?: MongoDbConfig): Promise<void> {
        if (!config) {
            return;
        }

        const db = await connect(config.uri, config.options);
        if (db.connection.readyState === ConnectionStatus.Connected) {
            console.info('Connected to mongo db');
        }
    }
}
