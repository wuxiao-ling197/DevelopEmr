import { Controller, Get, Post, HttpStatus, Body, Put, Param, Query, Res, Delete, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordService } from './medicalRecord.service';
import { Response } from 'express';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';


import { CreateMedicalRecordDto, ListMedicalRecordDto, ChangeStatusDto } from './dto/index';

/**
 * 处理传入的请求，并调用服务来处理业务逻辑。
 */
@ApiTags('病历管理')
@Controller('emrManage/MedicalRecord')
export class MedicalRecordController {
  constructor(private readonly MedicalRecordService: MedicalRecordService) { }

  @ApiOperation({
    summary: '病历-创建',
  })
  @ApiBody({
    type: CreateMedicalRecordDto,
    required: true,
  })
  // @RequirePermission('emr:MedicalRecord:add')//权限标识
  @Post()
  create(@Body() createMedicalRecordDto: any) {
    return this.MedicalRecordService.create(createMedicalRecordDto);
  }

  @ApiOperation({
    summary: '病历-列表',
  })
  // @RequirePermission('system:MedicalRecord:query')
  @Get('list')
  // findAll(@Query() query: ListMedicalRecordDto, @Request() req) {
  // findAll(@Request() req) {
  findAll(@Query() req, @Res({ passthrough: true }) res: Response) {
    console.log(req);
    // MedicalRecordId='string'&participants='{"p1":"pd-id"}'&payload='{"type":"病历"}'&active='1'&status='string';
    // const MedicalRecord = req.MedicalRecord;\
    return this.MedicalRecordService.findAll(req);
  }

  @ApiOperation({
    summary: '病历-生成唯一ID',
  })
  // @RequirePermission('system:MedicalRecord:query')
  @Get('generateID')
  // findAll(@Query() query: ListMedicalRecordDto, @Request() req) {
  // findAll(@Request() req) {
  async getJobID(@Query() query) {
    console.log(query);
    // MedicalRecordId='string'&participants='{"p1":"pd-id"}'&payload='{"type":"病历"}'&active='1'&status='string';
    // const MedicalRecord = req.MedicalRecord;
    return this.MedicalRecordService.generateID(query);
  }

  @ApiOperation({
    summary: '病历-患者病历列表',
  })
  // @RequirePermission('system:MedicalRecord:query')
  @Get(':patient')
  async findOne(@Param('patient') patient: string) {
    console.log('patient:', patient);
    return this.MedicalRecordService.findPatientMR(patient);
  }

  @ApiOperation({
    summary: '病历-停用模板',
  })
  @ApiBody({
    type: ChangeStatusDto,
    required: true,
  })
  @RequireRole('admin')
  @Put('changeStatus')
  changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return this.MedicalRecordService.changeStatus(changeStatusDto);
  }

  @ApiOperation({
    summary: '病历-删除',
  })
  @RequireRole('admin')
  @Delete(':id')
  remove(@Param('id') ids: string) {
    const menuIds = ids.split(',').map((id) => +id);
    return this.MedicalRecordService.remove(menuIds);
  }

  @ApiOperation({ summary: '导出病历信息数据为xlsx' })
  @RequirePermission('system:MedicalRecord:export')
  @Post('/export')
  async export(@Res() res: Response, @Body() body: ListMedicalRecordDto, @Request() req): Promise<void> {
    const MedicalRecord = req.MedicalRecord.MedicalRecord;
    return this.MedicalRecordService.export(res, body, MedicalRecord);
  }
}
