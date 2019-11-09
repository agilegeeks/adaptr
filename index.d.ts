declare module 'Adaptr' {
    export class Adaptr {
        _key: string;
        _schema: object;
        _default: any;
        constructor(key: string, schema: object);

        serialize(data: object): object;
        unserialize(data: object): object;
    }
}