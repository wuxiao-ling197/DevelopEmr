import { BeforeUpdate, Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
//基础实体信息
@Entity()
export abstract class SharedEntity {
  //0正常 1停用
  @ApiProperty({ type: String, description: '状态' })
  @Column({ type: 'boolean', name: 'active', default: true, comment: '状态' })
  public active: boolean;

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

  // 钩子，处理默认值在数据库中插入失败的问题（原因是只在orm中生效）
  @BeforeUpdate()
  setDefaultUsername() {
    if (this.active === null || this.active === undefined) {
      this.active = true;
    }
    if (this.createDate === null || this.createDate === undefined) {
      this.createDate = new Date();
    }
    if (this.writeDate === null || this.writeDate === undefined) {
      this.writeDate = new Date();
    }
  }
}
