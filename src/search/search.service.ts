import { Injectable, Logger } from '@nestjs/common';
import { SearchRepository } from './repositories/search.repository/search.repository';
import { SearchQueryDto } from './dto/search-query.dto/search-query.dto';
import { SearchResultDto } from './dto/search-result.dto/search-result.dto';
import { AutoSuggestionResponseDto } from './dto/auto-suggestion.dto/auto-suggestion.dto';
import { TrendingSearchResponseDto } from './dto/trending-search.dto/trending-search.dto';


@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  
  constructor(private readonly searchRepository: SearchRepository) {}

  async search(searchQueryDto: SearchQueryDto): Promise<SearchResultDto> {
    try {
      // Log the search query for trending searches
      if (searchQueryDto.query) {
        this.logSearchQuery(searchQueryDto.query);
      }
      
      return await this.searchRepository.search(searchQueryDto);
    } catch (error) {
      this.logger.error(`Error during search: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAutoSuggestions(query: string): Promise<AutoSuggestionResponseDto> {
    try {
      const suggestions = await this.searchRepository.getAutoSuggestions(query);
      return { suggestions };
    } catch (error) {
      this.logger.error(`Error getting auto-suggestions: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTrendingSearchTerms(): Promise<TrendingSearchResponseDto> {
    try {
      const terms = await this.searchRepository.getTrendingSearchTerms();
      return { terms };
    } catch (error) {
      this.logger.error(`Error getting trending search terms: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async logSearchQuery(query: string): Promise<void> {
    // Implementation for logging search queries to database
    // This will be used for trending searches feature
    try {
      // You'd implement database logging here
      this.logger.debug(`Logging search query: ${query}`);
    } catch (error) {
      this.logger.error(`Error logging search query: ${error.message}`);
    }
  }
}
