## Global node js packages
```bash
$ npm install -g ts-node@10.5.0
$ npm install -g nodemon
$ npm install -g db-migrate
$ npm install -g db-migrate-pg
```

## Important!
Before starting, install docker-compose to your machine and start docker containers:
```bash
$ docker-compose up
```

## Environment
* need create .env file
* example: .env.sample

## Migrate database
```bash
# Create tables
$ npm run up
# Delete tables
$ npm run down
```

## Start project
```bash
$ npm install
$ npm run start:dev
```

## Swagger documentation
* http://host:port/swagger

## Socket.io api
* ws://host:port/chat
  - Headers:
    - authorization
  - Events. Listen on connect.
    - msg_receive
    - error
  - Sending messages
    - Event send message:
      - msg_send
    - Event send file:
      - msg_send:file

### [Introduction video link for testing socket.io api via Postman](https://youtu.be/H-7EZVj9D-k)

## Examples socket.io api
Message send: type JSON
```json
{
    "room": "2d52e031-7039-48bb-8052-056649670bd1",
    "interlocutorId": 2,
    "message": "Hi, I'm Robert Deniro"
}
```
Message receive: type JSON
```json
{
    "id": 10,
    "room": "2d52e031-7039-48bb-8052-056649670bd1",
    "date": "2022-08-09T09:55:22.753Z",
    "message": "Hi, I'm Robert Deniro",
    "filePath": null,
    "from": 4,
    "to": 2
}
```

File send: type JSON
```json
{
    "room": "2d52e031-7039-48bb-8052-056649670bd1",
    "interlocutorId": 2,
    "file": "text file",
    "extension": "txt"
}
```
File receive: type JSON
```json
{
    "id": 9,
    "room": "2d52e031-7039-48bb-8052-056649670bd1",
    "date": "2022-08-09T08:15:59.816Z",
    "message": null,
    "filePath": "http://localhost:8050/files/a39d83eb-ad2d-4182-a270-5c576d29e340.txt",
    "from": 4,
    "to": 2
}
```