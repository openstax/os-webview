
export function findByType<Union extends {type: string}, T extends string>(entries: Union[], type: T) {
  return entries.find((entry) => entry.type === type) as Extract<Union, { type: T }> | undefined;
}
