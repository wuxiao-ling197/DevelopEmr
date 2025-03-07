import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicOptionsService } from './dynamicOptions.service';
import { DynamicOptionsController } from './dynamicOptions.controller';

// 引入部门，职员，元数据实体
import { HrDeptEntity } from 'src/module/share/hrdept/entities/hrdept.entity';
import { HrEmpEntity } from 'src/module/share/resuser/entities/hremp.entity';
import { MetadataEntity } from 'src/module/emrManage/metadata/entities/emr-metadata.entity';


@Global()
@Module({
    imports: [
        // TypeOrmModule.forFeature([DynamicOptionsEntity, SysDeptEntity, SysRoleEntity, SysPostEntity, SysDynamicOptionsWithPostEntity, SysDynamicOptionsWithRoleEntity]),
        TypeOrmModule.forFeature([HrDeptEntity, HrEmpEntity, MetadataEntity], 'odoo18-2'),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                secret: config.get('jwt.secretkey'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [DynamicOptionsController],
    providers: [DynamicOptionsService],
    exports: [DynamicOptionsService],
})
export class DynamicOptionsModule { }
