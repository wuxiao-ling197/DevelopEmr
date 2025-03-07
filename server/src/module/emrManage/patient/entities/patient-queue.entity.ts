
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base';
import { PatientEntity } from '../../registerAndCheckIn/entities/patient.entity';
@Entity('hospital_queue', {
    comment: '排队叫号表',
})
/**
 * 数据处理逻辑 1.定义实体和列属性
 */
export class PatientQueueEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
    public id: number;

    @Column({ type: 'int', name: 'patient_jid', nullable: false, comment: '病人' })
    public patientJID: number;

    @Column({ type: 'int', name: 'patient_gender', comment: '性别' })
    public patientGender: number;

    @Column({ type: 'int', name: 'qNumber', comment: '排队号' })
    public qNumber: number;

    @Column({ type: 'int', name: 'busTypeSeq', comment: '业务类型编码' })
    public busTypeSeq: number;

    @Column({ type: 'int', name: 'doctor_id', comment: '挂号医生' })
    public doctorID: number;

    @Column({ type: 'int', name: 'call_times', comment: '叫号次数' })
    public callTimes: number;

    @Column({ type: 'int', name: 'create_uid', comment: 'Created by' })
    public createUid: number;

    @Column({ type: 'int', name: 'write_uid', comment: 'Last Updated by' })
    public writeUid: number;

    @Column({ type: 'varchar', name: 'idCard', comment: '身份证号' })
    public idCard: string;

    @Column({ type: 'varchar', name: 'patient_age', comment: '年龄' })
    public patientAge: string;

    @Column({ type: 'varchar', name: 'ticketNumber', comment: '取票号' })
    public ticketNumber: string;

    @Column({ type: 'varchar', name: 'vipLevel', comment: '优先级别' })
    public vipLevel: string;

    @Column({ type: 'varchar', name: 'state', comment: '处理状态' })
    public state: string;

    @Column({ type: 'varchar', name: 'reserveSeq', comment: '预约号' })
    public reserveSeq: string;

    @Column({ type: 'varchar', name: 'reserveType', comment: '预约类型' })
    public reserveType: string;

    @Column({ type: 'varchar', name: 'type', comment: '类型' })
    public type: string;

    @Column({ type: 'varchar', name: 'qType', comment: '排队类型' })
    public qType: string;

    @Column({ type: 'varchar', name: 'queue_state', comment: '排队状态' })
    public queueState: string;

    @Column({ type: 'date', name: 'reserveDate', comment: '预约日期' })
    public reserveDate: Date;

    @Column({ type: 'timestamp', name: 'ticketTime', comment: '取票时间' })
    public ticketTime: Date;

    @Column({ type: 'timestamp', name: 'reserveStartTime', comment: '预约开始时间' })
    public reserveStartTime: Date;

    @Column({ type: 'timestamp', name: 'reserveEndTime', comment: '预约结束时间' })
    public reserveEndTime: Date;

    @Column({ type: 'timestamp', name: 'reserveTime', comment: '预约时间' })
    public reserveTime: Date;

    @Column({ type: 'timestamp', name: 'create_date', comment: 'Created on' })
    public createDate: Date;

    @Column({ type: 'varchar', name: 'write_date', comment: 'Last Updated on' })
    public writeDate: Date;

    @Column({ type: 'int', name: 'department_id', comment: '挂号科室' })
    public departmentID: number;

    @Column({ type: 'int', name: 'room_id', comment: '排队诊室' })
    public roomID: number;

    @Column({ type: 'int', name: 'patient_id', comment: '病人' })
    public patientID: number;

    // 和patient的关联关系
    @ManyToOne(() => PatientEntity, (patient) => patient.queue)
    @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
    public patient?: PatientEntity;
}
