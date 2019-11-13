export default class Adaptr {
    constructor(key, schema) {
        if (!key || typeof key !== 'string') {
            throw new Error(`Expected a string for key, but found ${key} of type ${typeof key}`);
        }
        if (!schema || typeof schema !== 'object') {
            throw new Error(`Expected an object for schema, but found ${schema} of type ${typeof schema}`);
        }

        this._key = key;
        this._schema = schema;
    }

    serialize(data) {
        if (typeof data !== 'object') {
            throw new Error(`Expected an object for data, but found ${data} of type ${typeof data}`);
        }

        const flippedSchema = Object.entries(this._schema).reduce((ret, entry) => {
            const [key, value] = entry;
            if (typeof value === 'string') {
                ret[value] = key;
            } else if (typeof value === 'object') {
                ret[value._key] = new Adaptr(key, value._schema);
            }
            return ret;
        }, {});
        const result = {};

        Object.keys(flippedSchema).map((s) => {
            if (!data.hasOwnProperty(s)) {
                return '';
            }

            if (typeof flippedSchema[s] === 'string') {
                result[flippedSchema[s]] = data[s];
            } else if (typeof flippedSchema[s] === 'object') {
                if (Array.isArray(data[s])) {
                    if (data[s].length === 0) {
                        result[flippedSchema[s]._key] = [];
                    }

                    if (data[s].length > 0) {
                        result[flippedSchema[s]._key] = data[s].map((d) => flippedSchema[s].serialize(d));
                    }
                } else {
                    result[flippedSchema[s]._key] = flippedSchema[s].serialize(data[s]);
                }
            }
            return '';
        });

        return result;
    }

    unserialize(data) {
        if (typeof data !== 'object') {
            throw new Error(`Expected an object for data, but found ${data} of type ${typeof data}`);
        }
        const result = {};

        Object.keys(this._schema).map((s) => {
            if (!data.hasOwnProperty(s)) {
                return '';
            }

            if (typeof this._schema[s] === 'string') {
                result[this._schema[s]] = data[s];
            } else if (typeof this._schema[s] === 'object') {
                if (Array.isArray(data[s])) {
                    if (data[s].length === 0) {
                        result[this._schema[s]._key] = [];
                    }

                    if (data[s].length > 0) {
                        result[this._schema[s]._key] = data[s].map((d) => this._schema[s].unserialize(d));
                    }
                } else {
                    result[this._schema[s]._key] = this._schema[s].unserialize(data[s]);
                }
            }

            return '';
        });

        return result;
    }
}
