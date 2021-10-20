import { CSV, CSVBody, CSVHeader } from './csv';

export type TableAlignment = 'left' | 'right' | 'center';
export interface TableMargin {
  left: number;
  right: number;
}

export interface MarkdownTable {
  headers: string[];
  alignment: TableAlignment[];
  rows: string[][];
  minWidth: number[];
  margin: TableMargin[];
}

/**
 * Markdown table generation options
 */
export interface MarkdownTableOptions {
  /**
   * Column headers to select form data, if omitted all headers are chosen
   */
  columns?: string[];
  /**
   * List of column headers to exclude (takes precedence over `columns`)
   */
  exclude?: string[];
  /**
   * Pretty print table
   */
  pretty?: true;
  /**
   * Column alignment, can be specified per-column or for all columns
   * Has no effect if pretty !== true
   */
  alignment?: (TableAlignment & string)[] | (TableAlignment & string);
  /**
   * Minimum width of columns, can be specified per-column or for all columns
   * Has no effect if pretty !== true
   */
  minWidth?: number | number[];
  /**
   * Column margins, can be specified per-column or for all columns
   * If specified as a number, left and right margins will be set to it
   * Has no effect if pretty !== true
   */
  margin?: (TableMargin | number)[] | (TableMargin | number);
}

const DEFAULT_TABLE_OPTIONS: MarkdownTableOptions = {};

export function csvToTable(csv: CSV, options: Omit<MarkdownTableOptions, 'pretty'> = {}): MarkdownTable {
  const { columns, exclude, alignment: _alignment = 'left', minWidth: _minWidth = 0, margin: _margin = 0 } = options;
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
      ? data.map((row: (string | number | boolean)[]) => row.map(col => stringify(col)))
      : data.map((row: (string | number | boolean)[]) => headerIndexes.map(i => stringify(row[i])));

  const minWidth = typeof _minWidth == 'number' ? headers.map(() => _minWidth) : _minWidth;
  const margin =
    typeof _margin == 'number'
      ? headers.map(() => ({ left: _margin, right: _margin }))
      : _margin instanceof Array
      ? _margin.map(m => (typeof m == 'number' ? { left: m, right: m } : m))
      : headers.map(() => _margin);

  return { headers, alignment, rows, minWidth, margin };
}

export function printTable(table: MarkdownTable): string {
  return getTableRows(table)
    .map(row => `| ${row.join(' | ')} |`)
    .join('\n');
}

export function prettyPrintTable(table: MarkdownTable): string {
  const rows = getTableRows(table);
  const colSizes = getColSize(rows).map((size, i) => Math.max(size, table.minWidth[i]));
  const overfill = table.margin.map(({ left, right }) => left + right);

  const headers = rows.shift().map(mapColumnPadding(colSizes, table));
  const separator = rows.shift().map(mapPadSeparator(colSizes, overfill));
  const body = rows.map(row => row.map(mapColumnPadding(colSizes, table)));

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

function padColumn(column: string, length: number, alignment: TableAlignment, margin: TableMargin): string {
  const leftPadding = ' '.repeat(margin.left);
  const rightPadding = ' '.repeat(margin.right);
  switch (alignment) {
    case 'left':
      return leftPadding + column.padEnd(length, ' ') + rightPadding;
    case 'center':
      const right = column.length + Math.ceil((length - column.length) / 2);
      column = column.padEnd(right, ' ');
    case 'right':
      return leftPadding + column.padStart(length, ' ') + rightPadding;
  }
}

function mapColumnPadding(sizes: number[], { alignment, margin }: MarkdownTable) {
  return (col: string, i: number) => padColumn(col, sizes[i], alignment[i], margin[i]);
}

function mapPadSeparator(sizes: number[], overfill: number[]) {
  return (col: string, i: number) => col.replace('---', '-'.repeat(sizes[i] + overfill[i] + 3 - col.length));
}

function stringify(value: any): string {
  if (value === null || value === undefined) return '';
  else if (typeof value == 'string') return value;
  return JSON.stringify(value);
}
