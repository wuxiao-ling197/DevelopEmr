import { Repository, In, Not } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/module/redis/redis.service';
import { ResultData } from 'src/common/utils/result';
import { PatientEntity } from './entities/patient.entity';
import { AxiosService } from 'src/module/axios/axios.service';
import { HrDeptService } from 'src/module/share/hrdept/hrdept.service';

import { JwtService } from '@nestjs/jwt';


@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity,'shared')
    private readonly PatientRepo: Repository<PatientEntity>,
    private readonly deptService: HrDeptService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly axiosService: AxiosService,
  ) {}
  
  /**
   * 查询所有病人列表
   * @param query
   * @returns
   */
  async findAll(){
    console.log('========findPatientService========');
    const patient = this.PatientRepo.createQueryBuilder('Patient');
    patient.select(['Patient.name']);
    const [list, total] = await patient.getManyAndCount();
    // const list = await this.PatientRepo.find();
    // return list;
    return ResultData.ok({
      list,
      total,
    })
  }
}