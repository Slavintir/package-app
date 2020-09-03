"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbResource = void 0;
const mongoose_1 = require("mongoose");
class MongodbResource {
    async connect(config) {
        if (!config) {
            return;
        }
        await mongoose_1.connect(config.uri, config.options);
        mongoose_1.connection.on('open', () => {
            console.info('Open connection to mongo server.');
        });
        mongoose_1.connection.on('connected', () => {
            console.info('Connected to mongo server.');
        });
        mongoose_1.connection.on('reconnect', () => {
            console.log('Reconnect to mongo server.');
        });
        mongoose_1.connection.on('error', (err) => {
            console.error('Error connection to mongo server!', err);
        });
    }
}
exports.MongodbResource = MongodbResource;
//# sourceMappingURL=mongodb.js.map