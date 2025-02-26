import { Injectable, Inject } from '@nestjs/common';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { paginated } from './interfaces/pagination-interface';
import { PaginationQueryDto } from './dto/pagination-query-dto.dto';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginationQuery<T extends ObjectLiteral>(
    paginatedQueryDto: PaginationQueryDto,
    repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  ): Promise<paginated<T>> {
    let result: T[];
    let totalItems: number;

    if (repositoryOrQueryBuilder instanceof Repository) {
      result = await repositoryOrQueryBuilder.find({
        skip: paginatedQueryDto.limit * (paginatedQueryDto.page - 1),
        take: paginatedQueryDto.limit,
      });
      totalItems = await repositoryOrQueryBuilder.count();
    } else {
      [result, totalItems] = await repositoryOrQueryBuilder
        .skip(paginatedQueryDto.limit * (paginatedQueryDto.page - 1))
        .take(paginatedQueryDto.limit)
        .getManyAndCount();
    }

    const totalPages = Math.ceil(totalItems / paginatedQueryDto.limit);
    const currentPage = paginatedQueryDto.page;
    const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
    const previousPage = currentPage === 1 ? currentPage : currentPage - 1;

    return {
      data: result,
      meta: {
        itemsPerPage: paginatedQueryDto.limit,
        totalItemsPerPage: totalItems,
        currentPage: paginatedQueryDto.page,
        totalPages,
      },
      links: {
        firstPage: `?limit=${paginatedQueryDto.limit}&page=1`,
        lastPage: `?limit=${paginatedQueryDto.limit}&page=${totalPages}`,
        currentPage: `?limit=${paginatedQueryDto.limit}&page=${currentPage}`,
        previousPage: `?limit=${paginatedQueryDto.limit}&page=${previousPage}`,
        nextPage: `?limit=${paginatedQueryDto.limit}&page=${nextPage}`,
      },
    };
  }
}
