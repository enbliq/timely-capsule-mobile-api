import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  getPaginationData(page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      total,
      page: currentPage,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }
}