# 연결(Connection) 작업

- [`Connection` 이란](#connection-이란)
- [연결(connection) 생성](<#연결(connection)-생성>)
- [`연결 관리자(ConnectionManager)` 사용](<#연결-관리자(ConnectionManager)-사용>)
- [연결(connection) 작업](<#연결(connection)-작업하기>)

## `Connection` 이란

데이터베이스와의 상호작용은 데이터베이스 연결을 설정한 후에만 가능합니다. TypeORM의 `Connection`은 데이터베이스 연결을 설정하지 않고 대신 연결 풀(connection pool)을 설정합니다. 실제 데이터베이스 연결에 관심이 있다면, `QueryRunner` 문서를 참조하세요. `QueryRunner` 의 각 인스턴스는 별도의 분리된 데이터베이스 연결입니다.
`Connection` 의 `connect` 함수가 실행되면 연결 풀 설정이 완료됩니다. `createConnection` 함수를 이용하여 connection을 설정하면 `connect` 함수가 자동으로 호출됩니다. `close`가 호출되면 connection을 해제(모든 연결의 풀을 닫음)합니다. 일반적으로, 앱에서 한번만 connection을 만들고 데이터베이스 작업을 완전히 마친후에는 connection을 닫아야합니다.
실제로, 사이트에 대한 백엔드를 만들고 백엔드 서버가 항상 구동중이라면 connection을 닫지 않아야합니다.

## 연결(connection) 생성

연결을 만드는 방법은 여러가지가 있습니다. 그중 가장 간단하고 일반적인 방법은 `createConnection` 과 `createConnections` 함수를 사용하는 것입니다.

`createConnection` 은 단일 연결을 만듭니다 :

```typescript
import { createConnection, Connection } from 'typeorm';

const connection = await createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
});
```

단일 `url` 속성과 `type` 속성도 함께 사용할 수 있습니다.

```js
createConnection({
  type: 'postgres',
  url: 'postgres://test:test@localhost/test',
});
```

`createConnections` 은 다중 연결을 만듭니다 :

```typescript
import { createConnections, Connection } from 'typeorm';

const connections = await createConnections([
  {
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'test',
  },
  {
    name: 'test2-connection',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'test2',
  },
]);
```

이 두 함수는 사용자가 설정한 연결을 기반으로 `Connection`을 만들고 `connect` 함수를 호출합니다.
프로젝트의 루트에 [ormconfig.json](./using-ormconfig.md) 파일을 만들 수 있으며 이러한 방법으로 연결 옵션이 이 파일에서 자동으로 읽힙니다. 프로젝트의 루트는 `node_modules` 디렉토리와 같은 레벨에 위치합니다.

```typescript
import { createConnection, createConnections, Connection } from 'typeorm';

// ormconfig 파일이나, 특별한 환경 변수에서
// createConnection이 연결 옵션을 로드합니다.
// ormconfig.json / ormconfig.js / ormconfig.yml / ormconfig.env / ormconfig.xml
const connection: Connection = await createConnection();

// 생성할 connection의 이름을 정할 수 있습니다.
// (이름을 생략하면 이름이 정해지지 않은 connection이 생성됩니다.)
const secondConnection: Connection = await createConnection('test2-connection');

// createConnections 가 createConnection 대신에 호출되는 경우
// ormconfig 파일에 정의된 모든 connection을 초기화하고 반환합니다.
const connections: Connection[] = await createConnections();
```

connection은 각자 이름이 달라야합니다. connection의 이름을 정하지 않은 경우 이름은 `default`가 됩니다. 일반적으로 다중 데이터베이스나 여러 연결 구성을 사용한다면 다중 connection을 사용하세요.

connection을 한번 만들어두면 `getConnection` 함수를 이용하여 앱 어디에서나 접근할 수 있습니다 :

```typescript
import { getConnection } from 'typeorm';

// createConnection 이 호출되어 해결되면 사용할 수 있습니다.
const connection = getConnection();

// 여러개의 connection을 사용중이라면 connection의 이름으로 접근할 수 있습니다.
const secondConnection = getConnection('test2-connection');
```

connection을 저장하고 관리하기 위해 추가 클래스 / 서비스를 만들지 마세요.
이 기능은 이미 TypeORM에 내장되어 있으므로 과도한 엔지니어링을 수행하고 쓸모없는 추상화를 할 필요가 없습니다.

## `연결 관리자(ConnectionManager)` 사용

`ConnectionManager` 클래스를 사용해 connection을 만들 수 있습니다. 예를 들면 다음과 같습니다 :

```typescript
import { getConnectionManager, ConnectionManager, Connection } from 'typeorm';

const connectionManager = getConnectionManager();
const connection = connectionManager.create({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
});
await connection.connect(); // 연결 수행
```

이것은 connection을 만드는 일반적인 방법은 아니지만, 일부 사용자에게 유용할 수 있습니다. 예를 들어, connection을 만들고 인스턴스를 저장하지만, 실제 "connection"이 설정되는 시기를 제어해야하는 사용자의 경우. 또한 connectionManager를 생성하고 유지할 수 있습니다 :

```typescript
import { getConnectionManager, ConnectionManager, Connection } from 'typeorm';

const connectionManager = new ConnectionManager();
const connection = connectionManager.create({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
});
await connection.connect(); // 연결 수행
```

그러나 이 방법으로는 더이상 `getConnection()` 을 사용할 수 없습니다. 연결 관리자 인스턴스를 저장하고 `connectionManager.get` 을 사용하여 원하는 connection을 얻으십시오.

일반적으로 이방법을 피하고 애플리케이션에서 불필요한 복잡성을 방지하십시오. connectionManager는 정말로 필요하다고 생각되는 경우에만 사용하십시오.

## 연결(connection) 작업하기

연결을 설정하면, `getConnection` 함수를 통해 앱 어디에서나 connection을 사용할 수 있습니다 :

```typescript
import { getConnection } from 'typeorm';
import { User } from '../entity/User';

export class UserController {
  @Get('/users')
  getAll() {
    return getConnection().manager.find(User);
  }
}
```

`ConnectionManager#get` 으로도 connection을 얻을수 있지만, 대부분의 경우에는 `getConnection()` 으로도 충분히 connection을 얻을 수 있습니다.

connection을 사용하여 엔티티, 특히 connection의 `EntityManager` 및 `Repository`를 사용하여 데이터베이스 작업을 실행하십시오. 자세한 내용은 [Entity Manager and Repository](../entityManagerAndRepository/working-with-entity-manager.md) 설명서를 참조하십시오.

그러나 일반적으로, `connection`은 많이 사용하지 않습니다. 대부분의 경우 connection 객체를 직접 사용하지 않고 `getRepository()` 나 `getManager()` 를 사용하여 connection manager나 repository에 접근할 수 있습니다.

```typescript
import { getManager, getRepository } from 'typeorm';
import { User } from '../entity/User';

export class UserController {
  @Get('/users')
  getAll() {
    return getManager().find(User);
  }

  @Get('/users/:id')
  getAll(@Param('id') userId: number) {
    return getRepository(User).findOne(userId);
  }
}
```
