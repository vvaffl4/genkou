import { Dict } from "./dictionaries";

export interface Table<T extends number | string, U> {
  byId: Dict<T, U>,
  allIds: T[],
  availableIds: T[]
}