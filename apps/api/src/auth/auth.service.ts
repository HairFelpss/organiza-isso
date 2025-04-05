import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { AuthenticateDto } from './dto/authenticate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAuthDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(data: RegisterAuthDto) {
    const { email, document, phone } = data;

    if (await this.usersRepository.findByEmail(email)) {
      throw new NotFoundException(`Usuário com email ${email} já cadastrado`);
    }

    if (await this.usersRepository.findByDocument(document)) {
      throw new NotFoundException(`Usuário com CPF ${document} já cadastrado`);
    }

    if (await this.usersRepository.findByPhone(phone)) {
      throw new NotFoundException(
        `Usuário com telefone ${phone} já cadastrado`,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    return this.usersRepository.create(data);
  }

  async authenticate(registerUserDto: AuthenticateDto) {
    const { email, password } = registerUserDto;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    // Aqui você pode gerar e retornar um token JWT, se quiser.
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

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPassword = hashedPassword;

    return this.usersRepository.update(user.id, {
      password: newPassword,
      email,
    });
  }
}
