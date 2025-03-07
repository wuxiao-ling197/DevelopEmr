import { IsString, IsEnum, IsArray, Length, IsOptional, IsNumber, IsNumberString, IsEmail, IsDate, IsJSON, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';
import { extend } from 'dayjs';
import { Type } from 'class-transformer';

export enum FeildTypeEnum {
    LIBRARY = '字段库',
    CATEGORY = '标准编码类别',
    ENTITY = '实体',
    FIELD = '字段'
}
// 定义type
export class TreeNode {
    level: number;
    code: string;
    name: string;

    @IsEnum(FeildTypeEnum)
    type?: FeildTypeEnum;

    children?: Array<TreeNode>;

    parent?: string;
    label: string
}

// 定义枚举
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

// 顶级结构类
export class DynamicOptionsDto {
    @IsString()
    value: string;

    @IsString()
    label: string;
}

export class WidgetJsonDto {
    @IsString()
    type: string;

    @IsString()
    name: string;

    @IsString()
    label: string;

    @IsString()
    id: string;

    @IsArray()
    optionItems: any[];
}
/**
 * DTO 用于定义数据的结构，用于请求和响应的验证.
 */
export class EmrHeaderDto {
    @ApiProperty({ required: true })
    @IsString()
    @IsEnum(BusinessEnum)
    business: string;

    @ApiProperty({ required: true })
    @IsEnum(StatusEnum)
    status: string;
}

export class SelectDoctorDto {
    @ApiProperty({ required: true })
    @IsString()
    deptID: string//选择科室

    @IsOptional()
    @IsString()
    docterID?: string//选择医生

    @IsOptional()
    @IsDate()
    regisDate?: Date//预约日期

    @IsOptional()
    @IsDate()
    bookTime?: Date//预约时间

}