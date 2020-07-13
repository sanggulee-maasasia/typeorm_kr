# Select using Query Builder

- [`QueryBuilder`란?](#querybuilder-란?)
- [`QueryBuilder`를 만들고 사용하는 방법](#querybuilder를-만들고-사용하는-방법)
- [QueryBuilder를 사용해서 값 얻기](#querybuilder를-사용해서-값-얻기)
- [alias 란?](#alias-란?)
- [매개변수를 사용한 데이터 탈출](#매개변수를-사용한-데이터-탈출)
- [`WHERE` 표현식 추가](#where-표현식-추가)
- [`HAVING` 표현식 추가](#having-표현식-추가)
- [`ORDER BY` 표현식 추가](#order-by-표현식-추가)
- [`GROUP BY` 표현식 추가](#group-by-표현식-추가)
- [`LIMIT` 표현식 추가](#limit-표현식-추가)
- [`OFFSET` 표현식 추가](#offset-표현식-추가)
- [관계 조인](#관계-조인)
- [Inner 조인과 left 조인](#Inner-조인과-left-조인)
- [select 없이 조인](#select-없이-조인)
- [엔티티와 테이블 조인](#엔티티와-테이블-조인)
- [조인 및 맵핑 기능](#조인-및-맵핑-기능)
- [생성된 쿼리 가져오기](#생성된-쿼리-가져오기)
- [생성된 raw 결과값 가져오기](#생성된-raw-결과값-가져오기)
- [결과 데이터 Streaming](#결과-데이터-Streaming)
- [페이지네이션 사용](#페이지네이션-사용)
- [잠금 설정](#잠금-설정)
- [부분 select](#부분-select)
- [서브쿼리 사용](#서브쿼리-사용)
- [숨겨진 열](#숨겨진-열)

## `QueryBuilder` 란?

`QueryBuilder`는 TypeORM의 가장 강력한 기능 중 하나로, 우아하고 편리한 구문을 사용하여 SQL 쿼리를 작성하고 이를 실행하며 자동으로 변환된 엔티티를 가져올 수 있습니다.

`QueryBuilder`에 대한 간단한 예제 :

```typescript
const firstUser = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .where('user.id = :id', { id: 1 })
  .getOne();
```

다음과 같은 쿼리를 빌드합니다 :

```sql
SELECT
    user.id as userId,
    user.firstName as userFirstName,
    user.lastName as userLastName
FROM users user
WHERE user.id = 1
```

그리고 `User` 인스턴스를 반환합니다 :

```
User {
    id: 1,
    firstName: "Timber",
    lastName: "Saw"
}
```

## `QueryBuilder`를 만들고 사용하는 방법

`QueryBuilder`를 만드는 방법은 여러가지가 있습니다 :

- connection 사용 :

  ```typescript
  import { getConnection } from 'typeorm';

  const user = await getConnection()
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .where('user.id = :id', { id: 1 })
    .getOne();
  ```

- entity manager 사용 :

  ```typescript
  import { getManager } from 'typeorm';

  const user = await getManager().createQueryBuilder(User, 'user').where('user.id = :id', { id: 1 }).getOne();
  ```

- repository 사용 :

  ```typescript
  import { getRepository } from 'typeorm';

  const user = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: 1 }).getOne();
  ```

`QueryBuilder`는 5가지의 다른 타입이 존재합니다.

- `SelectQueryBuilder` - `SELECT` 쿼리를 빌드하고 실행하는데 사용됩니다. 예시:

  ```typescript
  import { getConnection } from 'typeorm';

  const user = await getConnection()
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .where('user.id = :id', { id: 1 })
    .getOne();
  ```

- `InsertQueryBuilder` - `INSERT` 쿼리를 빌드하고 실행하는데 사용됩니다. 예시:

  ```typescript
  import { getConnection } from 'typeorm';

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      { firstName: 'Timber', lastName: 'Saw' },
      { firstName: 'Phantom', lastName: 'Lancer' },
    ])
    .execute();
  ```

- `UpdateQueryBuilder` - `UPDATE` 쿼리를 빌드하고 실행하는데 사용됩니다. 예시:

  ```typescript
  import { getConnection } from 'typeorm';

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ firstName: 'Timber', lastName: 'Saw' })
    .where('id = :id', { id: 1 })
    .execute();
  ```

- `DeleteQueryBuilder` - `DELETE` 쿼리를 빌드하고 실행하는데 사용됩니다. 예시:

  ```typescript
  import { getConnection } from 'typeorm';

  await getConnection().createQueryBuilder().delete().from(User).where('id = :id', { id: 1 }).execute();
  ```

- `RealationQueryBuilder` - 특정 관계 작업을 빌드하고 실행하는데 사용됩니다 [TBD].

서로 다른 타입의 queryBuilder간에 스위칭이 가능합니다. 이는 다른 메소드들과 달리 새로운 queryBuilder 인스턴스를 생성합니다.

## QueryBuilder를 사용해서 값 얻기

데이터베이스에서 단일 결과 값을 얻으려면 (예를 들어 id나 이름으로 user를 얻으려는 경우), `getOne`을 사용해야 합니다 :

```typescript
const timber = await getRepository(User)
  .createQueryBuilder('user')
  .where('user.id = :id OR user.name = :name', { id: 1, name: 'Timber' })
  .getOne();
```

데이터베이스에서 여러 결과 값을 얻으려면 (예를들어 데이터베이스에서 모든 유저를 얻으려는 경우), `getMany`를 사용해야 합니다 :

```typescript
const users = await getRepository(User).createQueryBuilder('user').getMany();
```

select query builder를 사용하여 **entites** 또는 **raw results**의 두가지 유형을 얻을 수 있습니다. 대부분의 경우 데이터베이스에서 실제 엔티티를 필요로 합니다 (users와 같은). 이를 위해 `getOne`과 `getMany`를 사용합니다. 하지만 때때로 특정 데이터를 선택해야 하는 경우도 있습니다. 모든 *사용자의 사진의 합*을 생각해 봅시다. 이 데이터는 엔티티가 아니고 raw data라고 부릅니다. raw data를 가져오려면 `getRawOne` 및 `getRawMany`를 사용합니다.

예시 :

```typescript
const { sum } = await getRepository(User)
  .createQueryBuilder('user')
  .select('SUM(user.photosCount)', 'sum')
  .where('user.id = :id', { id: 1 })
  .getRawOne();
```

```typescript
const photosSums = await getRepository(User)
  .createQueryBuilder('user')
  .select('user.id')
  .addSelect('SUM(user.photosCount)', 'sum')
  .groupBy('user.id')
  .getRawMany();

// 결과는 다음과 같습니다 : [{ id: 1, sum: 25 }, { id: 2, sum: 13 }, ...]
```

## alias 란?

우리는 `createQueryBuilder("user")`를 사용했습니다. 하지만 "user"가 뭐죠?
그건 단지 일반 SQL 별칭에 불과합니다. 선택한 데이터로 작업할 때를 제외하고는 모든 곳에서 별칭을 사용합니다.

`createQueryBuilder("user")`는 다음과 같습니다 :

```typescript
createQueryBuilder().select('user').from(User, 'user');
```

다음과 같은 sql 쿼리가 발생합니다 :

```sql
SELECT ... FROM users user
```

이 SQL 쿼리에서, `users`는 테이블 이름이며, `user`는 이 테이블의 별칭입니다. 나중에 이 별칭을 이용하여 테이블에 접근합니다 :

```typescript
createQueryBuilder().select('user').from(User, 'user').where('user.name = :name', { name: 'Timber' });
```

다음과 같은 sql 쿼리를 생성합니다 :

```sql
SELECT ... FROM users user WHERE user.name = 'Timber'
```

query Builder를 만들때 할당한 `user` 별칭으로 users 테이블을 사용했습니다.

한 queryBuilder에 따로 별칭 제한은 없으며 다수의 별칭을 가질 수 있습니다. 각 select에는 별칭이 있을 수 있으며, 여러 테이블에서 각각 고유한 별칭을 선택할 수도 있으며, 고유한 별칭으로 join 할 수 있습니다. 선택한 테이블이나 데이터에 접근하기 위해 별칭을 사용할 수도 있습니다.

## 매개변수를 사용한 데이터 탈출

우리는 `where("user.name = :name", { name: "Timber" })`를 사용했습니다. {name: "timber"}는 무엇을 의미합니까? 이는 SQL injection을 막기위한 매개변수입니다.
`where("user.name = '" + name + "')`라고 쓸 수도 있었지만, 이는 코드가 SQL injection에 대해 오픈되어있기 때문에 안전하지 않았습니다. 안전한 방법은 다음과 같은 특별한 구문을 사용하는 것입니다: `where("user.name = :name", { name: "Timber" })`, 여기서 `:name` 은 매개변수 이름이며 값은 객체에 저장됩니다: `{ name: "Timber" }`.

```typescript
.where("user.name = :name", { name: "Timber" })
```

는 다음의 간단한 버전입니다 :

```typescript
.where("user.name = :name")
.setParameter("name", "Timber")
```

참고: query builder의 다른 값에 대해 동일한 변수 이름을 사용하지 마세요. 값을 여러 번 설정하면 값이 재정의 됩니다.

다음과 같은 특수 확장 구문을 사용하여 값의 배열을 제공하고 SQL문의 값 목록으로 변환시킬 수 있습니다:

```typescript
.where("user.name IN (:...names)", { names: [ "Timber", "Cristal", "Lina" ] })
```

다음과 같습니다.

```sql
WHERE user.name IN ('Timber', 'Cristal', 'Lina')
```

## `WHERE` 표현식 추가

`WHERE`식을 추가하는 것은 매우 쉽습니다 :

```typescript
createQueryBuilder('user').where('user.name = :name', { name: 'Timber' });
```

다음을 생성합니다 :

```sql
SELECT ... FROM users user WHERE user.name = 'Timber'
```

기존 `WHERE`식에 `AND`를 추가할 수 있습니다:

```typescript
createQueryBuilder('user')
  .where('user.firstName = :firstName', { firstName: 'Timber' })
  .andWhere('user.lastName = :lastName', { lastName: 'Saw' });
```

다음과 같은 SQL 쿼리를 생성합니다:

```sql
SELECT ... FROM users user WHERE user.firstName = 'Timber' AND user.lastName = 'Saw'
```

기존 `WHERE`식에 `OR`를 추가할 수 있습니다:

```typescript
createQueryBuilder('user')
  .where('user.firstName = :firstName', { firstName: 'Timber' })
  .orWhere('user.lastName = :lastName', { lastName: 'Saw' });
```

다음과 같은 SQL 쿼리를 생성합니다:

```sql
SELECT ... FROM users user WHERE user.firstName = 'Timber' OR user.lastName = 'Saw'
```

기존 `WHERE`식에 `IN`을 추가할 수 있습니다:

```typescript
createQueryBuilder('user').where('user.id IN (:...ids)', { ids: [1, 2, 3, 4] });
```

다음과 같은 SQL 쿼리를 생성합니다:

```sql
SELECT ... FROM users user WHERE user.firstName IN (1, 2, 3, 4)
```

`Brackets`를 사용하여 복잡한 `WHERE`식을 기존 `WHERE`식에 추가할 수 있습니다.

```typescript
createQueryBuilder('user')
  .where('user.registered = :registered', { registered: true })
  .andWhere(
    new Brackets((qb) => {
      qb.where('user.firstName = :firstName', { firstName: 'Timber' }).orWhere('user.lastName = :lastName', {
        lastName: 'Saw',
      });
    }),
  );
```

다음과 같은 SQL 쿼리를 생성합니다:

```sql
SELECT ... FROM users user WHERE user.registered = true AND (user.firstName = 'Timber' OR user.lastName = 'Saw')
```

필요한 만큼 `AND` 및 `OR` 식을 결합할 수 있습니다. `.where`를 두번 이상 사용하면 이전의 모든 `WHERE`식이 재정의 됩니다.

참고: `orWhere`를 주의하세요. `AND` 및 `OR`식과 함께 복잡한 식을 사용하는 경우, 사전 준비 없이 쌓이는걸 명심하세요.
경우에 따라 `orWhere` 대신에 where 문자열을 사용해야 합니다.

## `HAVING` 표현식 추가

`HAVING`식을 추가하는 것은 매우 쉽습니다 :

```typescript
createQueryBuilder('user').having('user.name = :name', { name: 'Timber' });
```

다음과 같은 SQL 쿼리를 생성합니다.

```sql
SELECT ... FROM users user HAVING user.name = 'Timber'
```

기존 `HAVING` 식에 `AND`를 추가할 수 있습니다.

```typescript
createQueryBuilder('user')
  .having('user.firstName = :firstName', { firstName: 'Timber' })
  .andHaving('user.lastName = :lastName', { lastName: 'Saw' });
```

다음과 같은 SQL 쿼리를 생성합니다 :

```sql
SELECT ... FROM users user HAVING user.firstName = 'Timber' AND user.lastName = 'Saw'
```

기존 `HAVING` 식에 `AND`를 추가할 수 있습니다.

```typescript
createQueryBuilder('user')
  .having('user.firstName = :firstName', { firstName: 'Timber' })
  .orHaving('user.lastName = :lastName', { lastName: 'Saw' });
```

다음과 같은 SQL 쿼리를 생성합니다 :

```sql
SELECT ... FROM users user HAVING user.firstName = 'Timber' OR user.lastName = 'Saw'
```

필요한 만큼 `AND` 및 `OR` 식을 결합할 수 있습니다. `.having`를 두번 이상 사용하면 이전의 모든 `HAVING`식이 재정의 됩니다.

## `ORDER BY` 표현식 추가

`ORDER BY`식을 추가하는 것은 매우 쉽습니다 :

```typescript
createQueryBuilder('user').orderBy('user.id');
```

다음을 생성합니다 :

```sql
SELECT ... FROM users user ORDER BY user.id
```

정렬 방향을 오름차순에서 내림차순으로 변경할 수 있습니다 (또는 그 반대도) :

```typescript
createQueryBuilder('user').orderBy('user.id', 'DESC');

createQueryBuilder('user').orderBy('user.id', 'ASC');
```

여러 order-by 조건을 추가할 수 있습니다.

```typescript
createQueryBuilder('user').orderBy('user.name').addOrderBy('user.id');
```

order-by 필드 맵을 사용할 수도 있습니다.

```typescript
createQueryBuilder('user').orderBy({
  'user.name': 'ASC',
  'user.id': 'DESC',
});
```

`.orderBy`를 두번 이상 사용하면 이전의 모든 `ORDER BY`식이 재정의 됩니다.

## `DISTINCT ON` 표현식 추가 (Postgres 전용)

order-by 표현식과 함께 두 distinct-on을 모두 사용할 경우, distinct-on이 가장 왼쪽의 order-by와 일치해야 합니다.
distinct-on 표현식은 order-by와 동일한 규칙을 사용하여 해석됩니다. order-by 표현식 없이 distinct-on을 사용하면
각 세트의 첫번째 행을 예측할 수 없습니다.

`DISTINCT ON`식을 추가하는 것은 매우 쉽습니다.

```typescript
createQueryBuilder('user').distinctOn(['user.id']).orderBy('user.id');
```

다음을 생성합니다 :

```sql
SELECT DISTINCT ON (user.id) ... FROM users user ORDER BY user.id
```

## `GROUP BY` 표현식 추가

`GROUP BY`식을 추가하는 것은 매우 쉽습니다 :

```typescript
createQueryBuilder('user').groupBy('user.id');
```

다음과 같은 SQL 쿼리를 생성합니다 :

```sql
SELECT ... FROM users user GROUP BY user.id
```

더 많은 group-by를 추가하려면 `addGroupBY`를 사용하세요:

```typescript
createQueryBuilder('user').groupBy('user.name').addGroupBy('user.id');
```

`.groupBy`를 두번 이상 사용하면 이전의 모든 `GROUP BY`식이 재정의 됩니다.

## `LIMIT` 표현식 추가

`LIMIT`식을 추가하는 것은 매우 쉽습니다 :

```typescript
createQueryBuilder('user').limit(10);
```

다음과 같은 SQL 쿼리를 생성합니다 :

```sql
SELECT ... FROM users user LIMIT 10
```

SQL 쿼리의 결과는 데이터베이스 유형(SQL, MySQL, Postgres, 등등..)에 따라 달라집니다.
참고: 조인이나 서브쿼리를 사용하는 경우 LIMIT가 예상대로 작동하지 않을 수 있습니다. pagination을 사용하는 경우,
대신에 `take`를 사용하는것이 좋습니다.

## `OFFSET` 표현식 추가

`OFFSET`식을 추가하는 것은 매우 쉽습니다 :

```typescript
createQueryBuilder('user').offset(10);
```

다음과 같은 SQL 쿼리를 생성합니다 :

```sql
SELECT ... FROM users user OFFSET 10
```

SQL 쿼리의 결과는 데이터베이스 유형(SQL, MySQL, Postgres, 등등..)에 따라 달라집니다.
참고: 조인이나 서브쿼리를 사용하는 경우 OFFSET가 예상대로 작동하지 않을 수 있습니다. pagination을 사용하는 경우,
대신에 `skip`를 사용하는것이 좋습니다.

## 관계 조인

다음과 같은 엔티티가 있다고 가정해봅시다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Photo, (photo) => photo.user)
  photos: Photo[];
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne((type) => User, (user) => user.photos)
  user: User;
}
```

이제 사용자 "Timber"의 모든 사진을 로드하고 싶다고 가정해 보겠습니다 :

```typescript
const user = await createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .where('user.name = :name', { name: 'Timber' })
  .getOne();
```

얻은 결과는 다음과 같을것 입니다 :

```typescript
{
    id: 1,
    name: "Timber",
    photos: [{
        id: 1,
        url: "me-with-chakram.jpg"
    }, {
        id: 2,
        url: "me-with-trees.jpg"
    }]
}
```

보다시피 `leftJoinAndSelect`는 모든 Timber의 사진을 자동으로 로드합니다. 첫번째 인수는 로드할 관계이고,
두번째 인수는 이 관계의 테이블에 부여한 별칭입니다. query builder의 모든 위치에서 이 별칭을 사용할 수 있습니다.
예를 들어, 제거되지않은 Timber의 모든 사진을 구해보겠습니다.

```typescript
const user = await createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .where('user.name = :name', { name: 'Timber' })
  .andWhere('photo.isRemoved = :isRemoved', { isRemoved: false })
  .getOne();
```

다음과 같은 SQL 쿼리가 생성됩니다 :

```sql
SELECT user.*, photo.* FROM users user
    LEFT JOIN photos photo ON photo.user = user.id
    WHERE user.name = 'Timber' AND photo.isRemoved = FALSE
```

"where"를 사용하는 대신에 조인 표현식에 조건을 추가할 수도 있습니다 :

```typescript
const user = await createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo', 'photo.isRemoved = :isRemoved', { isRemoved: false })
  .where('user.name = :name', { name: 'Timber' })
  .getOne();
```

다음과 같은 SQL 쿼리가 생성됩니다 :

```sql
SELECT user.*, photo.* FROM users user
    LEFT JOIN photos photo ON photo.user = user.id AND photo.isRemoved = FALSE
    WHERE user.name = 'Timber'
```

## Inner 조인과 left 조인

`INNER JOIN` 대신에 `LEFT JOIN`을 사용하려면 대신에 `innerJoinAndSelect` 를 사용하세요.

```typescript
const user = await createQueryBuilder('user')
  .innerJoinAndSelect('user.photos', 'photo', 'photo.isRemoved = :isRemoved', { isRemoved: false })
  .where('user.name = :name', { name: 'Timber' })
  .getOne();
```

다음을 생성합니다 :

```sql
SELECT user.*, photo.* FROM users user
    INNER JOIN photos photo ON photo.user = user.id AND photo.isRemoved = FALSE
    WHERE user.name = 'Timber'
```

`LEFT JOIN`과 `INNER JOIN`의 차이점은 photo가 없는경우 `INNER JOIN`이 user를 반환하지 않는다는 것입니다.
`LEFT JOIN`은 photo가 없더라도 user를 반환합니다. 서로 다른 조인 타입에 대해 자세히 알아보려면 [SQL documentation](https://msdn.microsoft.com/en-us/library/zt8wzxy4.aspx)를 참조하세요.

## select 없이 조인

데이터를 선택하지 않고 조인할 수 있습니다. 이렇게 하려면, `leftJoin`이나 `innerJoin`을 사용하세요 :

```typescript
const user = await createQueryBuilder('user')
  .innerJoin('user.photos', 'photo')
  .where('user.name = :name', { name: 'Timber' })
  .getOne();
```

다음을 생성합니다 :

```sql
SELECT user.* FROM users user
    INNER JOIN photos photo ON photo.user = user.id
    WHERE user.name = 'Timber'
```

photo가 있으면 Timber를 선택하지만, photo를 반환하지는 않습니다.

## 엔티티와 테이블 조인

관계뿐만 아니라, 관련이 없는 다른 엔티티나 테이블에도 조인할 수 있습니다. 예시:

```typescript
const user = await createQueryBuilder('user').leftJoinAndSelect(Photo, 'photo', 'photo.userId = user.id').getMany();
```

```typescript
const user = await createQueryBuilder('user').leftJoinAndSelect('photos', 'photo', 'photo.userId = user.id').getMany();
```

## 조인 및 맵핑 기능

`profilePhoto`를 `user` 엔티티에 추가하면 `QueryBuilder`를 사용하여 해당 속성에 데이터를 연결할 수 있습니다 :

```typescript
export class User {
  /// ...
  profilePhoto: Photo;
}
```

```typescript
const user = await createQueryBuilder('user')
  .leftJoinAndMapOne('user.profilePhoto', 'user.photos', 'photo', 'photo.isForProfile = TRUE')
  .where('user.name = :name', { name: 'Timber' })
  .getOne();
```

Timber의 profile photo가 로드되고 `user.profilePhoto`로 설정됩니다. 단일 엔티티르 로드하고 맵핑하려면
`leftJoinAndMapOne`을 사용합니다. 여러 엔티티를 로드하고 맵핑하려면 `leftJoinAndMapMany`를 사용합니다.

## 생성된 쿼리 가져오기

가끔 `QueryBuilder`에서 생성한 쿼리를 가져오는 경우가 있습니다. 이렇게 하려면, `getSql`을 사용합니다 :

```typescript
const sql = createQueryBuilder('user')
  .where('user.firstName = :firstName', { firstName: 'Timber' })
  .orWhere('user.lastName = :lastName', { lastName: 'Saw' })
  .getSql();
```

디버깅을 위해 `printSql`을 사용할 수도 있습니다 :

```typescript
const users = await createQueryBuilder('user')
  .where('user.firstName = :firstName', { firstName: 'Timber' })
  .orWhere('user.lastName = :lastName', { lastName: 'Saw' })
  .printSql()
  .getMany();
```

이 쿼리는 user를 반환하고 사용된 sql문을 콘솔에 인쇄합니다.

## 생성된 raw 결과값 가져오기

select query builder를 사용하여 얻을 수 있는 결과는 **entites**와 **raw result**의 두가지 타입이 있습니다.
대부분의 경우 데이터베이스에서 실제 데이터를 선택해야 합니다. 이를 위해 `getOne`과 `getMany`를 사용합니다.
그러나 *모든 사용자의 사진 합*과 같은 특정 데이터를 선택해야 하는 경우도 있습니다. 이를 raw data라고 합니다.
raw data를 가져오려면 `getRawOne` 및 `getRawMany`를 사용합니다.
예시 :

```typescript
const { sum } = await getRepository(User)
  .createQueryBuilder('user')
  .select('SUM(user.photosCount)', 'sum')
  .where('user.id = :id', { id: 1 })
  .getRawOne();
```

```typescript
const photosSums = await getRepository(User)
  .createQueryBuilder('user')
  .select('user.id')
  .addSelect('SUM(user.photosCount)', 'sum')
  .groupBy('user.id')
  .getRawMany();

// result will be like this: [{ id: 1, sum: 25 }, { id: 2, sum: 13 }, ...]
```

## 결과 데이터 Streaming

`stream`을 사용하면 stream을 반환할 수 있습니다. 스트리밍은 raw data를 반환하며 엔티티 변환을 수동으로 처리해야 합니다:

```typescript
const stream = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: 1 }).stream();
```

## 페이지네이션 사용

애플리케이션을 개발할 때는 대부분의 경우 pagination 기능이 필요합니다. 이것은 pagination, 페이지 슬라이더 또는 무한 스크롤 컴포넌트가 있는 경우에 사용됩니다.

```typescript
const users = await getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .take(10)
  .getMany();
```

이렇게 하면 처음 10명의 사용자가 사진을 볼 수 있습니다.

```typescript
const users = await getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .skip(10)
  .getMany();
```

이렇게 하면 처음 10명을 제외한 모든 사용자에게 사진이 제공됩니다. 다음 방법을 결합할 수 있습니다 :

```typescript
const users = await getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .skip(5)
  .take(10)
  .getMany();
```

이렇게 하면 처음 5명의 사용자는 건너뛰고 10명의 사용자를 받습니다.

`take`와 `skip`은 `limit`와 `offset`을 사용하는 것처럼 보일 수 있지만, 그렇지 않습니다. 조인 또는 서브 쿼리를 사용하여
더 복잡한 쿼리를 가진 후에는 `limit` 및 `offset`이 예상대로 작동하지 않을 수 있지만, `take`나 `skip`을 사용하면 이러한
문제를 방지할 수 있습니다.

## 잠금 설정

QueryBuilder는 optimistic 와 pessimistic locking을 모두 지원합니다.
pessimistic read locking을 사용하려면 다음 방법을 사용합니다 :

```typescript
const users = await getRepository(User).createQueryBuilder('user').setLock('pessimistic_read').getMany();
```

pessimistic write locking을 사용하려면 다음 방법을 사용합니다.

```typescript
const users = await getRepository(User).createQueryBuilder('user').setLock('pessimistic_write').getMany();
```

dirty read locking을 사용하려면 다음 방법을 사용합니다.

```typescript
const users = await getRepository(User).createQueryBuilder('user').setLock('dirty_read').getMany();
```

optimistic locking을 사용하려면 다음 방법을 사용합니다.

```typescript
const users = await getRepository(User).createQueryBuilder('user').setLock('optimistic', existUser.version).getMany();
```

optimistic locking은 `@Version` 및 `@UpdatedDate` 데코레이터 모두와 함께 작동합니다.

## 부분 select

일부 엔티티 속성만 선택하려는 경우 다음 구문을 사용할 수 있습니다 :

```typescript
const users = await getRepository(User).createQueryBuilder('user').select(['user.id', 'user.name']).getMany();
```

`user`의 `id`와 `name`만 선택합니다.

## 서브쿼리 사용

서브쿼리를 쉽게 만들 수 있습니다. 서브쿼리는 `FROM`,`WHERE` 및 `JOIN` 표현식에서 지원됩니다. 예시:

```typescript
const qb = await getRepository(Post).createQueryBuilder('post');
const posts = qb
  .where(
    'post.title IN ' +
      qb.subQuery().select('user.name').from(User, 'user').where('user.registered = :registered').getQuery(),
  )
  .setParameter('registered', true)
  .getMany();
```

보다 우아한 방식으로 동일한 작업을 수행할 수 있습니다 :

```typescript
const posts = await connection
  .getRepository(Post)
  .createQueryBuilder('post')
  .where((qb) => {
    const subQuery = qb
      .subQuery()
      .select('user.name')
      .from(User, 'user')
      .where('user.registered = :registered')
      .getQuery();
    return 'post.title IN ' + subQuery;
  })
  .setParameter('registered', true)
  .getMany();
```

또는 별도의 query builder를 작성하고 생성된 SQL을 사용할 수 있습니다.

```typescript
const userQb = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .select('user.name')
  .where('user.registered = :registered', { registered: true });

const posts = await connection
  .getRepository(Post)
  .createQueryBuilder('post')
  .where('post.title IN (' + userQb.getQuery() + ')')
  .setParameters(userQb.getParameters())
  .getMany();
```

다음과 같이 `FROM`에서 서브 쿼리를 만들 수 있습니다 :

```typescript
const userQb = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .select('user.name', 'name')
  .where('user.registered = :registered', { registered: true });

const posts = await connection
  .createQueryBuilder()
  .select('user.name', 'name')
  .from('(' + userQb.getQuery() + ')', 'user')
  .setParameters(userQb.getParameters())
  .getRawMany();
```

또는 보다 우아한 구문을 사용할 수도 있습니다 :

```typescript
const posts = await connection
  .createQueryBuilder()
  .select('user.name', 'name')
  .from((subQuery) => {
    return subQuery
      .select('user.name', 'name')
      .from(User, 'user')
      .where('user.registered = :registered', { registered: true });
  }, 'user')
  .getRawMany();
```

subselect를 "second from"으로 추가하려면 `addFrom`을 사용합니다.

`SELECT`문에서도 subselect를 사용할 수 있습니다 :

```typescript
const posts = await connection
  .createQueryBuilder()
  .select('post.id', 'id')
  .addSelect((subQuery) => {
    return subQuery.select('user.name', 'name').from(User, 'user').limit(1);
  }, 'name')
  .from(Post, 'post')
  .getRawMany();
```

## 숨겨진 열

쿼리하려는 모델에 `select: false`를 가진 열이 있으면 `addSelect` 함수를 사용하여 열에서 정보를 검색해야 합니다.

다음과 같은 엔티티가 있다고 해 봅시다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;
}
```

표준 `find` 또는 쿼리를 사용하면 모델의 `password` 속성을 받을 수 없습니다. 그러나 다음 작업을 수행할 경우 :

```typescript
const users = await connection
  .getRepository(User)
  .createQueryBuilder()
  .select('user.id', 'id')
  .addSelect('user.password')
  .getMany();
```

쿼리에서 `password` 속성을 받게됩니다.