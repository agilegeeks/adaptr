const VARIABLE_NAMIG_STYLES = ['snakecase', 'camelcase'];
const NAMING_STYLES_REGEX = {
    snakecase: '[A-Z,a-z]+(_[A-Z,a-z]+)*',
    camelcase: '[a-z]+((d)|([A-Z0-9][a-z0-9]+))*([A-Z])?'
};

function validateObjectKeyAdheresToCodingStyle(key, codingStyle) {
    return RegExp(NAMING_STYLES_REGEX[codingStyle]).test(key);
}

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

function convertCamelCaseToSnakeCase(text) {
    return text
        .split(/(?=[A-Z])/)
        .map((s) => s.toLowerCase())
        .join('_');
}

function convertSnakeCaseToCamelCase(text) {
    return text
        .split('_')
        .map((s, i) => (i === 0 ? s.toLowerCase() : capitalize(s)))
        .join('');
}

function convertFactory(style) {
    if (style === 'snakecase') {
        return convertCamelCaseToSnakeCase;
    } else if (style == 'camelcase') {
        return convertSnakeCaseToCamelCase;
    } else {
        return null;
    }
}

function convertDataToStyle(data, style) {
    if (!VARIABLE_NAMIG_STYLES.includes(style)) {
        return null;
    }

    const results = {};

    Object.keys(data).map((o) => {
        if (!validateObjectKeyAdheresToCodingStyle(o, style)) {
            // we leave it as is
            results[o] = data[o];
        }

        if (typeof data[o] === 'object') {
            if (Array.isArray(data[o])) {
                results[convertFactory(style)(o)] = [];
                data[o].map((d) => {
                    results[convertFactory(style)(o)].push(convertDataToStyle(d, style));
                });
            } else {
                results[convertFactory(style)(o)] = convertDataToStyle(data[o], style);
            }
        } else {
            results[convertFactory(style)(o)] = data[o];
        }
    });

    return results;
}

export default class Adaptr {
    constructor(key, schema) {
        if (!key || typeof key !== 'string') {
            throw new Error(`Expected a string for key, but found ${key} of type ${typeof key}`);
        }

        if (!schema || (typeof schema !== 'object' && !Array.isArray(schema))) {
            throw new Error(`Expected an object or string for schema, but found ${schema} of type ${typeof schema}`);
        }

        this._key = key;
        this._schema = schema;
        this._server = null;
        this._client = null;

        if (Array.isArray(schema)) {
            this._server = schema[0];
            this._client = schema[1];
        }
    }

    serialize(data) {
        if (typeof data !== 'object') {
            throw new Error(`Expected an object for data, but found ${data} of type ${typeof data}`);
        }

        let result = {};

        if (Array.isArray(this._schema)) {
            result = convertDataToStyle(data, this._server);
        } else {
            const flippedSchema = Object.entries(this._schema).reduce((ret, entry) => {
                const [key, value] = entry;
                if (typeof value === 'string') {
                    ret[value] = key;
                } else if (typeof value === 'object') {
                    ret[value._key] = new Adaptr(key, value._schema);
                }
                return ret;
            }, {});

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
        }

        return result;
    }

    unserialize(data) {
        if (typeof data !== 'object') {
            throw new Error(`Expected an object for data, but found ${data} of type ${typeof data}`);
        }

        let result = {};

        if (Array.isArray(this._schema)) {
            result = convertDataToStyle(data, this._client);
        } else {
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
        }

        return result;
    }
}
