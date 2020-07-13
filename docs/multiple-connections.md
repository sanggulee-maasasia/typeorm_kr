# 다중 connection, 데이터베이스, 스키마 그리고 이중화 설정

- [다중 connections 사용](#다중-connections-사용)
- [다중 데이터베이스에 단일 connection 사용](#다중-데이터베이스에-단일-connection-사용)
- [다중 스키마에 단일 connection 사용](#다중-스키마에-단일-connection-사용)
- [이중화](#이중화)

## 다중 connections 사용

다중 데이터베이스를 사용하는 가장 간단한 방법은 다른 connection을 만드는 것 입니다 :

```typescript
import { createConnections } from 'typeorm';

const connections = await createConnections([
  {
    name: 'db1Connection',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin',
    database: 'db1',
    entities: [__dirname + '/entity/*{.js,.ts}'],
    synchronize: true,
  },
  {
    name: 'db2Connection',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin',
    database: 'db2',
    entities: [__dirname + '/entity/*{.js,.ts}'],
    synchronize: true,
  },
]);
```

이 방법은 가지고있는 수만큼의 데이터베이스에 연결할 수 있도록 해주고, 데이터베이스들은 각각 자기만의 configuration, entities, ORM scope, setting을 가지게 해줍니다.

각 connection마다 새로운 `Connection` 인스턴스가 만들어집니다. 생성되는 각 connection은 고유한 이름을 가져야합니다.

연결 옵션은 ormconfig 파일에서도 또한 불러올 수 있습니다. ormconfig 파일에서 모든 connection을 불러 올 수도 있습니다 :

```typescript
import { createConnections } from 'typeorm';

const connections = await createConnections();
```

아니면 이름을 사용하여 연결을 지정할 수 있습니다 :

```typescript
import { createConnection } from 'typeorm';

const connection = await createConnection('db2Connection');
```

connection 작업시 특정 connection을 얻으려면 이름을 지정해야 합니다 :

```typescript
import { getConnection } from 'typeorm';

const db1Connection = getConnection('db1Connection');
// "db1" 데이터베이스가 작동중 ...

const db2Connection = getConnection('db2Connection');
// "db2" 데이터베이스가 작동중 ...
```

이 방법을 사용하면 서로 다른 로그인 인증, 호스트, 포트 및 데이터베이스 유형 자체를 사용하여 다중 연결을 구성할 수 있다는 이점이 있습니다.
단점은 다중 connection 인스턴스를 관리하고 작업해야 한다는 것 입니다.

## 다중 데이터베이스에 단일 connection 사용

다중 connections를 만들지 않고 단일 connection에서 다중 데이터베이스를 사용 하려는 경우, 사용하려는 엔티티마다 데이터베이스 이름을 지정할 수 있습니다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'secondDB' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'thirdDB' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
}
```

`User` 엔티티는 `secondDB` 데이터베이스에, `Photo` 엔티티는 `thirdDB` 데이터베이스 안에 생성될 것 입니다. 다른 엔티티는 기본 connection 데이터베이스에 생성 됩니다.

다른 데이터베이스에서 데이터를 가져오고 싶다면 엔티티만 제공하면 됩니다 :

```typescript
const users = await connection
  .createQueryBuilder()
  .select()
  .from(User, 'user')
  .addFrom(Photo, 'photo')
  .andWhere('photo.userId = user.id')
  .getMany(); // userId는 데이터베이스간 요청으로 외래키가 아닙니다.
```

이 코드는 다음 sql 쿼리를 생성합니다 (데이터베이스 타입에 따라 다를 수 있음).

```sql
SELECT * FROM "secondDB"."user" "user", "thirdDB"."photo" "photo"
    WHERE "photo"."userId" = "user"."id"
```

엔티티 대신에 테이블 경로를 지정할 수도 있습니다:

```typescript
const users = await connection
  .createQueryBuilder()
  .select()
  .from('secondDB.user', 'user')
  .addFrom('thirdDB.photo', 'photo')
  .andWhere('photo.userId = user.id')
  .getMany(); // userId는 데이터베이스간 요청으로 외래키가 아닙니다.
```

이 기능은 mysql, mssql 데이터베이스에서만 지원됩니다.

## 다중 스키마에 단일 connection 사용

애플리케이션에서 다중 스키마를 사용 할 수 있습니다. 각 엔티티에 `schema` 를 설정하세요 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'secondSchema' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'thirdSchema' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
}
```

`User` 엔티티는 `secondSchema`, `Photo` 엔티티는 `thirdSchema` 에 생성 됩니다. 다른 엔티티들은 기본 connection 스키마에 생성 됩니다.

다른 스키마에서 데이터를 가져오고 싶다면 엔티티만 제공하면 됩니다 :

```typescript
const users = await connection
  .createQueryBuilder()
  .select()
  .from(User, 'user')
  .addFrom(Photo, 'photo')
  .andWhere('photo.userId = user.id')
  .getMany(); // userId는 데이터베이스간 요청으로 외래키가 아닙니다.
```

이 코드는 다음 sql 쿼리를 생성합니다 (데이터베이스 타입에 따라 다를 수 있음) :

```sql
SELECT * FROM "secondSchema"."question" "question", "thirdSchema"."photo" "photo"
    WHERE "photo"."userId" = "user"."id"
```

엔티티 대신에 테이블 경로를 지정할 수도 있습니다:

```typescript
const users = await connection
  .createQueryBuilder()
  .select()
  .from('secondSchema.user', 'user') // mssql에서는 데이터베이스도 지정할 수 있습니다 : secondDB.secondSchema.user
  .addFrom('thirdSchema.photo', 'photo') // mssql에서는 데이터베이스도 지정할 수 있습니다 : thirdDB.thirdSchema.photo
  .andWhere('photo.userId = user.id')
  .getMany();
```

이 기능은 postgres, mssql 데이터베이스에서만 지원됩니다.
mssql에서는 데이터베이스와 스키마를 결합할 수도 있습니다. 예시 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ database: 'secondDB', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

## 이중화

TypeORM을 이용하여 읽기/쓰기 이중화를 설정할 수 있습니다.
이중화 연결 설정 예시 :

```typescript
{
  type: "mysql",
  logging: true,
  replication: {
    master: {
      host: "server1",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    },
    slaves: [{
      host: "server2",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    }, {
      host: "server3",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    }]
  }
}
```

모든 스키마 업데이트 및 쓰기 작업은 `master` 서버를 사용하여 수행 됩니다. find 메소드나 queryBuilder로 수행되는 간단한 쿼리들은 임의의 `slave` 인스턴스를 사용합니다.

queryBuilder에서 작성된 SELECT에서 명시적으로 master를 사용하려면 다음 코드를 사용하세요 :

```typescript
const masterQueryRunner = connection.createQueryRunner('master');
try {
  const postsFromMaster = await connection.createQueryBuilder(Post, 'post').setQueryRunner(masterQueryRunner).getMany();
} finally {
  await masterQueryRunner.release();
}
```

queryBuilder에서 작성된 SELECT에서 명시적으로 master를 사용하려면 다음 코드를 사용하세요 :

`QueryRunner` 에 의해 생성된 연결을 명시적으로 해제해야 한다는 것에 유의하세요.
이중화는 mysql, postgres, sql server 데이터베이스에서 지원됩니다.

Mysql은 심층 구성(deep configuration)을 지원합니다 :

```typescript
{
  replication: {
    master: {
      host: "server1",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    },
    slaves: [{
      host: "server2",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    }, {
      host: "server3",
      port: 3306,
      username: "test",
      password: "test",
      database: "test"
    }],

    /**
    * true라면, 연결에 실패했을 때 PoolCluster가 재연결을 시도합니다. (기본값: true)
    */
    canRetry: true,

    /**
     * 연결에 실패하면, node의 errorCount를 증가시킵니다.
     * errorCount가 removeNodeErrorCount보다 높아지면, PoolCluster에서 해당 node를 삭제합니다. (기본값: 5)
     */
    removeNodeErrorCount: 5,

    /**
     * 연결에 실패하면, 다른 연결을 시도하기 전의 시간(밀리초)를 지정하세요.
     * 만약 0이라면, 노드가 대신 제거되고 다시 사용되지 않습니다.(기본값: 0)
     */
     restoreNodeTimeout: 0,

    /**
     * slave 선택 방법 결정:
     * RR: 하나씩 번갈아가면서 지정합니다. (Round-Robin).
     * RANDOM: 랜덤 함수로 노드를 지정합니다.
     * ORDER: 사용할 수 있는 가장 첫번째 노드를 사용합니다.
     */
    selector: "RR"
  }
}
```
