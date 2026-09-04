import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async requestRegistration(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    const signupToken = this.jwtService.sign({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: hashedPassword,
      code: codeHash,
    });

    await this.mailService.sendVerificationCode(createUserDto.email, code);

    return {
      message: 'Verification code sent to email',
      signupToken,
    };
  }

  async confirmRegistration(userCode: string, signupToken: string) {
    type payload = {
      name: string;
      email: string;
      passwordHash: string;
      code: string;
    };

    let payload: payload;

    try {
      payload = this.jwtService.verify(signupToken);
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }

    const isCodeValid = await bcrypt.compare(userCode, payload.code);
    
    if (!isCodeValid) {
      throw new BadRequestException('Incorrect verification code');
    }

    const newUser = this.userRepository.create({
      name: payload.name,
      email: payload.email,
      password: payload.passwordHash,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }
}
