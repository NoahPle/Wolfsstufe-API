import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private authService: AuthService) {}

    @Post('authenticate')
    async authenticate(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
        this.logger.verbose(`User "${authCredentialsDto.email}" tried to sign in.`);
        return this.authService.authenticate(authCredentialsDto);
    }
}
