export interface IUser {
  id: string;
  email: string;
  name: string;
  roleId: string;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
  isActive: boolean;
  serventia: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
}
