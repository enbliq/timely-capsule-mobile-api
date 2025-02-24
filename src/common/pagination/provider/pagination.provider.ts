import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async PaginatedQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
  ) {
    let result = await repository.find({
      //skip logic for selecting a random page
      skip: paginationQueryDto.limit * (paginationQueryDto.page - 1),

      //Number of data to display per page
      take: paginationQueryDto.limit,
    });

    //Create a request url
    const baseUrl = this.request.protocol + '://' + this.request.host + '/';

    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();

    const totalPages = Math.ceil(totalItems / paginationQueryDto.limit);

    const nextPage =
      paginationQueryDto.page === totalPages
        ? paginationQueryDto.page
        : paginationQueryDto.page + 1;

    const previousPage =
      paginationQueryDto.page === 1
        ? paginationQueryDto.page
        : paginationQueryDto.page - 1;

    const finalResponse = {
      data: result,
      meta: {
        itemsPerPage: paginationQueryDto.limit,
        totalItems: totalItems,
        currentPage: paginationQueryDto.page,
        totalPage: totalPages,
      },
      links: {
        first: `${newUrl.origin} ${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=1`,
        last: `${newUrl.origin} ${newUrl.pathname}?limit=${totalPages}&page=${totalPages}`,
        current: `${newUrl.origin} ${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${paginationQueryDto.page}`,
        next: `${newUrl.origin} ${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,
        previous: `${newUrl.origin} ${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
