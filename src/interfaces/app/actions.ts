export type ActionHandler<R = object> = () => Promise<R>;

export type Actions = { [name in ActionName]: ActionHandler };

/**
 * R - Action response
 */
export interface Action<R = object> {
    readonly actionName: ActionName;
    handler: ActionHandler<R>;
}

export enum ActionName {

}