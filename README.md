## Description

Credit Limit Validation Service application

## Installation

```bash
$ npm i
```

## Running the app

```bash
# development with env
$ STAGE=dev nest start

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# running postgres
$ docker run --name vegapay-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

## Test

```bash
# api testing via postman
$ postman collection present in the root of the project (Vegapay.postman_collection.json)
# unit tests
$ npm run test
```

## Stay in touch

- Author - [Rishabh Sharma](https://github.com/Rishabhltfb)
- Linkedin - [Linkedin Profile Link](https://www.linkedin.com/in/rishabhltfb/)
- Twitter - [@Rishabh_ltfb](https://twitter.com/Rishabh_ltfb)

## License

Nest is [MIT licensed](LICENSE).
