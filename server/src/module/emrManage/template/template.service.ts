import { Repository, In, Not } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/module/redis/redis.service';
import { ResultData } from 'src/common/utils/result';
import { TemplateEntity } from './entities/emr_template.entity';
import { AxiosService } from 'src/module/axios/axios.service';
import { HrDeptService } from 'src/module/share/hrdept/hrdept.service';
import { CreateTemplateDto, FindTemplateDto } from './dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity, 'odoo18-2')
    private readonly TemplateRepo: Repository<TemplateEntity>,
    private readonly deptService: HrDeptService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly axiosService: AxiosService,
  ) { }

  /**
   * 查询所有模板
   * @param query
   * @returns
   */
  async findAll(query: FindTemplateDto) {
    console.log('========findTemplateService========');
    let { tempType, transTree } = query;
    const template = this.TemplateRepo.createQueryBuilder('Template');
    // template.select(['Template.name']);
    let [list, total] = await template.getManyAndCount();
    // const list = await this.PatientRepo.find();
    if (tempType) {
      list = list.filter(item => {
        return item.payload.type === tempType
      });
      total = list.length
    }
    if (transTree) {
      let treeData = this.translateTreeData(list)
      return ResultData.ok({
        treeData,
        total,
      })
    }
    return ResultData.ok({
      list,
      total,
    })
  }

  /**
   * 将模板列表转成treedata
   * @param query 
   * @returns 
   */
  translateTreeData(list: any[]) {
    console.log(list);
    // 这个应该有一张表或者规定字段（定义枚举），目前不清楚，暂时根据存入的数据筛一下
    const categoryList = []
    list.forEach(item => {
      // 如果list里没有当前category才push
      if (!categoryList.some(cate => cate === item.category)) {
        categoryList.push(item.category)
      }
      // if(categoryList.findIndex(cate => cate === item.category) == -1){
      //   categoryList.push(item.category)
      // }
    });
    // 根据类别，将模板列表拆分成组，改造成tree需要的数据格式[{cate,children:[]},{cate,children:[]},{}]
    let treeData = []
    categoryList.forEach(cate => {
      treeData.push({ label: cate, children: [] })
    })
    treeData.forEach(td => {
      list.forEach(md => {
        if (td.label == md.category) {
          md.label = md.name
          td.children.push(md)
        }
      })
    })
    return treeData
  }

  async findOne(query: any) {
    console.log('========selectTemplateService========');
    try {
      let templateID = query.id
      let templateName = query.name
      const template = this.TemplateRepo.createQueryBuilder('Template');
      // template.select(['Template.id']);
      if (templateID) {
        template.where('Template.id = :templateID', { templateID: templateID })
      } else if (templateName) {
        template.where('Template.name = :templateName', { templateName: templateName })
      } else {
        return ResultData.fail(300, '请传递id或name')
      }
      const data = await template.getOne();
      // const list = await this.PatientRepo.find();
      // return list;
      return ResultData.ok(data)
    } catch (err) {
      console.log(err);
      return ResultData.fail(500)
    }
  }

  /**
   * 创建模板
   * @param createTemplateDto 
   * @returns 
   */
  async createTemplate(createTemplateDto: CreateTemplateDto) {
    console.log('========createTemplateService========');
    // const template = this.TemplateRepo.createQueryBuilder('Template');
    console.log(createTemplateDto);
    const writeDate = new Date();
    const createDate = new Date();
    const number = `${createTemplateDto.business}- ${createTemplateDto.category}-${createTemplateDto.name}`

    const emr: TemplateEntity = {
      ...createTemplateDto, // 这里假设 createMedicalRecordDto 中的属性与 MedicalRecordEntity 兼容
      // payload,
      number,
      active: '1',
      meta: createTemplateDto.meta || '1.0',
      writeDate,
      // 暂定固定属性
      createDate,
      id: 100,
    };
    delete emr.id; // 仅在 id 是自动生成的并且不应该在创建时设置时添加此行
    try {
      const res = await this.TemplateRepo.save(emr);
      return ResultData.ok(res);
    } catch (err) {
      console.error(err); // 使用 console.error 以区分错误日志
      // 可以选择返回一个错误响应
      return ResultData.fail(500, 'Failed to create template');
    }
  }
}