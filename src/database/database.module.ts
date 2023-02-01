import { Module } from '@nestjs/common';
import { databaseProviders } from './mongodb';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
