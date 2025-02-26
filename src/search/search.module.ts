import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './repositories/search.repository/search.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([]), 
    ConfigModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
  exports: [SearchService],
})
export class SearchModule {}