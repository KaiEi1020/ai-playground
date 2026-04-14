import { Injectable } from '@nestjs/common';
import { Permission } from '../../auth/constants/permissions';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.interface';
import { ensurePermission } from '../../auth/utils/authorization.util';
import { CreateCampaignDto } from '../api/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../api/dto/update-campaign.dto';
import { InMemoryMarketingCampaignRepository } from '../infrastructure/repositories/in-memory-marketing-campaign.repository';

@Injectable()
export class MarketingCampaignsService {
  constructor(
    private readonly campaignRepository: InMemoryMarketingCampaignRepository,
  ) {}

  async create(dto: CreateCampaignDto, user: AuthenticatedUser) {
    ensurePermission(user.permissions, Permission.MARKETING_CAMPAIGNS.CREATE);
    return this.campaignRepository.create(dto, user.userId);
  }

  async findAll(user: AuthenticatedUser) {
    ensurePermission(user.permissions, Permission.MARKETING_CAMPAIGNS.READ);
    return this.campaignRepository.findAll();
  }

  async update(id: string, dto: UpdateCampaignDto, user: AuthenticatedUser) {
    ensurePermission(user.permissions, Permission.MARKETING_CAMPAIGNS.UPDATE);
    return this.campaignRepository.update(id, dto);
  }

  async activate(id: string, user: AuthenticatedUser) {
    ensurePermission(user.permissions, Permission.MARKETING_CAMPAIGNS.UPDATE);
    return this.campaignRepository.activate(id, user.userId);
  }

  async clear(): Promise<void> {
    await this.campaignRepository.clear();
  }
}
