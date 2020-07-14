# TypeORM와 Express를 함께 사용하는 예제

- [초기 설정](#초기-설정)
- [응용 프로그램에 Express 추가](#응용-프로그램에-Express-추가)
- [응용 프로그램에 TypeORM 추가](#응용-프로그램에-TypeORM-추가)

## 초기 설정

데이터베이스에 사용자를 저장하고 웹 api 내의 id별 단일 사용자 뿐만 아니라 모든 사용자 목록을 작성,
업데이트,제거 및 로드할 수 있는 "user"라는 간단한 응용프로그램을 만들겠습니다.

먼저, "user"라는 디렉토리를 만듭니다 :

```
mkdir user
```

그런 다음 디렉토리로 전환하고 새 프로젝트를 만듭니다 :

```
cd user
npm init
```

필요한 모든 앱 정보를 입력하여 초기화 프로세스를 완료합니다.

이제 TypeScript 컴파일러를 설치하고 설정해야 합니다 :

```
npm i typescript --save-dev
```

그런 다음 응용프로그램을 컴파일하고 실행하는데 필요한 구성이 포함된 `tsconfig.json` 파일을 만듭니다.
즐겨찾는 편집기를 사용하여 만들고 다음 구성을 추가합니다:

```json
{
  "compilerOptions": {
    "lib": ["es5", "es6", "dom"],
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

이제 `src` 디렉토리 안에 메인 에플리케이션 엔드포인트 - `app.ts`를 만들어 보겠습니다 :

```
mkdir src
cd src
touch app.ts
```

여기에 간단한 `console.log`를 추가합니다:

```typescript
console.log('Application is up and running');
```

이제 애플리케이션을 실행할 때입니다. 이 프로그램을 실행하려면 먼저 typescript 프로젝트를 컴파일해야 합니다 :

```
tsc
```

이 파일을 컴파일하면 `src/app.js` 파일이 생성되어야 합니다. 다음을 사용하여 실행할 수 있습니다:

```
node src/app.js
```

응용 프로그램을 실행한 직후 콘솔에 "Application is up and running" 메시지가 표시됩니다.

파일을 변경할 때마다 파일을 컴파일해야 합니다.
또는 매번 수동으로 컴파일되지 않도록 watcher를 설정하거나 [ts-node](https://github.com/TypeStrong/ts-node)를 설치할 수 있습니다.

## 응용 프로그램에 Express 추가

어플리케이션에 익스프레스를 추가하겠습니다. 먼저 필요한 패키지를 설치합니다 :

```
npm i express  @types/express --save
```

- `express` 는 익스프레스 엔진 그 자체입니다. 웹 API를 만들 수 있습니다.
- `@types/express` 는 익스프레스 사용 시 형식 정보를 가지는 데 사용됩니다.

src/app.ts 파일을 편집하고 Express 관련 로직을 추가합니다 :

```typescript
import * as express from 'express';
import { Request, Response } from 'express';

// create and setup express app
const app = express();
app.use(express.json());

// register routes

app.get('/users', function (req: Request, res: Response) {
  // here we will have logic to return all users
});

app.get('/users/:id', function (req: Request, res: Response) {
  // here we will have logic to return user by id
});

app.post('/users', function (req: Request, res: Response) {
  // here we will have logic to save a user
});

app.put('/users/:id', function (req: Request, res: Response) {
  // here we will have logic to update a user by a given user id
});

app.delete('/users/:id', function (req: Request, res: Response) {
  // here we will have logic to delete a user by a given user id
});

// start express server
app.listen(3000);
```

이제 프로젝트를 컴파일하고 실행할 수 있습니다. 지금 작업 경로가 있는 익스프레스 서버가 실행 중이어야 합니다.
그러나 해당 라우트는 아직 콘텐츠를 반환하지 않습니다.

## 응용 프로그램에 TypeORM 추가

마지막으로 응용 프로그램에 TypeORM을 추가합니다. 이 예에서는 `mysql` 드라이버를 사용합니다.
다른 드라이버에 대한 설정 프로세스는 유사합니다.

먼저 필요한 패키지를 설치합니다:

```
npm i typeorm mysql reflect-metadata --save
```

- `typeorm` 은 typeorm 패키지 그 자체입니다.
- `mysql` 은 기본 데이터베이스 드라이버입니다. 다른 데이터베이스 시스템을 사용하는 경우
  적절한 패키지를 설치해야 합니다.
- `reflect-metadata` 은 데코레이터가 올바르게 작업할 수 있도록 하기 위해 필요합니다.

이제 사용할 데이터베이스 연결 구성으로 `ormconfig.json`을 만들겠습니다.

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "test",
  "password": "test",
  "database": "test",
  "entities": ["src/entity/*.js"],
  "logging": true,
  "synchronize": true
}
```

필요에 따라 각 옵션을 구성합니다. [connection options](./connection-options.md)에 대해 자세히 알아봅니다.

`src/entity` 내에 `User` 엔티티를 만듭니다:

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

`src/app.ts`를 변경합니다:

```typescript
import * as express from 'express';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { User } from './entity/User';

// create typeorm connection
createConnection().then((connection) => {
  const userRepository = connection.getRepository(User);

  // create and setup express app
  const app = express();
  app.use(express.json());

  // register routes

  app.get('/users', async function (req: Request, res: Response) {
    const users = await userRepository.find();
    res.json(users);
  });

  app.get('/users/:id', async function (req: Request, res: Response) {
    const results = await userRepository.findOne(req.params.id);
    return res.send(results);
  });

  app.post('/users', async function (req: Request, res: Response) {
    const user = await userRepository.create(req.body);
    const results = await userRepository.save(user);
    return res.send(results);
  });

  app.put('/users/:id', async function (req: Request, res: Response) {
    const user = await userRepository.findOne(req.params.id);
    userRepository.merge(user, req.body);
    const results = await userRepository.save(user);
    return res.send(results);
  });

  app.delete('/users/:id', async function (req: Request, res: Response) {
    const results = await userRepository.delete(req.params.id);
    return res.send(results);
  });

  // start express server
  app.listen(3000);
});
```

작업 콜백을 별도의 파일로 추출하고 연결 `instance`가 필요한 경우 `getConnection`을 사용하면 됩니다:

```typescript
import { getConnection } from 'typeorm';
import { User } from './entity/User';

export function UsersListAction(req: Request, res: Response) {
  return getConnection().getRepository(User).find();
}
```

이 예에서는 `getConnection`이 필요하지 않습니다. `getRepository` 함수를 직접 사용할 수 있습니다:

```typescript
import { getRepository } from 'typeorm';
import { User } from './entity/User';

export function UsersListAction(req: Request, res: Response) {
  return getRepository(User).find();
}
```
