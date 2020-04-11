"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const path_1 = require("path");
const moleculer_1 = require("@transports/moleculer");
const cfg = require(path_1.resolve('env', 'local.js'));
class App {
    constructor(options) {
        var _a;
        App.serviceName = cfg.serviceName;
        App.moleculerTransport = new moleculer_1.MoleculerTransport((_a = options) === null || _a === void 0 ? void 0 : _a.actionsDir);
    }
    static getInstance(options) {
        return App.instance ? App.instance : new App(options);
    }
    async run() {
        var _a;
        await ((_a = App.moleculerTransport) === null || _a === void 0 ? void 0 : _a.start(Object.assign(Object.assign({}, cfg), { serviceName: App.serviceName })));
    }
}
exports.App = App;
const app = App.getInstance({
    actionsDir: 'actions'
});
async function main() {
    await app.run();
}
main();
//# sourceMappingURL=index.js.map