import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
        this.logger.verbose(`New sign up. Username: ${createUserDto.email}`);
        return this.authService.createUser(createUserDto);
    }

    @Post('signin')
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        this.logger.verbose(`User "${authCredentialsDto.email}" tried to sign in.`);
        return this.authService.authenticate(authCredentialsDto);
    }
}
