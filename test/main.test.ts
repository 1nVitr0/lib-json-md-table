import generateMarkdownTable from '../src';
import { ShallowJSON, CSV, CSVBody } from '../src/csv';
import { TableAlignment } from '../src/md';

describe('test exported library', () => {
  test('should generate table from json', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json);
    expect(result).toStrictEqual('| a | b | c |\n| :---: | :---: | :---: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate pretty table from json', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, { pretty: true });
    expect(result).toStrictEqual(
      '|   a   |   b   |   c   |\n| :---: | :---: | :---: |\n|   1   |   2   |   3   |\n|   4   |   5   |   6   |'
    );
  });

  test('should generate pretty table from json with pretty as true', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, true);
    expect(result).toStrictEqual(
      '|   a   |   b   |   c   |\n| :---: | :---: | :---: |\n|   1   |   2   |   3   |\n|   4   |   5   |   6   |'
    );
  });

  test('should generate pretty table with headers and pretty as true', () => {
    const csv: CSVBody = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const result = generateMarkdownTable(['a', 'b', 'c'], csv, true);
    expect(result).toStrictEqual(
      '|   a   |   b   |   c   |\n| :---: | :---: | :---: |\n|   1   |   2   |   3   |\n|   4   |   5   |   6   |'
    );
  });

  test('should generate pretty table from json respecting alignment', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, {
      pretty: true,
      alignment: [TableAlignment.left, TableAlignment.center, TableAlignment.right],
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
    expect(result).toStrictEqual('| a | b | c |\n| :---: | :---: | :---: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate table from csv string', () => {
    const csv = 'a,b,c\n1,2,3\n4,5,6';
    const result = generateMarkdownTable(csv);
    expect(result).toStrictEqual('| a | b | c |\n| :---: | :---: | :---: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate table from headers and csv', () => {
    const csv: CSVBody = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const result = generateMarkdownTable(['a', 'b', 'c'], csv);
    expect(result).toStrictEqual('| a | b | c |\n| :---: | :---: | :---: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should generate table from headers and csv string', () => {
    const csv = '1,2,3\n4,5,6';
    const result = generateMarkdownTable(['a', 'b', 'c'], csv);
    expect(result).toStrictEqual('| a | b | c |\n| :---: | :---: | :---: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should respect include columns', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, { columns: ['a', 'c', 'd'] });
    expect(result).toStrictEqual('| a | c | d |\n| :---: | :---: | :---: |\n| 1 | 3 |  |\n| 4 | 6 |  |');
  });

  test('should respect incexcludelude columns', () => {
    const json: ShallowJSON[] = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const result = generateMarkdownTable(json, { exclude: ['b'] });
    expect(result).toStrictEqual('| a | c |\n| :---: | :---: |\n| 1 | 3 |\n| 4 | 6 |');
  });

  test('should throw error on unsupported parameters', () => {
    expect(generateMarkdownTable.bind(['a', 'b', 'c'], {})).toThrowError();
    expect(generateMarkdownTable.bind({})).toThrowError();
  });
});
