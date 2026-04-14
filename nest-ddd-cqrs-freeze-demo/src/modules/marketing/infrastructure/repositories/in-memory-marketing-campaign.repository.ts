import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CampaignEntity } from '../../domain/campaign.entity';
import { CreateCampaignDto } from '../../api/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../api/dto/update-campaign.dto';

@Injectable()
export class InMemoryMarketingCampaignRepository {
  private readonly campaigns = new Map<string, CampaignEntity>();

  async create(dto: CreateCampaignDto, createdBy: string): Promise<CampaignEntity> {
    const campaign = new CampaignEntity(
      randomUUID(),
      dto.name,
      dto.description,
      'DRAFT',
      createdBy,
      new Date(),
      null,
      null,
    );
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async findAll(): Promise<CampaignEntity[]> {
    return Array.from(this.campaigns.values());
  }

  async findById(id: string): Promise<CampaignEntity> {
    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new NotFoundException(`Campaign ${id} not found.`);
    }

    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto): Promise<CampaignEntity> {
    const campaign = await this.findById(id);
    campaign.name = dto.name ?? campaign.name;
    campaign.description = dto.description ?? campaign.description;
    return campaign;
  }

  async activate(id: string, activatedBy: string): Promise<CampaignEntity> {
    const campaign = await this.findById(id);
    campaign.status = 'ACTIVE';
    campaign.activatedAt = new Date();
    campaign.activatedBy = activatedBy;
    return campaign;
  }

  async clear(): Promise<void> {
    this.campaigns.clear();
  }
}
