import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { OdooWebSocketService } from './websocket.service';
import { ApiOperation } from '@nestjs/swagger';
import { ResultData } from 'src/common/utils/result';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { query } from 'express';
import { ChannelEntity } from './entity/channel.entity';

@Controller('/live')
export class WsController {
    constructor(
        @InjectRepository(ChannelEntity, 'odoo18')
        private readonly channelRepo: Repository<ChannelEntity>,
        private readonly odoows: OdooWebSocketService,
    ) { }

    /** 初始化ws连接并等待完成
     * 注：用户登录之后应该立即调用该接口，否则odoo ws将连接失败 */ 
    @Get('')
    async initWebsocket(@Request() req) {
        try {
            const login_user = req.user.user;
            await this.odoows.connect(login_user);
            console.log('按需ws初始化用户为：', login_user.login);
            // this.odoows.ws = await this.odoows.getConnection(userId);
            return { status: 'WS is connected' };
        } catch (error) {
            return 'Websocket初始化失败，请检查配置信息';
        }
    }

    @ApiOperation({
        summary: '指定频道',
    })
    @Get('/channel/:id')
    async findOne(@Param('id') id: number) {
        const data = await this.channelRepo.findOne({
            where: {
                id: id,
                active: true,
            },
        });
        this.odoows.channelId = id;
        return ResultData.ok(data);
    }

    @ApiOperation({
        summary: '频道列表',
    })
     @Get('/channel/list')
    async findList(@Query() query: ChannelEntity) {
        const entity = this.channelRepo.createQueryBuilder('channel');
        // 查询表单
        if (query.id) {
            entity.andWhere('id = :id', { id: query.id });
        }
        
        if (query.name) {
            entity.andWhere('name LIKE :name', { name: `%${query.name}%` });
        }

        if (query.parentChannelId) {
            entity.andWhere('parentChannelId = :parentChannelId', { parentChannelId: query.parentChannelId });
        }

        if (query.fromMessageId) {
            entity.andWhere('fromMessageId = :fromMessageId', { fromMessageId: query.fromMessageId });
        }

        if (query.groupPublicId) {
            entity.andWhere('groupPublicId = :groupPublicId', { groupPublicId: query.groupPublicId });
        }

        if (query.channelType) {
            entity.andWhere('channelType LIKE :channelType', { channelType: `%${query.channelType}%` });
        }

        if (query.description) {
            entity.andWhere('description LIKE :description', { description: `%${query.description}%` });
        }

        if (query.active) {
            entity.andWhere('active = :active', { active: query.active });
        }
        const [data, list] = await entity.getManyAndCount();
        return ResultData.ok({ list, data });
    }
}