import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Post('midata')
    private async setMidataAccount(@Body() body: any) {
        if (body.email && body.password) {
            return await this.adminService.setMidataAccount(body.email, body.password);
        } else {
            throw new HttpException('email and password must be set', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('email')
    private async setEmailAccount(@Body() body: any) {
        if (body.email && body.password) {
            return await this.adminService.setEmailAccount(body.email, body.password);
        } else {
            throw new HttpException('email and password must be set', HttpStatus.BAD_REQUEST);
        }
    }
}
