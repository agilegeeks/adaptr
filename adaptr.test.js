// eslint-env jest
import Adaptr from './src/index';

describe('input validation', () => {
    [42, null, undefined, {}, () => {}].forEach((input) => {
        it(`cannot create adaptor with key == ${input}`, () => {
            expect(() => {
                new Adaptr(input);
            }).toThrow();
        });
    });

    [42, null, undefined, () => {}].forEach((input) => {
        it(`cannot create adaptor with schema == ${input}`, () => {
            expect(() => {
                new Adaptr('test', input);
            }).toThrow();
        });
    });

    [42, null, undefined, () => {}].forEach((input) => {
        it(`cannot deserialize input that == ${input}`, () => {
            const adaptr = new Adaptr('test', {});
            expect(adaptr.unserialize.bind(null, input)).toThrow();
        });
    });
});

describe('serialization/unserialization', () => {
    it('can serialize/unserialize', () => {
        const data = {
            full_name: 'John Doe',
            email: 'john@example.com'
        };

        const expectedData = {
            fullName: 'John Doe',
            email: 'john@example.com'
        };

        const schema = new Adaptr('test', {
            full_name: 'fullName',
            email: 'email'
        });

        expect(schema.serialize(expectedData)).toEqual(data);
        expect(schema.unserialize(data)).toEqual(expectedData);
    });

    it('can serialize/userialize nested object', () => {
        const data = {
            full_name: 'John Doe',
            address: {
                city: 'New York',
                postal_code: '100001'
            }
        };

        const expectedData = {
            fullName: 'John Doe',
            address: {
                city: 'New York',
                postalCode: '100001'
            }
        };

        const addressSchema = new Adaptr('address', {
            city: 'city',
            postal_code: 'postalCode'
        });

        const userSchema = new Adaptr('user', {
            full_name: 'fullName',
            address: addressSchema
        });

        expect(userSchema.serialize(expectedData)).toEqual(data);
        expect(userSchema.unserialize(data)).toEqual(expectedData);
    });

    it('can serialize/unserialize from "snake_case" to "cameCase" and back', () => {
        const data = {
            full_name: 'John Doe',
            email: 'john@example.com'
        };

        const expectedData = {
            fullName: 'John Doe',
            email: 'john@example.com'
        };

        const schema = new Adaptr('test', ['snakecase', 'camelcase']);

        expect(schema.unserialize(data)).toEqual(expectedData);
        expect(schema.serialize(expectedData)).toEqual(data);
    });

    it('can serialize/unserialize from "camelCase" to "snake_case" and back', () => {
        const data = {
            fullName: 'John Doe',
            email: 'john@example.com'
        };

        const expectedData = {
            full_name: 'John Doe',
            email: 'john@example.com'
        };

        const schema = new Adaptr('test', ['camelcase', 'snakecase']);

        expect(schema.unserialize(data)).toEqual(expectedData);
        expect(schema.serialize(expectedData)).toEqual(data);
    });

    it('can serialize/userialize coding style with nested object', () => {
        const data = {
            full_name: 'John Doe',
            address: {
                city: 'New York',
                postal_code: '100001'
            }
        };

        const expectedData = {
            fullName: 'John Doe',
            address: {
                city: 'New York',
                postalCode: '100001'
            }
        };

        const userSchema = new Adaptr('user', ['snakecase', 'camelcase']);

        expect(userSchema.serialize(expectedData)).toEqual(data);
        expect(userSchema.unserialize(data)).toEqual(expectedData);
    });

    it('can serialize/userialize coding style with nested object', () => {
        const data = {
            store_name: 'Super Store',
            products: [
                {
                    prod_name: 'Sampoo',
                    prod_price: 124
                },
                {
                    prod_name: 'Shower Gel',
                    prod_price: 1234
                }
            ]
        };

        const expectedData = {
            storeName: 'Super Store',
            products: [
                {
                    prodName: 'Sampoo',
                    prodPrice: 124
                },
                {
                    prodName: 'Shower Gel',
                    prodPrice: 1234
                }
            ]
        };

        const storeSchema = new Adaptr('store', ['snakecase', 'camelcase']);

        expect(storeSchema.serialize(expectedData)).toEqual(data);
        expect(storeSchema.unserialize(data)).toEqual(expectedData);
    });

    it('can serialize/deserilize from camelcase key with number "admin1"', () => {
        const data = {
            admin1: 'John Doe',
            admin22: 'Gus Doe'
        };

        const expectedData = {
            admin_1: 'John Doe',
            admin_22: 'Gus Doe'
        };

        const schema = new Adaptr('schema', ['camelcase', 'snakecase']);

        expect(schema.serialize(expectedData)).toEqual(data);
        expect(schema.unserialize(data)).toEqual(expectedData);
    });

    it('can serialize/deserialize even if the property of the obect is null or undefined', () => {
        const data = {
            full_name: 'John Doe',
            email: null
        };

        const expectedData = {
            fullName: 'John Doe',
            email: null
        };

        const schema = new Adaptr('schema', ['snakecase', 'camelcase']);

        expect(schema.serialize(expectedData)).toEqual(data);
        expect(schema.unserialize(data)).toEqual(expectedData);
    });
});
