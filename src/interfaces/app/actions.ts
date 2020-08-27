import { ActionHandler as MoleculerActionHandler, Context } from 'moleculer';

export type ActionHandler = (args: Context<any, any>) => Promise<unknown>;

export type Actions = { [name in ActionName]: MoleculerActionHandler };

/**
 * R - Action response
 */
export interface Action {
    readonly actionName: ActionName;
    handler: ActionHandler;
}

export enum ActionName {

}