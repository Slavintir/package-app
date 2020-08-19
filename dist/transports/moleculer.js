"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoleculerTransport = void 0;
const moleculer_1 = require("moleculer");
const fs_1 = require("fs");
const path_1 = require("path");
const directory_1 = require("../helpers/directory");
const DEFAULT_ACTION_DIR = 'actions';
class MoleculerTransport {
    constructor(transporter, serviceName, actionsDir = DEFAULT_ACTION_DIR) {
        this.transporter = transporter;
        this.serviceName = serviceName;
        this.actionsDir = actionsDir;
    }
    async act(service, action, params, options) {
        return this.broker.call(`${service}.${action}`, params, options);
    }
    async listen() {
        const actionDir = path_1.resolve('dist', this.actionsDir);
        const stats = await fs_1.promises.stat(actionDir);
        if (!stats.isDirectory()) {
            await fs_1.promises.mkdir(actionDir);
        }
        const actions = await this.initActions(actionDir);
        this.broker = this.createService(this.serviceName, actions, {
            transporter: this.transporter
        });
        await this.broker.start();
        console.info('Listening actions: ', Object.keys(actions));
    }
    async initActions(actionsDir, expansions = ['.js']) {
        var e_1, _a;
        const actions = {};
        try {
            for (var _b = __asyncValues(directory_1.DirectoryHelper.recursiveFindFile(actionsDir)), _c; _c = await _b.next(), !_c.done;) {
                const actionDir = _c.value;
                if (expansions.includes(path_1.extname(actionDir))) {
                    const { actionName, handler } = require(actionDir).default;
                    actions[actionName] = async (ctx) => handler(ctx.params);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return actions;
    }
    createService(name, actions, options) {
        const broker = new moleculer_1.ServiceBroker(options);
        broker.createService({ name, actions });
        return broker;
    }
}
exports.MoleculerTransport = MoleculerTransport;
//# sourceMappingURL=moleculer.js.map