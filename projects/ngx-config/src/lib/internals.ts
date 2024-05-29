// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPureFunction(value: any): value is (...args: any) => any {
  return !!(value.constructor && value.call && value.apply);
}

export const isInstance = <T>(value: T) => {
  return !isPureFunction(value);
};

/**
 * @internal
 * Merge properties of the source object into the target object
 */
export function deepMerge<T extends { [key: string]: unknown }>(
  target: T,
  source: T | Partial<T>
) {
  const isObject = (obj: unknown) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  // Initialiaze output object
  const output: Record<string, unknown> = { ...target } as T;

  for (const key in source) {
    const tValue = target[key];
    const sValue = source[key];
    if (Array.isArray(tValue) && Array.isArray(sValue)) {
      output[key] = [...tValue].concat(sValue);
      continue;
    }
    if (isObject(tValue) && isObject(sValue)) {
      output[key] = deepMerge(Object.assign({}, tValue), sValue as never);
      continue;
    }

    output[key] = sValue;
  }

  // return the constructed merged object
  return output as T;
}
