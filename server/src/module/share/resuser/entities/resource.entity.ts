import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HrEmpEntity } from './hremp.entity';
import { SharedEntity } from 'src/common/entities/shared';
import { ResUserEntity } from './resuser.entity';
@Entity('resource_resource', {
  comment: 'resource_resource',
})
export class ResoureceEntity extends SharedEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column({ type: 'int', name: 'company_id', comment: 'Company ID' })
  public companyId: number;

  @Column({ type: 'int', name: 'user_id', comment: 'User ID' })
  public userId: number;

  @Column({ type: 'int', name: 'calendar_id', comment: 'Calendar ID' })
  public calendarId: number;

  @Column({ type: 'varchar', name: 'name', comment: 'Name' })
  public name: string;

  @Column({ type: 'varchar', name: 'resource_type', comment: 'Resource Type' })
  public resourceType: string;

  //在 TypeORM 中，实体类的默认值只会在 ORM 操作时生效。确保数据库表中也有相应的默认值设置
  @Column({ type: 'varchar', name: 'tz', default: 'Asia/Shanghai', comment: 'TZ' })
  public tz: string;

  @Column({ type: 'float', name: 'time_efficiency', comment: 'Efficiency Factor' })
  public timeEfficiency: number;

  //employee中存在resource_id外键，因此应该在employee实体中定义外键关系
  @OneToOne(() => HrEmpEntity, (employee) => employee.resource)
  @JoinColumn({ name: 'id', referencedColumnName: 'resourceId' }) // 指定外键列,是实体中的定义名称,在外键指向的表的实体中定义
  public employee: HrEmpEntity;

  @OneToOne(() => ResUserEntity, (user) => user.resource)
  public user: ResUserEntity;
}
