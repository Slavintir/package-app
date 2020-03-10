import { ActionHandler } from 'moleculer';

export interface AppAction {
    getName(): string;
    handler: ActionHandler;
}