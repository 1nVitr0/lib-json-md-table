import generateMarkdownTable, { MarkdownTableOptions } from '../src';
import { ShallowJSON, CSV, CSVBody } from '../src/csv';

describe('test exported library', () => {
  test('should generate table from json', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json);
    expect(result).toStrictEqual('| a | b | c |\n| :--- | :--- | :--- |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate pretty table from json', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, { pretty: true });
    expect(result).toStrictEqual(
      '| a    | b    | c    |\n| :--- | :--- | :--- |\n| 1    | 2    | 3    |\n| 4    | 5    | 6    |'
    );
  });

  test('should generate pretty table from json with pretty as true', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, true);
    expect(result).toStrictEqual(
      '| a    | b    | c    |\n| :--- | :--- | :--- |\n| 1    | 2    | 3    |\n| 4    | 5    | 6    |'
    );
  });

  test('should generate pretty table with headers and pretty as true', () => {
    const csv: CSVBody = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const result = generateMarkdownTable(['a', 'b', 'c'], csv, true);
    expect(result).toStrictEqual(
      '| a    | b    | c    |\n| :--- | :--- | :--- |\n| 1    | 2    | 3    |\n| 4    | 5    | 6    |'
    );
  });

  test('should generate pretty table from json respecting alignment', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, {
      pretty: true,
      alignment: ['left', 'center', 'right'],
    });
    expect(result).toStrictEqual(
      '| a    |   b   |    c |\n| :--- | :---: | ---: |\n| 1    |   2   |    3 |\n| 4    |   5   |    6 |'
    );
  });

  test('should generate table from csv', () => {
    const csv: CSV = [
      ['a', 'b', 'c'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ];
    const result = generateMarkdownTable(csv);
    expect(result).toStrictEqual('| a | b | c |\n| :--- | :--- | :--- |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate table from csv string', () => {
    const csv = 'a,b,c\n1,2,3\n4,5,6';
    const result = generateMarkdownTable(csv);
    expect(result).toStrictEqual('| a | b | c |\n| :--- | :--- | :--- |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate table from headers and csv', () => {
    const csv: CSVBody = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const result = generateMarkdownTable(['a', 'b', 'c'], csv);
    expect(result).toStrictEqual('| a | b | c |\n| :--- | :--- | :--- |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate table from headers and csv string', () => {
    const csv = '1,2,3\n4,5,6';
    const result = generateMarkdownTable(['a', 'b', 'c'], csv);
    expect(result).toStrictEqual('| a | b | c |\n| :--- | :--- | :--- |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should respect include columns', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, { columns: ['a', 'c', 'd'] });
    expect(result).toStrictEqual('| a | c | d |\n| :--- | :--- | :--- |\n| 1 | 3 |  |\n| 4 | 6 |  |');
  });

  test('should respect exclude columns', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, { exclude: ['b'] });
    expect(result).toStrictEqual('| a | c |\n| :--- | :--- |\n| 1 | 3 |\n| 4 | 6 |');
  });

  test('should throw error on unsupported parameters', () => {
    expect(generateMarkdownTable.bind(['a', 'b', 'c'], {})).toThrowError();
    expect(generateMarkdownTable.bind({})).toThrowError();
  });

  test('should accept alignment strings', () => {
    const csv = 'a,b,c\n1,2,3\n4,5,6';
    const options: MarkdownTableOptions = { alignment: ['left', 'center', 'right'], pretty: true };
    const md = generateMarkdownTable(csv, options);

    expect(md).toStrictEqual(
      '| a    |   b   |    c |\n| :--- | :---: | ---: |\n| 1    |   2   |    3 |\n| 4    |   5   |    6 |'
    );
  });

  test('should exclude columns', () => {
    const csv = 'a,b,c\n1,2,3\n4,5,6';
    const options: MarkdownTableOptions = { exclude: ['b'] };
    const md = generateMarkdownTable(csv, options);

    expect(md).toStrictEqual('| a | c |\n| :--- | :--- |\n| 1 | 3 |\n| 4 | 6 |');
  });

  test('should work with boolean values', () => {
    const csv: CSV = [
      ['a', 'b'],
      [true, false],
    ];
    const result = generateMarkdownTable(csv);
    expect(result).toStrictEqual('| a | b |\n| :--- | :--- |\n| true | false |');
  });

  test('should work with numbers', () => {
    const csv: CSV = [
      ['a', 'b'],
      [1, 2],
    ];
    const result = generateMarkdownTable(csv);
    expect(result).toStrictEqual('| a | b |\n| :--- | :--- |\n| 1 | 2 |');
  });

  test('should work with null and undefined', () => {
    const csv: CSV = [
      ['a', 'b'],
      [null, undefined],
    ];
    const result = generateMarkdownTable(csv);
    expect(result).toStrictEqual('| a | b |\n| :--- | :--- |\n|  |  |');
  });

  test('should work with mixed types', () => {
    const csv: CSV = [
      ['a', 'b', 'c'],
      [true, false, null],
      [undefined, 1, ''],
    ];
    const result = generateMarkdownTable(csv);
    expect(result).toStrictEqual('| a | b | c |\n| :--- | :--- | :--- |\n| true | false |  |\n|  | 1 |  |');
  });
});
