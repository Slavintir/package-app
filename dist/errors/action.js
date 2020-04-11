"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegisterActionError extends Error {
    constructor(pathToAction) {
        super(`Failed register action. Action don't exist along path: ${pathToAction}`);
    }
}
exports.RegisterActionError = RegisterActionError;
//# sourceMappingURL=action.js.map