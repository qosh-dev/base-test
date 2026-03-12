export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IFindPaginationBase {
  page?: number;
  limit?: number;
}
