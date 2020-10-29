"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbResource = void 0;
const mongoose_1 = require("mongoose");
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["Disconnected"] = 0] = "Disconnected";
    ConnectionStatus[ConnectionStatus["Connected"] = 1] = "Connected";
    ConnectionStatus[ConnectionStatus["Connecting"] = 2] = "Connecting";
    ConnectionStatus[ConnectionStatus["Disconnecting"] = 3] = "Disconnecting";
})(ConnectionStatus || (ConnectionStatus = {}));
class MongodbResource {
    async connect(config) {
        if (!config) {
            return;
        }
        const db = await mongoose_1.connect(config.uri, config.options);
        if (db.connection.readyState === ConnectionStatus.Connected) {
            console.info('Connected to mongo db');
        }
    }
}
exports.MongodbResource = MongodbResource;
//# sourceMappingURL=mongodb.js.map