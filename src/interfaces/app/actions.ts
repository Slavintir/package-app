import { ActionHandler as MoleculerActionHandler } from 'moleculer';

export type ActionHandler<R = object> = (params: unknown) => Promise<R>;

export type Actions = { [name in ActionName]: MoleculerActionHandler };

/**
 * R - Action response
 */
export interface Action<R = object> {
    readonly actionName: ActionName;
    handler: ActionHandler<R>;
}

export enum ActionName {

}