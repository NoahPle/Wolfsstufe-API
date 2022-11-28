import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { CreateMemberDto } from '../members/dto/create-member-dto';
import { MembersService } from '../members/members.service';
import { User, UserRole } from '../users/user.model';
import { ModelService } from '../../core/firestore/model-service';

@Injectable()
export class MigrationsService extends ModelService {
    public migrationNames = [
        {
            title: 'Participants to Members',
            description:
                'Moves all entries of the participants collection to the members collection and sets custom ids',
            endpoint: 'members',
        },
        {
            title: 'Leaders to Users',
            description: 'Converts Leaders collection to Users with Uids',
            endpoint: 'users',
        },
        {
            title: 'DivisionEntries to Events',
            description:
                'Moves all entries of the divisionEntries collection to the events collection. (Users should have midataIds)',
            endpoint: 'events',
        },
    ];

    constructor(private membersService: MembersService) {
        super();
    }

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

    async moveLeadersToUsers() {
        const db = FirestoreService.getInstance();
        const snapshot = await db.collection('leaders').get();
        const authUsers = (await FirestoreService.getAuth().listUsers()).users;
        const currentUsers = await User.queryAll(true);
        const users: User[] = [];

        for (const leader of snapshot.docs) {
            const data = leader.data();
            const authUser = authUsers.find((user) => user.uid === data.uid);
            const user = new User();

            user.id = data.uid;
            user.email = authUser.email;
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.pfadiname = data.pfadiname;
            user.phone = data.phone;
            user.midataId = leader.id;
            user.role = data.admin ? UserRole.admin : UserRole.leiter;

            if (!currentUsers.map((user) => user.id).includes(user.id)) users.push(user);
        }

        await Promise.all(users.map((user) => FirestoreService.setCustomClaims(user.id, user.getJson())));
        await this.bulkSet(users, false);
    }

    async moveDivisionEntriesToEvents() {
        const db = FirestoreService.getInstance();
        const snapshot = await db.collection('divisionEntries').get();
        const batch = db.batch();
        const users = await User.queryAll(true);

        for (const doc of snapshot.docs) {
            const ref = db.collection('events').doc();
            const data = doc.data();
            let wsIds = data.responsible.ws;
            wsIds = wsIds.filter((id) => users.map((user) => user.midataId).includes(id));
            wsIds = wsIds.map((id) => (id = users.find((user) => user.midataId === id).id));
            data.responsible.ws = wsIds;
            batch.create(ref, data);
            batch.delete(doc.ref);
        }

        await batch.commit();
    }
}
