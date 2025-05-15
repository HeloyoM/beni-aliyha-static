export default interface IUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role_name: string;
    level: number;
    address: string;
    birthday: Date;
    active: boolean;
}