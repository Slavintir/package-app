"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedError = void 0;
const error_1 = require("../helpers/error");
class UnexpectedError extends Error {
    constructor(message, data) {
        super(`${message} ${error_1.ErrorHelper.stringifyErrorData(data)}`);
    }
}
exports.UnexpectedError = UnexpectedError;
//# sourceMappingURL=unexpectedError.js.map