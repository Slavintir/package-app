"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddAction {
    getName() {
        return 'add';
    }
    async handler(ctx) {
        console.log(ctx);
    }
}
exports.default = new AddAction();
//# sourceMappingURL=add.js.map