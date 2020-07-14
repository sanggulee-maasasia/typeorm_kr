# Working with Relations

`RelationQueryBuilder`는 관계와 함께 작업할 수 있는 특별한 유형의 `QueryBuilder` 입니다.
이걸 사용하면, 엔티티를 로드할 필요 없이 데이터베이스의 엔티티를 서로 바인딩하거나 관련 엔티티를 쉽게
로드할 수 있습니다. 예시 :

예를 들어, `Post` 엔티티가 있으며, 이는 `Category`라고 불리는 `categories`와 다대다 관계를 가집니다.
이 다대다관계에 새로운 category를 추가하겠습니다 :

```typescript
import { getConnection } from 'typeorm';

await getConnection().createQueryBuilder().relation(Post, 'categories').of(post).add(category);
```

이 코드는 다음과 같습니다 :

```typescript
import { getRepository } from 'typeorm';

const postRepository = getRepository(Post);
const post = await postRepository.findOne(1, { relations: ['categories'] });
post.categories.push(category);
await postRepository.save(post);
```

그러나 부피가 더 큰 `save` 메소드를 호출하는 것과 달리 최소한의 작업만 수행하고 데이터베이스 내의 엔티티를 바인딩
하기 때문에 더 효율적입니다.

또한 이러한 접근법의 또 다른 이점은 모든 관련 엔티티를 푸시할 필요가 없다는 것입니다. 예를 들어, 하나의 게시물안에
10,000개의 카테고리를 가지고 있다면, 이 목록에 새로운 게시물을 추가하는것은 문제가 될 수 있습니다. 표준적인 방법은 게시물을
만개의 카테고리로 로드하고 새 카테고리를 푸시하고, 저장하는 것입니다. 이로 인해 성능 비용이 매우 많이 들어 기본적으로 프로덕션 결과에
적용되지 않습니다. 그러나 `RelationQueryBuilder`를 사용하면 문제가 해결됩니다.

또한, 엔티티 ID를 대신 사용 할 수 있으므로 항목을 "bind"할때 엔티티를 사용할 필요가 없습니다.
예를 들어 id = 3 인 카테고리를 id = 1 인 게시물에 추가해 보겠습니다.

```typescript
import { getConnection } from 'typeorm';

await getConnection().createQueryBuilder().relation(Post, 'categories').of(1).add(3);
```

복합 기본키를 사용하는 경우 다음과 같이 ID 맵으로 전달해야 합니다. 예시 :

```typescript
import { getConnection } from 'typeorm';

await getConnection()
  .createQueryBuilder()
  .relation(Post, 'categories')
  .of({ firstPostId: 1, secondPostId: 3 })
  .add({ firstCategoryId: 2, secondCategoryId: 4 });
```

엔티티를 추가하는 방법과 동일한 방법으로 엔티티를 제거할 수 있습니다 :

```typescript
import { getConnection } from 'typeorm';

// this code removes a category from a given post
await getConnection()
  .createQueryBuilder()
  .relation(Post, 'categories')
  .of(post) // you can use just post id as well
  .remove(category); // you can use just category id as well
```

관련 엔티티를 추가 및 제거하면 `many-to-many` 및 `one-to-many` 관계에서 작동합니다.
`one-to-one` 및 `many-to-one` 관계의 경우에는 `set`를 대신 사용합니다 :

```typescript
import { getConnection } from 'typeorm';

// this code sets category of a given post
await getConnection()
  .createQueryBuilder()
  .relation(Post, 'categories')
  .of(post) // you can use just post id as well
  .set(category); // you can use just category id as well
```

관계를 설정 해제(null로 설정)하려면 `null`을 `set` 메소드에 전달하기만 하면 됩니다.

```typescript
import { getConnection } from 'typeorm';

// this code unsets category of a given post
await getConnection()
  .createQueryBuilder()
  .relation(Post, 'categories')
  .of(post) // you can use just post id as well
  .set(null);
```

relational query builder는 관계 업데이트 외에도, 관계 엔티티를 로드할 수도 있습니다.
예를 들어 `Post` 엔티티 내부에 다대다 `categories` 관계와 다대일 `user` 관계가 있다고 가정하여 다음 코드를
사용할 수 있습니다.

```typescript
import { getConnection } from 'typeorm';

const post = await getConnection().manager.findOne(Post, 1);

post.categories = await getConnection()
  .createQueryBuilder()
  .relation(Post, 'categories')
  .of(post) // you can use just post id as well
  .loadMany();

post.author = await getConnection()
  .createQueryBuilder()
  .relation(User, 'user')
  .of(post) // you can use just post id as well
  .loadOne();
```
