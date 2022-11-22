import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './user.model';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { ModelService } from '../../core/firestore/model-service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends ModelService {
    public async createUser(createUserDto: CreateUserDto) {
        if (createUserDto.role !== UserRole.admin) {
            const uid = await FirestoreService.createUser(createUserDto.email);

            if (uid) {
                await this.setWithDto({ id: uid, ...createUserDto }, User);
                const user = await User.queryById(uid);
                await FirestoreService.setCustomClaims(uid, user.getJson());
            }
        }
    }

    public async updateUser(updateUserDto: UpdateUserDto, token: string) {
        const decodedIdToken = await FirestoreService.verifyIdToken(token);

        if (updateUserDto.role === UserRole.admin && decodedIdToken.role !== UserRole.admin) {
            throw new HttpException('Only Admins can upgrade to admin', HttpStatus.FORBIDDEN);
        }

        const user = await User.queryById(updateUserDto.id);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        if (
            user.role === UserRole.admin &&
            updateUserDto.role !== UserRole.admin &&
            decodedIdToken.role !== UserRole.admin
        ) {
            throw new HttpException('Cannot downgrade an admin', HttpStatus.FORBIDDEN);
        }

        await this.setWithDto(updateUserDto, User);
        const updatedUser = await User.queryById(updateUserDto.id);
        await FirestoreService.setCustomClaims(updateUserDto.id, updatedUser.getJson());
    }

    public async disableUser(id: string) {
        await this.setWithDto({ id, role: UserRole.disabled }, User);
    }
}
