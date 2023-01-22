// Write your tests here
const server = require('./server.js');
const request = require('supertest');
const db = require('../data/dbConfig');

beforeAll(async () => {
  // await db('users').truncate();
  await db.migrate.rollback();
  await db.migrate.latest();

})

afterAll(async () => {
  await db.destroy();
})

describe('testing the api endpoints', () => {
  
  describe('testing the auth register endpoint', () => {
    it('missing password returns "username and password required"', async () => {
      const response = await request(server).post('/api/auth/register').send({username: 'manny'}).expect({message: "username and password required"});
    });

    it('check that new user is added to the database', async () => {
      let users = await db('users');
      expect(users).toHaveLength(0);
      const response = await request(server).post('/api/auth/register').send({username: 'manny', password: 'mypassword'})
      users = await db('users');
      expect(users).toHaveLength(1);
    })

    it('check that user is not added if username exists', async () => {
      const response = await request(server).post('/api/auth/register').send({username: 'manny', password: 'mypassword'});
      let users = await db('users');
      expect(users).toHaveLength(1);
      const newResponse = await request(server).post('/api/auth/register').send({username: 'manny', password: 'mypassword'}).expect({message: 'username taken'});
      users = await db('users');
      expect(users).toHaveLength(1);
    });
  });

  describe('Testing the auth login endpoint', () => {
    it('missing password or username returns "username and password required"', async () => {
      const response = await request(server).post('/api/auth/login').send({username: 'manny'}).expect({message: "username and password required"});
    });

    it('missing password or username returns appropriate status code', async () => {
      const response = await request(server).post('/api/auth/login').send({username: 'manny'}).expect(400);
    });

    it('Successfull login sends appropriate status code', async () => {
      const response1 = await request(server).post('/api/auth/register').send({username: 'manny', password: 'mypassword'})
      const response2 = await request(server).post('/api/auth/login').send({username: 'manny', password: 'mypassword'}).expect(200);
    });

    it('Sends invalid credentials if password is incorrect', async () => {
      const response1 = await request(server).post('/api/auth/register').send({username: 'manny', password: 'mypassword'})
      const response2 = await request(server).post('/api/auth/login').send({username: 'manny', password: 'mypasswordddd'}).expect({message: "invalid credentials"});
    });
  })
})
