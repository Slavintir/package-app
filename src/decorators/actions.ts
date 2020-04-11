import { MoleculerTransport } from '../transports/moleculer';

type Constructor = { new(...args: any[]): {} };

export function action<T extends Constructor>(constructor: T): T {
    MoleculerTransport.registerAction(constructor.name, constructor.prototype.handler, __filename);

    return class extends constructor { };
}
