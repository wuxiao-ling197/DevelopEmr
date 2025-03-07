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

  @Column({ type: 'int', name: 'coach_id', comment: 'Coach' })
  public coachId: number;

  @Column({ type: 'int', name: 'private_state_id', comment: 'Private State' })
  public privateStateId: number;

  @Column({ type: 'int', name: 'private_country_id', comment: 'Private Country' })
  public privateCountryId: number;

  @Column({ type: 'int', name: 'country_id', comment: 'Nationality (Country)' })
  public countryId: number;

  @Column({ type: 'int', name: 'children', comment: 'Number of Dependent Children' })
  public children: number;

  @Column({ type: 'int', name: 'country_of_birth', comment: 'Country of Birth' })
  public countryOfBirth: number;

  @Column({ type: 'int', name: 'bank_account_id', comment: 'Bank Account' })
  public bankAccountId: number;

  @Column({ type: 'int', name: 'distance_home_work', comment: 'Home-Work Distance' })
  public distanceHomeWork: number;

  @Column({ type: 'int', name: 'km_home_work', comment: 'Home-Work Distance in Km' })
  public kmHomeWork: number;

  @Column({ type: 'int', name: 'departure_reason_id', comment: 'Departure Reason' })
  public departureReasonId: number;

  @Column({ type: 'varchar', name: 'private_street', comment: 'Private Street' })
  public privateStreet: string;

  @Column({ type: 'varchar', name: 'private_street2', comment: 'Private Street2' })
  public privateStreet2: string;

  @Column({ type: 'varchar', name: 'private_city', comment: 'Private City' })
  public privateCity: string;

  @Column({ type: 'varchar', name: 'lang', comment: 'Lang' })
  public lang: string;

  @Column({ type: 'varchar', name: 'private_zip', comment: 'Private Zip' })
  public privateZip: string;

  @Column({ type: 'varchar', name: 'passport_id', comment: 'Passport No' })
  public passportId: string;

  @Column({ type: 'varchar', name: 'permit_no', comment: 'Work Permit No' })
  public permitNo: string;

  @Column({ type: 'varchar', name: 'visa_no', comment: 'Visa No' })
  public visaNo: string;

  @Column({ type: 'varchar', name: 'certificate', comment: 'Certificate Level' })
  public certificate: string;

  @Column({ type: 'varchar', name: 'study_field', comment: 'Field of Study' })
  public studyField: string;

  @Column({ type: 'varchar', name: 'study_school', comment: 'School' })
  public studySchool: string;

  @Column({ type: 'varchar', name: 'emergency_contact', comment: 'Contact Name' })
  public emergencyContact: string;

  @Column({ type: 'varchar', name: 'emergency_phone', comment: 'Contact Phone' })
  public emergencyPhone: string;

  @Column({ type: 'varchar', name: 'distance_home_work_unit', nullable: false, comment: 'Home-Work Distance unit' })
  public distanceHomeWorkUnit: string;

  @Column({ type: 'varchar', name: 'barcode', comment: 'Badge ID' })
  public barcode: string;

  @Column({ type: 'varchar', name: 'pin', comment: 'OIN' })
  public pin: string;

  @Column({ type: 'varchar', name: 'private_car_plate', comment: 'Private Car Plate' })
  public privateCarPlate: string;

  @Column({ type: 'timestamp', name: 'spouse_birthdate', comment: 'Spouse Birthdate' })
  public spouseBirthdate: Date;

  @Column({ type: 'timestamp', name: 'visa_expire', comment: 'Visa Expiration Date' })
  public visaExpire: Date;

  @Column({ type: 'timestamp', name: 'departure_date', comment: 'Departure Date' })
  public departureDate: Date;

  @Column({ type: 'timestamp', name: 'work_permit_expiration_date', comment: 'Work Permit Expiration Date' })
  public workPermitExpirationDate: Date;

  @Column({ type: 'jsonb', name: 'employee_properties', comment: 'Properties' })
  public employeeProperties: Record<string, any>;

  @Column({ type: 'varchar', name: 'job_title', default: '', comment: 'Job Title' })
  public jobTitle: string;

  @Column({ type: 'text', name: 'additional_note', default: '', comment: 'Additional Note' })
  public additionalNote: string;

  @Column({ type: 'text', name: 'notes', default: '', comment: 'Notes' })
  public notes: string;

  @Column({ type: 'text', name: 'departure_description', default: '', comment: 'Additional Information' })
  public departureDescription: string;

  @Column({ type: 'bool', name: 'is_flexible', comment: 'is Flexible' })
  public isFlexible: boolean;

  @Column({ type: 'bool', name: 'is_fully_flexible', comment: 'Is Fully Flexible' })
  public isFullyFlexible: boolean;

  @Column({ type: 'bool', name: 'work_permit_scheduled_activity', comment: 'Work Permit Scheduled Activity' })
  public workPermitScheduledActivity: boolean;

  @Column({ type: 'varchar', name: 'legal_name', comment: 'Legal Name' })
  public legalName: string;

  @Column({ type: 'varchar', name: 'vehicle', comment: 'Company Vehicle' })
  public vehicle: string;

  @Column({ type: 'bool', name: 'contract_warning', comment: 'Contract Warning' })
  public contractWarning: boolean;

  @Column({ type: 'date', name: 'first_contract_date', comment: 'First Contract Date' })
  public firstContractDate: Date;

  @Column({ type: 'varchar', name: 'marital', comment: 'Marital Status' })
  public marital: string;

  @Column({ type: 'timestamp', name: 'passport_expiry_date', comment: 'Expiry Date' })
  public passportExpiryDate: Date;

  @Column({ type: 'timestamp', name: 'id_expiry_date', comment: 'Expiry Date' })
  public idExpiryDate: Date;

  @Column({ type: 'timestamp', name: 'joining_date', comment: 'Joining Date' })
  public joiningDate: Date;

  @Column({ type: 'varchar', name: 'personal_mobile', comment: 'Mobile' })
  public personal_mobile: string;

  @Column({ type: 'int4', name: 'job_id', comment: 'Job Position' })
  public jobId: number;


  @Column({ type: 'int4', name: 'address_id', comment: 'Work Address' })
  public addressId: number;


  @Column({ type: 'int4', name: 'work_contact_id', comment: 'Work Contact' })
  public workContactId: number;

  @Column({ type: 'int4', name: 'work_location_id', comment: 'Work Location' })
  public workLocationId: number;

  @Column({ type: 'varchar', name: 'spouse_complete_name', comment: 'Spouse Complete Name' })
  public spouseCompleteName: string;

  @Column({ type: 'varchar', name: 'place_of_birth', comment: 'Place of Birth' })
  public placeOfBirth: string;

  @Column({ type: 'varchar', name: 'ssnid', comment: 'SSN No' })
  public ssnid: string;

  @Column({ type: 'varchar', name: 'work_contact_id', comment: 'SIN No' })
  public sinid: string;

  @Column({ type: 'varchar', name: 'identification_id', comment: 'Identification No' })
  public identificationId: string;

  @Column({ type: 'varchar', name: 'nation', comment: '民族' })
  public nation: string;

  @Column({ type: 'int4', name: 'schoolgrade', comment: '学历' })
  public schoolgrade: string;

  @Column({ type: 'int4', name: 'appellation', comment: '职称' })
  public appellation: string;

  @Column({ type: 'int4', name: 'surgery_grade', comment: '手术级别' })
  public surgeryGrade: string;

  @Column({ type: 'int4', name: 'physician_cert', comment: '职业医生资质' })
  public physicianCert: string;

  @Column({ type: 'int4', name: 'physician_aid_cert', comment: '职业医生助理资质' })
  public physicianAidCert: string;

  @Column({ type: 'int4', name: 'pharmacist_cert', comment: '职业药师资质' })
  public pharmacistCert: string;

  @Column({ type: 'int4', name: 'nurse_cert', comment: '职业护士资质' })
  public nurseCert: string;

  @Column({ type: 'int4', name: 'booking_num_am', comment: '上午最大预约人数' })
  public bookingNumAM: number;

  @Column({ type: 'int4', name: 'booking_num_pm', comment: '下午最大预约人数' })
  public bookingNumPM: number;

  @Column({ type: 'int4', name: 'booking_num_ng', comment: '晚上最大预约人数' })
  public bookingNumNG: number;

  @Column({ type: 'int4', name: 'specialist_id', comment: '专科护士类别' })
  public specialistId: number;

  @Column({ type: 'int4', name: 'native_place_p', comment: '籍贯（省）' })
  public nativePlaceP: number;

  @Column({ type: 'int4', name: 'native_place_c', comment: '籍贯（市）' })
  public nativePlaceC: number;

  @Column({ type: 'varchar', name: 'politics_status', comment: '政治面貌' })
  public politicsStatus: string;

  @Column({ type: 'varchar', name: 'nature_position', comment: '岗位性质' })
  public nature_position: string;

  @Column({ type: 'varchar', name: 'tocompile', comment: '身份类型' })
  public tocompile: string;

  @Column({ type: 'varchar', name: 'rank', comment: '职级' })
  public rank: string;

  @Column({ type: 'varchar', name: 'appellation_code', comment: '职称证书编号' })
  public appellationCode: string;

  @Column({ type: 'varchar', name: 'edu_appellation', comment: '教学职称' })
  public edu_appellation: string;

  @Column({ type: 'varchar', name: 'edu_school', comment: '教学单位' })
  public eduSchool: string;

  @Column({ type: 'varchar', name: 'surgery_cert', comment: '手术资质' })
  public surgeryCert: string;

  @Column({ type: 'varchar', name: 'edu_category', comment: '导师资质' })
  public eduCategory: string;


  @Column({ type: 'text', name: 'introduction', comment: '医生简介' })
  public introduction: string;


  @Column({ type: 'varchar', name: 'note', comment: '说明' })
  public note: string;

  @Column({ type: 'varchar', name: 'performanceclass', comment: '绩效优先资质' })
  public performanceClass: string;

  @Column({ type: 'varchar', name: 'performance_rank', comment: '绩效职称' })
  public performanceRank: string;

  @Column({ type: 'varchar', name: 'operate_cert', comment: '操作资质' })
  public operateCert: string;

  @Column({ type: 'bool', name: 'is_specialist', comment: '是否为专科护士' })
  public is_specialist: boolean;

  @Column({ type: 'varchar', name: 'nurse_spe', comment: '护士能级' })
  public nurseSpe: string;

  @Column({ type: 'varchar', name: 'practice_categ', comment: '职业类别' })
  public practiceCateg: string;

  @Column({ type: 'timestamp', name: 'birthday', comment: '出生日期' })
  public birthday: Date;

  @Column({ type: 'timestamp', name: 'graduation_date', comment: '毕业时间' })
  public graduationDate: Date;

  @Column({ type: 'timestamp', name: 'specialist_date', comment: '护士能级获取时间' })
  public specialistDate: Date;

  @Column({ type: 'timestamp', name: 'appellation_time', comment: '职称获得日期' })
  public appellationTime: Date;

  @Column({ type: 'timestamp', name: 'inductiondate', comment: '入职日期' })
  public inductionDate: Date;

  @OneToOne(() => ResUserEntity, (user) => user.employee)
  public user: ResUserEntity;

  @ManyToOne(() => HrDeptEntity, (department) => department.employees)
  // 在一对多/多对一关系中，外键只存在于多端
  @JoinColumn({ name: 'department_id' })
  department: HrDeptEntity;

  @OneToOne(() => ResoureceEntity, (resource) => resource.employee)
  public resource: ResoureceEntity;
}
