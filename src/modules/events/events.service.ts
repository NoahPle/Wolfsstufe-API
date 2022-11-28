import { Injectable } from '@nestjs/common';
import { ModelService } from '../../core/firestore/model-service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.model';
import * as moment from 'moment';

@Injectable()
export class EventsService extends ModelService {
    async createEvent(createEventDto: CreateEventDto) {
        createEventDto.start = moment(createEventDto.start).startOf('day').toDate();
        createEventDto.end = moment(createEventDto.end).startOf('day').toDate();
        await this.addWithDto(createEventDto, Event);
    }

    async updateEvent(updateEventDto: UpdateEventDto) {
        updateEventDto.start = moment(updateEventDto.start).startOf('day').toDate();
        updateEventDto.end = moment(updateEventDto.end).startOf('day').toDate();
        await this.setWithDto(updateEventDto, Event);
    }

    async deleteEvent(id: string) {
        await this.delete(id, Event);
    }
}
