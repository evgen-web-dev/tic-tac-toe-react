export interface BaseAction<Type extends string, Payload extends any = undefined> {
    type: Type, 
    payload?: Payload
}