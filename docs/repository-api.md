# Repository APIs

- [Repository API](#repository-api)
- [TreeRepository API](#treerepository-api)
- [MongoRepository API](#mongorepository-api)

## `Repository` API

- `manager` - `EntityManager` 에서 사용하는 repository입니다.

```typescript
const manager = repository.manager;
```

- `metadata` - 이 repository에서 관리하는 엔티티의 `EntityMetadata`입니다. 더 자세한 내용은 [transactions in Entity Metadata](./entity-metadata.md)를 참조하세요.

```typescript
const metadata = repository.metadata;
```

- `queryRunner` - `EntityManager`에서 사용하는 query runner. EntityManager의 트랜잭션 인스터스일 경우에만 사용 가능합니다.

```typescript
const queryRunner = repository.queryRunner;
```

- `target` - 이 Repository에서 관리하는 대상 엔티티 클래스. EntityManager의 트랜잭션 인스턴스일 경우에만 사용 가능합니다.

```typescript
const target = repository.target;
```

- `createQueryBuilder` - SQL 쿼리를 빌드할때 사용하는 query builder를 생성합니다. 더 자세한 내용은 [QueryBuilder](select-query-builder.md)를 참조하세요.

```typescript
const users = await repository.createQueryBuilder('user').where('user.name = :name', { name: 'John' }).getMany();
```

- `hasId` - 주어진 엔티티가 기본 열 속성이 정의 돼있는지 여부를 확인합니다.

```typescript
if (repository.hasId(user)) {
  // ... do something
}
```

- `getId` - 주어진 엔티티의 기본 열 속성값을 가져옵니다. 엔티티가 복합 기본키를 가지고 있을 경우 기본열의 이름과 값이 담긴 객체를 반환합니다.

```typescript
const userId = repository.getId(user); // userId === 1
```

- `create` - `User`에 대한 새로운 인스턴스를 만듭니다. 선택적으로 새로 생성된 User 객체에 기록될 User 속성이 있는 객체 리터럴을 허용합니다.

```typescript
const user = repository.create(); // const user = new User(); 와 같습니다.
const user = repository.create({
  id: 1,
  firstName: 'Timber',
  lastName: 'Saw',
}); // const user = new User(); user.firstName = "Timber"; user.lastName = "Saw"; 와 같습니다.
```

- `merge` - 여러개의 엔티티를 단일 엔티티로 병합합니다.

```typescript
const user = new User();
repository.merge(user, { firstName: 'Timber' }, { lastName: 'Saw' }); // user.firstName = "Timber"; user.lastName = "Saw"; 와 같습니다.
```

- `preload` - 지정된 일반 javascript 객체에서 새로운 엔티티를 생성합니다. 엔티티가 데이터베이스에 이미 존재하는 경우, 엔티티(및 그와 관련된 모든 항목)를 로드하고 지정된 객체의 모든 값을 새 엔티티로 바꾼 다음 새 엔티티를 반환합니다. 새 엔티티는 실제로 데이터베이스 엔티티에서 로드되고 새 객체에서 모든 속성이 교체됩니다. <br>
  지정된 엔티티와 유사한 엔티티를 찾으려면 엔티티 id/기본 키가 있어야 합니다. 지정된 ID의 엔티티를 찾을 수 없는 경우 undefined을 반환합니다.

```typescript
const partialUser = {
  id: 1,
  firstName: 'Rizzrak',
  profile: {
    id: 1,
  },
};
const user = await repository.preload(partialUser);
// 사용자는 partialUser의 누락된 모든 데이터를 partialUser 속성 값과 함께 포함합니다:
// { id: 1, firstName: "Rizzrak", lastName: "Saw", profile: { id: 1, ... } }
```

- `save` - 지정된 엔티티 또는 엔티티의 배열을 저장합니다. 데이터베이스에 이미 엔티티가 존재한다면, 엔티티를 업데이트 합니다. 엔티티가 데이터베이스에 존재하지 않으면, 엔티티를 삽입합니다. 단일 트랜잭션에 지정된 모든 엔티티를 저장합니다 (entity manager가 트랜잭션이 아닐 때). 또한 정의되지 않은 부분을 모두 뛰어넘기 때문에 부분적인 업데이트를 지원합니다. 저장된 엔티티/엔티티들을 반환합니다.

```typescript
await repository.save(user);
await repository.save([category1, category2, category3]);
```

- `remove` - 지정된 엔티티 또는 엔티티의 배열을 삭제합니다. 단일 트랜잭션에 지정된 모든 엔티티를 삭제합니다 (entity manager가 트랜잭션이 아닐 때). 삭제한 엔티티/엔티티들을 반환합니다.

```typescript
await repository.remove(user);
await repository.remove([category1, category2, category3]);
```

- `insert` - 새로운 엔티티 혹은 엔티티의 배열을 삽입합니다.

```typescript
await repository.insert({
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

- `update` - 지정된 업데이트 옵션이나 엔티티 id로 엔티티를 부분적으로 업데이트 합니다.

```typescript
await repository.update({ firstName: 'Timber' }, { firstName: 'Rizzrak' });
// UPDATE user SET firstName = Rizzrak WHERE firstName = Timber 를 실행합니다.

await repository.update(1, { firstName: 'Rizzrak' });
// UPDATE user SET firstName = Rizzrak WHERE id = 1 를 실행합니다.
```

- `delete` - 엔티티 id, ids, 지정된 옵션으로 엔티티를 제거합니다:

```typescript
await repository.delete(1);
await repository.delete([1, 2, 3]);
await repository.delete({ firstName: 'Timber' });
```

- `softDelete` and `restore` - Soft deleting and restoring a row by id

```typescript
const repository = connection.getRepository(Entity);
// 엔티티 삭제
await repository.softDelete(1);
// restore를 사용하여 복원할 수 있습니다.
await repository.restore(1);
```

- `softRemove` and `recover` - `softDelete` 와 `restore` 대신 사용할 수 있습니다.

```typescript
// softRemove를 사용하여 soft-delete 할 수 있습니다.
const entities = await repository.find();
const entitiesAfterSoftRemove = await repository.softRemove(entities);

// recover를 사용하여 복원할 수 있습니다.
await repository.recover(entitiesAfterSoftRemove);
```

- `count` - 주어진 옵션과 일치하는 엔티티의 수를 셉니다. pagination에서 유용합니다.

```typescript
const count = await repository.count({ firstName: 'Timber' });
```

- `increment` - 주어진 옵션과 일치하는 엔티티 값을 제공하여 일부 열을 증가시킵니다.

```typescript
await manager.increment(User, { firstName: 'Timber' }, 'age', 3);
```

- `decrement` - 주어진 옵션과 일치하는 엔티티 값을 제공하여 일부 열을 감소시킵니다.

```typescript
await manager.decrement(User, { firstName: 'Timber' }, 'age', 3);
```

- `find` - 주어진 옵션과 일치하는 엔티티를 찾습니다.

```typescript
const timbers = await repository.find({ firstName: 'Timber' });
```

- `findAndCount` - 주어진 옵션과 일치하는 엔티티를 찾습니다. 또한 주어진 조건과 일치하는 엔티티의 수를 셉니다. 하지만 pagination 설정(`skip` 혹은 `take`)은 무시됩니다.

```typescript
const [timbers, timbersCount] = await repository.findAndCount({ firstName: 'Timber' });
```

- `findByIds` - id로 다수의 엔티티들을 찾습니다.

```typescript
const users = await repository.findByIds([1, 2, 3]);
```

- `findOne` - 일부 id 또는 find 옵션과 일치하는 첫번째 엔티티를 찾습니다.

```typescript
const user = await repository.findOne(1);
const timber = await repository.findOne({ firstName: 'Timber' });
```

- `findOneOrFail` - 일부 id 또는 find 옵션과 일치하는 첫번째 엔티티를 찾습니다.
  일치하는 엔티티가 없다면 리턴되는 promise를 reject합니다.

```typescript
const user = await repository.findOneOrFail(1);
const timber = await repository.findOneOrFail({ firstName: 'Timber' });
```

- `query` - raw SQL 쿼리를 실행합니다.

```typescript
const rawData = await repository.query(`SELECT * FROM USERS`);
```

- `clear` - 주어진 테이블의 모든 데이터를 삭제합니다 (truncates / drops).

```typescript
await repository.clear();
```

### Additional Options

`SaveOptions`는 `save`의 매개 변수로 전달 될 수 있습니다.

- `data` - persist 메소드와 함께 전달될 추가 데이터입니다. 이 데이터를 subscribers 에서 사용할 수 있습니다.

- `listeners`: boolean - 이 작업에 대해 listeners와 subscribers를 호출할지 여부를 나타냅니다. 기본적으로 활성화 되어있으며, save/remove 옵션에서 `{listeners: false }`를 설정하여 사용하지 않도록 설정할 수 있습니다.

- `transaction`: boolean - 기본적으로 트랜잭션이 활성화 되고 persistence 작업의 모든 쿼리가 트랜잭션에 포함됩니다. persistence 옵션에서 `{ transaction: false }` 를 설정하여 이 동작을 사용하지 않도록 할 수 있습니다.

- `chunk`: number - 저장 실행을 다수의 chunks 그룹으로 나눕니다. 예를들어 100.000개의 객체를 저장하려고 하지만 문제가 있는 경우, 10.000개의 객체로 구성된 10개의 그룹으로 구분하고 (`{ chunk: 10000}` 을 설정합니다) 각 그룹을 별도로 저장할 수 있습니다. 이 옵션은 기본 드라이버 매개변수 번호 제한에 문제가 있는 경우 매우 큰 삽입을 수행할 때 필요합니다.

- `reload`: boolean - persist 작업 중에 유지되는 엔티티를 다시 로드할지 여부를 결정하는 flag입니다. RETURN / OUTPUT 문을 지원하지 않는 데이터베이스에서만 작동합니다. 기본적으로 활성화됩니다.

Example:

```typescript
// users가 User 엔티티의 배열을 포함하고 있습니다.
userRepository.save(users, { chunk: users.length / 1000 });
```

`RemoveOptions` 는 `remove` 나 `delete`의 매개변수로 전달 될 수 있습니다.

- `data` - remove 메소드와 함께 전달될 추가 데이터입니다. 이 데이터를 subscribers 에서 사용할 수 있습니다.

- `listeners`: boolean - 이 작업에 대해 listeners와 subscribers를 호출할지 여부를 나타냅니다. 기본적으로 활성화 되어있으며, save/remove 옵션에서 `{ listeners: false }`를 설정하여 사용하지 않도록 설정할 수 있습니다.

- `transaction`: boolean - 기본적으로 트랜잭션이 활성화 되고 persistence 작업의 모든 쿼리가 트랜잭션에 포함됩니다. persistence 옵션에서 `{ transaction: false }` 를 설정하여 이 동작을 사용하지 않도록 할 수 있습니다.

- `chunk`: number - 저장 실행을 다수의 chunks 그룹으로 나눕니다. 예를들어 100.000개의 객체를 저장하려고 하지만 문제가 있는 경우, 10.000개의 객체로 구성된 10개의 그룹으로 구분하고 (`{ chunk: 10000}` 을 설정합니다) 각 그룹을 별도로 저장할 수 있습니다. 이 옵션은 기본 드라이버 매개변수 번호 제한에 문제가 있는 경우 매우 큰 삽입을 수행할 때 필요합니다.

Example:

```typescript
// users가 user 엔티티의 배열을 포함하고 있습니다.
userRepository.remove(users, { chunk: entities.length / 1000 });
```

## `TreeRepository` API

`TreeRepository`에 대한 API는 [the Tree Entities documentation](./tree-entities.md#working-with-tree-entities)를 참조하세요.

## `MongoRepository` API

`MongoRepository`에 대한 API는 [the MongoDB documentation](./mongodb.md)를 참조하세요.
