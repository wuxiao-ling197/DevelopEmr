import { Repository, In, Not } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/module/redis/redis.service';
import { Response } from 'express';
import { ExportTable } from 'src/common/utils/export';

import { DelFlagEnum, DataScopeEnum } from 'src/common/enum/index';
import { ResultData } from 'src/common/utils/result';
import { CreateMetadataDto, ListMetadataDto, ChangeStatusDto, SelectFieldListDto } from './dto/index';
import { MetadataEntity } from './entities/emr-metadata.entity';
// import { SysMetadataWithPostEntity } from './entities/metadata-width-post.entity-width-post.entity';
// import { SysMetadataWithRoleEntity } from './entities/metadata-width-role.entity-width-role.entity';
// import { SysPostEntity } from '../post/entities/post.entity';
// import { SysDeptEntity } from '../dept/entities/dept.entity';
// import { RoleService } from '../role/role.service';
// import { DeptModule } from '../dept/dept.service';
// import { ConfigService } from '../config/config.service';
import { pbkdf2Sync } from 'crypto';
import { AxiosService } from 'src/module/axios/axios.service';
import { HrDeptService } from 'src/module/share/hrdept/hrdept.service';

import { JwtService } from '@nestjs/jwt';


@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(MetadataEntity, 'shared')
    private readonly MetadataRepo: Repository<MetadataEntity>,
    // @InjectRepository(SysDeptEntity)
    // private readonly sysDeptEntityRep: Repository<SysDeptEntity>,
    // @InjectRepository(SysPostEntity)
    // private readonly sysPostEntityRep: Repository<SysPostEntity>,
    // @InjectRepository(SysMetadataWithPostEntity)
    // private readonly sysMetadataWithPostEntityRep: Repository<SysMetadataWithPostEntity>,
    // @InjectRepository(SysMetadataWithRoleEntity)
    // private readonly sysMetadataWithRoleEntityRep: Repository<SysMetadataWithRoleEntity>,
    // private readonly roleService: RoleService,
    private readonly deptService: HrDeptService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    // private readonly configService: ConfigService,
    private readonly axiosService: AxiosService,
  ) { }

  /**
   * 创建元数据（不该我们创建，后面有新的标准应该导进去，只能获取不能创建）
   * @param createMetadataDto
   * @returns
   */
  async create(createMetadataDto: CreateMetadataDto) {
    const writeDate = new Date();
    const createDate = new Date();
    const updateTime = new Date();
    const emr: MetadataEntity = {
      ...createMetadataDto,
      id: 100,
      writeDate,
      createDate,
    };
    // 删除任何不应该在创建时设置的属性，比如如果 id 是自动生成的
    delete emr.id; // 仅在 id 是自动生成的并且不应该在创建时设置时添加此行
    const res = await this.MetadataRepo.save(emr);
    return ResultData.ok();
  }

  /**
   * 查询大类列表
   * @param query
   * @returns
   */
  async findCategory() {
    const metadata = this.MetadataRepo.createQueryBuilder('Metadata');
    metadata.select(['Metadata.categoryCode', 'Metadata.category']);
    // .getMany();
    // const  = await metadata.getMany();
    const [list, total] = await metadata.getManyAndCount();
    // const list = await this.MetadataRepo.find({
    //   where: {},
    //   select: ['categoryCode', 'category'],
    // });
    // return metadata;
    return ResultData.ok({
      list,
      total,
    })
  }
  /**
   * 通过大类编码category_code查询值域名列表
   * @param categoryCode
   * @returns
   */
  async findCodeByCategoryCode(categoryCode: string) {
    const list = await this.MetadataRepo.find({
      where: {
        categoryCode: categoryCode,
      },
      select: ['code', 'codeName'],
    });
    return list
  }
  /**
   * 通过值域code查询值列表
   * @param query
   * @returns
   */
  async findValueListByCode(code: string) {
    const list = await this.MetadataRepo.find({
      where: {
        code: code,
        // delFlag: '0',
      },
      select: ['value', 'valueMean'],
    });
    return list
  }
  /**
   * 通过编号查询完整数据
   * @param query
   * @returns
   */
  async findByNo(no: string) {
    const data = await this.MetadataRepo.findOne({
      where: {
        no: no,
      },
    });
    return data
  }

  /**
   * 复杂查询
   * @param query 
   * @param Metadata 
   * @returns 
   */
  async findByCategory(query: ListMetadataDto, Metadata: any) {
    // 使用TypeORM的查询构建器（createQueryBuilder）来构建和执行复杂的数据库查询。
    const entity = this.MetadataRepo.createQueryBuilder('Metadata');
    entity.where('Metadata.delFlag = :delFlag', { delFlag: '0' });
    if (query.status) {
      entity.andWhere('Metadata.status = :status', { status: query.status });
    }
    if (query.params?.beginTime && query.params?.endTime) {
      entity.andWhere('Metadata.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }
    if (query.pageSize && query.pageNum) {
      entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    }
    const [list, total] = await entity.getManyAndCount();
    return ResultData.ok({
      list,
      total,
    });
  }

  /**
   * 根据大类（表单类型）获取表单feildLabel
   * @param category 元数据大类
   * @returns 
   */
  async getFieldList(query: SelectFieldListDto) {
    console.log('getFieldList-----165---');
    console.log(query);
    try {
      const entity = this.MetadataRepo.createQueryBuilder('Metadata');
      entity.where('Metadata.category = :category', { category: query.category });
      const [list, total] = await entity.getManyAndCount();
      const fieldList = []
      list.map(item => {
        // if(feildList.findIndex(feild=>feild.fieldLabel==item.codeName) == -1)
        const isDuplicate = fieldList.some(field => field.fieldLabel === item.codeName);
        if (!isDuplicate) {
          const filed = {
            fieldName: item.code,
            fieldLabel: item.codeName,
          }
          fieldList.push(filed)
        }
      })
      return ResultData.ok({
        fieldList,
        total,
      });
    } catch (err) {
      console.log(err);
      return ResultData.fail(500, err)
    }

  }
  /**
   * 停用元数据
   * @param changeStatusDto 
   */
  async changeStatus(changeStatusDto: any) {

  }
  /**
   * 批量删除元数据（删不了，应该是修改某一个状态值为不可查询或者其他）
   * @param ids
   * @returns
   */
  async remove(ids: number[]) {
    // 忽略系统角色的删除
    // const data = await this.MetadataRepo.update(
    //   { MetadataId: In(ids), MetadataType: Not(SYS_Metadata_TYPE.SYS) },
    //   {
    //     delFlag: '1',
    //   },
    // );
    // return ResultData.ok(data);
  }

  async findAll() {

  }
  /**
   * 导出元数据信息数据为xlsx
   * @param res
   */
  async export(res: Response, body: ListMetadataDto, Metadata) {
    //   delete body.pageNum;
    //   delete body.pageSize;
    //   const list = await this.findAll(body, Metadata);
    //   const options = {
    //     sheetName: '用户数据',
    //     data: list.data.list,
    //     header: [
    //       { title: '用户序号', dataIndex: 'MetadataId' },
    //       { title: '登录名称', dataIndex: 'MetadataName' },
    //       { title: '用户昵称', dataIndex: 'nickName' },
    //       { title: '用户邮箱', dataIndex: 'email' },
    //       { title: '手机号码', dataIndex: 'phonenumber' },
    //       { title: '用户性别', dataIndex: 'sex' },
    //       { title: '账号状态', dataIndex: 'status' },
    //       { title: '最后登录IP', dataIndex: 'loginIp' },
    //       { title: '最后登录时间', dataIndex: 'loginDate', width: 20 },
    //       { title: '部门', dataIndex: 'dept.deptName' },
    //       { title: '部门负责人', dataIndex: 'dept.leader' },
    //     ],
    //   };
    //   ExportTable(options, res);
  }
}

// function hashPwd(password: string, salt: string, iterations: any) {
//   const key = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('base64');
//   const hashedPwd = `$pbkdf2-sha512$${iterations}$${Buffer.from(salt).toString('base64')}$${key}`;
//   return hashedPwd;
// }

// function verifyPwd(password: string, hashPassword: string) {
//   return hashPwd(password, password, 600000) === hashPassword;
// }
