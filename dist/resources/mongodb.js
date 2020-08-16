"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbResource = void 0;
const mongoose_1 = require("mongoose");
const DEFAULT_RECONNECT_INTERVAL = 5000;
class MongodbResource {
    constructor(config, interval = DEFAULT_RECONNECT_INTERVAL) {
        this.config = config;
        this.interval = interval;
    }
    async connect() {
        const interval = setInterval(async () => {
            if (await this.init()) {
                console.info('Connected to mongodb. ', { uris: this.config.uris });
                clearInterval(interval);
                return;
            }
            console.info(`Next try connect to mongodb through ${this.interval}ms`);
        }, this.interval);
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