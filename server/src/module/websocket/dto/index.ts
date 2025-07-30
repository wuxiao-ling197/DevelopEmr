import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBooleanString, IsNumber, IsOptional, IsString } from "class-validator";

// 通知发布dto
export class messageDto {
    @IsNumber()
    channelId: number;

    @IsString()
    messageBody: string;

    @IsString()
    user: string;
}

// 列表查询dto
export class ListChannelDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    parentChannelId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    fromMessageId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    groupPublicId?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    channelType?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    uuid?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBooleanString()
    active?: boolean;
}