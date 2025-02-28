import type { Repository, SelectQueryBuilder } from "typeorm"
import type { PaginationDto } from "../dto/pagination.dto"

export class PaginationUtils {
  /**
   * Apply pagination to a TypeORM query builder
   */
  static applyPagination<T>(queryBuilder: SelectQueryBuilder<T>, paginationDto: PaginationDto): SelectQueryBuilder<T> {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" } = paginationDto

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Apply pagination
    queryBuilder.skip(skip).take(limit)

    // Apply sorting if the column exists
    if (sortBy) {
      queryBuilder.orderBy(`entity.${sortBy}`, order)
    }

    return queryBuilder
  }

  /**
   * Get paginated results from a repository
   */
  static async paginate<T>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    where: any = {},
    relations: string[] = [],
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "DESC" } = paginationDto

    const [data, total] = await repository.findAndCount({
      where,
      relations,
      skip: (page - 1) * limit,
      take: limit,
      order: sortBy ? { [sortBy]: order } : undefined,
    })

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}

