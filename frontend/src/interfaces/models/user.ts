import { UserRole } from "../../enums/role";

export interface User {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    isActivated?: boolean;
    isActive?: boolean;
}
