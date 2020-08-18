"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path_1 = require("path");
const moleculer_1 = require("./transports/moleculer");
const mongodb_1 = require("./resources/mongodb");
class App {
    constructor(options) {
        this.config = require(path_1.resolve('dist', 'env', 'local.js')).default;
        const { serviceName, transporter } = this.config;
        if ((options === null || options === void 0 ? void 0 : options.actionsDir) && transporter) {
            this.moleculerTransport = new moleculer_1.MoleculerTransport(transporter, serviceName, options.actionsDir);
        }
        if (this.config.mongodb) {
            this.mongoResource = new mongodb_1.MongodbResource(this.config.mongodb);
        }
    }
    static getInstance(options) {
        return App.instance ? App.instance : new App(options);
    }
    async run() {
        var _a, _b;
        const promises = [
            (_a = this.mongoResource) === null || _a === void 0 ? void 0 : _a.connect(),
            (_b = this.moleculerTransport) === null || _b === void 0 ? void 0 : _b.listen()
        ];
        Promise.all(promises);
    }
}
exports.App = App;
//# sourceMappingURL=index.js.map