# `EntityManager` API

- `connection` - `EntityManager` 에서 사용하는 connection입니다.

```typescript
const connection = manager.connection;
```

- `queryRunner` - `EntityManager` 에서 사용하는 query runner 입니다. EntityManager의 트랜잭션 인스턴스에서만 사용됩니다.

```typescript
const queryRunner = manager.queryRunner;
```

- `transaction` - 단일 데이터베이스 트랜잭션에서 여러 데이터베이스 요청이 실행되는 트랜잭션을 제공합니다. 자세한 내용은 [여기](./transactions.md)를 참조하세요.

```typescript
await manager.transaction(async (manager) => {
  // 참고: 지정된 관리자 인스턴스를 사용하여 모든 데이터베이스 작업을 수행해야 합니다.
  // 이 트랜잭션과 함께 작업하는 엔티티 관리자의 특별한 인스턴스입니다.
  // await을 사용하는걸 잊지마세요.
});
```

- `query` - 실행할 raw SQL 쿼리.

```typescript
const rawData = await manager.query(`SELECT * FROM USERS`);
```

- `createQueryBuilder` - SQL 쿼리를 빌드할때 사용할 query builder를 생성합니다. 자세한 내용은 [여기](select-query-builder.md)를 참조하세요.

```typescript
const users = await manager
  .createQueryBuilder()
  .select()
  .from(User, 'user')
  .where('user.name = :name', { name: 'John' })
  .getMany();
```

- `hasId` - 지정한 엔티티에 기본열 속성이 정의됐는지 여부를 확인합니다.

```typescript
if (manager.hasId(user)) {
  // ... do something
}
```

- `getId` - 지정한 엔티티의 기본 열 속성값을 가져옵니다. 엔티티가 복합 기본키를 가지고 있다면 기본키의 이름과 값을 가진 오브젝트를 반환합니다.

```typescript
const userId = manager.getId(user); // userId === 1
```

- `create` - `User`에 대한 새 인스턴스를 생성합니다. 선택적으로 새로 생성된 사용자 객체에 기록될 사용자 속성이 있는 객체 리터럴을 허용합니다.

```typescript
const user = manager.create(User); // const user = new User(); 와 같습니다.
const user = manager.create(User, {
  id: 1,
  firstName: 'Timber',
  lastName: 'Saw',
}); // const user = new User(); user.firstName = "Timber"; user.lastName = "Saw"; 와 같습니다.
```

- `merge` - 여러 엔티티를 단일 엔티티로 병합합니다.

```typescript
const user = new User();
manager.merge(User, user, { firstName: 'Timber' }, { lastName: 'Saw' }); // user.firstName = "Timber"; user.lastName = "Saw"; 와 같습니다.
```

- `preload` - 지정된 일반 javascript 객체에서 새로운 엔티티를 생성합니다. 엔티티가 데이터베이스에 이미 존재하는 경우, 엔티티(및 그와 관련된 모든 항목)를 로드하고 지정된 객체의 모든 값을 새 엔티티로 바꾼 다음 새 엔티티를 반환합니다. 새 엔티티는 실제로 데이터베이스 엔티티에서 로드되고 새 객체에서 모든 속성이 교체됩니다.

```typescript
const partialUser = {
  id: 1,
  firstName: 'Rizzrak',
  profile: {
    id: 1,
  },
};
const user = await manager.preload(User, partialUser);
// 사용자는 partialUser의 누락된 모든 데이터를 partialUser 속성 값으로 포함합니다 :
// { id: 1, firstName: "Rizzrak", lastName: "Saw", profile: { id: 1, ... } }
```

- `save` - 지정된 엔티티 또는 엔티티의 배열을 저장합니다. 데이터베이스에 이미 엔티티가 존재한다면, 엔티티를 업데이트 합니다. 엔티티가 데이터베이스에 존재하지 않으면, 엔티티를 삽입합니다. 지정된 모든 엔티티를 단일 트랜잭션에 저장합니다 (entity manager가 트랜잭션이 아닐때). 또한 정의되지 않은 부분을 모두 뛰어넘기 때문에 부분적인 업데이트를 지원합니다. 값을 `NULL`로 설정하려면 속성을 수동으로 `NULL`로 설정해야 합니다.

```typescript
await manager.save(user);
await manager.save([category1, category2, category3]);
```

- `remove` - 지정된 엔티티 혹은 엔티티의 배열을 삭제합니다. 단일 트랜잭션에 지정된 모든 엔티티를 삭제합니다 (entity manager가 트랜잭션이 아닐 때).

