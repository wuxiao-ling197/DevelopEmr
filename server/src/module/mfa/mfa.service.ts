import { Injectable } from '@nestjs/common';
import { AuthTotpEntity } from '../share/resuser/entities/auth_totp';
import { Repository } from 'typeorm/repository/Repository';
import { ResultData } from 'src/common/utils/result';
import { authenticator, totp } from 'otplib';
import * as QRCode from 'qrcode';
import { ResUserEntity } from '../share/resuser/entities/resuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '../system/config/config.service';
import { LoginDto } from '../main/dto';
import { CryptoContext } from 'src/common/utils/sha512';
@Injectable()
export class MfaService {
  private readonly secretSize = 20;
  private pwdContext: CryptoContext;
  ALGORITHM = 'HmacSHA1'; // HMAC SHA1
  DIGITS = 6; // 生成的验证码的位数
  constructor(
    @InjectRepository(ResUserEntity, 'odoo18')
    private readonly userRepo: Repository<ResUserEntity>,
    @InjectRepository(AuthTotpEntity, 'odoo18')
    public readonly totpEntityRep: Repository<AuthTotpEntity>,
  ) {
    this.pwdContext = new CryptoContext();
  }

  /**
   * 激活totp认证 生成totp secret
   * @param userId 操作对象
   * @param user 当前操作用户
   * {username: string, password: string, code: string}
   * @returns
   */
  async createTotpcode(userId?: number, user?: LoginDto): Promise<ResultData> {
    let data: any;
    if (userId) {
      data = await this.userRepo.createQueryBuilder('user').where('user.id = :id', { id: userId }).select(['user.id', 'user.nestSecret', 'user.login']).getOne();
    }
    if (user) {
      data = await this.userRepo.createQueryBuilder('user').where('user.login = :login', { login: user.username }).select(['user.id', 'user.nestSecret', 'user.login']).getOne();
    }
    /** 外部调用总是失败 搞不懂 但是这个在创建记录时必须首先完成密码验证 */
    // const result = await this.pwdContext.verifyPasslib(user.password, data.password);
    // console.log('验证密码=', result);
    // if (!result) {
    //   return ResultData.fail(404, '【登陆首页初始化双重验证】用户或密码错误，请重新输入');
    // }
    // 显式设置算法
    authenticator.options = { crypto: require('crypto'), HashAlgorithms: this.ALGORITHM, windows: 0 };
    // 如果用户没有开启totp验证（即user表中secret无值）
    if (!data.nestSecret || data.nestSecret === '' || data.nestSecret === 'false') {
      const secret = authenticator.generateSecret(40).substring(0, 32);
      // 生成并显示二维码
      const otpUrl = authenticator.keyuri(user.username, 'Nest', secret);
      // 生成4个模块数的二维码
      const qrCodeDataURL = await QRCode.toDataURL(otpUrl, {
        width: 212,
        margin: 1,
      });
      const authtotp = new AuthTotpEntity();
      authtotp.userId = data.id;
      authtotp.secret = secret; //安全起见只在用户表存
      authtotp.code = null;
      authtotp.url = otpUrl;
      authtotp.qrcode = qrCodeDataURL;
      authtotp.createUid = data.id;
      authtotp.createDate = new Date();
      authtotp.writeUid = data.id;
      authtotp.writeDate = new Date();
      await this.totpEntityRep.save({ ...authtotp }); // 使用 save 方法插入数据
      return ResultData.ok(
        {
          qrcode: qrCodeDataURL,
        },
        '启用totp',
      );
    } else {
      return ResultData.fail(404, '双重验证启用失败');
    }
  }

  /**
   * totp验证 首次验证及后续验证 在verify路由 直接查auth_wiard有没有secret,在激活又关闭totp后，用户表和该表内secret均清零，以此实现二维码单次生成。
   * @param user 用户登录表单信息
   * @returns
   */
  async validateTotp(user: LoginDto) {
    let  verify: any;
    const data = await this.userRepo.findOne({
      where: { login: user.username },
    });
    const totps = await this.totpEntityRep.findOne({
        where: { userId: data.id, },
        order: { id: 'DESC' }
      });
    // 首次激活
    if (!data.nestSecret || data.nestSecret === 'false' || data.nestSecret === '') {
      verify = authenticator.check(user.code, totps.secret);
      if (verify) {
        await this.totpEntityRep.update({id: totps.id}, { code: user.code, secret: 'valid', writeUid: data.id, writeDate: new Date() });
        await this.userRepo.update({login: user.username}, { nestSecret: totps.secret, writeUid: data.id, writeDate: new Date() });
        return ResultData.ok({ verify: verify}, '验证成功');
      } else {
        return ResultData.fail(404, '验证失败', { verify: verify });
      }
    }
    // 不是第一次激活，直接验证
    if (totps.secret === 'valid') {
      verify = authenticator.check(user.code, data.nestSecret);
      if (verify) {
        return ResultData.ok({ verify: verify}, '验证成功');
      } else {
        return ResultData.fail(404, '验证失败', { verify: verify });
      }
    }
  }

  /**
   * 关闭TOTP
   * @param userId
   * @returns
   */
  async disableTotp(userId: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { login: userId, }
      });
      const totp = await this.totpEntityRep.findOne({
        where: { userId: user.id, },
        order: { id: 'DESC' }
      });
      if (!totp) {
        await this.userRepo.update({ login: userId }, { nestSecret: 'false' });
        return ResultData.ok(200, '资源错误');
      }

      await this.userRepo.update({ login: userId }, { nestSecret: 'false' });
      await this.totpEntityRep.update({ id: totp.id }, { secret: 'false', writeDate: new Date() });
      return ResultData.ok(200, '已关闭TOTP双重验证');
    } catch (error) {
      return ResultData.fail(404, '操作失败')
    }

  }
}
