"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHelper = void 0;
class ErrorHelper {
    static stringifyErrorData(data) {
        if (Array.isArray(data)) {
            return data.join(',');
        }
        if (typeof data === 'object' && data !== null) {
            return JSON.stringify(data);
        }
        return String(data);
    }
}
exports.ErrorHelper = ErrorHelper;
//# sourceMappingURL=error.js.map