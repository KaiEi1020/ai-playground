import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
  async createUser(@Body() dto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(dto.id));
  }

  @Post(':id/freeze')
  async freezeUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commandBus.execute(new FreezeUserAccountCommand(id));
  }

  @Get(':id')
  async getUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userFacade.getUser(id);
  }
}
