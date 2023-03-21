export type Maybe<T> = T | undefined;

export interface IAnyObject {
    [key: string]: any;
}

export interface ITransformation {
    type: string;
    [key: string]: any;
}

export interface IFieldConfig {
    field: string;
    name: string;
    transformations: ITransformation[];
}