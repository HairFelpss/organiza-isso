import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAuthDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(data: RegisterAuthDto) {
    const { email, document, phone } = data;

    if (await this.usersService.findByEmail(email)) {
      throw new NotFoundException(`Usuário com email ${email} já cadastrado`);
    }

    if (await this.usersService.findByDocument(document)) {
      throw new NotFoundException(`Usuário com CPF ${document} já cadastrado`);
    }

    if (await this.usersService.findByPhone(phone)) {
      throw new NotFoundException(
        `Usuário com telefone ${phone} já cadastrado`,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    return this.usersService.create(data);
  }

  async authenticate(registerUserDto: AuthenticateDto) {
    const { email, password } = registerUserDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    return {
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { password, email } = forgotPasswordDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPassword = hashedPassword;

    return this.usersService.update(user.id, {
      password: newPassword,
      email,
    });
  }
}
