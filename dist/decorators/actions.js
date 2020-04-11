"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("../transports/moleculer");
function action(constructor) {
    moleculer_1.MoleculerTransport.registerAction(constructor.name, constructor.prototype.handler, __filename);
    return class extends constructor {
    };
}
exports.action = action;
//# sourceMappingURL=actions.js.map