"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const path_1 = require("path");
const local_1 = require("./env/local");
const directory_1 = require("./helpers/directory");
class App {
    async createActions(actionsDir, extensions = []) {
        const actions = {};
        for await (const actionDir of directory_1.DirectoryHelper.getFiles(actionsDir)) {
            if (!extensions.includes(path_1.extname(actionDir))) {
                const action = require(actionDir).default;
                actions[`${action.getName()}`] = action.handler;
            }
        }
        return actions;
    }
    createService(name, actions, options) {
        const broker = new moleculer_1.ServiceBroker(options);
        broker.createService({ name, actions });
        return broker;
    }
    async start() {
        const { actionsDir, serviceName, transporter } = local_1.default;
        const actions = await this.createActions(path_1.resolve('dist', actionsDir), ['.map']);
        this.broker = this.createService(serviceName, actions, {
            transporter
        });
        await this.broker.start();
    }
}
exports.App = App;
//# sourceMappingURL=index.js.map