export class RegisterActionError extends Error {
    code: 0;
    name: 'Register action';

    constructor(pathToAction: string) {
        super(`Failed register action. Action don't exist along path: ${pathToAction}`);
    }
}