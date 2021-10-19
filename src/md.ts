import { CSV, CSVBody, CSVHeader } from './csv';

export type TableAlignment = 'left' | 'right' | 'center';

export interface MarkdownTable {
  headers: string[];
  alignment: TableAlignment[];
  rows: string[][];
}

export interface MarkdownTableOptions {
  columns?: string[];
  exclude?: string[];
  pretty?: true;
  alignment?: (TableAlignment & string)[] | (TableAlignment & string);
}

const DEFAULT_TABLE_OPTIONS: MarkdownTableOptions = {};

export function csvToTable(csv: CSV, options: Omit<MarkdownTableOptions, 'pretty'> = {}): MarkdownTable {
  const { columns, exclude, alignment: _alignment = 'center' } = options;
  const data: CSV = [...csv];
  const dataHeaders = data.shift() as CSVHeader;

  const headers: string[] = columns ? columns : [...dataHeaders];
  for (const col of exclude || []) {
    const index = headers.indexOf(col);
    if (index) headers.splice(index, 1);
  }

  const headerIndexes = headers.map(col => dataHeaders.indexOf(col));
  const alignment = _alignment instanceof Array ? _alignment : headers.map(_ => _alignment);
  const rows: string[][] =
    !exclude && !columns
      ? data.map((row: (string | number | boolean)[]) => row.map(col => col?.toString()))
      : data.map((row: (string | number | boolean)[]) => headerIndexes.map(i => row[i]?.toString() || null));

  return { headers, alignment, rows };
}

export function printTable(table: MarkdownTable): string {
  return getTableRows(table)
    .map(row => `| ${row.join(' | ')} |`)
    .join('\n');
}

export function prettyPrintTable(table: MarkdownTable): string {
  const rows = getTableRows(table);
  const colSizes = getColSize(rows);

  const headers = rows.shift().map((col, i) => padColumn(col, colSizes[i], table.alignment[i]));
  const separator = rows.shift().map((row, i) => row.replace('---', '-'.repeat(colSizes[i] - (row.length - 3))));
  const body = rows.map(row => row.map((col, i) => padColumn(col, colSizes[i], table.alignment[i])));

  return [headers, separator, ...body].map(row => `| ${row.join(' | ')} |`).join('\n');
}

function getTableRows(table: MarkdownTable): [string[], string[], ...string[][]] {
  const { headers, alignment, rows } = table;
  const separator = alignment.map(alignment => {
    switch (alignment) {
      case 'left':
        return ':---';
      case 'center':
        return ':---:';
      case 'right':
        return '---:';
    }
  });

  return [headers, separator, ...rows];
}

function getColSize(rows: string[][]): number[] {
  const result = rows[0].map(_ => 0);
  for (const row of rows) {
    for (const [i, col] of Object.entries(row)) if (col.length > result[i]) result[i] = col.length;
  }

  return result;
}

function padColumn(column: string, length: number, alignment: TableAlignment): string {
  switch (alignment) {
    case 'left':
      return column.padEnd(length, ' ');
    case 'center':
      const left = Math.ceil(length / 2);
      return column.padStart(left, ' ').padEnd(length, ' ');
    case 'right':
      return column.padStart(length, ' ');
  }
}
