import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SharedEntity } from 'src/common/entities/shared';

// @Entity({ database: 'odoo18' }) // 指定数据库的连接名称
@Entity('discuss_channel', {
  comment: 'Discuss_Channel',
})
export class ChannelEntity extends SharedEntity {
  @ApiProperty({ type: String, description: '频道ID' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '频道ID' })
  public id: number;

  @ApiProperty({ type: String, description: 'Parent channel' })
  @Column({ type: 'int', name: 'parent_channel_id', default: null, comment: 'Parent channel' })
  public parentChannelId: number;

  @Column({ type: 'int', name: 'from_message_id', comment: 'Complete Name' })
  public fromMessageId: number;

  @ApiProperty({ type: String, description: '群组' })
  @Column({ type: 'int', name: 'group_public_id', default: null, comment: '群组' })
  public groupPublicId: number;

  @Column({ type: 'varchar', name: 'name', comment: 'Parent Path' })
  public name: string;

  @Column({ type: 'varchar', name: 'channel_type', default: null, comment: '频道类型' })
  public channelType: string;

  @Column({ type: 'varchar', name: 'uuid', default: null, comment: 'uuid' })
  public uuid: string;

  @Column({ type: 'varchar', name: 'description', default: null, comment: '描述' })
  public description: string;

//   @Column({ type: 'text', name: 'anonymous_name', default: null, comment: 'xx名称' })
//   public anonymousName: string;

  @Column({ type: 'boolean', name: 'active', default: null, comment: '可用' })
  public active: boolean;

//   @Column({ type: 'boolean', name: 'livechat_active', default: true, comment: '活跃聊天' })
//   public livechatActive: boolean;
}
