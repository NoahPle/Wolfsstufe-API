import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ModelService } from '../../core/firestore/model-service';

@Injectable()
export class UserService extends ModelService {
    model = new User();

    public async createUser(createUserDto: CreateUserDto) {
        const uid = await FirestoreService.createUser(createUserDto.email);

        if (uid) {
            this.model.getCollection();
            const user = new User();

            user.setFields({
                id: uid,
                ...createUserDto,
            });

            await this.set(uid, user.getJson());
            await FirestoreService.setCustomClaims(uid, user.getJson());
        }
    }

    public async updateRole(updateRoleDto: UpdateRoleDto) {
        const user = await User.queryById(updateRoleDto.uid);

        if (user && updateRoleDto.role !== user.role) {
            user.role = updateRoleDto.role;

            await this.set(updateRoleDto.uid, { role: user.role });
            await FirestoreService.setCustomClaims(updateRoleDto.uid, user.getJson());
        }
    }
}
