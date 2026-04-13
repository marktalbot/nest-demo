import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Service } from '../services/service.entity';

@Entity('service_versions')
export class ServiceVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn()
  organization: Organization;

  @Column()
  serviceId: string;

  @ManyToOne(() => Service, (service) => service.versions)
  @JoinColumn()
  service: Service;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
