import { ErrorHelper } from '../helpers/error';

export class UnexpectedError extends Error {
    constructor(message: string, data?: unknown[] | unknown) {
        super(`${message} ${ErrorHelper.stringifyErrorData(data)}`);
    }
}