import { CreateUserDto } from './dto/create-user.dto';
import { FirestoreService } from '../../core/firestore/firestore.service';

export enum UserRole {
    admin = 'admin',
    user = 'user',
}

export class UserModel {
    private uid: string;
    private email: string;
    private pfadiname: string;
    private firstname: string;
    private lastname: string;

    private role: UserRole;

    constructor(uid: string, createUserDto: CreateUserDto) {
        this.uid = uid;
        this.email = createUserDto.email;
        this.pfadiname = createUserDto.pfadiname;
        this.firstname = createUserDto.firstname;
        this.lastname = createUserDto.lastname;
        this.role = createUserDto.role || UserRole.user;
    }

    public getObject(): any {
        return { ...this };
    }

    public static queryAll() {
        FirestoreService.getInstance().getAll(FirestoreService.getInstance().collection('users').doc());
    }
}
