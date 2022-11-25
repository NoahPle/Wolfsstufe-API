import { Module } from '@nestjs/common';
import { CypherService } from './services/cypher.service';
import { EmailService } from './services/email.service';
import { MidataService } from './services/midata.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [CypherService, EmailService, MidataService],
    imports: [HttpModule],
    exports: [MidataService],
})
export class CoreModule {}
