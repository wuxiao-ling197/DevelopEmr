import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity('emr_templates', {
  comment: '电子病历相关模板表',
})
/**
 * 数据处理逻辑 1.定义实体和列属性
 */

export class TemplateEntity{
    @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
    public id: number;
    
    @Column({ type: 'int', name: 'create_uid', comment: '创建人' })
    public createUID: number;
    
    @Column({ type: 'int', name: 'write_uid', comment: '修改人' })
    public writeUID: number;
    
    @Column({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
    public createDate: Date;
  
    @Column({ type: 'timestamp', name: 'write_date', comment: '修改时间' })
    public writeDate: Date;

    @Column({ type: 'varchar', name: 'name', nullable: false, comment: '模板名称' })
    public name: string;
  
    @Column({ type: 'varchar', name: 'business', nullable: false, comment: '业务类型' })
    public business: string;
  
    @Column({ type: 'varchar', name: 'category', comment: '模板大类' })
    public category: string;
  
    @Column({ type: 'varchar', name: 'permission', comment: '模板权限' })
    public permission: string;
  
    @Column({ type: 'varchar', name: 'number', comment: '模板编码' })
    public number: string;
    
    @Column({ type: 'json', name: 'payload', comment: '模板内容' })
    public payload: JSON;
  
    @Column({ type: 'varchar', name: 'active', comment: '是否可用' })
    public active: string;
  
    @Column({ type: 'varchar', name: 'meta', length: 30, comment: '版本' })
    public meta: string;
    
    @Column({ type: 'varchar', name: 'remark', comment: '备注' })
    public remark: string;
}