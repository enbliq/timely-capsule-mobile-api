import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, SelectQueryBuilder } from 'typeorm';
import { SearchQueryDto } from '../../dto/search-query.dto/search-query.dto';
import { SearchResultDto } from '../../dto/search-result.dto/search-result.dto';

@Injectable()
export class SearchRepository {
  constructor(
    // @InjectRepository(/* Add your main entity, e.g. Article */)
    private readonly repository: Repository<any>,
    private readonly entityManager: EntityManager,
  ) {}

  async search(searchQueryDto: SearchQueryDto): Promise<SearchResultDto> {
    const { 
      query, 
      tags, 
      startDate, 
      endDate, 
      contributedBy, 
      page = 1, 
      limit = 20,
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = searchQueryDto;

    const qb = this.repository.createQueryBuilder('entity');

    // Apply full-text search if query is provided
    if (query) {
      qb.where(`
        to_tsvector('english', entity.title || ' ' || entity.content) @@ 
        plainto_tsquery('english', :query)
      `, { query });
      
      // Add ranking for relevance sorting
      qb.addSelect(`
        ts_rank(
          to_tsvector('english', entity.title || ' ' || entity.content),
          plainto_tsquery('english', :query)
        )`, 'rank');
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      qb.andWhere('entity.tags && :tags', { tags });
    }

    // Filter by date range
    if (startDate) {
      qb.andWhere('entity.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('entity.createdAt <= :endDate', { endDate });
    }

    // Filter by user contribution
    if (contributedBy) {
      qb.andWhere('entity.userId = :contributedBy', { contributedBy });
    }

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        qb.orderBy('entity.viewCount', sortOrder.toUpperCase() as 'ASC' | 'DESC');
        break;
      case 'date':
        qb.orderBy('entity.createdAt', sortOrder.toUpperCase() as 'ASC' | 'DESC');
        break;
      case 'relevance':
      default:
        if (query) {
          qb.orderBy('rank', sortOrder.toUpperCase() as 'ASC' | 'DESC');
        } else {
          qb.orderBy('entity.createdAt', sortOrder.toUpperCase() as 'ASC' | 'DESC');
        }
        break;
    }

    // Apply pagination
    const total = await qb.getCount();
    qb.skip((page - 1) * limit).take(limit);

    const items = await qb.getMany();

    return {
      items,
      total,
      page,
      limit,
      hasNext: page * limit < total,
    };
  }

  async getAutoSuggestions(query: string): Promise<string[]> {
    // This approach uses PostgreSQL's trigram similarity for suggestions
    const result = await this.entityManager.query(`
      SELECT DISTINCT
        word
      FROM
        ts_stat('
          SELECT to_tsvector(''english'', title || '' '' || content)
          FROM your_entity_table
        ')
      WHERE
        word % $1
      ORDER BY
        similarity(word, $1) DESC
      LIMIT 10
    `, [query]);

    return result.map(row => row.word);
  }

  async getTrendingSearchTerms(): Promise<Array<{ term: string; count: number }>> {
    // Assuming you have a search_logs table to track search queries
    const result = await this.entityManager.query(`
      SELECT
        search_term as term,
        COUNT(*) as count
      FROM
        search_logs
      WHERE
        created_at > NOW() - INTERVAL '7 days'
      GROUP BY
        search_term
      ORDER BY
        count DESC
      LIMIT 10
    `);

    return result;
  }
}