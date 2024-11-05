import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SharedEntity } from 'src/common/entities/shared';
import { ResUserEntity } from './resuser.entity';
import { HrDeptEntity } from '../../hrdept/entities/hrdept.entity';
import { ResoureceEntity } from './resource.entity';
@Entity('hr_employee', {
  comment: 'Employee',
})
export class HrEmpEntity extends SharedEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  //默认等于id
  @Column({ type: 'int', name: 'resource_id', nullable: false })
  public resourceId: number;

  @Column({ type: 'int', name: 'company_id', nullable: false, default: 1 })
  public companyId: number;

  @Column({ type: 'int', name: 'resource_calendar_id', default: 1 })
  public resourceCalendarId: number;

  @Column({ type: 'int', name: 'message_main_attachment_id', default: null })
  public messageMainAttachmentId: number;

  @Column({ type: 'int', name: 'color', default: 0 })
  public color: number;

  @Column({ type: 'int', name: 'department_id', default: null })
  public departmentId: number;

  @Column({ type: 'varchar', name: 'gender', comment: 'Gender' })
  public gender: string;

  @Column({ type: 'varchar', name: 'work_email', default: '', comment: 'Work Email' })
  public workEmail: string;

  @Column({ type: 'varchar', name: 'private_email', default: '', comment: 'Private Email' })
  public privateEmail: string;

  @Column({ type: 'varchar', name: 'work_phone', comment: 'Work Phone' })
  public workPhone: string;

  @Column({ type: 'varchar', name: 'mobile_phone', comment: 'Mobile Phone' })
  public mobilePhone: string;

  @Column({ type: 'varchar', name: 'private_phone', comment: 'Private Phone' })
  public privatePhone: string;

  @Column({ type: 'varchar', name: 'employee_type', nullable: false, default: 'employee', comment: 'Employee Type' })
  public employeeType: string;

  @Column({ type: 'varchar', name: 'name', default: '', comment: 'Employee Name' })
  public name: string;

  @Column({ type: 'int', name: 'user_id', comment: 'User ID' })
  public userId: number;

  @Column({ type: 'int', name: 'parent_id', comment: 'Manager' })
  public parentId: number;

  @Column({ type: 'int', name: 'country_id', comment: 'Manager' })
  public countryId: number;

  @Column({ type: 'varchar', name: 'job_title', default: '', comment: 'Job Title' })
  public jobTitle: string;

  @Column({ type: 'varchar', name: 'marital', comment: 'Marital Status' })
  public marital: string;

  @Column({ type: 'varchar', name: 'nation', comment: 'Nation' })
  public nation: string;

  @Column({ type: 'varchar', name: 'schoolgrade', comment: '学历' })
  public schoolgrade: string;

  @OneToOne(() => ResUserEntity, (user) => user.employee)
  public user: ResUserEntity;

  @ManyToOne(() => HrDeptEntity, (department) => department.employees)
  // 在一对多/多对一关系中，外键只存在于多端
  @JoinColumn({ name: 'department_id' })
  department: HrDeptEntity;

  @OneToOne(() => ResoureceEntity, (resource) => resource.employee)
  public resource: ResoureceEntity;
}
