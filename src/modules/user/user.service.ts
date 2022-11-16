import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UserService {
    public async createUser(createUserDto: CreateUserDto) {
        const uid = await FirestoreService.createUser(createUserDto.email);

        if (uid) {
            const user = new User(uid, createUserDto);
            await user.set(user.getJson());
            await FirestoreService.setCustomClaims(uid, user.getJson());
        }
    }

    public async updateRole(updateRoleDto: UpdateRoleDto) {
        const user = await User.queryById(updateRoleDto.uid);

        if (updateRoleDto.role !== user.getRole()) {
            await user.set({ role: updateRoleDto.role });
            await FirestoreService.setCustomClaims(user.getId(), user.getJson());
        }
    }

    public async deleteUser(id: string) {
        if (id) {
            console.log(id);

            const user = await User.queryById(id);
            await user.delete();
        } else {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
    }

    private getCollection() {
        return FirestoreService.getInstance().collection('users');
    }
}
