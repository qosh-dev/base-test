import { Transform } from 'class-transformer';

export function TransformStringArray() {
  return Transform(({ value }) => {
    const values: string[] = [];
    if (typeof value === 'string') {
      values.push(...value.split(','));
    } else if (Array.isArray(value)) {
      values.push(...value);
    }
    return values;
  });
}
