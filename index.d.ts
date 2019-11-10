declare module 'adaptr' {
    export class Adaptr {
        constructor(key: string, schema: object);

        serialize(data: object): object;
        unserialize(data: object): object;
    }
}