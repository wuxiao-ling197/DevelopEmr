import { IsString, IsEnum, IsArray, Length, IsOptional, IsNumber, IsNumberString, IsEmail, IsDate, IsJSON, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';
import { extend } from 'dayjs';
import { Type } from 'class-transformer';

export enum StatusEnum {
  STATIC = '1',
  DYNAMIC = '2',
}

/**
 * DTO 用于定义数据的结构，用于请求和响应的验证.
 */
export class CreateTemplateDto {

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)//确保从json转换过来也能被正确解析成number类型
  createUID: number;

  @ApiProperty({ required: true })
  @IsNumber()
  writeUID: number;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  business: string;

  @ApiProperty({ required: true })
  @IsString()
  templateType: string;

  @ApiProperty({ required: true })
  @IsString()
  category: string;

  @ApiProperty({ required: true })
  @IsString()
  permission: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  active?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  meta?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ required: true })
  @IsObject()
  payload: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  createDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  writeDate?: Date;
}

/**
 * 查询所有模板列表或者树形列表参数
 */
export class FindTemplateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tempType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  transTree?: any;
}

export class ChangeStatusDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  TemplateId: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsEnum(StatusEnum)
  status: string;
}

export class ListTemplateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  TemplateId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  participants?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  active?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}

