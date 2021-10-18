import { jsonToCsv, parseCsv, parseCsvBody, ShallowJSON } from '../src/csv';

describe('test csv functions', () => {
  test('should read in csv string', () => {
    const csv = 'a,b,c\n1,2,3\n4,5,6';
    const result = parseCsv(csv);

    expect(result).toStrictEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]);
  });

  test('should read in csv body', () => {
    const csv = `1,2,3\n4,5,6`;
    const result = parseCsvBody(csv);

    expect(result).toStrictEqual([
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]);
  });

  test('should convert json', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = jsonToCsv(json);

    expect(result).toStrictEqual([
      ['a', 'b', 'c'],
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  test('should convert json and respect headers', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = jsonToCsv(json, ['a', 'c']);

    expect(result).toStrictEqual([
      ['a', 'c'],
      [1, 3],
      [4, 6],
    ]);
  });

  test('should set missing values to null', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, c: 6 },
    ];
    const result = jsonToCsv(json);

    expect(result).toStrictEqual([
      ['a', 'b', 'c'],
      [1, 2, 3],
      [4, null, 6],
    ]);
  });

  test('adds missing values and set them to null', () => {
    const json: ShallowJSON[] = [{ a: 1 }, { a: 2, c: 3 }, { a: 4, b: 5, c: 6 }];
    const result = jsonToCsv(json);

    expect(result).toStrictEqual([
      ['a', 'c', 'b'],
      [1, null, null],
      [2, 3, null],
      [4, 6, 5],
    ]);
  });
});
