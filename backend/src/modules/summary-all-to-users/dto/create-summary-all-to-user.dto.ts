import { Gender } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSummaryAllToUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(0, { message: 'La edad debe ser un número positivo' })
  edad?: number;

  @IsOptional()
  @IsString()
  comidaFavorita?: string;

  @IsEnum(Gender, {
    message: 'El género debe ser MASCULINO, FEMENINO u OTRO',
  })
  @IsNotEmpty({ message: 'El género es obligatorio' })
  genero: Gender;
}
