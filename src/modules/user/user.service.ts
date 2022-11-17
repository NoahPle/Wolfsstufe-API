import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ModelService } from '../../core/firestore/model-service';

@Injectable()
export class UserService extends ModelService {
    public async createUser(createUserDto: CreateUserDto) {
        const uid = await FirestoreService.createUser(createUserDto.email);

        if (uid) {
            const user = new User();

            user.setFields({
                id: uid,
                ...createUserDto,
            });

            await this.set(user);
            await FirestoreService.setCustomClaims(uid, user.getJson());
        }
    }

    public async updateRole(updateRoleDto: UpdateRoleDto) {
        const user = await User.queryById(updateRoleDto.id);

        if (user && updateRoleDto.role !== user.role) {
            await this.setWithDto(updateRoleDto, User);
            await FirestoreService.setCustomClaims(updateRoleDto.id, user.getJson());
        }
    }
}
