import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { pathToRegexp } from 'path-to-regexp';
import { ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

// import { UserService } from 'src/module/system/user/user.service';
import { ResUserService } from 'src/module/share/resuser/resuser.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 配置白名单，或者请求头携带Authorization 
  private globalWhiteList = [
    // 不知道为什么没生效，只能在dev.yml里配置白名单
    // { path: '/emrManage/regisCheck/allDocumentList', method: 'GET' },
    // { method: 'GET', path: '/docs' },
    // { method: 'GET', path: '/docs-json' }
  ];
  constructor(
    private readonly reflector: Reflector,
    @Inject(ResUserService)
    private readonly userService: ResUserService,
    private readonly config: ConfigService,
  ) {
    super();
    this.globalWhiteList = [].concat(this.config.get('perm.router.whitelist') || []);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isInWhiteList = this.checkWhiteList(ctx);
    if (isInWhiteList) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const accessToken = req.get('Authorization');
    if (!accessToken) throw new ForbiddenException('请重新登录');
    const atUserId = await this.userService.parseToken(accessToken);
    if (!atUserId) throw new UnauthorizedException('当前登录已过期，请重新登录');
    return await this.activate(ctx);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }

  /**
   * 检查接口是否在白名单内
   * @param ctx
   * @returns
   */
  checkWhiteList(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const i = this.globalWhiteList.findIndex((route) => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        return !!pathToRegexp(route.path).exec(req.path);
      }
      return false;
    });
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    return i > -1;
  }
}
