import { PartialType } from '@nestjs/mapped-types';
import { Gender } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CreateSummaryAllToUserDto } from './create-summary-all-to-user.dto';

export class UpdateSummaryAllToUserDto extends PartialType(
  CreateSummaryAllToUserDto,
) {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo?: string;

  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(0, { message: 'La edad debe ser un número positivo' })
  edad?: number;

  @IsOptional()
  @IsString()
  comidaFavorita?: string;

  @IsOptional()
  @IsEnum(Gender, {
    message: 'El género debe ser MASCULINO, FEMENINO u OTRO',
  })
  genero?: Gender;
}
