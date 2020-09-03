"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbResource = void 0;
const mongoose_1 = require("mongoose");
class MongodbResource {
    async connect(config) {
        if (!config) {
            return;
        }
        const connection = await mongoose_1.createConnection(config.uri, config.options);
        connection.on('open', () => {
            console.info('Open connection to mongo server.');
        });
        connection.on('connected', () => {
            console.info('Connected to mongo server.');
        });
        connection.on('reconnect', () => {
            console.log('Reconnect to mongo server.');
        });
        connection.on('error', (err) => {
            console.error('Error connection to mongo server!', err);
        });
    }
}
exports.MongodbResource = MongodbResource;
//# sourceMappingURL=mongodb.js.map