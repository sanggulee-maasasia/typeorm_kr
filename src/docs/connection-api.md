# 연결 API

- [메인 API](#메인-api)
- [`Connection` API](#connection-api)
- [`ConnectionManager` API](#connectionmanager-api)

## 메인 API

- `createConnection()` - 새 connection을 생성하고 글로벌 connection manager 에 등록합니다. connection 옵션을 생략하면 `ormconfig` 파일이나 환경변수에서 connection 옵션을 읽어옵니다.

```typescript
import { createConnection } from 'typeorm';

const connection = await createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
});
```

- `createConnections()` - 다중 connection을 생성하고 글로벌 connection manager 에 등록합니다. connection 옵션을 생략하면 ormconfig 파일이나 환경변수에서 connection 옵션을 읽어옵니다.

```typescript
import { createConnections } from 'typeorm';

const connection = await createConnections([
  {
    name: 'connection1',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'test',
  },
  {
    name: 'connection2',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'test',
  },
]);
```

- `getConnectionManager()` - 생성된 모든 connection(`createConnection()` 이나 `createConnections()` 를 사용한)을 저장하는 connection manager를 불러옵니다.

```typescript
import { getConnectionManager } from 'typeorm';

const defaultConnection = getConnectionManager().get('default');
const secondaryConnection = getConnectionManager().get('secondary');
```

- `getConnection()` - `createConnection` 메소드를 사용하여 생성된 connection을 가져옵니다.

```typescript
import { getConnection } from 'typeorm';

const connection = getConnection();
// connection에 이름이 있는 경우 이름을 지정하세요 :
const secondaryConnection = getConnection('secondary-connection');
```

- `getEntityManager()` - connection에서 `EntityManager` 를 가져옵니다. connection 이름을 지정하여 어떤 connection의 entity manager를 선택해야 하는지 나타낼 수 있습니다.

```typescript
import { getEntityManager } from 'typeorm';

const manager = getEntityManager();
// 이제 manager 메소드를 사용할 수 있습니다.

const secondaryManager = getEntityManager('secondary-connection');
// 이제 secondary connection의 manager 메소드를 사용할 수 있습니다.
```

- `getRepository()` - connection에서 `Repository` 를 가져옵니다. connection 이름을 지정하여 어떤 connection의 entity manager를 선택해야 하는지 나타낼 수 있습니다.

```typescript
import { getRepository } from 'typeorm';

const userRepository = getRepository(User);
// 이제 repository 메소드를 사용할 수 있습니다.

const blogRepository = getRepository(Blog, 'secondary-connection');
// 이제 secondary connection의 manager 메소드를 사용할 수 있습니다.
```

- `getTreeRepository()` - connection에서 `TreeRepository` 를 가져옵니다. connection 이름을 지정하여 어떤 connection의 entity manager를 선택해야 하는지 나타낼 수 있습니다.

```typescript
import { getTreeRepository } from 'typeorm';

const userRepository = getTreeRepository(User);
// 이제 repository 메소드를 사용할 수 있습니다.

const blogRepository = getTreeRepository(Blog, 'secondary-connection');
// 이제 secondary connection의 manager 메소드를 사용할 수 있습니다.
```

- `getMongoRepository()` - connection에서 `MongoRepository` 를 가져옵니다. connection 이름을 지정하여 어떤 connection의 entity manager를 선택해야 하는지 나타낼 수 있습니다.

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
// 이제 repository 메소드를 사용할 수 있습니다.

const blogRepository = getMongoRepository(Blog, 'secondary-connection');
// 이제 secondary connection의 manager 메소드를 사용할 수 있습니다.
```

## `Connection` API

- `name` - Connection 이름. 이름없는 connection을 만들었을 경우 그 connection의 이름은 "default"와 같습니다. 다중 connection과 함께 작업하거나 `getConnection(connectionName: string)` 이 호출될 때 사용합니다.

```typescript
const connectionName: string = connection.name;
```

- `options` - 이 connection에서 사용될 Connection 옵션입니다. 자세한 내용은 [Connection Options](./connection-options.md)를 참조하세요.

```typescript
const connectionOptions: ConnectionOptions = connection.options;
// connectionOptions 에서 MysqlConnectionOptions로 캐스트 할 수 있습니다.
// 또는 사용하는 데이터베이스 드라이버에 따라 다른 옵션으로 캐스트 할 수 있습니다.
```

- `isConnected` - 데이터베이스에 대한 실제 연결이 이루어졌는지 여부를 나타냅니다.

```typescript
const isConnected: boolean = connection.isConnected;
```

- `driver` - 이 connection에 사용된 기본 드라이버.

```typescript
const driver: Driver = connection.driver;
// connectionOptions 에서 MysqlDriver로 캐스트 할 수 있습니다.
// 또는 사용하는 데이터베이스 드라이버에 따라 다른 드라이버로 캐스트 할 수 있습니다.
```

- `manager` - `EntityManager` 는 connection entity와 함께 작업하는데 사용됩니다. 더 자세한 내용은 [Entity Manager and Repository](working-with-entity-manager.md)를 참조하세요.

```typescript
const manager: EntityManager = connection.manager;
// manager 메소드를 호출할 수 있습니다. 예를 들면:
const user = await manager.findOne(1);
```

- `mongoManager` - `MongoEntityManager` 는 mongodb connection에서 connection entities와 함께 작업하는데 사용됩니다. MongoEntityManager에 대한 더 자세한 내용은 [MongoDB](./mongodb.md) 문서를 참조하세요.

```typescript
const manager: MongoEntityManager = connection.mongoManager;
// manager나 mongodb-manager 메소드를 호출할 수 있습니다. 예를 들면:
const user = await manager.findOne(1);
```

- `connect` - 데이터베이스에 연결을 수행합니다. `createConnection`을 사용하면 자동으로 `connect` 도 호출되기 때문에 직접 호출할 필요가 없습니다.

```typescript
await connection.connect();
```

- `close` - 데이터베이스와의 연결을 닫습니다. 일반적으로, 애플리케이션이 종료될 때 이 메소드를 호출합니다.

```typescript
await connection.close();
```

- `synchronize` - 데이터베이스 스키마를 동기화합니다. connection 옵션의 값이 `synchronize: true` 일 경우 호출되는 메소드입니다. 일반적으로, 애플리케이션이 실행 될 때 이 메소드를 호출합니다.

```typescript
await connection.synchronize();
```

- `dropDatabase` - 데이터베이스와 모든 데이터를 드랍합니다. 이 메소드를 사용하면 모든 데이터베이스 테이블과 해당 데이터가 지워지므로 프로덕션 시 주의하세요. 데이터베이스와 연결 한 후에만 사용 가능합니다.

```typescript
await connection.dropDatabase();
```

- `runMigrations` - 보류중인 모든 마이그레이션을 실행합니다.

```typescript
await connection.runMigrations();
```

- `undoLastMigrations` - 마지막으로 실행된 마이그레이션을 되돌립니다.

```typescript
await connection.undoLastMigration();
```

- `hasMetadata` - 지정한 엔티티에 대한 메타데이터가 등록 돼 있는지 확인합니다. 자세한 내용은 [Entity Metadata](./entity-metadata.md)를 참조하세요.

```typescript
if (connection.hasMetadata(User)) const userMetadata = connection.getMetadata(User);
```

- `getMetadata` - 지정된 엔티티의 `EntityMetadata` 를 가져옵니다. 테이블 이름을 지정할 수도 있으며, 이러한 테이블 이름을 가진 엔티티 metadata가 발견되면 반환됩니다. 자세한 내용은 [Entity Metadata](./entity-metadata.md)를 참조하세요.

```typescript
const userMetadata = connection.getMetadata(User);
// user 엔티티에 대한 모든 정보를 얻을 수 있습니다.
```

- `getRepository` - 지정된 엔티티의 `Repository` 를 가져옵니다. 테이블 이름을 지정할 수도 있으며, 이러한 테이블 이름을 가진 repository가 발견되면 반환됩니다. 자세한 내용은 [Repositories](working-with-repository.md)를 참조하세요.

```typescript
const repository = connection.getRepository(User);
// repository 메소드를 호출 할 수 있습니다. 예를 들면 :
const users = await repository.findOne(1);
```

- `getTreeRepository` - 지정된 엔티티의 `TreeRepository` 를 가져옵니다. 테이블 이름을 지정할 수도 있으며, 이러한 테이블 이름을 가진 repository가 발견되면 반환됩니다. 자세한 내용은 [Repositories](working-with-repository.md)를 참조하세요.

```typescript
const repository = connection.getTreeRepository(Category);
// tree repository 메소드를 호출 할 수 있습니다. 예를 들면 :
const categories = await repository.findTrees();
```

- `getMongoRepository` - 지정된 엔티티의 `MongoRepository` 를 가져옵니다. 이 repository는 MongoDB connection에 있는 entites에서 사용됩니다. 자세한 내용은 [MongoDB support](./mongodb.md)를 참조하세요.

```typescript
const repository = connection.getMongoRepository(User);
//mongodb-specific repository 메소드를 호출 할 수 있습니다. 예를 들면:
const categoryCursor = repository.createEntityCursor();
const category1 = await categoryCursor.next();
const category2 = await categoryCursor.next();
```

- `getCustomRepository` - 사용자 커스텀 정의 Repository를 가져옵니다. 자세한 내용은 [custom repositories](custom-repository.md)를 참조하세요.

```typescript
const userRepository = connection.getCustomRepository(UserRepository);
// 사용자 정의 repository 안의 메소드를 사용할 수 있음. - UserRepository class
const crazyUsers = await userRepository.findCrazyUsers();
```

- `transaction` - Provides a single transaction where multiple database requests will be executed in a single database transaction.
  Learn more about [Transactions](./transactions.md).

```typescript
await connection.transaction(async (manager) => {
  // NOTE: 지정된 manager 인스턴스를 이용하여 모든 데이터베이스 작업을 완료해야 합니다.
  // 트랜잭션과 함께 작업하는 entityManager의 special instance.
  // await을 사용하는것도 잊지마세요.
});
```

- `query` - Executes a raw SQL query.

```typescript
const rawData = await connection.query(`SELECT * FROM USERS`);
```

- `createQueryBuilder` - queryBuilder를 만듭니다. queryBuilder는 쿼리를 작성할때 사용할 수 있습니다. 자세한 내용은 [QueryBuilder](select-query-builder.md)를 참조하세요.

```typescript
const users = await connection
  .createQueryBuilder()
  .select()
  .from(User, 'user')
  .where('user.name = :name', { name: 'John' })
  .getMany();
```

- `createQueryRunner` - 실제 단일 데이터베이스 connection을 관리하고 작업하는데 사용되는 queryRunner를 만듭니다. 자세한 내용은 [QueryRunner](./query-runner.md)를 참조하세요.

```typescript
const queryRunner = connection.createQueryRunner();

// 실제 데이터베이스 연결을 수행하는 connection을 호출한 후에만 메소드를 사용할 수 있습니다.
await queryRunner.connect();

// ... 이제 query runner와 함께 작업할 수도 있고, 메소드를 호출할 수도 있습니다.

// 매우 중요합니다 - 작업을 끝마치면 query runner를 해제하는걸 잊지마세요.
await queryRunner.release();
```

## `ConnectionManager` API

- `create` - 새로운 connection을 만들어 manager에 등록합니다.

```typescript
const connection = connectionManager.create({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
});
```

- `get` - 이름으로 manager에 생성된 connection을 가져옵니다.

```typescript
const defaultConnection = connectionManager.get('default');
const secondaryConnection = connectionManager.get('secondary');
```

- `has` - 해당 connection이 지정된 connection manager에게 등록이 되어 있는지 확인합니다.

```typescript
if (connectionManager.has('default')) {
  // ...
}
```
