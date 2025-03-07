
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base';
@Entity('hospital_patient_jobid', {
    comment: '病人就诊表',
})
/**
 * 数据处理逻辑 1.定义实体和列属性
 */

// export class MetadataEntity extends BaseEntity {
export class PatientJobIDEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
    public id: number;

    @Column({ type: 'int', name: 'create_uid', comment: 'Created by' })
    public createUid: number;

    @Column({ type: 'int', name: 'write_uid', comment: 'Last Updated by' })
    public writeUid: number;

    @Column({ type: 'int', name: 'register_id', nullable: false, comment: '就诊信息' })
    public registerID: number;

    @Column({ type: 'int', name: 'patient_id', nullable: false, comment: '病人信息' })
    public patientID: number;

    @Column({ type: 'varchar', name: 'jobId', comment: '就诊号' })
    public jobId: string;

    @Column({ type: 'int', name: 'business_type_id', nullable: false, comment: '业务类型' })
    public businessTypeId: number;

    @Column({ type: 'bool', name: 'if_in_queue', nullable: false, comment: '是否在队列' })
    public ifInQueue: boolean;

    @Column({ type: 'int', name: 'department_id', nullable: false, comment: '挂号科室' })
    public departmantID: number;

    @Column({ type: 'int', name: 'doctor_id', nullable: false, comment: '挂号医生' })
    public doctorID: number;

    @Column({ type: 'bool', name: 'active', nullable: false, comment: '是否有效' })
    public active: boolean;

    @Column({ type: 'timestamp', name: 'create_date', comment: 'Created on' })
    public createDate: Date;

    @Column({ type: 'varchar', name: 'write_date', comment: 'Last Updated on' })
    public writeDate: Date;

}
