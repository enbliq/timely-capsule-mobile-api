// import { ApiProperty } from '@nestjs/swagger';

class TrendingSearchTermDto {
  // @ApiProperty({ description: 'Search term' })
  // term: string;
  
  // @ApiProperty({ description: 'Number of searches for this term' })
  // count: number;
}

export class TrendingSearchResponseDto {
  // @ApiProperty({ 
  //   description: 'Array of trending search terms with count',
  //   type: [TrendingSearchTermDto]
  // })
  terms: TrendingSearchTermDto[];
}