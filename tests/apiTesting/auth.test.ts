import request = require("supertest");
import server = require("../../src/app");

describe('POST /signup',  () => {

    it('if user exists should return a 409', async () => {

        const response = await request(server.app.app)
            .post('/api/auth/signup')
            .send({
                firstName: "Will",
                lastName: "Smith",
                email: "will_smith@gmail.com",
                password: "Will$Smith",
                confirmPassword: "Will$Smith"
            })
            .set('Accept', 'application/json');

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(409);

    });

});

describe('POST /login',  () => {

    it('if email not exists should return a 422', async () => {

        const response = await request(server.app.app)
            .post('/api/auth/login')
            .send({
                email: "non-existent@gmail.com",
                password: "qwerty"
            })
            .set('Accept', 'application/json');

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(422);

    });

});