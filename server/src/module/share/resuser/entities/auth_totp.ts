import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity('auth_totp_wizard', {
  comment: 'auth_totp_wizard',
})
export class AuthTotpEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column({ type: 'int', name: 'user_id', nullable: false, comment: 'User ID' })
  public userId: number;

  @Column({ type: 'varchar', name: 'secret', comment: 'totp secret' })
  public secret: string;

  @Column({ type: 'varchar', name: 'url', comment: 'url' })
  public url: string;

  @Column({ type: 'varchar', name: 'code', length: 7, comment: 'code' })
  public code: string;

  @Column({ type: 'bytea', name: 'qrcode', comment: 'qrcode' })
  public qrcode: Buffer;

  @ApiProperty({ type: String, description: '创建者' })
  @Column({ type: 'int', name: 'create_uid', comment: '创建者' })
  public createUid: number;

  @ApiProperty({ type: Date, description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  public createDate: Date;

  @ApiProperty({ type: String, description: '更新者' })
  @Column({ type: 'int', name: 'write_uid', comment: '更新者' })
  public writeUid: number;

  @ApiProperty({ type: Date, description: '更新时间' })
  @UpdateDateColumn({ type: 'timestamp', name: 'write_date', comment: '更新时间' })
  public writeDate: Date;

  //没添加外键连接的必要，因为只在第一次存入totp激活时的信息发生
  //   @ManyToOne(() => ResUserEntity, (user) => user.authtotps)
  //   // 在一对多/多对一关系中，外键只存在于多端
  //   @JoinColumn({ name: 'user_id' })
  //   user: ResUserEntity;
}
