"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoleculerTransport = void 0;
const moleculer_1 = require("moleculer");
const fs_1 = require("fs");
const path_1 = require("path");
const moleculer_web_1 = __importDefault(require("moleculer-web"));
const directory_1 = require("../helpers/directory");
const DEFAULT_ACTION_DIR = 'actions';
const DEFAULT_API_URI = '/';
class MoleculerTransport {
    constructor(transporter, serviceName, actionsDir = DEFAULT_ACTION_DIR) {
        this.transporter = transporter;
        this.serviceName = serviceName;
        this.actionsDir = actionsDir;
    }
    async act(service, action, params, options) {
        return this.broker.call(`${service}.${action}`, params, options);
    }
    async listen(express, settings) {
        const actionDir = path_1.resolve('dist', this.actionsDir);
        const stats = await fs_1.promises.stat(actionDir);
        if (!stats.isDirectory()) {
            await fs_1.promises.mkdir(actionDir);
        }
        const actions = await this.initActions(actionDir);
        this.broker = new moleculer_1.ServiceBroker({ transporter: this.transporter });
        const svc = this.createService(this.serviceName, actions, this.broker, settings);
        if (express) {
            express.use(DEFAULT_API_URI, svc.express());
        }
        await this.broker.start();
        console.info('Listening actions: ', Object.keys(actions));
    }
    async initActions(actionsDir, expansions = ['.js']) {
        const actions = {};
        for (const actionDir of await directory_1.DirectoryHelper.recursiveReadDir(actionsDir, expansions)) {
            if (expansions.includes(path_1.extname(actionDir))) {
                const { actionName, handler } = require(actionDir).default;
                actions[actionName] = async (ctx) => handler(ctx);
            }
        }
        return actions;
    }
    createService(name, actions, broker, settings) {
        let schema = settings ? { name, actions, settings, mixins: [moleculer_web_1.default] } : { name, actions };
        return broker.createService(schema);
    }
}
exports.MoleculerTransport = MoleculerTransport;
//# sourceMappingURL=moleculer.js.map