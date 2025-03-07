import { IsString, IsEnum, IsArray, Length, IsOptional, IsNumber, IsNumberString, IsEmail, IsDate, IsJSON, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';
import { extend } from 'dayjs';
import { Type } from 'class-transformer';

export enum StatusEnum {
  STATIC = '1',
  DYNAMIC = '2',
}

export enum BusinessEnum {
  OUTPATIENT = '门诊',
  INPATIENT = '住院',
  CT = 'CT',
  PHYSICAL_EXAMINATION = '体检',
  EXAMINATION = '检查',
  TESTING = '检验'
}

/**
 * DTO 用于定义数据的结构，用于请求和响应的验证.
 */
export class EmrHeaderDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsEnum(BusinessEnum)
  business: string;
  // business (business：门诊、住院、CT、体检、检查、检验) 

  @ApiProperty({ required: true })
  @IsString()
  id: string;
  // id：(payload文档id) 

  @ApiProperty({ required: true })
  @IsString()
  jobId: string;
  // jobId (病人job_id) 

  @ApiProperty({ required: true })
  @IsString()
  patient: string;
  // patient (病人unique) 

  @ApiProperty({ required: true })
  @IsString()
  project: string;
  // project (项目编号；区分payload类型，用于病历特殊情况的标签显示) 

  @ApiProperty({ required: true })
  @IsEnum(StatusEnum)
  status: string;
  // status (payload状态，发布状态:1/草稿状态:2) 
}

export class CreateMedicalRecordDto {
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

  // @ApiProperty({ required: true, type: EmrHeaderDto })
  // header: EmrHeaderDto;
  @ApiProperty({ required: true })
  @IsObject()
  header: Record<string, any>;

  @ApiProperty({ required: true })
  @IsString()
  jobID: string;

  @ApiProperty({ required: true })
  @IsString()
  patientID: string;

  @ApiProperty({ required: true })
  @IsString()
  payloadID: string;

  @IsOptional()
  @IsString()
  @IsEnum(BusinessEnum)
  businessType: string

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
  @IsObject()
  participants: Record<string, any>;

  @ApiProperty({ required: true })
  @IsObject()
  payload: Record<string, any>;
}

/**
 * 实际上没有update病历操作
 */
// export class UpdateMedicalRecordDto extends PartialType(CreateMedicalRecordDto) {
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
  MedicalRecordId: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsEnum(StatusEnum)
  status: string;
}

export class ListMedicalRecordDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  MedicalRecordId?: string;

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

