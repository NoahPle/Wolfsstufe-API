import { CreateUserDto } from './dto/create-user.dto';
import { FirestoreService } from '../../core/firestore/firestore.service';

export enum UserRole {
    admin = 'admin',
    user = 'user',
}

export class User {
    private id: string;
    private email: string;
    private pfadiname: string;
    private firstname: string;
    private lastname: string;
    private role: UserRole;

    getId(): string {
        return this.id;
    }

    getRole(): UserRole {
        return this.role;
    }

    constructor(id: string, createUserDto: CreateUserDto) {
        this.id = id;
        this.email = createUserDto.email;
        this.pfadiname = createUserDto.pfadiname;
        this.firstname = createUserDto.firstname;
        this.lastname = createUserDto.lastname;
        this.role = createUserDto.role || UserRole.user;
    }

    public getJson() {
        return { ...this };
    }

    public static async queryAll(): Promise<User[]> {
        const snapshot = await User.getCollection().get();
        return snapshot.docs.map((doc) => new User(doc.id, doc.data() as CreateUserDto));
    }

    public static async queryById(id: string): Promise<User> {
        const snapshot = await User.getCollection().doc(id).get();
        return new User(id, snapshot.data() as CreateUserDto);
    }

    public async set(fields: any) {
        await User.getCollection().doc(this.id).set(fields, { merge: true });

        for (const key of Object.keys(fields)) {
            this[key] = fields[key];
        }
    }

    public async delete() {
        await User.getCollection().doc(this.id).delete();
    }

    public static getCollection() {
        return FirestoreService.getInstance().collection('users');
    }
}
