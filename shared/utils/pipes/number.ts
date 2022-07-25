export const numberPipe = (value: number): string =>
  value.toLocaleString("en").replace(/,/g, " ");
