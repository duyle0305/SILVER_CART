export const SORT_TYPE = Object.freeze({
  Default: 'Default',
  Ascending: 'Ascending',
  Descending: 'Descending',
})

export type SortType = (typeof SORT_TYPE)[keyof typeof SORT_TYPE]
