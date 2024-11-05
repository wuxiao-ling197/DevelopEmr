import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SharedEntity } from 'src/common/entities/shared';
@Entity('res_company', {
  comment: 'Company',
})
export class ResCompEntity extends SharedEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column({ type: 'varchar', name: 'name', default: '', comment: 'Employee Name' })
  public name: string;

  @Column({ type: 'int', name: 'parent_id', comment: 'Manager' })
  public parentId: number;

  @Column({ type: 'varchar', name: 'email', comment: 'Email' })
  public email: string;

  @Column({ type: 'varchar', name: 'phone', comment: 'Phone' })
  public phone: string;

  @Column({ type: 'varchar', name: 'parent_path', comment: '路径' })
  public parentpath: string;

  @Column({ type: 'varchar', name: 'status_auth', comment: '注册状态' })
  public statusAuth: string;
}
