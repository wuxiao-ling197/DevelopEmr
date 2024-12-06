import { Controller, Get, Post, Body, Put, Param, Query, Res, Delete, Request, UseGuards, CanActivate } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MetadataService } from './metadata.service';
import { Response } from 'express';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';

import { CreateMetadataDto, ListMetadataDto, ChangeStatusDto, SelectFieldListDto } from './dto/index';

/**
 * 处理传入的请求，并调用服务来处理业务逻辑。
 */
@ApiTags('元数据管理')
@Controller('emrManage/Metadata')
export class MetadataController {
  constructor(private readonly MetadataService: MetadataService) { }

  // @ApiOperation({
  //   summary: '信息中心-',
  // })
  // @RequirePermission('system:Metadata:query')
  // @Get('/profile')
  // profile(@Request() req) {
  //   const Metadata = req.Metadata.Metadata;
  //   return this.MetadataService.profile(Metadata);
  // }

  @ApiOperation({
    summary: '元数据-查询大类',
  })
  // @UseGuards(<CanActivate[]>[])
  // @RequirePermission('emr:Metadata:add')//权限标识
  @Get('/category')
  findCategory() {
    return this.MetadataService.findCategory();
  }

  @ApiOperation({
    summary: '元数据-查询值域code',
  })
  // @RequirePermission('system:Metadata:query')
  @Get('codelist:category')
  findAll(@Param('category') category: string) {
    return this.MetadataService.findCodeByCategoryCode(category);
  }

  @ApiOperation({
    summary: '元数据-查询值value',
  })
  // @RequirePermission('system:Metadata:query')
  @Get('valuelist:code')
  findOne(@Param('code') code: string) {
    // return this.MetadataService.findOne(+MetadataId);//通过一元运算将string转换成number
    return this.MetadataService.findValueListByCode(code);
  }

  @ApiOperation({
    summary: '元数据-通过编号查询完整数据对象',
  })
  @ApiBody({
    type: ChangeStatusDto,
    required: true,
  })
  // @RequireRole('admin')
  @Get('metadata:no')
  findMetadataByNo(@Param('no') no: string) {
    return this.MetadataService.findByNo(no);
  }

  @ApiOperation({
    summary: '元数据-获取表单fieldList',
  })
  @ApiBody({
    type: ChangeStatusDto,
    required: true,
  })
  // @RequireRole('admin')
  @Get('fieldList')
  getFieldList(@Query() query: SelectFieldListDto) {
    // console.log('getFieldListController-----80---');
    // console.log(query.category);
    return this.MetadataService.getFieldList(query);
  }


}
