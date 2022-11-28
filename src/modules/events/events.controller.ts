import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserGuard } from '../../guards/user-guard';

@Controller('events')
@UseGuards(UserGuard)
export class EventsController {
    constructor(private eventsService: EventsService) {}

    @Post()
    async createEvent(@Body() createEventDto: CreateEventDto): Promise<any> {
        return await this.eventsService.createEvent(createEventDto);
    }

    @Put()
    async updateRule(@Body() updateEventDto: UpdateEventDto): Promise<any> {
        return await this.eventsService.updateEvent(updateEventDto);
    }

    @Delete(':id')
    async deleteRule(@Param('id') id: string): Promise<any> {
        return await this.eventsService.deleteEvent(id);
    }
}
