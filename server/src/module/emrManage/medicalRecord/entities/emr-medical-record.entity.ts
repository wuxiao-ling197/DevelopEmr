import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BusinessEnum } from '../dto';
@Entity('emr_medical_record', {
  comment: '电子病历表',
})
/**
 * 数据处理逻辑 1.定义实体和列属性
 */

export class MedicalRecordEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
  public id: number;

  @Column({ type: 'int', name: 'create_uid', comment: '创建人' })
  public createUID: number;

  @Column({ type: 'int', name: 'write_uid', comment: '修改人' })
  public writeUID: number;

  @Column({ type: 'varchar', name: 'active', comment: '是否可用' })
  public active: string;

  @Column({ type: 'varchar', name: 'job_id', nullable: false, comment: '病人的一次医院工作记录' })
  public jobID: string;

  @Column({ type: 'varchar', name: 'patient_id', nullable: false, comment: '病人的unique ID' })
  public patientID: string;

  @Column({ type: 'varchar', name: 'payloadId', nullable: false, comment: '病历文档id' })
  public payloadID: string;

  @Column({ type: 'varchar', name: 'business_type', comment: '业务类型', enum: BusinessEnum })
  public businessType: string;

  @Column({ type: 'varchar', name: 'meta', length: 30, comment: '版本' })
  public meta: string;

  @Column({ type: 'jsonb', name: 'header', nullable: false, comment: '病历头信息' })
  public header: Record<string, any>;

  //employee和priority
  @Column({ type: 'jsonb', name: 'participants', comment: '参与者' })
  public participants: Record<string, any>;

  @Column({ type: 'jsonb', name: 'payload', default: '', comment: '病历文档' })
  public payload: Record<string, any>;

  @Column({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  public createDate: Date;

  @Column({ type: 'timestamp', name: 'write_date', comment: '修改时间' })
  public writeDate: Date;

}
