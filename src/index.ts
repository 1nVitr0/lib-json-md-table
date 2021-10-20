import { ShallowJSON, CSV, CSVBody, CSVHeader, parseCsv, jsonToCsv, parseCsvBody } from './csv';
import { csvToTable, MarkdownTableOptions, prettyPrintTable, printTable } from './md';

export { MarkdownTableOptions } from './md';
export { ShallowJSON, CSV, CSVBody, CSVHeader } from './csv';

/**
 * Generate a markdown table from string CSV string
 *
 * @param data CSV data as comma separated columns and `\n` separated rows
 * @param options optional options for table generation
 */
export default function generateMarkdownTable(data: string, options?: MarkdownTableOptions | true): string;
/**
 * Generate a markdown table from a JSON array
 *
 * @param data JSON data array, columns will be all JSON properties in order of occurrence
 * @param options optional options for table generation
 */
export default function generateMarkdownTable(data: ShallowJSON[], options?: MarkdownTableOptions | true): string;
/**
 * Generate a markdown table from a CSV array
 *
 * @param data CSV data array, first row will be used as headers
 * @param options optional options for table generation
 */
export default function generateMarkdownTable(data: CSV, options?: MarkdownTableOptions | true): string;
/**
 * Generate a markdown table from string CSV string and headers
 *
 * @param headers headers for the given CSV data
 * @param data CSV data as comma separated columns and `\n` separated rows
 * @param options optional options for table generation
 */
export default function generateMarkdownTable(
  headers: CSVHeader,
  data: string,
  options?: MarkdownTableOptions | true
): string;
/**
 * Generate a markdown table from string CSV array and headers
 *
 * @param headers headers for the given CSV data
 * @param data CSV data array without header row
 * @param options optional options for table generation
 */
export default function generateMarkdownTable(
  headers: CSVHeader,
  data: CSVBody,
  options?: MarkdownTableOptions | true
): string;
export default function generateMarkdownTable(
  dataOrHeaders: ShallowJSON[] | CSV | string | CSVHeader,
  dataOrOptions?: CSVBody | MarkdownTableOptions | string | true,
  options?: MarkdownTableOptions | true
): string {
  const data = (isData(dataOrOptions) ? dataOrOptions : dataOrHeaders) as ShallowJSON[] | CSV | string | CSVBody;
  const headers = (isData(dataOrOptions) ? dataOrHeaders : null) as CSVHeader | null;
  options = isData(dataOrOptions) ? options : dataOrOptions;

  if (headers && data instanceof Array) {
    return generateTableFromCSV([headers as CSVHeader, ...(data as CSVBody)], options);
  } else if (headers && typeof data == 'string') {
    return generateTableFromCSV([headers as CSVHeader, ...parseCsvBody(data)], options);
  } else if (typeof data == 'string') {
    return generateTableFromCSV(parseCsv(data), options);
  } else if (data instanceof Array && data[0] instanceof Array) {
    return generateTableFromCSV(data as CSV, options);
  } else if (data instanceof Array) {
    return generateTableFromCSV(jsonToCsv(data as ShallowJSON[]), options);
  } else {
    throw new Error('unsupported parameters');
  }
}

function generateTableFromCSV(csv: CSV, options?: MarkdownTableOptions | true): string {
  options = options === true ? { pretty: true } : options;
  const table = csvToTable(csv, options);

  return options?.pretty ? prettyPrintTable(table) : printTable(table);
}

function isData(data: any): data is ShallowJSON[] | CSV | string | CSVBody {
  return data instanceof Array || typeof data === 'string';
}
