export interface UserEntity {
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  
  createdAt: Date;
}