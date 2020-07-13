# Find 옵션

- [기본 옵션](#기본-옵션)
- [고급 옵션](#고급-옵션)

## 기본 옵션

모든 리포지토리와 매니저의 `find` 메소드는 `QueryBuilder`를 사용하지 않고 필요한 데이터를 조회하는 데 사용할 수 있는 특수 옵션을 허용합니다:

- `select` - 선택해야 하는 메인 객체의 속성을 나타냅니다.

```typescript
userRepository.find({ select: ['firstName', 'lastName'] });
```

- `relations` - 관계는 메인 엔티티와 함께 로드되어야 합니다. 하위 관계도 로드할 수 있습니다. (join과 leftJoinAndSelect의 축약형)

```typescript
userRepository.find({ relations: ['profile', 'photos', 'videos'] });
userRepository.find({ relations: ['profile', 'photos', 'videos', 'videos.video_attributes'] });
```

- `join` - 엔티티에 대해 조인을 수행해야 합니다. "relations"의 확장버전.

```typescript
userRepository.find({
  join: {
    alias: 'user',
    leftJoinAndSelect: {
      profile: 'user.profile',
      photo: 'user.photos',
      video: 'user.videos',
    },
  },
});
```

- `where` - 엔티티를 조회해야 하는 간단한 조건.

```typescript
userRepository.find({ where: { firstName: 'Timber', lastName: 'Saw' } });
```

임베디드 엔티티에서 열을 쿼리하는 작업은 정의된 계층 구조와 관련하여 수행되어야 합니다.

예시 :

```typescript
userRepository.find({ where: { name: { first: 'Timber', last: 'Saw' } } });
```

OR 연산자와 함께 쿼리 :

```typescript
userRepository.find({
  where: [
    { firstName: 'Timber', lastName: 'Saw' },
    { firstName: 'Stan', lastName: 'Lee' },
  ],
});
```

다음 쿼리를 실행합니다 :

```sql
SELECT * FROM "user" WHERE ("firstName" = 'Timber' AND "lastName" = 'Saw') OR ("firstName" = 'Stan' AND "lastName" = 'Lee')
```

- `order` - 순서 선택.

```typescript
userRepository.find({
  order: {
    name: 'ASC',
    id: 'DESC',
  },
});
```

여러 엔티티 (`find`, `findAndCount`, `findByIds`)를 반환하는 `find` 메소드 역시 다음 옵션을 허용한다.

- `skip` - 엔티티를 가져와야 하는 위치에서의 오프셋(paginated).

```typescript
userRepository.find({
  skip: 5,
});
```

- `take` - 가질 수 있는 최대 엔티티의 수 제한(paginated)입니다.

```typescript
userRepository.find({
  take: 10,
});
```

\*\* MSSQL과 함께 typeorm을 사용하고 `take` 또는 `limit`을 사용하려면 order도 함께 사용해야 하며, 그렇지 않으면 `'Invalid usage of the option NEXT in the FETCH statement.'` 오류가 나타납니다.

```typescript
userRepository.find({
  order: {
    columnName: 'ASC',
  },
  skip: 0,
  take: 10,
});
```

- `cache` - 쿼리결과 캐싱을 활성 / 비활성화 합니다. 자세한 정보 및 옵션은 [caching](caching.md)을 참조하세요.

```typescript
userRepository.find({
  cache: true,
});
```

- `lock` - 쿼리잠금 메커니즘을 활성화 합니다. `findOne` 메소드 에서만 사용할 수 있습니다. `lock`은 다음과 같이 정의할 수 있는 객체입니다 :

```ts
{ mode: "optimistic", version: number|Date }
```

또는

```ts
{
  mode: 'pessimistic_read' |
    'pessimistic_write' |
    'dirty_read' |
    'pessimistic_partial_write' |
    'pessimistic_write_or_fail';
}
```

예제 :

```typescript
userRepository.findOne(1, {
  lock: { mode: 'optimistic', version: 1 },
});
```

`pessimistic_partial_write` 와 `pessimistic_write_or_fail`은 postgres에서만 지원되며, `SELECT .. FOR UPDATE SKIP LOCKED`, `SELECT .. FOR UPDATE NOWAIT`
와 동등합니다.

find 옵션에 대한 완전한 예시 :

```typescript
userRepository.find({
  select: ['firstName', 'lastName'],
  relations: ['profile', 'photos', 'videos'],
  where: {
    firstName: 'Timber',
    lastName: 'Saw',
  },
  order: {
    name: 'ASC',
    id: 'DESC',
  },
  skip: 5,
  take: 10,
  cache: true,
});
```

## 고급 설정

TypeORM은 복잡한 비교를 만드는 데 사용할 수 있는 많은 기본 연산자를 제공합니다 :

- `Not`

```ts
import { Not } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  title: Not('About #1'),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "title" != 'About #1'
```

- `LessThan`

```ts
import { LessThan } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  likes: LessThan(10),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "likes" < 10
```

- `LessThanOrEqual`

```ts
import { LessThanOrEqual } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  likes: LessThanOrEqual(10),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "likes" <= 10
```

- `MoreThan`

```ts
import { MoreThan } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  likes: MoreThan(10),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "likes" > 10
```

- `MoreThanOrEqual`

```ts
import { MoreThanOrEqual } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  likes: MoreThanOrEqual(10),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "likes" >= 10
```

- `Equal`

```ts
import { Equal } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  title: Equal('About #2'),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "title" = 'About #2'
```

- `Like`

```ts
import { Like } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  title: Like('%out #%'),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "title" LIKE '%out #%'
```

- `Between`

```ts
import { Between } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  likes: Between(1, 10),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "likes" BETWEEN 1 AND 10
```

- `In`

```ts
import { In } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  title: In(['About #2', 'About #3']),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "title" IN ('About #2','About #3')
```

- `Any`

```ts
import { Any } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  title: Any(['About #2', 'About #3']),
});
```

다음의 쿼리를 실행합니다 (Postgres 문법입니다):

```sql
SELECT * FROM "post" WHERE "title" = ANY(['About #2','About #3'])
```

- `IsNull`

```ts
import { IsNull } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  title: IsNull(),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "title" IS NULL
```

- `Raw`

```ts
import { Raw } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  likes: Raw('dislikes - 4'),
});
```

다음의 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "likes" = "dislikes" - 4
```

갸장 간단한 경우, raw 쿼리는 동일한 기호 바로 뒤에 삽입됩니다. 하지만 함수를 사용하여 비교 로직을 완전히 다시 작성할 수 있습니다.

```ts
import { Raw } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  currentDate: Raw((alias) => `${alias} > NOW()`),
});
```

다음 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE "currentDate" > NOW()
```

> 참고: Raw 연산자를 조심하세요. 제공된 식에서 순수 SQL을 실행하고 사용자 입력을 포함하면 안 됩니다.
> 그렇지 않으면 SQL-injection으로 이어집니다.

또한 이런 연산자를 `Not` 연산자와 결합할 수도 있습니다 :

```ts
import { Not, MoreThan, Equal } from 'typeorm';

const loadedPosts = await connection.getRepository(Post).find({
  likes: Not(MoreThan(10)),
  title: Not(Equal('About #2')),
});
```

다음 쿼리를 실행합니다 :

```sql
SELECT * FROM "post" WHERE NOT("likes" > 10) AND NOT("title" = 'About #2')
```
