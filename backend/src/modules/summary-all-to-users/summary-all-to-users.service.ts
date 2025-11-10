import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { CreateSummaryAllToUserDto } from './dto/create-summary-all-to-user.dto';
import { UpdateSummaryAllToUserDto } from './dto/update-summary-all-to-user.dto';

@Injectable()
export class SummaryAllToUsersService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async create(createDto: CreateSummaryAllToUserDto) {
    try {
      const user = await this.prisma.summaryAllToUsers.create({
        data: createDto,
      });

      // Emitir evento de creación en tiempo real
      this.realtimeGateway.emitUserCreated(user);

      // Actualizar estadísticas
      await this.emitStats();

      return user;
    } catch (error) {
      // Manejo de error de correo duplicado (código P2002 de Prisma)
      if (error.code === 'P2002') {
        throw new ConflictException(
          `El correo ${createDto.correo} ya está registrado`,
        );
      }
      throw new BadRequestException(
        'Error al crear el usuario: ' + error.message,
      );
    }
  }

  async findAll() {
    return await this.prisma.summaryAllToUsers.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.summaryAllToUsers.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, updateDto: UpdateSummaryAllToUserDto) {
    // Verificar que el usuario existe
    await this.findOne(id);

    try {
      const updatedUser = await this.prisma.summaryAllToUsers.update({
        where: { id },
        data: updateDto,
      });

      // Emitir evento de actualización en tiempo real
      this.realtimeGateway.emitUserUpdated(updatedUser);

      // Actualizar estadísticas
      await this.emitStats();

      return updatedUser;
    } catch (error) {
      // Manejo de error de correo duplicado
      if (error.code === 'P2002') {
        throw new ConflictException(
          `El correo ${updateDto.correo} ya está registrado por otro usuario`,
        );
      }
      throw new BadRequestException(
        'Error al actualizar el usuario: ' + error.message,
      );
    }
  }

  async remove(id: number) {
    // Verificar que el usuario existe
    await this.findOne(id);

    try {
      await this.prisma.summaryAllToUsers.delete({
        where: { id },
      });

      // Emitir evento de eliminación en tiempo real
      this.realtimeGateway.emitUserDeleted(id);

      // Actualizar estadísticas
      await this.emitStats();

      return { message: `Usuario con ID ${id} eliminado exitosamente` };
    } catch (error) {
      throw new BadRequestException(
        'Error al eliminar el usuario: ' + error.message,
      );
    }
  }

  // Método para obtener estadísticas
  async getStats() {
    const total = await this.prisma.summaryAllToUsers.count();

    const byGender = await this.prisma.summaryAllToUsers.groupBy({
      by: ['genero'],
      _count: true,
    });

    const avgAge = await this.prisma.summaryAllToUsers.aggregate({
      _avg: { edad: true },
      _min: { edad: true },
      _max: { edad: true },
    });

    const recentUsers = await this.prisma.summaryAllToUsers.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        genero: true,
        createdAt: true,
      },
    });

    return {
      total,
      byGender: byGender.map((g) => ({
        genero: g.genero,
        count: g._count,
      })),
      ageStats: {
        average: avgAge._avg.edad,
        min: avgAge._min.edad,
        max: avgAge._max.edad,
      },
      recentUsers,
      timestamp: new Date().toISOString(),
    };
  }

  // Emitir estadísticas en tiempo real
  private async emitStats() {
    try {
      const stats = await this.getStats();
      this.realtimeGateway.emitUsersStats(stats);
    } catch (error) {
      // No lanzar error si falla el emit de stats
      console.error('Error emitting stats:', error);
    }
  }
}
