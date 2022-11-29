import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../../core/firestore/firestore.service';
import { CreateMemberDto } from '../members/dto/create-member-dto';
import { MembersService } from '../members/members.service';
import { User, UserRole } from '../users/user.model';
import { ModelService } from '../../core/firestore/model-service';
import { Job } from '../jobs/job.model';
import { CreateAbsenceEntryDto } from '../absences/dto/create-absence-entry.dto';
import { AbsencesService } from '../absences/absences.service';
import { EntryType } from '../absences/models/entry.model';
import { Member } from '../members/member.model';

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
        {
            title: 'Update User Ids from Jobs',
            description:
                'Moves all entries of the divisionEntries collection to the events collection. (Users should have midataIds)',
            endpoint: 'jobs',
        },
        {
            title: 'Lists to Absences',
            description:
                'Moves all entries of the divisionEntries collection to the events collection. (Users should have midataIds)',
            endpoint: 'absences',
        },
    ];

    constructor(private membersService: MembersService, private absencesService: AbsencesService) {
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
        const batch = db.batch();

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
            batch.delete(leader.ref);
        }

        await Promise.all(users.map((user) => FirestoreService.setCustomClaims(user.id, user.getJson())));
        await this.bulkSet(users, false);
        await batch.commit();
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

    async updateJobUserIds() {
        const jobs = await Job.queryAll();
        const users = await User.queryAll(true);
        for (const job of jobs) {
            job.userIds = job.userIds.map((id) => {
                const user = users.find((user) => user.id === id || user.midataId === id);
                return user ? user.id : id;
            });
        }

        await this.bulkSet(jobs);
    }

    async moveListsToAbsences() {
        const db = FirestoreService.getInstance();
        const snapshot = await db.collection('lists').get();
        const users = await User.queryAll(true);
        const members = await Member.queryAll(true);
        const batch = db.batch();

        await Promise.all(
            snapshot.docs.map(async (list) => {
                const data = list.data();
                const absenceList = await this.absencesService.createAbsenceList({ date: data.date.toDate() });
                const entries: CreateAbsenceEntryDto[] = [];

                for (const midataId of data.leaders) {
                    const user = users.find((user) => user.midataId === midataId);
                    if (user) entries.push({ id: user.id, present: true, type: EntryType.leader });
                }

                for (const midataId of data.participants) {
                    const member = members.find((member) => member.midataId === midataId);
                    if (member) entries.push({ id: member.id, present: true, type: EntryType.member });
                }

                batch.delete(list.ref);
                await this.absencesService.updateEntries({ id: absenceList.id, entries });
            }),
        );

        await batch.commit();
    }
}
