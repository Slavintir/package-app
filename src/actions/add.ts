import { Context } from 'moleculer';

import { AppAction } from '../interfaces/app/action';

class AddAction implements AppAction {
    getName(): string {
        return 'add'
    }

    async handler(ctx: Context): Promise<void> {
        console.log(ctx);
    }
}

export default new AddAction();