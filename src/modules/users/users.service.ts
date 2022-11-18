import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './user.model';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ModelService } from '../../core/firestore/model-service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends ModelService {
    public async createUser(createUserDto: CreateUserDto) {
        if (createUserDto.role !== UserRole.admin) {
            const uid = await FirestoreService.createUser(createUserDto.email);

            if (uid) {
                await this.addWithDto(createUserDto, User);
                const user = await User.queryById(uid);
                await FirestoreService.setCustomClaims(uid, user.getJson());
            }
        }
    }

    public async updateUser(updateUserDto: UpdateUserDto) {
        await this.setWithDto(updateUserDto, User);
        const user = await User.queryById(updateUserDto.id);
        await FirestoreService.setCustomClaims(updateUserDto.id, user.getJson());
    }

    public async updateRole(updateRoleDto: UpdateRoleDto) {
        if (updateRoleDto.role !== UserRole.admin) {
            const user = await User.queryById(updateRoleDto.id);

            if (user && updateRoleDto.role !== user.role && user.role !== UserRole.admin) {
                await this.setWithDto(updateRoleDto, User);
                await FirestoreService.setCustomClaims(updateRoleDto.id, user.getJson());
            } else {
                throw new HttpException('Cannot downgrade an admin', HttpStatus.FORBIDDEN);
            }
        } else {
            throw new HttpException('Only Admins can upgrade to admin', HttpStatus.FORBIDDEN);
        }
    }

    public async makeAdmin(id: string) {
        const user = await User.queryById(id);

        if (user && user.role !== UserRole.admin) {
            const updateDto: UpdateRoleDto = { id, role: UserRole.admin };
            await this.setWithDto(updateDto, User);
            await FirestoreService.setCustomClaims(id, user.getJson());
        } else {
            throw new HttpException('User is already admin', HttpStatus.FORBIDDEN);
        }
    }
}
