import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}

export class LoginDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  // @Length(2, 10)
  username: string;

  @IsString()
  @Length(5, 20)
  password: string;

  @IsOptional()
  @IsString()
  uuid?: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  phonenumber: string;
}

export class ClientInfoDto {
  ipaddr: string;
  userAgent: string;
  browser: string;
  os: string;
  loginLocation: string;
}
