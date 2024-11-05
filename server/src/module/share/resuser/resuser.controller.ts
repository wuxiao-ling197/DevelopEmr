import { Controller, Get, Post, Body, Put, Param, Query, Res, Delete, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';

import { CreateResUserDto, UpdateResUserDto, ListResUserDto, ChangeStatusDto, ResetPwdDto, UpdateProfileDto, UpdatePwdDto } from './dto/index';
import { ResUserService } from './resuser.service';
// import { ListResUserDto } from './dto';

/**
 * 处理传入的请求，并调用服务来处理业务逻辑。
 */
@ApiTags('用户管理')
@Controller('system/user')
export class ResUserController {
  constructor(private readonly resuserService: ResUserService) {}

  @ApiOperation({
    summary: '个人中心-用户信息',
  })
  @RequirePermission('system:user:query')
  @Get('/profile')
  profile(@Request() req) {
    const user = req.user.user;
    return this.resuserService.profile(user);
  }

  @ApiOperation({
    summary: '个人中心-修改用户信息',
  })
  @RequirePermission('system:user:edit')
  @Put('/profile')
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user = req.user;
    return this.resuserService.updateProfile(user, updateProfileDto);
  }

  @ApiOperation({
    summary: '个人中心-修改密码',
  })
  @RequirePermission('system:user:edit')
  // 11.1 update
  // @RequirePermission(['*:*:*', 'system:user:edit'])
  @Put('/profile/updatePwd')
  updatePwd(@Request() req, @Body() updatePwdDto: UpdatePwdDto) {
    const user = req.user;
    console.log('修改密码数据传递给后端；', updatePwdDto);
    return this.resuserService.updatePwd(user, updatePwdDto);
  }

  @ApiOperation({
    summary: '用户-创建',
  })
  @ApiBody({
    type: CreateResUserDto,
    required: true,
  })
  @RequirePermission('system:user:add')
  @Post()
  create(@Body() createUserDto: CreateResUserDto, @Request() req) {
    return this.resuserService.create(createUserDto, req.user);
  }

  @ApiOperation({
    summary: '用户-列表',
  })
  @RequirePermission('system:user:query')
  @Get('list')
  findAll(@Query() query: ListResUserDto, @Request() req) {
    const user = req.user;
    return this.resuserService.findAll(query, user);
  }

  @ApiOperation({
    summary: '用户-部门树',
  })
  @RequirePermission('system:dept:query')
  @Get('deptTree')
  deptTree() {
    return this.resuserService.deptTree();
  }

  @ApiOperation({
    summary: '用户-公司树',
  })
  @RequirePermission('system:comp:query')
  @Get('compTree')
  compTree() {
    return this.resuserService.compTree();
  }

  @ApiOperation({
    summary: '用户-员工+部门',
  })
  @RequirePermission('system:user:add')
  @Get()
  findEmpAndDeptAll() {
    // return this.resuserService.findPostAndRoleAll();
    return this.resuserService.findEmpAndDeptAll();
  }

  // @ApiOperation({
  //   summary: '用户-角色',
  // })
  // @RequirePermission('system:user:add')
  // @Get('roleTree')
  // findRoleAll() {
  //   return this.resuserService.findRoleAll();
  // }

  @ApiOperation({
    summary: '用户-分配角色-详情',
  })
  @RequireRole('admin')
  @Get('authRole/:id')
  authRole(@Param('id') id: string) {
    const rr = this.resuserService.authRole(+id);
    console.log('分配角色向前端返回值=', rr);
    return this.resuserService.authRole(+id);
  }

  @ApiOperation({
    summary: '用户-角色信息-更新',
  })
  @RequireRole('admin')
  @Put('authRole')
  updateAuthRole(@Query() query) {
    console.log('controller 用户角色修改：', query);
    return this.resuserService.updateAuthRole(query);
  }

  @ApiOperation({
    summary: '用户-详情',
  })
  @RequirePermission('system:user:query')
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    // this.resuserService.findOne(+userId).then((value) => {
    //   console.log('后端用户-详情=', value);
    // });
    return this.resuserService.findOne(+userId);
  }

  @ApiOperation({
    summary: '用户-停用角色',
  })
  @ApiBody({
    type: ChangeStatusDto,
    required: true,
  })
  @RequireRole('admin')
  @Put('changeStatus')
  changeStatus(@Body() changeStatusDto: ChangeStatusDto) {
    return this.resuserService.changeStatus(changeStatusDto);
  }

  @ApiOperation({
    summary: '用户-更新',
  })
  @ApiBody({
    type: UpdateResUserDto,
    required: true,
  })
  @RequirePermission('system:user:edit')
  @Put()
  update(@Body() updateUserDto: UpdateResUserDto, @Request() req) {
    const userId = req.user.userId;
    const roles = req.user.roles;
    // 当前用户信息 req.user.userId / roles即可获取
    // 当前表单返回值 req.body = updateUserDto
    return this.resuserService.update(updateUserDto, userId, roles);
  }

  @ApiOperation({
    summary: '用户-重置密码',
  })
  @ApiBody({
    type: ResetPwdDto,
    required: true,
  })
  @RequireRole('admin')
  @Put('resetPwd')
  resetPwd(@Body() body: ResetPwdDto) {
    return this.resuserService.resetPwd(body);
  }

  @ApiOperation({
    summary: '用户-删除',
  })
  @RequireRole('admin')
  @Delete(':id')
  remove(@Param('id') ids: string) {
    const menuIds = ids.split(',').map((id) => +id);
    return this.resuserService.remove(menuIds);
  }

  @ApiOperation({ summary: '导出用户信息数据为xlsx' })
  @RequirePermission('system:user:export')
  @Post('/export')
  async export(@Res() res: Response, @Body() body: ListResUserDto, @Request() req): Promise<void> {
    const user = req.user.user;
    return this.resuserService.export(res, body, user);
  }
}
