import { ActionHandler as MoleculerActionHandler, Context } from 'moleculer';

export interface ActionArgs extends Context<any, any> {};

export type ActionHandler = (args: ActionArgs) => Promise<unknown>;

export type Actions = { [name in ActionName]: MoleculerActionHandler };

export interface Action {
    readonly actionName: ActionName;
    handler: ActionHandler;
}

export enum ActionName { }