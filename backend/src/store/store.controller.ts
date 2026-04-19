import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { QueryStoreDto, CreateStoreDto, UpdateStoreDto } from './store.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@clothing-inventory/shared';

@Controller('stores')
@Roles(UserRole.ADMIN)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findAll(@Query() query: QueryStoreDto) {
    return this.storeService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateStoreDto) {
    return this.storeService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storeService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.remove(id);
  }
}
