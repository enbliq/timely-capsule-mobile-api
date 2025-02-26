/* eslint-disable prettier/prettier */
export class paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    firstPage: string;
    lastPage: string;
    previousPage: string;
    currentPage: string;
    nextPage: string;
  };
}
