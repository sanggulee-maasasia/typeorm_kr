# 쿼리 캐싱

다음과 같은 `QueryBuilder` 메소드로 선택한 결과를 캐싱할 수 있습니다 :
`getMany`, `getOne`, `getRawMany`, `getRawOne`, `getCount`.

또한 다음과 같은 `Repository` 메소드로 선택한 결과를 캐싱할 수 있습니다 :
`find`, `findAndCount`, `findByIds`, `count`.

캐시를 활성화 하려면 연결 옵션에서 캐시를 명시적으로 활성화 해야 합니다 :

```typescript
{
    type: "mysql",
    host: "localhost",
    username: "test",
    ...
    cache: true
}
```

캐시를 처음 활성화 할때는, 데이터베이스 스키마(CLI, 마이그레이션 또는 연결 `synchronize` 옵션 사용)를 동기화 해야합니다.

그런 다음 QueryBuilder에서 모든 쿼리에 대해 쿼리 캐시를 사용하도록 설정할 수 있습니다 :

```typescript
const users = await connection
  .createQueryBuilder(User, 'user')
  .where('user.isAdmin = :isAdmin', { isAdmin: true })
  .cache(true)
  .getMany();
```

`Repository` 쿼리는 다음과 같습니다 :

```typescript
const users = await connection.getRepository(User).find({
  where: { isAdmin: true },
  cache: true,
});
```

쿼리를 실행하여 모든 관리자를 가져오고 결과를 캐시합니다. 다음번에 동일한 코드를 실행할 때 모든 관리 사용자가 캐시에서 가져와집니다.
기본 캐시수명은 `1000 ms`와 같습니다 (1초). 이는 query builder가 호출 된 후 1초 후에는 캐시가 유효하지 않음을 의미합니다.
실제로는 사용자가 3초 이내에 사용자페이지를 150번 열면 이 기간동안 3개의 쿼리만 실행된다는 의미입니다. 1초 캐시 기간동안 삽입된 사용자는
반환되지 않습니다.

`QueryBuilder` 를 통해 캐시 시간을 수동으로 변경할 수 있습니다 :

```typescript
const users = await connection
  .createQueryBuilder(User, 'user')
  .where('user.isAdmin = :isAdmin', { isAdmin: true })
  .cache(60000) // 1 minute
  .getMany();
```

또는 `Repository` 를 통해 다음을 수행할 수 있습니다.

```typescript
const users = await connection.getRepository(User).find({
  where: { isAdmin: true },
  cache: 60000,
});
```

또는 전역 연결 옵션을 통해 변경할 수 있습니다 :

```typescript
{
    type: "mysql",
    host: "localhost",
    username: "test",
    ...
    cache: {
        duration: 30000 // 30 seconds
    }
}
```

또한, `QueryBuilder` 를 통해 "cache id"를 설정할 수도 있습니다 :

```typescript
const users = await connection
  .createQueryBuilder(User, 'user')
  .where('user.isAdmin = :isAdmin', { isAdmin: true })
  .cache('users_admins', 25000)
  .getMany();
```

또는 `Repository` 를 사용하여 다음을 수행합니다.

```typescript
const users = await connection.getRepository(User).find({
  where: { isAdmin: true },
  cache: {
    id: 'users_admins',
    milliseconds: 25000,
  },
});
```

이렇게 하면 캐시를 세부적으로 제어할 수 있습니다. 예를 들어 새 사용자를 삽입할 때 캐시된 결과를 지울 수 있습니다 :

```typescript
await connection.queryResultCache.remove(['users_admins']);
```

기본적으로 TypeORM은 `query-result-cache` 라고 부르는 별도의 테이블을 사용하고 모든 쿼리 및 결과를 여기에 저장합니다.
테이블 이름을 구성할 수 있으므로, 테이블 이름 속성에서 값을 지정하여 테이블 이름을 변경할 수 있습니다. 예시 :

```typescript
{
    type: "mysql",
    host: "localhost",
    username: "test",
    ...
    cache: {
        type: "database",
        tableName: "configurable-table-query-result-cache"
    }
}
```

캐시를 단일 데이터베이스 테이블에 저장하는 것이 효과적이지 않은 경우 캐시 유형을
"redis" 또는 "ioredis"로 변경할 수 있으며 TypeORM은 캐시된 모든 레코드를 대신 redis에 저장합니다. 예시 :

```typescript
{
    type: "mysql",
    host: "localhost",
    username: "test",
    ...
    cache: {
        type: "redis",
        options: {
            host: "localhost",
            port: 6379
        }
    }
}
```

"options" 은 사용중인 타입에 따라 [node_redis specific options](https://github.com/NodeRedis/node_redis#options-object-properties) 또는 [ioredis specific options](https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options) 이 될 수 있습니다.

IORedis의 클러스터 기능을 사용하여 Redis-cluster에 연결하려는 경우 다음을 통해 이를 수행할 수 있습니다 :

```typescript
{
    type: "mysql",
    host: "localhost",
    username: "test",
    cache: {
        type: "ioredis/cluster",
        options: {
            startupNodes: [
                {
                    host: 'localhost',
                    port: 7000,
                },
                {
                    host: 'localhost',
                    port: 7001,
                },
                {
                    host: 'localhost',
                    port: 7002,
                }
            ],
            options: {
                scaleReads: 'all',
                clusterRetryStrategy: function (times) { return null },
                redisOptions: {
                    maxRetriesPerRequest: 1
                }
            }
        }
    }
}
```

IORedis 클러스터 생성자의 첫 번째 인수로 옵션을 계속 사용할 수 있습니다.

```typescript
{
    ...
    cache: {
        type: "ioredis/cluster",
        options: [
            {
                host: 'localhost',
                port: 7000,
            },
            {
                host: 'localhost',
                port: 7001,
            },
            {
                host: 'localhost',
                port: 7002,
            }
        ]
    },
    ...
}
```

캐시 공급자가 사용자의 요구를 충족하지 않는 경우, `QueryResultCache` 인터페이스를 구현하는 새 객체를 반환
해야하는 `provider` 팩토리 기능을 사용해 캐시 공급자를 지정할 수도 있습니다.

```typescript
class CustomQueryResultCache implements QueryResultCache {
    constructor(private connection: Connection) {}
    ...
}
```

```typescript
{
    ...
    cache: {
        provider(connection) {
            return new CustomQueryResultCache(connection);
        }
    }
}
```

`typeorm cache:clear`를 사용하여 캐시에 저장된 모든 항목을 지울 수 있습니다.
