export type ScrubbedJsonValue =
  | string
  | number
  | boolean
  | null
  | ScrubbedJsonValue[]
  | { [key: string]: ScrubbedJsonValue };
