import { ApiProperty } from '@nestjs/swagger';

export class AutoSuggestionResponseDto {
  @ApiProperty({ 
    description: 'Array of suggested search terms',
    type: [String]
  })
  suggestions: string[];
}