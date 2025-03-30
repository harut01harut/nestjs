import { INestApplication } from "@nestjs/common";
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

export function appCreate (app: INestApplication): void {
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      }))
    
      const swaggerConfig = new DocumentBuilder()
      .setTitle('Nestjs mastercalss')
      .setDescription('awdawdawd')
      .setTermsOfService('http://localhost:3000/term')
      .setLicense('MIT license', 'http://localhost:3000/term')
      .setVersion('1.0')
      .build();
    
      const document = SwaggerModule
      .createDocument(app, swaggerConfig);
      
      SwaggerModule.setup('api', app, document)
    
      // Setup the aws sdk used 
      // uploading the file to aws s3 bucket
      const configService = app.get(ConfigService);
      config.update({
        credentials: {
          accessKeyId: configService.get('appConfig.awsAccessKeyId') || '',
          secretAccessKey: configService.get('appConfig.awsSecretAccessKey') || '',
        },
        region: configService.get('appConfig.awsRegion') || '',
      })
    
      //enable cors
      app.enableCors();
}