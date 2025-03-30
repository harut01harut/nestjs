import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appCreate } from 'src/app.create';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { bootstrapApp } from 'test/helpers/bootstrap-nest-app';
import { completeUser, missingEmail, missingFirstName, missingPassword } from './users.post.e2e-spec.sample-data';


describe('[Users] @Post Endpoints', () => {
    let app: INestApplication<App>;
    let config: ConfigService
    let httpServer: App;

  beforeEach(async () => {
    // Instantiatig the app
    app = await bootstrapApp();
    // Extract the config
    config = app.get<ConfigService>(ConfigService)
    
    httpServer = app.getHttpServer();

  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  })

  it('/users - Endpoint is public', () => {
    return request(httpServer)
        .post('/users')
        .send({})
        .expect(400);
  });
  it('/users - firstName is mandatory', () => {
    return request(httpServer)
        .post('/users')
        .send(missingFirstName)
        .expect(400);
  });

  it('/users - email is mandatory', () => {
    return request(httpServer)
        .post('/users')
        .send(missingEmail)
        .expect(400);
  });
  it('/users - password is mandatory', () => {
    return request(httpServer)
        .post('/users')
        .send(missingPassword)
        .expect(400);
  });
  it('/users - Valid request successfully creates user', () => {
    return request(httpServer)
        .post('/users')
        .send(completeUser)
        .expect(201)
        .then(({body}) => {
            expect(body).toBeDefined();
            expect(body.data).toBeDefined();
            expect(body.data.firstName).toBe(completeUser.firstName);
            expect(body.data.lastName).toBe(completeUser.lastName);
            expect(body.data.email).toBe(completeUser.email);
        })
  });
  it('/users - password is not returned in response', () => {
    return request(httpServer)
        .post('/users')
        .send(completeUser)
        .expect(201)
        .then(({body}) => {
            expect(body.data.password).toBeUndefined();
        })
  });
  it('/users - googleId is not returned in response', () => {
    return request(httpServer)
        .post('/users')
        .send(completeUser)
        .expect(201)
        .then(({body}) => {
            expect(body.data.googleId).toBeUndefined();
        })
  });
});
