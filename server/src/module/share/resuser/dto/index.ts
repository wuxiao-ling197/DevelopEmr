import { IsString, IsArray, IsOptional, IsBoolean, IsNumber, IsNumberString, IsEmail, IsDate, IsBooleanString, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';
import { SharedEntity } from 'src/common/entities/shared';
import { Type } from 'class-transformer';

/**
 * DTO 用于定义数据的结构，用于请求和响应的验证.
 */
export class CreateResUserDto extends SharedEntity {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  //emp根据dept_id查询到hr_dept然后返回deptname
  departmentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  companyId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  workEmail: string;

  //员工姓名，创建用户时在根据
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  //res_user 登录名
  @ApiProperty({ required: true })
  @IsString()
  login: string;

  //res_user
  @ApiProperty({ required: true })
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  // @IsPhoneNumber('CN')
  workPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  // @IsPhoneNumber('CN')
  mobilePhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  roles?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  employeeType?: string;

  //res_groups id=1 10 11 与res_user联合表res_user_goup
  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // userType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  //婚姻状况
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  marital?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  privatePhone?: string;
}

export class CreateEmpDto extends SharedEntity {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  //emp根据dept_id查询到hr_dept然后返回deptname
  deptName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  workEmail: string;

  //员工姓名，创建用户时在根据
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  //res_user 登录名
  @ApiProperty({ required: true })
  @IsString()
  login: string;

  //res_user
  @ApiProperty({ required: true })
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  // @IsPhoneNumber('CN')
  workPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  // @IsPhoneNumber('CN')
  mobilePhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  saleTeamId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  companyId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  employeeType?: string;

  //res_groups id=1 10 11 与res_user联合表res_user_goup
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  //婚姻状况
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  marital?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  privatePhone?: string;

  //   @ApiProperty({ required: false })
  //   @IsOptional()
  //   @IsDate()
  //   createTime?: Date;

  //   @ApiProperty({ required: false })
  //   @IsOptional()
  //   @IsString()
  //   createBy?: string;
}

export class UpdateResUserDto extends PartialType(CreateResUserDto) {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  id: number;
}

export class ChangeStatusDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({ required: true })
  @IsBoolean()
  active: boolean;
}

export class CreateUGDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  gid: number;

  @ApiProperty({ required: true })
  @IsNumber()
  uid: number;
}

export class ListResUserDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  // @IsNumberString()
  @IsNumber()
  @Type(() => Number)
  departmentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  employeeType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  workPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  workEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  active?: boolean;
}

export class ResetPwdDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  password: string;
}

export class AllocatedListDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  roleId?: string;
}

export class AuthUserCancelDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  roleId: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  userId: number;
}

export class AuthUserCancelAllDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  roleId: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  userIds: string;
}

export class AuthUserSelectAllDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  roleId: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  userIds: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  login: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsEmail()
  workEmail: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  mobilePhone: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  gender: string;
}

export class UpdatePwdDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(5, 50)
  oldPassword: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(5, 50)
  newPassword: string;

  // @ApiProperty({ required: true })
  // @IsString()
  // confirmnewPassword: string;
}
