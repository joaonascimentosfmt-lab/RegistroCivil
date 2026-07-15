import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluateRuleDto {
  @ApiProperty({ description: 'Dados do contexto para avaliação' })
  @IsObject()
  context: Record<string, any>;
}
