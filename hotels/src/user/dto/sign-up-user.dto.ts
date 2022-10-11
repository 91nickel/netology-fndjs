export enum Role {
    Client = 'client',
    Manager = 'manager',
    Admin = 'admin',
}

export class SignUpUserDto {
    email: string
    passwordHash: string
    name: string
    contactPhone: string
    role: Role = Role.Client
}