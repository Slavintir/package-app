"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbResource = void 0;
const mongoose_1 = require("mongoose");
const DEFAULT_RECONNECT_TIMEOUT = 5000;
class MongodbResource {
    constructor(config, timeout = DEFAULT_RECONNECT_TIMEOUT) {
        this.config = config;
        this.timeout = timeout;
    }
    async connect() {
        const interval = setInterval(async () => {
            if (await this.init()) {
                console.info('Connected to mongodb');
                clearInterval(interval);
                return;
            }
            console.info(`Next try connect to mongodb through ${this.timeout}ms`);
        }, this.timeout);
    }
    async init() {
        try {
            const { uris, options } = this.config;
            const connection = await mongoose_1.connect(uris, options);
            return Boolean(connection);
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.MongodbResource = MongodbResource;
//# sourceMappingURL=mongodb.js.map