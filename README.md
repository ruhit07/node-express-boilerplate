# A boilerplate for building RESTful APIs using Node.js, Express.js and MongoDB

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone https://github.com/ruhit07/node-express-boilerplate.git
cd node-express-boilerplate
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```
## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com/docs/) sql query builder using [mongoose](https://mongoosejs.com/)
- **Authentication**: using [jsonwebtoken](https://jwt.io)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [morgan](https://github.com/expressjs/morgan)
- **Error handling**: centralized error handling mechanism
- **Dependency management**: with [Npm](https://docs.npmjs.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io), HTTP parameter pollution attacks using [hpp](https://github.com/analog-nico/hpp) and sanitizes user-supplied data using [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
- **CORS**: cross-origin resource-sharing enabled using [cors](https://github.com/expressjs/cors)

## Commands

Running locally:

```bash
npm run dev
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
NODE_ENV = development
PORT = 5000

MONGO_URI = mongodb://localhost:27017/test

JWT_SECRET=gsdhgfhdgshgh4g54b5s4fg5
JWT_EXPIRE=1d
JWT_COOKIE_EXPIRE=1
```

## Project Structure
```
|--config\               # Environment variables and configuration related things
|--controllers\          # Controller layer
|--enums\                # Common enum values
|--middlewares\          # Custom express middlewares
|--model\                # Modules
|--routes\               # Routes
|--utils\                # Utility classes and functions
|--validations\          # Request data validation schemas
|--server.js             # App entry point
```

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/v1/auth/register` - register\
`POST /api/v1/auth/login` - login\
`DELETE /api/v1/auth/logout` - logout\
`GET /api/v1/auth/me` - retriving his profile\
`DELETE /api/v1/auth/me` - delete currect user\
`PUT /api/v1/auth/updatedetails` - update his details\
`PUT /api/v1/auth/updatepassword` - update his password


**User routes**:\
`GET /api/v1/users` - get all users\
`GET /api/v1/users/:id` - get user\
`POST /api/v1/users` - create a user\
`PUT /api/v1/users/:id` - update user\
`PATCH /api/v1/users/update-password/:id` - update password\
`DELETE /api/v1/users/:id` - delete user
