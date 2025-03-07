
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base';
import { PatientEntity } from './patient.entity';
@Entity('hospital_patient_record', {
    comment: '病人挂号门诊记录表',
})
/**
 * 数据处理逻辑 1.定义实体和列属性
 */

export class HospitalPatientRecordEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
    public id: number;

    @Column({ type: 'int', name: 'patient_id', comment: '病人信息' })
    public patientID: number;

    @Column({ type: 'int', name: 'gender', comment: '性别' })
    public gender: number;

    @Column({ type: 'int', name: 'department_id', nullable: false, comment: '挂号科室' })
    public departmentID: number;

    @Column({ type: 'int', name: 'doctor_id', nullable: false, comment: '挂号医生' })
    public doctorID: number;

    @Column({ type: 'int', name: 'register_type', comment: '挂号类型' })
    public registerType: number;

    @Column({ type: 'int', name: 'create_uid', comment: 'Created by' })
    public createUid: number;

    @Column({ type: 'int', name: 'write_uid', comment: 'Last Updated by' })
    public writeUid: number;

    @Column({ type: 'varchar', name: 'jobId', nullable: false, comment: 'JobID' })
    public jobId: string;

    @Column({ type: 'varchar', name: 'age', comment: '年龄' })
    public age: string;

    @Column({ type: 'text', name: 'self_reported_symptom', comment: '主诉' })
    public selfReportedSymptom: string;

    @Column({ type: 'text', name: 'history_of_present_illness', comment: '现病史' })
    public historyOfPresentIllness: string;

    @Column({ type: 'text', name: 'past_medical_history', comment: '既往史' })
    public pastMedicalHistory: string;

    @Column({ type: 'text', name: 'history_of_family_illness', comment: '家族史' })
    public historyOfFamilyIllness: string;

    @Column({ type: 'text', name: 'personal_history', comment: '个人史' })
    public personalHistory: string;

    @Column({ type: 'text', name: 'marriage_history', comment: '婚姻史' })
    public marriageHistory: string;

    @Column({ type: 'text', name: 'diagnosis_result', comment: '诊断结果' })
    public diagnosisResult: string;

    @Column({ type: 'bool', name: 'jobid_if_active', comment: 'JobID是否有效' })
    public jobidIfActive: boolean;

    @Column({ type: 'timestamp', name: 'register_date', comment: '挂号日期' })
    public registerDate: Date;

    @Column({ type: 'timestamp', name: 'prescription_date', comment: '诊断日期' })
    public prescriptionDate: Date;

    @Column({ type: 'timestamp', name: 'create_date', comment: 'Created on' })
    public createDate: Date;

    @Column({ type: 'timestamp', name: 'write_date', comment: 'Last Updated on' })
    public writeDate: Date;

    @Column({ type: 'float8', name: 'total_amount', comment: '总价' })
    public totalAmount: number;

    @Column({ type: 'varchar', name: 'current_section', comment: '当前环节' })
    public currentSection: string;

    @Column({ type: 'bool', name: 'register_if_paid', comment: '挂号是否缴费' })
    public registerIfPaid: boolean;

    @Column({ type: 'bool', name: 'if_in_queue', comment: '是否在排队' })
    public ifInQueue: boolean;

    @Column({ type: 'int', name: 'room_id', comment: '病房' })
    public roomID: number;

    @Column({ type: 'bool', name: 'prescription_if_paid', comment: '处方是否缴费' })
    public prescriptionIfPaid: boolean;

    @Column({ type: 'bool', name: 'test_if_paid', comment: '检查是否缴费' })
    public testIfPaid: boolean;


    @OneToOne(() => PatientEntity, (patient) => patient.record)
    @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
    public patient?: PatientEntity;
}
