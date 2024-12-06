import { Repository, In, Not } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/module/redis/redis.service';
import { ResultData } from 'src/common/utils/result';
import { TemplateEntity } from './entities/emr_template.entity';
import { AxiosService } from 'src/module/axios/axios.service';
import { HrDeptService } from 'src/module/share/hrdept/hrdept.service';


@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity,'shared')
    private readonly TemplateRepo: Repository<TemplateEntity>,
    private readonly deptService: HrDeptService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly axiosService: AxiosService,
  ) {}
  
  /**
   * 查询所有模板
   * @param query
   * @returns
   */
  async findAll(){
    console.log('========findTemplateService========');
    const template = this.TemplateRepo.createQueryBuilder('Template');
    template.select(['Template.name']);
    const [list, total] = await template.getManyAndCount();
    // const list = await this.PatientRepo.find();
    // return list;
    return ResultData.ok({
      list,
      total,
    })
  }

  
  async findOne(templateID){
    console.log('========selectTemplateService========');
    const template = this.TemplateRepo.createQueryBuilder('Template');
    // template.select(['Template.id']);
    template.where('Template.id = :templateID', { templateID: templateID })
    const data  = await template.getOne();
    // const list = await this.PatientRepo.find();
    // return list;
    return ResultData.ok(data)
  }
  
  /**
   * 创建模板
   * @param createTemplateDto 
   * @returns 
   */
// async createTemplate(createTemplateDto: CreateTemplateDto){
async createTemplate(createTemplateDto: any){
    console.log('========createTemplateService========');
    const template = this.TemplateRepo.createQueryBuilder('Template');
    console.log(createTemplateDto);
    const writeDate = new Date();
    const createDate = new Date();
    let  payload = JSON.parse(createTemplateDto.payload)
    let  header = JSON.parse(createTemplateDto.header)
    let  participants = JSON.parse(createTemplateDto.participants)
    const emr: TemplateEntity = {
      ...createTemplateDto, // 这里假设 createMedicalRecordDto 中的属性与 MedicalRecordEntity 兼容
      header,
      participants,
      payload,
      writeDate,
      // 暂定固定属性
      createDate,
      // 如果 id 是从 DTO 中获取的，并且应该是 number，但 DTO 中是 string，您需要进行转换
      // id: Number(createMedicalRecordDto.id), // 仅在需要时添加此行，并且确保这是正确的行为
      // 如果 id 是自动生成的，则不要包含此行
    };
    // 删除任何不应该在创建时设置的属性，比如如果 id 是自动生成的
    delete emr.id; // 仅在 id 是自动生成的并且不应该在创建时设置时添加此行
    try{
        const res = await this.TemplateRepo.save(emr);
        return ResultData.ok(res);
    }catch(err){
        console.error(err); // 使用 console.error 以区分错误日志
        // 可以选择返回一个错误响应
        return ResultData.fail(500,'Failed to create template');
    }
  }
}