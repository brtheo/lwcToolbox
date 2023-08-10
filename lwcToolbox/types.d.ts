export type GenericFunction<T = any> = (...input: any[]) => T
export type GenericConstructor<T = object> = new (...input: any[]) => T

export type Mixin<T extends GenericFunction> = InstanceType<ReturnType<T>>