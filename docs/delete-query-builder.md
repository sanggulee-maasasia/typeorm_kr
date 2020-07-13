# Query Builder 를 사용하여 삭제

- [Query Builder 를 사용하여 삭제](#query-builder-를-사용하여-삭제)
  - [`Delete`](#delete)
  - [`Soft-Delete`](#soft-delete)
  - [`Restore-Soft-Delete`](#restore-soft-delete)

### `Delete`

`QueryBuilder`를 사용하여 `DELETE` 쿼리를 생성할 수 있습니다. 예시 :

```typescript
import { getConnection } from 'typeorm';

await getConnection().createQueryBuilder().delete().from(User).where('id = :id', { id: 1 }).execute();
```

이것은 데이터베이스에 행을 삭제하는 방법중에 성능 측면에서 가장 효율적인 방법입니다. 이방법으로 대량 삭제를
수행할 수도 있습니다.

---

### `Soft-Delete`

QueryBuilder에 soft delete 적용

```typescript
import { createConnection } from 'typeorm';
import { Entity } from './entity';

createConnection(/*...*/)
  .then(async (connection) => {
    await connection.getRepository(Entity).createQueryBuilder().softDelete();
  })
  .catch((error) => console.log(error));
```

### `Restore-Soft-Delete`

또는, `restore()` 메소드를 사용하여 soft delete된 행을 복구할 수 있습니다 :

```typescript
import { createConnection } from 'typeorm';
import { Entity } from './entity';

createConnection(/*...*/)
  .then(async (connection) => {
    await connection.getRepository(Entity).createQueryBuilder().restore();
  })
  .catch((error) => console.log(error));
```
