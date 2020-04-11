"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const path_1 = require("path");
const action_1 = require("../errors/action");
const directory_1 = require("../helpers/directory");
const fs_1 = require("fs");
class MoleculerTransport {
    constructor(actionsDir = 'actions') {
        MoleculerTransport.actionsDir = actionsDir;
    }
    static registerAction(actionName, handler, path) {
        if (!(typeof actionName === 'string' && typeof handler === 'function')) {
            throw new action_1.RegisterActionError(path);
        }
        MoleculerTransport.actions[actionName] = handler;
        console.log('Success registered action: %s', actionName);
    }
    async registerActions(actionsDir, expansions = ['.js']) {
        var e_1, _a;
        try {
            for (var _b = __asyncValues(directory_1.DirectoryHelper.getFiles(actionsDir)), _c; _c = await _b.next(), !_c.done;) {
                const actionDir = _c.value;
                if (expansions.includes(path_1.extname(actionDir))) {
                    require(actionDir);
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
        return MoleculerTransport.actions;
    }
    createService(name, actions, options) {
        const broker = new moleculer_1.ServiceBroker(options);
        broker.createService({ name, actions });
        return broker;
    }
    async start(cfg) {
        const { transporter, serviceName } = cfg;
        const actionDir = path_1.resolve('dist', MoleculerTransport.actionsDir);
        if (!fs_1.existsSync(actionDir)) {
            fs_1.mkdirSync(actionDir);
        }
        const actions = await this.registerActions(actionDir);
        this.broker = this.createService(serviceName, actions, {
            transporter
        });
        await this.broker.start();
    }
}
exports.MoleculerTransport = MoleculerTransport;
MoleculerTransport.actions = {};
//# sourceMappingURL=moleculer.js.map