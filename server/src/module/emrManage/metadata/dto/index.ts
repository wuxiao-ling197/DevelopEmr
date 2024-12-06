import { IsString, IsEnum, IsArray, Length, IsOptional, IsNumber, IsNumberString, IsEmail, IsDate, IsJSON, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';
import { extend } from 'dayjs';

export enum StatusEnum {
  STATIC = '1',
  DYNAMIC = '2',
}

/**
 * DTO 用于定义数据的结构，用于请求和响应的验证.
 */

export class CreateMetadataDto {
  // public no: string;
  @ApiProperty({ required: true })
  @IsString()
  no: string;

  // public create_uid: number; 
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  createUid: number;

  // public write_uid: number; 
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  writeUid: number;

  // public code: string;
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  code: string;

  // public code_name: string;
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  codeName: string;

  // public value: string;
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  value: string;

  // public value_mean: string;
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  valueMean: string;

  // public category: string;
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  category: string;

  // public explain: string;
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  explain: string;

  // public create_date: Date;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  createDate?: Date;

  // public write_date: Date;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  writeDate?: Date;

  // public category_code: string;
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  categoryCode: string;
}

// 查询fieldList
export class SelectFieldListDto {
  //类别
  @ApiProperty({
    required: false,
  })
  @IsString()
  category?: string;

  //类别代码
  // @ApiProperty({
  //   required: false,
  // })
  // @IsString()
  // categoryCode?: string;

  // // 值域代码
  // @IsString()
  // @IsEnum(StatusEnum)
  // code?: string;

  // // 值
  // @IsString()
  // @IsEnum(StatusEnum)
  // value?: string;

  // // 值含义
  // @IsString()
  // @IsEnum(StatusEnum)
  // value_mean?: string;

  // // 编号
  // @IsString()
  // @IsEnum(StatusEnum)
  // no?: string;
}

export class ChangeStatusDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  MetadataId: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsEnum(StatusEnum)
  status: string;
}

export class ListMetadataDto extends PagingDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumberString()
  MetadataId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  participants?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsJSON()
  payload?: JSON;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: Boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}