```typescript
await manager.remove(user);
await manager.remove([category1, category2, category3]);
```

- `insert` - 새로운 엔티티나 엔티티의 배열을 삽입합니다.

```typescript
await manager.insert(User, {
  firstName: 'Timber',
  lastName: 'Timber',
});

await manager.insert(User, [
  {
    firstName: 'Foo',
    lastName: 'Bar',
  },
  {
    firstName: 'Rizz',
    lastName: 'Rak',
  },
]);
```

- `update` - 주어진 업데이트 옵션이나 엔티티 id로 엔티티를 부분 업데이트 합니다.

```typescript
await manager.update(User, { firstName: 'Timber' }, { firstName: 'Rizzrak' });
// UPDATE user SET firstName = Rizzrak WHERE firstName = Timber 를 실행합니다.

await manager.update(User, 1, { firstName: 'Rizzrak' });
// UPDATE user SET firstName = Rizzrak WHERE id = 1 를 실행합니다.
```

- `delete` - 주어진 엔티티 id나 ids, 지정한 조건으로 엔티티를 삭제합니다:

```typescript
await manager.delete(User, 1);
await manager.delete(User, [1, 2, 3]);
await manager.delete(User, { firstName: 'Timber' });
```

- `count` - 주어진 엔티티 옵션과 일치하는 엔티티들의 수를 셉니다. pagination에 유용합니다.

```typescript
const count = await manager.count(User, { firstName: 'Timber' });
```

- `increment` - 주어진 옵션과 일치하는 엔티티 값을 제공하여 일부 값을 증가시킵니다.

```typescript
await manager.increment(User, { firstName: 'Timber' }, 'age', 3);
```

- `decrement` - 주어진 옵션과 일치하는 제공된 값으로 일부 값을 감소시킵니다.

```typescript
await manager.decrement(User, { firstName: 'Timber' }, 'age', 3);
```

- `find` - 주어진 옵션과 일치하는 엔티티를 찾습니다.

```typescript
const timbers = await manager.find(User, { firstName: 'Timber' });
```

- `findAndCount` - 주어진 find 옵션과 일치하는 엔티티를 찾습니다. 또한 주어진 조건에 일치하는 모든 엔티티의 수를 셉니다. 하지만 pagination 설정(from과 take 옵션)은 무시됩니다.

```typescript
const [timbers, timbersCount] = await manager.findAndCount(User, { firstName: 'Timber' });
```

- `findByIds` - id로 다수의 엔티티를 찾습니다.

```typescript
const users = await manager.findByIds(User, [1, 2, 3]);
```

- `findOne` - id나 find옵션과 첫번째로 일치하는 엔티티를 찾습니다.

```typescript
const user = await manager.findOne(User, 1);
const timber = await manager.findOne(User, { firstName: 'Timber' });
```

- `findOneOrFail` - id나 find 옵션과 첫번째로 일치하는 엔티티를 찾습니다. 일치된 항목이 없으면 반환된 promise를 reject합니다.

```typescript
const user = await manager.findOneOrFail(User, 1);
const timber = await manager.findOneOrFail(User, { firstName: 'Timber' });
```

- `clear` - 주어진 테이블에서 모든 데이터를 지워버립니다 (truncates/drop).

```typescript
await manager.clear(User);
```

- `getRepository` - 특정 엔티티에 대해 작업할 `Repository`를 가져옵니다. 더 자세한 내용은 [Repositories](working-with-repository.md)를 참조하세요.

```typescript
const userRepository = manager.getRepository(User);
```

- `getTreeRepository` - 특정 엔티티에 대해 작업할 `TreeRepository`를 가져옵니다. 더 자세한 내용은 [Repositories](working-with-repository.md)를 참조하세요.

```typescript
const categoryRepository = manager.getTreeRepository(Category);
```

- `getMongoRepository` - 특정 엔티티에 대해 작업할 `MongoRepository`를 가져옵니다. 더 자세한 내용은 [MongoDB](./mongodb.md)를 참조하세요.

```typescript
const userRepository = manager.getMongoRepository(User);
```

- `getCustomRepository` - 사용자 정의 엔티티 리포지토리를 가져옵니다. 자세한 내용은 [Custom repositories](custom-repository.md)를 참조하세요.

```typescript
const myUserRepository = manager.getCustomRepository(UserRepository);
```

- `release` - Entity Manager의 querry runner를 해제합니다. query runner가 수동으로 생성되고 관리될 때만 사용됩니다.

```typescript
await manager.release();
```
