import { IsString, IsOptional, IsNumber, IsObject, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHrDeptDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  parentId: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  masterDepartmentId: number;

  @ApiProperty({
    required: true,
    description: 'odoo部门名称,以jsonb格式存储于数据库',
  })
  @IsObject()
  name: Record<string, any>;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  createDate: Date;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  dutyId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  virtual?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

export class UpdateHrDeptDto extends CreateHrDeptDto {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  id: number;
}

export class ListHrDeptDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
