import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Permission } from '../../auth/constants/permissions';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.interface';
import { MarketingCampaignsService } from '../application/marketing-campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Controller('marketing-campaigns')
export class MarketingCampaignsController {
  constructor(private readonly marketingCampaignsService: MarketingCampaignsService) {}

  @Post()
  @RequirePermissions(Permission.MARKETING_CAMPAIGNS.CREATE)
  async create(
    @Body() dto: CreateCampaignDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.marketingCampaignsService.create(dto, user);
  }

  @Get()
  @RequirePermissions(Permission.MARKETING_CAMPAIGNS.READ)
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.marketingCampaignsService.findAll(user);
  }

  @Patch(':id')
  @RequirePermissions(Permission.MARKETING_CAMPAIGNS.UPDATE)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCampaignDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.marketingCampaignsService.update(id, dto, user);
  }

  @Post(':id/activate')
  @RequirePermissions(Permission.MARKETING_CAMPAIGNS.UPDATE)
  async activate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.marketingCampaignsService.activate(id, user);
  }
}
