import { Context } from 'moleculer';
import { AppAction } from '../interfaces/app/action';
declare class AddAction implements AppAction {
    getName(): string;
    handler(ctx: Context): Promise<void>;
}
declare const _default: AddAction;
export default _default;
