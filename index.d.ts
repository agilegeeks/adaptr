declare module 'adaptr' {
    export default class Adaptr {
        constructor(key: string, schema: object);

        serialize(data: object): object;
        unserialize(data: object): object;
    }
}
