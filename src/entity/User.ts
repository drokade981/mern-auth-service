import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tenant } from "./Tenant";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // exclude password from query results by default for security reasons
  password: string;

  @Column()
  role: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;
}
