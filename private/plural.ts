/*
 * Copyright 2022 Marek Kobida
 */

function plural(a: number | string, b: string[]): string {
  return `${a}\u00A0${a === 1 ? b[0] : a > 1 && a < 5 ? b[1] : b[2]}`;
}

export default plural;
