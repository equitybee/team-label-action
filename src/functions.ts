export function isString(value: string | undefined): value is string {
  return 'string' === typeof value;
}

export function parseInputList(input: string, delimiter = ','): string[] {
  return input
    .split(delimiter)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
