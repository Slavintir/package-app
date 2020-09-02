"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path_1 = require("path");
const errors_1 = require("./errors");
const moleculer_1 = require("./transports/moleculer");
const rabbitmq_1 = require("./transports/rabbitmq");
const mongodb_1 = require("./resources/mongodb");
class App {
    constructor(options) {
        this.options = options;
        const { serviceName, transporter } = App.config;
        if ((options === null || options === void 0 ? void 0 : options.actionsDir) && transporter) {
            App.moleculerTransport = new moleculer_1.MoleculerTransport(transporter, serviceName, options.actionsDir);
        }
        if (App.config.mongodb) {
            App.mongoResource = new mongodb_1.MongodbResource(App.config.mongodb);
        }
        if (App.config.rabbit) {
            App.amqpTransport = new rabbitmq_1.RabbitMqTransport();
        }
    }
    static getConfig() {
        return App.config;
    }
    static getInstance(options) {
        return App.instance ? App.instance : new App(options);
    }
    static async act(service, action, params, options) {
        if (!this.moleculerTransport) {
            throw new errors_1.UnexpectedError('Moleculer transport did not initialized', { service, action, params });
        }
        return this.moleculerTransport.act(service, action, params, options);
    }
    async run() {
        var _a, _b, _c, _d, _e;
        const promises = [
            (_a = App.mongoResource) === null || _a === void 0 ? void 0 : _a.connect(),
            (_b = App.moleculerTransport) === null || _b === void 0 ? void 0 : _b.listen((_c = this.options.api) === null || _c === void 0 ? void 0 : _c.express, (_d = this.options.api) === null || _d === void 0 ? void 0 : _d.settings),
            (_e = App.amqpTransport) === null || _e === void 0 ? void 0 : _e.listen()
        ];
        Promise.all(promises);
    }
}
exports.App = App;
App.config = require(path_1.resolve('dist', 'env', 'local.js')).default;
//# sourceMappingURL=index.js.map