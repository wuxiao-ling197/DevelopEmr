import { Controller, Get, Post, Body, Put, Param, Query, Res, Delete, Request, UseGuards, CanActivate } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { RegisCheckService } from './regis_check.service';
import { Response } from 'express';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import { RequireRole } from 'src/common/decorators/require-role.decorator';
import { CreatePatientDto, CreateRegisterDto } from './dto';


/**
 * 处理传入的请求，并调用服务来处理业务逻辑。
 */
@ApiTags('挂号签到管理')
@Controller('emrManage/regisCheck')
export class RegisCheckController {
    constructor(private readonly RegisCheckService: RegisCheckService) { }

    @ApiOperation({
        summary: '查询所有档案',
    })
    // @RequirePermission('emr:Patient:add')//权限标识
    @Get('allDocumentList')
    findAllDocument() {
        console.log('========findAllDocument========');
        return this.RegisCheckService.selectList();
    }

    @ApiOperation({
        summary: '查询档案列表',
    })
    @Get('documentList')
    findDocument(@Query() query: any) {
        console.log('========selectDocument========');
        console.log(query);
        return this.RegisCheckService.selectList(query);
    }

    @ApiOperation({
        summary: '条件查询档案',
    })
    @Get('documentSelect')
    selectDocument(@Query() query: any) {
        console.log('========selectDocument========');
        console.log(query);
        return this.RegisCheckService.selectList(query);
    }

    /**
     * 挂号相关api
     * @param query 
     * @returns 
     */
    @ApiOperation({
        summary: '查询挂号列表',
    })
    // @RequirePermission('emr:Patient:add')//权限标识
    @Get('registerList')
    findRegister(@Query() query: any) {
        console.log('========findRegister========');
        console.log(query);

        return this.RegisCheckService.findRegisterList(query);
    }

    @ApiOperation({
        summary: '条件查询挂号列表',
    })
    // @RequirePermission('emr:Patient:add')//权限标识
    @Get('registerSelect')
    selectRegister(@Query() query: any) {
        console.log('========selectRegister========');
        console.log(query);

        return this.RegisCheckService.selectRegisterList(query);
    }



    @ApiOperation({
        summary: '档案-创建',
    })
    @ApiBody({
        type: CreatePatientDto,
        required: true,
    })
    // @RequirePermission('emr:pateint:add')//权限标识
    @Post('createDocument')
    createDocument(@Body() createPatientDto: any) {
        console.log('createDocumentController----------');
        console.log(createPatientDto);
        return this.RegisCheckService.createDocument(createPatientDto);
    }

    // 挂号
    @ApiOperation({
        summary: '挂号信息-创建',
    })
    @ApiBody({
        type: CreateRegisterDto,
        required: true,
    })
    // @RequirePermission('emr:pateint:add')//权限标识
    @Post('patientRegister')
    createRegister(@Body() CreateRegisterDto: any) {
        console.log('regiscontroller');

        return this.RegisCheckService.createRegister(CreateRegisterDto);
    }

    // 签到
    @ApiOperation({
        summary: '签到-修改挂号信息状态',
    })
    @ApiBody({
        type: String,
        required: true,
    })
    // @RequirePermission('emr:pateint:add')//权限标识
    @Post('patientCheckIn')
    checkIn(@Body() code: any) {
        console.log('patientCheckIn');
        console.log(code);

        return this.RegisCheckService.checkIn(code);
    }
}
