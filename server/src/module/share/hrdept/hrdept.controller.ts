import { Controller, Get, Post, Body, Put, Param, Query, Delete, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { HrDeptService } from './hrdept.service';
import { CreateHrDeptDto, UpdateHrDeptDto, ListHrDeptDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('部门管理')
@Controller('system/dept')
export class HrDeptController {
  constructor(private readonly hrdeptService: HrDeptService) { }

  @ApiOperation({
    summary: '部门管理-创建',
  })
  @ApiBody({
    type: CreateHrDeptDto,
    required: true,
  })
  @RequirePermission('system:dept:add')
  @Post()
  @HttpCode(200)
  create(@Body() createHrDeptDto: CreateHrDeptDto) {
    return this.hrdeptService.create(createHrDeptDto);
  }

  @ApiOperation({
    summary: '部门管理-列表',
  })
  @RequirePermission('system:dept:query')
  @Get('/list')
  findAll(@Query() query: ListHrDeptDto) {
    return this.hrdeptService.findAll(query);
  }

  @ApiOperation({
    summary: '部门管理-详情',
  })
  @RequirePermission('system:dept:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hrdeptService.findOne(+id);
  }

  @ApiOperation({
    summary: '部门管理-黑名单',
  })
  @RequirePermission('system:dept:query')
  @Get('/list/exclude/:id')
  findListExclude(@Param('id') id: string) {
    return this.hrdeptService.findListExclude(+id);
  }

  @ApiOperation({
    summary: '部门管理-更新',
  })
  @ApiBody({
    type: UpdateHrDeptDto,
    required: true,
  })
  @RequirePermission('system:dept:edit')
  @Put()
  update(@Body() updateHrDeptDto: UpdateHrDeptDto) {
    return this.hrdeptService.update(updateHrDeptDto);
  }

  @ApiOperation({
    summary: '部门管理-删除',
  })
  @RequirePermission('system:dept:remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hrdeptService.remove(+id);
  }
}
