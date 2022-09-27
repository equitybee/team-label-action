import { parseInputList } from '../functions';

describe('parseInputList', () => {
  test('empty', () => {
    expect(parseInputList('')).toStrictEqual([]);
  });

  test('one', () => {
    expect(parseInputList(' one')).toStrictEqual(['one']);
  });

  test('multiple', () => {
    expect(parseInputList('one, two,,')).toStrictEqual(['one', 'two']);
  });
});
