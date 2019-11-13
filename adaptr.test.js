// eslint-env jest
import Adaptr from './';

describe('deserialization', () => {
    [42, null, undefined, {}, () => {}].forEach((input) => {
        it(`cannot create adaptor with key == ${input}`, () => {
            expect(() => {
                new Adaptr(input);
            }).toThrow();
        });
    });

    [42, null, undefined, '42', () => {}].forEach((input) => {
        it(`cannot create adaptor with schema == ${input}`, () => {
            expect(() => {
                new Adaptr('test', input);
            }).toThrow();
        });
    });

    [42, null, undefined, '42', () => {}].forEach((input) => {
        it(`cannot deserialize input that == ${input}`, () => {
            const adaptr = new Adaptr('test', {});
            expect(adaptr.unserialize.bind(null, input)).toThrow();
        });
    });
});

describe('serialization', () => {
    [42, null, undefined, {}, () => {}].forEach((input) => {
        it(`cannot create adaptor with key == ${input}`, () => {
            expect(() => {
                new Adaptr(input);
            }).toThrow();
        });
    });

    [42, null, undefined, '42', () => {}].forEach((input) => {
        it(`cannot create adaptor with schema == ${input}`, () => {
            expect(() => {
                new Adaptr('test', input);
            }).toThrow();
        });
    });

    [42, null, undefined, '42', () => {}].forEach((input) => {
        it(`cannot deserialize input that == ${input}`, () => {
            const adaptr = new Adaptr('test', {});
            expect(adaptr.unserialize.bind(null, input)).toThrow();
        });
    });
});
