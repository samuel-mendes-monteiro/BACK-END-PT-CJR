import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}




  // REGISTRO / CADASTRO
  async register(registerDto: RegisterDto) {

    const { nome, username, email, senha } = registerDto; 

    const salt = await bcrypt.genSalt();
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    /* 
      --- ESPAÇO PARA BANCO DE DADOS ---
      
    */

    return { 
      message: 'Usuário cadastrado com sucesso!',
      dadosProcessados: { nome, username, email, senhaCriptografada } 
    };
  }








  // LOGIN
  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    /* 
      --- ESPAÇO DO BANCO DE DADOS ---
      
    */




    // USUÁRIO FALSO PARA TESTAR (senha "123456")
    const usuarioTESTE = { 
      id: 1, 
      email: 'teste@teste.com', 
      senhaDoBanco: await bcrypt.hash('123456', 10) 
    };

    // Simulando erro se o email não bater
    if (email !== usuarioTESTE.email) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 2. Compara a senha digitada com a senha do banco
    const senhaValida = await bcrypt.compare(senha, usuarioTESTE.senhaDoBanco);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera o Token 
    const payload = { email: usuarioTESTE.email, sub: usuarioTESTE.id };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}