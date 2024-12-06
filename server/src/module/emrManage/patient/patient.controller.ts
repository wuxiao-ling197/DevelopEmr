import { Controller, Get, Post, Body, Put, Param, Query, Res, Delete, Request, UseGuards, CanActivate } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { Response } from 'express';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';


/**
 * 处理传入的请求，并调用服务来处理业务逻辑。
 */
@ApiTags('病人管理')
@Controller('emrManage/patient')
export class PatientController {
  constructor(private readonly PatientService: PatientService) {}
  @ApiOperation({
    summary: '查询病人列表',
  })
  // @RequirePermission('emr:Patient:add')//权限标识
  @Get('list')
  findCategory() {
    console.log('========findPatient========');
    
    return this.PatientService.findAll();
  }
}
