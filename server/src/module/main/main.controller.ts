import { Controller, Get, Post, Body, HttpCode, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import * as Useragent from 'useragent';
import { MainService } from './main.service';
import { RegisterDto, LoginDto } from './dto/index';
import { createMath } from 'src/common/utils/captcha';
import { ResultData } from 'src/common/utils/result';
import { GenerateUUID } from 'src/common/utils/index';
import { RedisService } from 'src/module/redis/redis.service';
import { CacheEnum } from 'src/common/enum/index';
import { ConfigService } from 'src/module/system/config/config.service';
import { HrEmpEntity } from '../share/resuser/entities/hremp.entity';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResUserEntity } from '../share/resuser/entities/resuser.entity';
import { HrDeptEntity } from '../share/hrdept/entities/hrdept.entity';
import { ResUserService } from '../share/resuser/resuser.service';
import { CompUserEntity } from '../share/resuser/entities/comuserrel';
import { createHash, pbkdf2, randomBytes } from 'crypto';

@ApiTags('根目录')
@Controller('/')
export class MainController {
  constructor(
    @InjectRepository(HrEmpEntity, 'shared')
    private readonly employeeEntityRep: Repository<HrEmpEntity>,
    @InjectRepository(ResUserEntity, 'shared')
    private readonly userRepo: Repository<ResUserEntity>,
    @InjectRepository(HrDeptEntity, 'shared')
    private readonly deptEntityRep: Repository<HrDeptEntity>,
    @InjectRepository(CompUserEntity, 'shared')
    private readonly userWithcompanyEntityRep: Repository<CompUserEntity>,
    private readonly mainService: MainService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly resuserService: ResUserService,
  ) {}

  // private verificationCodes = new Map<string, string>(); // 用于存储手机号和验证码的映射

  @ApiOperation({
    summary: '用户登陆',
  })
  @ApiBody({
    type: LoginDto,
    required: true,
  })
  @Post('/login')
  @HttpCode(200)
  login(@Body() user: LoginDto, @Request() req) {
    const agent = Useragent.parse(req.headers['user-agent']);
    const os = agent.os.toJSON().family;
    const browser = agent.toAgent();
    const clientInfo = {
      userAgent: req.headers['user-agent'],
      ipaddr: req.ip,
      browser: browser,
      os: os,
      loginLocation: '',
    };
    return this.mainService.login(user, clientInfo);
  }

  @ApiOperation({
    summary: '退出登陆',
  })
  @ApiBody({
    type: LoginDto,
    required: true,
  })
  @Post('/logout')
  @HttpCode(200)
  logout(@Request() req) {
    const agent = Useragent.parse(req.headers['user-agent']);
    const os = agent.os.toJSON().family;
    const browser = agent.toAgent();
    const clientInfo = {
      userAgent: req.headers['user-agent'],
      ipaddr: req.ip,
      browser: browser,
      os: os,
      loginLocation: '',
    };
    return this.mainService.logout(clientInfo);
  }

  @ApiOperation({
    summary: '用户注册',
  })
  @ApiBody({
    type: RegisterDto,
    required: true,
  })
  @Post('/register')
  @HttpCode(200)
  register(@Body() user: RegisterDto) {
    return this.mainService.register(user);
  }

  // 自定义函数
  @ApiOperation({
    summary: '短信验证码',
  })
  @Post('/smscode')
  async smsCode(@Body() user: RegisterDto) {
    return this.mainService.smsCode(user);
  }

  @ApiOperation({
    summary: '获取验证图片',
  })
  @Get('/captchaImage')
  async captchaImage() {
    //是否开启验证码
    const enable = await this.configService.getConfigValue('sys.account.captchaEnabled');
    const captchaEnabled: boolean = enable === 'true';
    const data = {
      captchaEnabled,
      img: '',
      uuid: '',
    };
    try {
      if (captchaEnabled) {
        const captchaInfo = createMath();
        data.img = captchaInfo.data;
        data.uuid = GenerateUUID();
        await this.redisService.set(CacheEnum.CAPTCHA_CODE_KEY + data.uuid, captchaInfo.text.toLowerCase(), 1000 * 60 * 5);
      }
      return ResultData.ok(data, '操作成功');
    } catch (err) {
      return ResultData.fail(500, '生成验证码错误，请重试');
    }
  }

