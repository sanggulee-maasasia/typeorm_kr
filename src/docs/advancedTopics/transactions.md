# Transactions

- [트랜잭션을 만들고 사용하는 방법](#트랜잭션을-만들고-사용하는-방법)
  - [트랜잭션 격리 수준 지정](#트랜잭션-격리-수준-지정)
- [트랜잭션 데코레이터](#트랜잭션-데코레이터)
- [`QueryRunner`를 사용하여 단일 데이터베이스 연결상태 작성 및 제어하기](#QueryRunner를-사용하여-단일-데이터베이스-연결상태-작성-및-제어)

# 트랜잭션을 만들고 사용하는 방법

트랜잭션은 `Connection` 또는 `EntityManager`를 사용할 때 만들어 집니다.
예시:

```typescript
import { getConnection } from 'typeorm';

await getConnection().transaction(async (transactionalEntityManager) => {});
```

또는

```typescript
import { getManager } from 'typeorm';

await getManager().transaction(async (transactionalEntityManager) => {});
```

트랜잭션에서 실행하고자 하는 모든 내용은 콜백으로 실행되어야 합니다:

```typescript
import { getManager } from 'typeorm';

await getManager().transaction(async (transactionalEntityManager) => {
  await transactionalEntityManager.save(users);
  await transactionalEntityManager.save(photos);
  // ...
});
```

트랜잭션에서 작업할 때 가장 중요한 제한 사항은 제공된 엔티티 관리자의 인스턴스를 **항상** 사용하는 것입니다.
이 예에서는 `transactionalEntityManager`를 사용하십시오.
글로벌 매니저(`getManager` 또는 connection의 manager)를 사용할 경우 문제가 발생합니다.
글로벌 매니저 또는 connection을 사용하여 쿼리를 실행하는 클래스도 사용할 수 없습니다.
모든 작업은 제공된 트랜잭션 엔티티 관리자를 **사용하여** 실행해야 합니다.

### 트랜잭션 격리 수준 지정

트랜잭션의 분리 수준은 첫 번째 매개 변수로 제공하여 지정할 수 있습니다:

```typescript
import { getManager } from 'typeorm';

await getManager().transaction('SERIALIZABLE', (transactionalEntityManager) => {});
```

격리 수준 구현이 모든 데이터베이스에서 불가지론적인 것은 아닙니다.

다음 데이터베이스 드라이버들은 표준 격리 수준(`READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`)을 지원합니다 :

- MySQL
- Postgres
- SQL Server

**SQlite** 는 기본적으로 트랜잭션을 `SERIALIZABLE` 으로 설정하지만, 공유 캐시 모드를 사용하도록 설정하면
트랜잭션에서 `READ UNCOMMITED` 격리 수준을 사용할 수 있습니다.

**Oracle** 은 `READ UNCOMMITED` 및 `SERIALIZABLE` 격리수준 만을 지원합니다.

## 트랜잭션 데코레이터

트랜잭션을 구성하는데 도움이 되는 몇가지 데코레이터(`@Transaction`, `@TransactionManager` 및 `@TransactionRepository`)가 있습니다.

@Transaction은 모든 실행을 단일 데이터베이스 트랜잭션으로 처리하며,
@TransactionManager는 트랜잭션 내에서 쿼리를 실행하는 데 사용해야 하는 트랜잭션 엔티티 관리자를 제공합니다:

```typescript
@Transaction()
save(@TransactionManager() manager: EntityManager, user: User) {
    return manager.save(user);
}
```

격리 수준과 함께 사용하려면 :

```typescript
@Transaction({ isolation: "SERIALIZABLE" })
save(@TransactionManager() manager: EntityManager, user: User) {
    return manager.save(user);
}
```

`@TransactionManager`에서 제공하는 관리자를 항상 **사용해야 합니다**.

그러나, `@TransactionRepository`를 사용하여 트랜잭션 리포지토리 (후드 아래의 트랜잭션 엔티티 관리자를 사용)를 주입할 수도 있습니다.

```typescript
@Transaction()
save(user: User, @TransactionRepository(User) userRepository: Repository<User>) {
    return userRepository.save(user);
}
```

`@TransactionRepository() customRepository()`를 사용하여 `Repository`, `TreeRepository` 및 `MongoRepository`와 같은 기본 제공 TypeORM의 리포지토리 또는 사용자 지정 리포지토리를 모두 주입할 수 있습니다.

You can inject both built-in TypeORM's repositories like `Repository`, `TreeRepository` and `MongoRepository`
(using `@TransactionRepository(Entity) entityRepository: Repository<Entity>`)
or custom repositories (classes extending the built-in TypeORM's repositories classes and decorated with `@EntityRepository`)
using the `@TransactionRepository() customRepository: CustomRepository`.

## `QueryRunner`를 사용하여 단일 데이터베이스 연결상태 작성 및 제어

`QueryRunner`는 단일 데이터베이스 연결을 제공합니다. 트랜잭션은 쿼리 실행기를 사용하여 구성됩니다.
단일 트랜잭션은 단일 쿼리 실행자에서만 설정할 수 있습니다.
쿼리 실행자 인스턴스를 수동으로 생성하여 트랜잭션 상태를 수동으로 제어하는 데 사용할 수 있습니다.
예시 :

```typescript
import { getConnection } from 'typeorm';

// get a connection and create a new query runner
const connection = getConnection();
const queryRunner = connection.createQueryRunner();

// establish real database connection using our new query runner
await queryRunner.connect();

// now we can execute any queries on a query runner, for example:
await queryRunner.query('SELECT * FROM users');

// we can also access entity manager that works with connection created by a query runner:
const users = await queryRunner.manager.find(User);

// lets now open a new transaction:
await queryRunner.startTransaction();

try {
  // execute some operations on this transaction:
  await queryRunner.manager.save(user1);
  await queryRunner.manager.save(user2);
  await queryRunner.manager.save(photos);

  // commit transaction now:
  await queryRunner.commitTransaction();
} catch (err) {
  // since we have errors let's rollback changes we made
  await queryRunner.rollbackTransaction();
} finally {
  // you need to release query runner which is manually created:
  await queryRunner.release();
}
```

`QueryRunner` 에서는 다음과 같은 3가지 방법으로 트랜젝션을 제어할 수 있습니다:

- `startTranscation` - query runner 인스턴스 안에 새로운 트랜잭션을 시작합니다.
- `commitTransaction` - query runner 인스턴스를 사용하여 변경한 모든 내용을 커밋합니다.
- `rollbackTransaction` - query runner 인스턴스를 사용하여 변경한 모든 내용을 롤백합니다.

더 자세한 내용은 [Query Runner](https://typeorm.io/#/query-runner/)를 참조하세요.
