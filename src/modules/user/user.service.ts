import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './user.model';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UserService {
    public async createUser(createUserDto: CreateUserDto) {
        const uid = await FirestoreService.createUser(createUserDto.email);

        if (uid) {
            const user = new UserModel(uid, createUserDto);
            const db = FirestoreService.getInstance();
            const batch = db.batch();

            batch.set(db.collection('users').doc(uid), user.getObject());
            await batch.commit();

            await FirestoreService.setCustomClaims(uid, {
                uid,
                ...user.getObject(),
            });
        }
    }

    public async updateRole(updateRoleDto: UpdateRoleDto) {}
}
