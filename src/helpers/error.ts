export class ErrorHelper {
    static stringifyErrorData(data?: unknown): string {
        if (Array.isArray(data)) {
            return data.join(',');
        }
    
        if (typeof data === 'object' && data !== null) {
            return JSON.stringify(data);
        }
    
        return String(data);
    }
}
