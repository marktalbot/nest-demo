import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { User } from './user.entity';

@Entity('user_organizations')
export class UserOrganization {
  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.memberships)
  @JoinColumn()
  user: User;

  @PrimaryColumn()
  organizationId: string;

  @ManyToOne(() => Organization, (org) => org.memberships)
  @JoinColumn()
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
