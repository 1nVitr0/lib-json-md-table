import { CSV } from '../src/csv';
import { csvToTable, MarkdownTable, prettyPrintTable, printTable, TableAlignment } from '../src/md';

describe('test markdown functions', () => {
  test('should generate table descriptor', () => {
    const csv: CSV = [
      ['a', 'b', 'c'],
      [1, 2, 3],
      [4, 5, 6],
    ];
    const descriptor = csvToTable(csv);

    expect(descriptor).toStrictEqual({
      alignment: [TableAlignment.center, TableAlignment.center, TableAlignment.center],
      headers: ['a', 'b', 'c'],
      rows: [
        ['1', '2', '3'],
        ['4', '5', '6'],
      ],
    } as MarkdownTable);
  });

  test('should generate table descriptor respecting alignment', () => {
    const csv: CSV = [
      ['a', 'b', 'c'],
      [1, 2, 3],
      [4, 5, 6],
    ];
    const descriptor = csvToTable(csv, { alignment: TableAlignment.left });

    expect(descriptor).toStrictEqual({
      alignment: [TableAlignment.left, TableAlignment.left, TableAlignment.left],
      headers: ['a', 'b', 'c'],
      rows: [
        ['1', '2', '3'],
        ['4', '5', '6'],
      ],
    } as MarkdownTable);
  });

  test('should generate table descriptor respecting alignment array', () => {
    const csv: CSV = [
      ['a', 'b', 'c'],
      [1, 2, 3],
      [4, 5, 6],
    ];
    const descriptor = csvToTable(csv, {
      alignment: [TableAlignment.left, TableAlignment.center, TableAlignment.right],
    });

    expect(descriptor).toStrictEqual({
      alignment: [TableAlignment.left, TableAlignment.center, TableAlignment.right],
      headers: ['a', 'b', 'c'],
      rows: [
        ['1', '2', '3'],
        ['4', '5', '6'],
      ],
    } as MarkdownTable);
  });

  test('should print markdown table', () => {
    const table: MarkdownTable = {
      alignment: [TableAlignment.left, TableAlignment.center, TableAlignment.right],
      headers: ['a', 'b', 'c'],
      rows: [
        ['1', '2', '3'],
        ['4', '5', '6'],
      ],
    };
    const md = printTable(table);

    expect(md).toStrictEqual('| a | b | c |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should pretty print markdown table', () => {
    const table: MarkdownTable = {
      alignment: [TableAlignment.left, TableAlignment.center, TableAlignment.right],
      headers: ['a', 'b', 'c'],
      rows: [
        ['1', '2', '3'],
        ['4', '5', '6'],
      ],
    };
    const md = prettyPrintTable(table);

    expect(md).toStrictEqual(
      '| a    |   b   |    c |\n| :--- | :---: | ---: |\n| 1    |   2   |    3 |\n| 4    |   5   |    6 |'
    );
  });
});
