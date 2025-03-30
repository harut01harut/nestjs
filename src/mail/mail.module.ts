import { Global, Module } from '@nestjs/common';
import { MailService } from './provider/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { strict } from 'assert';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
        inject: [ConfigService],
        useFactory: async (
            config: ConfigService,
        ) => ({
            transport: {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'emil40@ethereal.email',
                    pass: 'sMFkuwmSJJtDSQHCbu',
                },
                default: {
                    from:  `My Blog <no-replay@nestjs-blog.com>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new EjsAdapter(),
                    options: {
                        strict: false,
                    }
                }
            }
        })
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
