import { pbkdf2Sync, randomBytes } from 'crypto';
import nodePasslib from 'node-passlib';

export class CryptoContext {
  private iterations: number;
  private hashBytes: number;
  private saltBytes: number;
  private digest: string;

  constructor(iterations: number = 600000, hashhashBytes: number = 64, saltBytes: number = 64, digest: string = 'sha512') {
    this.iterations = iterations;
    this.hashBytes = hashhashBytes;
    this.saltBytes = saltBytes;
    this.digest = digest;
  }

  //验证
  async verifyPasslib(password: string, hashedPwd: string): Promise<boolean> {
    return nodePasslib.verify(password, hashedPwd);
  }

  //加密 完全以odoo密码格式保存 +变. 无=填充 且能完全与odoo casdoor相互验证
  async hashPassword(password: string) {
    const salt = randomBytes(this.saltBytes);
    const hash = pbkdf2Sync(password, salt, this.iterations, this.hashBytes, this.digest).toString('base64');
    let format = ['$pbkdf2-sha512', this.iterations, salt.toString('base64'), hash].join('$');
    console.log(format);
    format = format.replace(/\+/g, '.').replace(/\=/g, '');
    return format;
  }

  async verifyPassword(password, combined) {
    combined = combined.replace(/\./g, '+');
    let [_, algorithm, iteration, salt, originalHash] = combined.split('$');
    //规范base64格式
    while (salt.length % 8 !== 0) {
      salt += '=';
    }
    while (originalHash.length % 8 !== 0) {
      originalHash += '=';
    }
    const hash = pbkdf2Sync(password, Buffer.from(salt, 'base64'), this.iterations, this.hashBytes, this.digest).toString('base64');
    return hash === originalHash;
  }
}
