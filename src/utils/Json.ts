export const Json = {
  parseJSON: (value: any) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
  stringifyJSON: (value: any) => {
    return JSON.stringify(value);
  },
};
