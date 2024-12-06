//模板管理
import { Controller, Get, Post, Body, Put, Param, Query, Res, Delete, Request, UseGuards, CanActivate } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { Response } from 'express';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';


/**
 * 处理传入的请求，并调用服务来处理业务逻辑。
 */
@ApiTags('模板管理')
@Controller('emrManage/EMRModules')
export class TemplateController {
  constructor(private readonly TemplateService: TemplateService) {}
  @ApiOperation({
    summary: '查询模板列表',
  })
  // @RequirePermission('emr:Patient:add')//权限标识
  @Get('findTemplate')
  findTemplateList() {
    console.log('========findTemplate========');
    return this.TemplateService.findAll();
  }

  @ApiOperation({
    summary: '查询模板',
  })
  // @RequirePermission('emr:Patient:add')//权限标识
  @Get('selectTemplate')
  selectTemplate(@Query('templateID') templateID: number) {
    console.log(templateID);
    
    console.log('========selectOneTemplate========');
    return this.TemplateService.findOne(templateID);
  }

  @ApiOperation({
    summary: '创建模板',
  })
  // @RequirePermission('emr:Patient:add')//权限标识
  @Post('createTemplate')
  createTemplate(@Body() createTemplateDto: any) {
    console.log('========createTemplate========');
    
    return this.TemplateService.createTemplate(createTemplateDto);
  }
}
