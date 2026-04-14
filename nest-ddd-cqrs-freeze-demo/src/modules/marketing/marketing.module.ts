import { Module } from '@nestjs/common';
import { MarketingCampaignsController } from './api/marketing-campaigns.controller';
import { MarketingCampaignsService } from './application/marketing-campaigns.service';
import { InMemoryMarketingCampaignRepository } from './infrastructure/repositories/in-memory-marketing-campaign.repository';

@Module({
  controllers: [MarketingCampaignsController],
  providers: [MarketingCampaignsService, InMemoryMarketingCampaignRepository],
  exports: [MarketingCampaignsService, InMemoryMarketingCampaignRepository],
})
export class MarketingModule {}
