import { Entity, PrimaryColumn } from 'typeorm';
@Entity('res_company_users_rel', {
  comment: 'res_company_users_rel',
})
export class CompUserEntity {
  @PrimaryColumn({ type: 'int', name: 'cid' })
  public cid: number;

  @PrimaryColumn({ type: 'int', name: 'user_id', comment: 'User ID' })
  public userId: number;
}
