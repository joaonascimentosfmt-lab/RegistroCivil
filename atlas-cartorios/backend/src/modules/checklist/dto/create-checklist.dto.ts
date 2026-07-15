import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';

export class CreateChecklistDto {
  @ApiProperty({ description: 'ID do protocolo' })
  @IsUUID('4', { message: 'ID do protocolo inválido' })
  protocolId: string;

  @ApiProperty({ enum: ServiceType, description: 'Tipo de serviço' })
  @IsEnum(ServiceType, { message: 'Tipo de serviço inválido' })
  serviceType: ServiceType;
}
