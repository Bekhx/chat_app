const app = require('./package.json');

module.exports = {
    openapi: "3.0.3",
    info: {
        version: `${app.version}`,
        title: "Swagger UI for Chat app",
        description: "This documentation for chat app application. Made by using nodejs, expressjs, typescript. For authorization, you have a token that can be obtained from the API login or after signup operation.",
        termsOfService: "Soon...",
        license: {
            name: "MIT",
            url: "https://openseource.org/licenses/MIT"
        }
    },
    servers: [
        {
            url: `http://${process.env.HOST}:${process.env.PORT}/api`,
            description: "Local server"
        },
        {
            url: "Soon...",
            description: "Testing server"
        },
        {
            url: "Soon...",
            description: "Production server"
        }
    ],
    tags: [
        {
            name: "Auth",
            description: "User methods for interaction with user entity"
        },
        {
            name: "Chat",
            description: "Chat methods for interaction with chat entity"
        }
    ],
    "paths": require('./swagger/path'),
    components: {
        schemas: require('./swagger/components'),
        securitySchemes: {
            Bearer: {
                type: "apiKey",
                in: "header",
                name: "authorization",
                description: ""
            }
        }
    }
}