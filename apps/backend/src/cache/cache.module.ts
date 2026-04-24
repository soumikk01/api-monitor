import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global() // available everywhere without importing
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
