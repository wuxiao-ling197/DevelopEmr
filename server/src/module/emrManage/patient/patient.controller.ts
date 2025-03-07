import { Controller, Get, Post, Body, Put, Param, Query, Res, Delete, Request, UseGuards, CanActivate } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { query, Response } from 'express';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';
import { CallPatientNumberDto, UpdateQueueStataDto } from './dto';


/**
 * 处理传入的请求，并调用服务来处理业务逻辑。
 */
@ApiTags('病人管理')
@Controller('emrManage/patient')
export class PatientController {
  constructor(private readonly PatientService: PatientService) { }
  @ApiOperation({
    summary: '查询病人列表',
  })
  // @RequirePermission('emr:Patient:add')//权限标识
  @Get('list')
  findAll() {
    console.log('========findPatient========');
    return this.PatientService.findAll();
  }

  @ApiOperation({
    summary: '查询本诊室排队病人列表',
  })
  // @RequirePermission('emr:Patient:add')//权限标识
  @Get('roomCallList')
  findRoomList(@Query() query: any) {
    console.log('========findRoomPatient========');
    console.log(query);
    return this.PatientService.getCallListByRoomId(query.roomID);
  }

  @ApiOperation({
    summary: '叫号',
  })
  @ApiBody({
    type: CallPatientNumberDto,
    required: true,
  })
  @Post('callNumber')
  callPatientNumber(@Body() callPatientNumberDto: any) {
    return this.PatientService.callPatientNumber(callPatientNumberDto);
  }

  @ApiOperation({
    summary: '修改排队状态',
  })
  @ApiBody({
    type: UpdateQueueStataDto,
    required: true,
  })
  @Post('updateState')
  updateQueueState(@Body() updateQueueStataDto: any) {
    console.log('-----update controller');
    console.log(updateQueueStataDto);

    return this.PatientService.updateQueueState(updateQueueStataDto);
  }
}
