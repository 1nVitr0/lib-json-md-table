<h1 align="center">Pretty Markdown tables from JSON and CSV data</h1>

<h2 align="center">json-md-table</h2>
<p align="center">Lightweight and fast generation of markdown tables from js data sources</p>

***

[![npm](https://img.shields.io/npm/v/json-md-table)](https://www.npmjs.com/package/json-md-table)
[![npm bundle size](https://img.shields.io/bundlephobia/min/json-md-table)](https://www.npmjs.com/package/json-md-table)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/1nVitr0/lib-json-md-table/Build,%20lint,%20and%20test?label=tests)](https://github.com/1nVitr0/lib-json-md-table/actions/workflows/main.yml)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/1nVitr0/lib-json-md-table/Release%20new%20version)](https://github.com/1nVitr0/lib-json-md-table/actions/workflows/release.yml)
[![nycrc config on GitHub](https://img.shields.io/nycrc/1nVitr0/lib-json-md-table?config=.nycrc.json)](https://github.com/1nVitr0/lib-json-md-table/blob/main/.nycrc.json)

<h3>Content</h3>

- [Features](#features)
- [Download & Installation](#download--installation)
- [Examples](#examples)
  - [Custom headers](#custom-headers)
  - [Options](#options)
- [Authors or Acknowledgments](#authors-or-acknowledgments)
- [License](#license)

### Features

- Generate markdown tables from
  - CSV strings
  - CSV-like arrays
  - JSON array
- Pretty print tables with
  - alignment support
  - column whitelist + additional columns
  - column blacklist

### Download & Installation

```shell
npm i --save json-md-table
```

### Examples

```js
import generateMarkdownTable from 'json-md-table';
generateMarkdownTable([{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]);
generateMarkdownTable([['a', 'b', 'c'], [1, 2, 3], [4, 5, 6]]);
generateMarkdownTable('a,b,c\n1,2,3\n4,5,6');
```

> ```md
> |   a   |   b   |   c   |
> | :---: | :---: | :---: |
> |   1   |   2   |   3   |
> |   4   |   5   |   6   |
> ```

#### Custom headers

```js
generateMarkdownTable(['d', 'e', 'f'], [[1, 2, 3], [4, 5, 6]]);
generateMarkdownTable(['d', 'e', 'f'], '1,2,3\n4,5,6');
```

#### Options

```js
generateMarkdownTable(    
  'a,b,c\n1,2,3\n4,5,6',  
  { exclude: 'b', alignment: ['left', 'right'], pretty: true }
);

// Shorthand for `{ pretty: true }`
generateMarkdownTable('a,b,c\n1,2,3\n4,5,6', true);
```

> ```md
> | a    |    c |
> | :--- | ---: |
> | 1    |    3 |
> | 4    |    6 |
> ```

```ts
// Complete option list

interface MarkdownTableOptions {
  columns?: string[];
  exclude?: string[];
  pretty?: true;
  alignment?: 
    | ('left' | 'center' | 'right')[]
    | ('left' | 'center' | 'right');
  minWidth?: number | number[];
  margin?:
    | ({ left: number; right: number } | number)[]
    | ({ left: number; right: number } | number);
}
```

### Authors or Acknowledgments

- Aram Becker

### License

This project is licensed under the MIT License
