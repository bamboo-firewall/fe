import lo from '@/utils/lodash';

type JsonType = 'string' | 'number' | 'boolean' | 'null' | 'undefined';

export function normalizeText(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const uid = (len) => {
  const buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;
  for (let i = 0; i < len; ++i) buf.push(chars[getRandomInt(0, charlen - 1)]);
  return buf.join('');
};

export const onCopy = (str: string): void => {
  navigator.clipboard.writeText(str);
};

export const isContainBrace = (str: string) => {
  if (str.includes('"') || !['{', '}', '[', ']'].includes(str.slice(-1))) return false;
  return str.includes('{') || str.includes('}') || str.includes('[') || str.includes(']');
};

export const handleCheckType = (
  str: string
): {
  valueRemoved: string;
  type: JsonType;
  isContainComma: boolean;
} => {
  const valueRemoved = str?.endsWith(',') ? str.slice(0, -1) : str;
  let type = 'string';

  if (!isNaN(+valueRemoved) && lo.isNumber(+valueRemoved)) type = 'number';
  if (valueRemoved.trim() === 'true' || valueRemoved.trim() === 'false') type = 'boolean';
  if (valueRemoved.trim() === 'null') type = 'null';

  return {
    valueRemoved,
    type: type as JsonType,
    isContainComma: str?.endsWith(','),
  };
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const stringToColour = (str: string) => {
  let hash = 0;
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
};

export const generateTagColor = (str: string) => {
  if (str === 'null') return 'magenta';
  if (['white', 'green', 'red', 'gray', 'black', 'yellow'].includes(str)) return str;
  return stringToColour(str);
};
