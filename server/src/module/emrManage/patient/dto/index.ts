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

export class CreatePatientDto {
  // 需要身份证号
  // 姓名
  // 性别
  // public no: string;
  @ApiProperty({ required: true })
  @IsString()
  no: string;

  // public create_uid: number; 
  @ApiProperty({ required: true })
  @IsNumber()
  createUid: number;

  // public write_uid: number; 
  @ApiProperty({ required: true })
  @IsNumber()
  write_uid: number;

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
}


// 选择病人
export class ChosePatientDto {
  // 证件号码
  @ApiProperty({ required: true })
  @IsString()
  identifyid: string;

  // 证件类型
  @ApiProperty({ required: true })
  @IsString()
  identityType: string;
}

// 根据条件选择病人（科室、主治医生、就诊类型、、、）
export class selectPatientDto {
  // 科室名称或编码...
  @ApiProperty({ required: true })
  @IsString()
  completeName?: string;

  @ApiProperty({ required: true })
  @IsNumber()
  completeCode?: number;
}

export class CallPatientNumberDto {
  @ApiProperty({ required: true })
  @IsNumber()
  patientID: number
}

// 签到后将信息加入排队
export class CreateQueueDto {
  @IsNumber()
  createUid: number;

  writeUid: number;

  patientID: number;

  patientGender: number;

  qNumber: number;

  busTypeSeq: number;

  regDapartmentID: number;

  doctorID: number;

  departmantID: number;

  idCard: string;

  patientJobid: string;

  patientAge: string;

  ticketNumber: string;

  windowNumber: string;

  windowName: string;

  areaName: string;

  vipLevel: string;

  state: string;

  reserveSeq: string;

  reserveType: string;

  type: string;

  qType: string;

  queueState: string;

  reserveDate: Date;

  ticketTime: Date;

  reserveStartTime: Date;

  reserveEndTime: Date;

  reserveTime: Date;

  createDate: Date;

  writeDate: Date;
}

// 修改排队状态
export class UpdateQueueStataDto {
  @ApiProperty({ required: true })
  @IsNumber()
  patientID: number;

  @ApiProperty({ required: true })
  @IsNumber()
  qNumber: number;

  @ApiProperty({ required: true })
  @IsString()
  queueState: string;
}