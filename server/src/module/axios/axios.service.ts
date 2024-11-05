import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import iconv from 'iconv-lite';
import { ConfigService } from 'src/module/system/config/config.service';
import { ResultData } from 'src/common/utils/result';
import { RedisService } from 'src/module/redis/redis.service';
import { CacheEnum } from 'src/common/enum/index';

@Injectable()
export class AxiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}
  /**
   * 获取ip地址信息
   * @param ip
   * @returns
   */
  async getIpAddress(ip: string) {
    try {
      const IP_URL = 'https://whois.pconline.com.cn/ipJson.jsp';
      const response = await this.httpService.axiosRef(`${IP_URL}?ip=${ip}&json=true`, {
        responseType: 'arraybuffer',
        transformResponse: [
          function (data) {
            const str = iconv.decode(data, 'gbk');
            return JSON.parse(str);
          },
        ],
      });
      return response.data.addr;
    } catch (error) {
      return '未知';
    }
  }

  async getsmsCode(tel: string) {
    try {
      const url = await this.configService.getConfigValue('sys.register.smsserver');
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const msg = `【钛铂云医】您正在登录服务，短信验证码 ${code}，已发送给您的手机，请尽快在五分钟内完成验证。`;
      const payload = {
        msg: msg,
        tel: tel,
      };
      // sms服务中的传参格式为payload，不能用data:payload包裹，那样的传参格式是{data:{payload}}
      const response = await this.httpService.axiosRef.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      await this.redisService.set(CacheEnum.CAPTCHA_CODE_KEY + tel, code, 1000 * 60 * 5);
      console.log('axiosservice smscode info:', url, code, response.data);
      return ResultData.ok(response.data, code);
    } catch (error) {
      return '请求发送验证码失败 ' + error;
    }
  }
}
