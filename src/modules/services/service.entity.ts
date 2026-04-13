import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { ServiceVersion } from '../service-versions/service-version.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn()
  organization: Organization;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  activeVersionId: string;

  @ManyToOne(() => ServiceVersion, { nullable: true, eager: false })
  @JoinColumn()
  activeVersion: ServiceVersion;

  @OneToMany(() => ServiceVersion, (version) => version.service)
  versions: ServiceVersion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
