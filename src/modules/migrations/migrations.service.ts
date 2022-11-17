import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { CreateMemberDto } from '../members/dto/create-member-dto';
import { MembersService } from '../members/members.service';

@Injectable()
export class MigrationsService {
    constructor(private membersService: MembersService) {}
    async moveParticipantsToMembers() {
        const db = FirestoreService.getInstance();
        const snapshot = await db.collection('participants').get();
        const members = (await db.collection('members').get()).docs.map((doc) => doc.data());

        const participants = snapshot.docs
            .map((doc) => {
                return { ...doc.data(), midataId: doc.id };
            })
            .filter((participant) => !members.map((member) => member.midataId).includes(participant.midataId));

        await this.membersService.bulkCreateMembers(participants as CreateMemberDto[]);
    }
}
