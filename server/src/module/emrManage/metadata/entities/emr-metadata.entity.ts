import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base';
@Entity('numbercode', {
  comment: '数据原值域表',
})
/**
 * 数据处理逻辑 1.定义实体和列属性
 */

// export class MetadataEntity extends BaseEntity {
export class MetadataEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
  public id: number;

  @Column({ type: 'varchar', name: 'no', comment: '编号' })
  public no: string;

  @Column({ type: 'int', name: 'create_uid', nullable: false, comment: 'Create by' })
  public createUid: number;

  @Column({ type: 'int', name: 'write_uid', nullable: false, comment: 'Last Updated by' })
  public writeUid: number;

  @Column({ type: 'varchar', name: 'code', default: '', comment: '值域代码' })
  public code: string;

  @Column({ type: 'varchar', name: 'code_name', default: '', comment: '值域代码名称' })
  public codeName: string;

  @Column({ type: 'varchar', name: 'value', default: '', comment: '值' })
  public value: string;
  
  @Column({ type: 'varchar', name: 'value_mean', default: '', length: 11, comment: '值含义' })
  public valueMean: string;
  
  @Column({ type: 'varchar', name: 'category', default: '', length: 11, comment: '类别' })
  public category: string;
  
  @Column({ type: 'varchar', name: 'explain', default: '', length: 11, comment: '说明' })
  public explain: string;
  
  @Column({ type: 'timestamp', name: 'create_date', nullable: false, comment: 'Created on' })
  public createDate: Date;
  
  @Column({ type: 'timestamp', name: 'write_date', nullable: false, comment: 'Last Updated on' })
  public writeDate: Date;
  
  @Column({ type: 'varchar', name: 'category_code', default: '', length: 11, comment: '类别代码' })
  public categoryCode: string;
}
