import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryStoreDto, CreateStoreDto, UpdateStoreDto } from './store.dto';

const SORTABLE_FIELDS = [
  'createdAt',
  'name',
  'code',
  'type',
  'status',
  'area',
  'employeeCount',
];

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryStoreDto) {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      type,
      status,
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: Record<string, unknown> = { isDeleted: false };

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { code: { contains: keyword } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (city) {
      where.city = { contains: city };
    }

    const sortField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.prisma.store.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortField]: sortOrder },
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number) {
    const store = await this.prisma.store.findFirst({
      where: { id, isDeleted: false },
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    return store;
  }

  private async generateNextCode(): Promise<string> {
    return this.prisma.$transaction(async (tx) => {
      const result = await tx.$queryRaw<Array<{ max_num: bigint }>>`
        SELECT MAX(CAST(REPLACE(code, 'STR-', '') AS INTEGER)) as max_num
        FROM stores WHERE code LIKE 'STR-%'
      `;
      const nextNum = result[0]?.max_num ? Number(result[0].max_num) + 1 : 1;
      return `STR-${String(nextNum).padStart(3, '0')}`;
    });
  }

  async create(dto: CreateStoreDto) {
    const code = await this.generateNextCode();

    if (dto.managerId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.managerId },
      });
      if (!user) {
        throw new NotFoundException('指定的管理员不存在');
      }
    }

    return this.prisma.store.create({
      data: {
        name: dto.name,
        code,
        type: dto.type,
        status: dto.status,
        country: dto.country,
        province: dto.province,
        city: dto.city,
        district: dto.district,
        address: dto.address,
        longitude: dto.longitude,
        latitude: dto.latitude,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        openTime: dto.openTime,
        openDate: dto.openDate ? new Date(dto.openDate) : undefined,
        closeDate: dto.closeDate ? new Date(dto.closeDate) : undefined,
        area: dto.area,
        employeeCount: dto.employeeCount,
        managerId: dto.managerId,
        managerName: dto.managerName,
        remark: dto.remark,
        rentCost: dto.rentCost,
      },
    });
  }

  async update(id: number, dto: UpdateStoreDto) {
    await this.findOne(id);

    if (dto.managerId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.managerId },
      });
      if (!user) {
        throw new NotFoundException('指定的管理员不存在');
      }
    }

    return this.prisma.store.update({
      where: { id },
      data: {
        ...dto,
        openDate: dto.openDate ? new Date(dto.openDate) : undefined,
        closeDate: dto.closeDate ? new Date(dto.closeDate) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.store.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
