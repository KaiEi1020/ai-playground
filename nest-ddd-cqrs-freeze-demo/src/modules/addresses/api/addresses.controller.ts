import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { Permission } from '../../auth/constants/permissions';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.interface';
import { AddressesService } from '../application/addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @RequirePermissions(Permission.ADDRESSES.CREATE)
  async create(
    @Body() dto: CreateAddressDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.addressesService.create(dto, user);
  }

  @Get(':id')
  @RequirePermissions(Permission.ADDRESSES.READ)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.addressesService.findOne(id, user);
  }

  @Get()
  @RequirePermissions(Permission.ADDRESSES.READ)
  async listByUser(
    @Query('userId', new ParseUUIDPipe()) userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.addressesService.findByUserId(userId, user);
  }
}
