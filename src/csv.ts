export type CSVHeader = string[];
export type CSVBody = (string | number | boolean | null)[][];
export type CSV = [CSVHeader, ...CSVBody];
export type ShallowJSON = Record<string, string | number | boolean | null>;

export function parseCsv(data: string): CSV {
  const lines = data.split('\n');
  const headers = lines.shift().split(/(?<!\\),/);
  return [headers, ...lines.map(line => line.split(/(?<!\\),/))];
}

export function parseCsvBody(data: string): CSVBody {
  const lines = data.split('\n');
  return lines.map(line => line.split(/(?<!\\),/));
}

export function jsonToCsv(data: ShallowJSON[], headers?: CSVHeader): CSV {
  const usedHeaders = headers || [];
  const result: CSV = [usedHeaders];

  for (const jsonRow of data) {
    const keys: string[] = Object.keys(jsonRow);
    if (!headers && usedHeaders.length !== keys.length) {
      // Add missing header fields to previous rows if row contains additional key(s)
      const missing: string[] = [];
      for (const key of keys) if (!usedHeaders.includes(key)) missing.push(key);
      for (let i = 1; i < result.length; i++) result[i].push(...missing.map(_ => null));
      usedHeaders.push(...missing);
    }

    result.push(usedHeaders.map(header => jsonRow[header] ?? null));
  }

  return result;
}
