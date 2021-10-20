import { CSV } from '../src/csv';
import { csvToTable, MarkdownTable, prettyPrintTable, printTable } from '../src/md';

const csv3x2: CSV = [
  ['a', 'b', 'c'],
  [1, 2, 3],
  [4, 5, 6],
];
const csv2x2: CSV = [
  ['a', 'b'],
  [1, 2],
  [3, 4],
];

const tableDescriptor3x2: MarkdownTable = {
  alignment: ['left', 'left', 'left'],
  headers: ['a', 'b', 'c'],
  rows: [
    ['1', '2', '3'],
    ['4', '5', '6'],
  ],
  margin: [
    { left: 0, right: 0 },
    { left: 0, right: 0 },
    { left: 0, right: 0 },
  ],
  minWidth: [0, 0, 0],
};
const tableDescriptor2x2: MarkdownTable = {
  alignment: ['left', 'left'],
  headers: ['a', 'b'],
  rows: [
    ['1', '2'],
    ['3', '4'],
  ],
  margin: [
    { left: 0, right: 0 },
    { left: 0, right: 0 },
  ],
  minWidth: [0, 0],
};

describe('test markdown functions', () => {
  test('should generate table descriptor', () => {
    const descriptor = csvToTable(csv3x2);
    expect(descriptor).toStrictEqual(tableDescriptor3x2);
  });

  test('should generate table descriptor respecting alignment', () => {
    const descriptor = csvToTable(csv3x2, { alignment: 'right' });
    expect(descriptor).toStrictEqual({
      ...tableDescriptor3x2,
      alignment: ['right', 'right', 'right'],
    });
  });

  test('should generate table descriptor respecting alignment array', () => {
    const descriptor = csvToTable(csv3x2, { alignment: ['left', 'center', 'right'] });
    expect(descriptor).toStrictEqual({
      ...tableDescriptor3x2,
      alignment: ['left', 'center', 'right'],
    });
  });

  test('should generate table descriptor respecting margin', () => {
    const descriptor = csvToTable(csv2x2, { margin: 5 });

    expect(descriptor).toStrictEqual({
      ...tableDescriptor2x2,
      margin: [
        { left: 5, right: 5 },
        { left: 5, right: 5 },
      ],
    });
  });

  test('should generate table descriptor respecting separate margin', () => {
    const descriptor = csvToTable(csv2x2, { margin: { left: 1, right: 2 } });
    expect(descriptor).toStrictEqual({
      ...tableDescriptor2x2,
      margin: [
        { left: 1, right: 2 },
        { left: 1, right: 2 },
      ],
    });
  });

  test('should generate table descriptor respecting margin array', () => {
    const descriptor = csvToTable(csv2x2, { margin: [1, 2] });
    expect(descriptor).toStrictEqual({
      ...tableDescriptor2x2,
      margin: [
        { left: 1, right: 1 },
        { left: 2, right: 2 },
      ],
    });
  });

  test('should generate table descriptor respecting separate margin array', () => {
    const descriptor = csvToTable(csv2x2, { margin: [{ left: 1, right: 2 }, 3] });
    expect(descriptor).toStrictEqual({
      ...tableDescriptor2x2,
      margin: [
        { left: 1, right: 2 },
        { left: 3, right: 3 },
      ],
    });
  });

  test('should generate table descriptor respecting min width', () => {
    const descriptor = csvToTable(csv2x2, { minWidth: 5 });
    expect(descriptor).toStrictEqual({
      ...tableDescriptor2x2,
      minWidth: [5, 5],
    });
  });

  test('should generate table descriptor respecting min width array', () => {
    const descriptor = csvToTable(csv2x2, { minWidth: [5, 6] });
    expect(descriptor).toStrictEqual({
      ...tableDescriptor2x2,
      minWidth: [5, 6],
    });
  });

  test('should print markdown table', () => {
    const md = printTable({ ...tableDescriptor3x2, alignment: ['left', 'center', 'right'] });
    expect(md).toStrictEqual('| a | b | c |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |');
  });

  test('should pretty print markdown table', () => {
    const md = prettyPrintTable({ ...tableDescriptor3x2, alignment: ['left', 'center', 'right'] });
    expect(md).toStrictEqual(
      '| a    |   b   |    c |\n| :--- | :---: | ---: |\n| 1    |   2   |    3 |\n| 4    |   5   |    6 |'
    );
  });

  test('should align odd centered rows left', () => {
    const table: MarkdownTable = {
      ...tableDescriptor2x2,
      alignment: ['center', 'center'],
      headers: ['aaaaaaaaaaaaaaa', 'bbbbbbbbbbbbbbb'],
      rows: [
        ['aaaa', 'bbbbb'],
        ['ccccc', 'dddd'],
      ],
    };
    const md = prettyPrintTable(table);

    expect(md).toStrictEqual(
      '| aaaaaaaaaaaaaaa | bbbbbbbbbbbbbbb |\n| :-------------: | :-------------: |\n|      aaaa       |      bbbbb      |\n|      ccccc      |      dddd       |'
    );
  });

  test('should respect margin', () => {
    const table: MarkdownTable = {
      ...tableDescriptor2x2,
      alignment: ['left', 'center'],
      margin: [
        { left: 5, right: 0 },
        { left: 3, right: 5 },
      ],
    };
    const md = prettyPrintTable(table);

    expect(md).toStrictEqual(
      '|      a    |      b        |\n| :-------- | :-----------: |\n|      1    |      2        |\n|      3    |      4        |'
    );
  });

  test('should respect min width', () => {
    const table: MarkdownTable = {
      ...tableDescriptor2x2,
      alignment: ['left', 'center'],
      minWidth: [10, 15],
    };
    const md = prettyPrintTable(table);

    expect(md).toStrictEqual(
      '| a          |        b        |\n| :--------- | :-------------: |\n| 1          |        2        |\n| 3          |        4        |'
    );
  });
});
