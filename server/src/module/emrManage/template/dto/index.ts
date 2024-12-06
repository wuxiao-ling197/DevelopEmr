import { IsString, IsEnum, IsArray, Length, IsOptional, IsNumber, IsNumberString, IsEmail, IsDate, IsJSON, IsBoolean } from 'class-validator';
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
  active: string;

  @ApiProperty({ required: true })
  @IsString()
  jobID: string;

  @ApiProperty({ required: true })
  @IsString()
  patientID: string;
  
  @ApiProperty({ required: true })
  @IsString()
  payloadID: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  createDate?: Date;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  writeDate?: Date;

  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 30)
  meta: string;

  @ApiProperty({ required: true })
  @IsString()
  participants: string;

  @ApiProperty({ required: true })
  @IsString()
  payload: string;
}

/**
 * 实际上没有（有没有呢）update模板操作
 */
// export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
//   @ApiProperty({
//     required: true,
//   })
//   @IsString()
//   id: string;

//   // @ApiProperty({ required: false })
//   // @IsOptional()
//   // @IsDate()
//   // updateTime?: Date;

//   // @ApiProperty({ required: false })
//   // @IsOptional()
//   // @IsString()
//   // updateBy?: string;
// }

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

export class ListTemplateDto{
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

