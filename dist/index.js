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
            App.mongoResource = new mongodb_1.MongodbResource();
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
        if (this.moleculerTransport) {
            return this.moleculerTransport.act(service, action, params, options);
        }
        throw new errors_1.UnexpectedError('Amqp transport setting not pointed. Update config along config.transporter');
    }
    static createQueue(queueName) {
        if (App.amqpTransport) {
            return App.amqpTransport.createQueue(queueName);
        }
        throw new errors_1.UnexpectedError('Amqp transport setting not pointed. Update config along config.rabbit');
    }
    static publish(queueName, event) {
        if (App.amqpTransport) {
            return App.amqpTransport.publish(queueName, event);
        }
        throw new errors_1.UnexpectedError('Amqp transport setting not pointed. Update config along config.rabbit');
    }
    static async subscribe(queueName, eventName, handler) {
        if (App.amqpTransport) {
            return App.amqpTransport.subscribe(queueName, eventName, handler);
        }
        throw new errors_1.UnexpectedError('Amqp transport setting not pointed. Update config along config.rabbit');
    }
    async run() {
        var _a, _b, _c, _d, _e;
        const promises = [
            (_a = App.mongoResource) === null || _a === void 0 ? void 0 : _a.connect(App.config.mongodb),
            (_b = App.moleculerTransport) === null || _b === void 0 ? void 0 : _b.listen((_c = this.options.api) === null || _c === void 0 ? void 0 : _c.express, (_d = this.options.api) === null || _d === void 0 ? void 0 : _d.settings),
            (_e = App.amqpTransport) === null || _e === void 0 ? void 0 : _e.listen(App.config.rabbit)
        ];
        await Promise.all(promises);
    }
}
exports.App = App;
App.config = require(path_1.resolve('dist', 'env', 'local.js')).default;
//# sourceMappingURL=index.js.map