  @ApiOperation({
    summary: '用户信息',
  })
  @Get('/getInfo')
  async getInfo(@Request() req) {
    const user = req.user;
    // 定义前端api或路由的返回结果，把return的内容封装到request参数中
    return {
      msg: '操作成功',
      code: 200,
      permissions: user.permissions,
      roles: user.roles,
      user: user.user,
    };
  }

  @ApiOperation({
    summary: '路由信息',
  })
  @Get('/getRouters')
  getRouters(@Request() req) {
    const userId: string = req.user.user.id;
    return this.mainService.getRouters(+userId);
  }

  @ApiOperation({
    summary: 'odoo查询',
  })
  @Get('/moreinfo')
  async getEmployeeUserData() {
    // const employee = await this.userRepo
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.employee', 'hr') // 联合查询
    //   .where('user.id = :userId', { userId: 1907 })
    //   .andWhere('user.active = :active', { active: true })
    //   .getOne();

    // const login = 'admin';
    // const employee = await this.userRepo
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.employee', 'hr') // 联合查询
    //   .where(`user.login LIKE '%${login}%'`)
    //   .getOne();

    // const employee = await this.userRepo
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.employee', 'hr')
    //   .where('user.login LIKE :login', { login: `%${login}%` })
    //   .andWhere('user.status = :status', { status })
    //   .orWhere('hr.department = :department', { department: 'IT' }) // 添加 OR 条件
    //   .getMany();

    // 如果需要指定查询内容的话应使用实体定义的字段
    // const employee = await this.employeeEntityRep.createQueryBuilder('hr').select(['hr.id', 'hr.departmentId', 'hr.name', 'hr.companyId']).where('hr.user_id = :userId', { userId: 2 }).getOne();

    // const employee = await this.deptEntityRep.createQueryBuilder('dept').leftJoinAndSelect('dept.employees', 'hr').where('dept.id = :userId', { userId: 4 });
    // const employee = await this.employeeEntityRep.createQueryBuilder('employee').leftJoinAndSelect('employee.department', 'dept').leftJoinAndSelect('employee.user', 'user').getManyAndCount();
    // let uid = 0;
    // employee.forEach((emp) => {
    //   uid = emp.userId;
    // });
    // const user = await this.userRepo.createQueryBuilder('user').where('user.id = :userId', { userId: uid }).getOne();
    // employee['user'] = user;

    // console.log('odoo data=', employee);
    // const employee = await this.employeeEntityRep.createQueryBuilder('hr').leftJoinAndSelect('hr.user', 'user').select('hr.userId').where('hr.userId  = :userId', { userId: 2 }).getMany();

    const userIds = [2, 1907, 1908, 1909];
    const employee = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.employee', 'hr')
      .leftJoinAndSelect('hr.department', 'dept')
      .where('user.id IN (:...userIds)', { userIds })
      .andWhere('user.active = :active', { active: true })
      .getMany();

    // const employee = await this.userRepo.createQueryBuilder('user').where('user.id = :id', { id: 2320 }).getOne();
    // const employee = await this.resuserService.findAll();
    // 插入数据
    // const employee = this.userWithcompanyEntityRep
    //   .createQueryBuilder('cu')
    //   .where('cu.userId IN (:...uid)', { uid: [2, 2338] })
    //   .getMany();
    // const compValues = {
    //   userId: 2,
    //   cid: 2,
    // };
    // employee.insert().values(compValues).execute();
    // const employee = await this.employeeEntityRep.createQueryBuilder('hr').where('hr.name LIKE :name', { name: 'nest' }).getOne();
    // if (employee) {
    //   if ((await employee).userId == 3) {
    //     // 处理查询结果
    //     (await employee).userId = 2293;
    //   }
    // }
    // // employee.userId = 3;
    // await this.employeeEntityRep.save(employee);

    return ResultData.ok(employee, 'odoo查询成功');
  }
}
