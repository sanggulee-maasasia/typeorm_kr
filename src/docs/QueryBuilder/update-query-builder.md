# Query Builder를 사용하여 업데이트

`QueryBuilder`를 사용하여 `UPDATE` 쿼리를 생성할 수 있습니다. 예시 :

```typescript
import { getConnection } from 'typeorm';

await getConnection()
  .createQueryBuilder()
  .update(User)
  .set({ firstName: 'Timber', lastName: 'Saw' })
  .where('id = :id', { id: 1 })
  .execute();
```

이것은 데이터베이스에 행을 업데이트하는 방법중에 성능 측면에서 가장 효율적인 방법입니다. 이방법으로 대량 업데이트를 수행할 수도 있습니다.

### Raw SQL 지원

SQL 쿼리를 실행할 때 함수 스타일 값을 사용해야 하는 경우도 있습니다:

```typescript
import { getConnection } from 'typeorm';

await getConnection()
  .createQueryBuilder()
  .update(User)
  .set({
    firstName: 'Timber',
    lastName: 'Saw',
    age: () => 'age + 1',
  })
  .where('id = :id', { id: 1 })
  .execute();
```

이 구문은 값을 escape하지 않으므로 직접 escape를 처리해야 합니다.
