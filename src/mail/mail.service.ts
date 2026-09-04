import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Seu código de confirmação - AutoChime',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333333; text-align: center;">Bem-vindo ao AutoChime!</h2>
            <p style="color: #666666; font-size: 16px;">Para prosseguir com a criação da sua conta, utilize o código de verificação abaixo:</p>
            
            <div style="background-color: #f4f5f7; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4F46E5;">${code}</span>
            </div>

            <p style="color: #888888; font-size: 14px; text-align: center;">Este código expira em <strong>10 minutos</strong>.</p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            <p style="color: #999999; font-size: 12px; text-align: center;">Se você não solicitou este código, basta ignorar este e-mail.</p>
          </div>
        `,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Falha ao enviar o e-mail de verificação. Verifique as credenciais SMTP.',
      );
    }
  }
}