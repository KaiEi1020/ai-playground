import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Permission } from '../../auth/constants/permissions';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.interface';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { FreezeUserAccountCommand } from '../application/commands/freeze-user-account.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFacade } from '../users.facade';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userFacade: UserFacade,
  ) {}

  @Post()
  @RequirePermissions(Permission.USERS.CREATE)
  async createUser(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(
      new CreateUserCommand(dto.id, user.permissions),
    );
  }

  @Post(':id/freeze')
  @RequirePermissions(Permission.USERS.FREEZE)
  async freezeUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commandBus.execute(
      new FreezeUserAccountCommand(id, user.permissions),
    );
  }

  @Get(':id')
  @RequirePermissions(Permission.USERS.READ)
  async getUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userFacade.getUser(id, user.permissions);
  }
}
