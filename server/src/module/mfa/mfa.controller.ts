import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MfaService } from '../mfa/mfa.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResUserEntity } from '../share/resuser/entities/resuser.entity';
import { ResUserService } from '../share/resuser/resuser.service';
import { Repository } from 'typeorm';
import { LoginDto } from '../main/dto';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';
import * as base32 from 'base32.js';
import * as QRCode from 'qrcode';
import { ResultData } from 'src/common/utils/result';
import { authenticator } from 'otplib';
import { AuthTotpEntity } from '../share/resuser/entities/auth_totp';

@ApiTags('多重验证')
@Controller('auth')
export class MfaController {
  constructor(
    @InjectRepository(ResUserEntity, 'odoo18')
    private readonly userRepo: Repository<ResUserEntity>,
    @InjectRepository(AuthTotpEntity, 'odoo18')
    public readonly totpEntityRep: Repository<AuthTotpEntity>,
    private readonly mafService: MfaService,
  ) { }

  // 只有在完全登录系统后，才会保存当前登录信息到requst中
  @ApiOperation({
    summary: '用户-启用TOTP',
  })
  @Get('/totp/enable/:userId')
  createTotpcode(@Param('userId') userId: number) {
    return this.mafService.createTotpcode(userId, undefined);
  }

  @ApiOperation({
    summary: '用户-验证二维码',
  })
  @ApiBody({
    required: true,
  })
  @HttpCode(200)
  @Post('/totp/qrcode')
  async getQRcode(@Body() user: LoginDto): Promise<ResultData> {
    // 显式设置算法
    authenticator.options = { crypto: require('crypto'), HashAlgorithms: this.mafService.ALGORITHM, windows: 0 };
    const data = await this.userRepo.findOne({
      where: { login: user.username },
    });
    
    const totp = await this.totpEntityRep.findOne({
      where: { userId: data.id, },
      order: { id: 'DESC' }
    });
    if (!totp || totp.secret === 'false') {
      return await this.mafService.createTotpcode(undefined, user);
    } else if (totp.secret !== 'valid') {
      const secret = authenticator.generateSecret(40).substring(0, 32);
      // 生成并显示二维码
      const otpUrl = authenticator.keyuri(user.username, 'EMR', secret);
      // 生成4个模块数的二维码
      const qrCodeDataURL = await QRCode.toDataURL(otpUrl, {
        width: 212,
        margin: 1,
      });
      await this.totpEntityRep.update({ id: totp.id }, { qrcode: qrCodeDataURL, secret: secret, writeUid: data.id, writeDate: new Date() });
      return ResultData.ok({ qrcode: qrCodeDataURL });
    } else if (totp.secret === 'valid' && data.nestSecret && data.nestSecret !== 'false') {
      return ResultData.ok({qrcode: ''});
    } else {
      return ResultData.fail(404, '资源错误');
    }
  }

  @ApiOperation({
    summary: '用户-验证TOTP',
  })
  @ApiBody({
    type: LoginDto,
    required: true,
  })
  @HttpCode(200)
  @Post('/totp/verify')
  validateTotp(@Body() user: any) {
    return this.mafService.validateTotp(user);
  }

  @ApiOperation({
    summary: '用户-关闭TOTP',
  })
  @ApiBody({
    required: true,
  })
  @Delete('/totp/disable/:userId')
  disableTotp(@Param('userId') userId: string) {
    return this.mafService.disableTotp(userId);
  }
}
