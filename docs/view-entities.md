# 뷰 엔티티

- [뷰 엔티티란?](<#뷰-엔티티(View-Entities)란>)
- [뷰 엔티티 열](#view-entity-columns)
- [완전한 예시](#완전한-예시)

## 뷰 엔티티(View Entities)란?

뷰 엔티티는 데이터베이스 뷰에 매핑되는 클래스입니다. 새 클래스를 정의하여 뷰 엔티티를 생성하고 `@ViewEntity()`로 표시할 수 있습니다 :

`@ViewEntity()`는 다음의 옵션들을 허용합니다.

- `name` - 뷰의 이름. 명시하지 않을경우 뷰의 이름은 엔티티 클래스의 이름에서 생성됩니다.

- `database` - 선택한 DB 서버의 데이터베이스 이름.

- `schema` - 스키마 이름.

- `expression` - 뷰를 정의합니다. **매개변수가 필요합니다**.

`expression`은 사용된 데이터베이스에 따라 적절하게 이스케이프된 열 또는 테이블일 수 있습니다 (예시는 postgres) :

```typescript
@ViewEntity({
    expression: `
        SELECT "post"."id" "id", "post"."name" AS "name", "category"."name" AS "categoryName"
        FROM "post" "post"
        LEFT JOIN "category" "category" ON "post"."categoryId" = "category"."id"
    `
})
```

또는 QueryBuilder의 인스턴스일 수 있습니다.

```typescript
@ViewEntity({
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("post.id", "id")
        .addSelect("post.name", "name")
        .addSelect("category.name", "categoryName")
        .from(Post, "post")
        .leftJoin(Category, "category", "category.id = post.categoryId")
})
```

**참고:** 드라이버 제한으로 인해 매개변수 바인딩이 지원되지 않습니다. 대신 리터럴 매개변수를 사용하세요.

```typescript
@ViewEntity({
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("post.id", "id")
        .addSelect("post.name", "name")
        .addSelect("category.name", "categoryName")
        .from(Post, "post")
        .leftJoin(Category, "category", "category.id = post.categoryId")
        .where("category.name = :name", { name: "Cars" })  // <-- 잘못된 방식입니다
        .where("category.name = 'Cars'")                   // <-- 이것이 옳은 방식입니다
})
```

각각의 뷰 엔티티는 connection 옵션에 등록해야 합니다:

```typescript
import { createConnection, Connection } from 'typeorm';
import { UserView } from './entity/UserView';

const connection: Connection = await createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: [UserView],
});
```

아니면 모든 엔티티가 포함된 전체 디렉토리를 지정할 수 있으며, 모든 엔티티가 로드됩니다 :

```typescript
import { createConnection, Connection } from 'typeorm';

const connection: Connection = await createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: ['entity/*.js'],
});
```

## 뷰 엔티티 열

뷰의 데이터를 올바른 엔티티 열에 매핑하려면 엔티티 열에 `@ViewColumn()` 데코레이터를 표시하고 이 열을 select문 별칭으로 지정해야 합니다.

문자열 표현식 정의에 대한 예제 :

```typescript
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
        SELECT "post"."id" AS "id", "post"."name" AS "name", "category"."name" AS "categoryName"
        FROM "post" "post"
        LEFT JOIN "category" "category" ON "post"."categoryId" = "category"."id"
    `,
})
export class PostCategory {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  categoryName: string;
}
```

QueryBuilder 사용 예제 :

```typescript
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('post.id', 'id')
      .addSelect('post.name', 'name')
      .addSelect('category.name', 'categoryName')
      .from(Post, 'post')
      .leftJoin(Category, 'category', 'category.id = post.categoryId'),
})
export class PostCategory {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  categoryName: string;
}
```

## 완전한 예시

두개의 엔티티와 이 엔티티에서 집계된 데이터를 포함하는 뷰를 만들어 봅시다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
```

```typescript
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('post.id', 'id')
      .addSelect('post.name', 'name')
      .addSelect('category.name', 'categoryName')
      .from(Post, 'post')
      .leftJoin(Category, 'category', 'category.id = post.categoryId'),
})
export class PostCategory {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  categoryName: string;
}
```

이 테이블들을 데이터로 채우고 PostCategory 뷰에서 모든 데이터를 요청하세요 :

```typescript
import { getManager } from 'typeorm';
import { Category } from './entity/Category';
import { Post } from './entity/Post';
import { PostCategory } from './entity/PostCategory';

const entityManager = getManager();

const category1 = new Category();
category1.name = 'Cars';
await entityManager.save(category1);

const category2 = new Category();
category2.name = 'Airplanes';
await entityManager.save(category2);

const post1 = new Post();
post1.name = 'About BMW';
post1.categoryId = category1.id;
await entityManager.save(post1);

const post2 = new Post();
post2.name = 'About Boeing';
post2.categoryId = category2.id;
await entityManager.save(post2);

const postCategories = await entityManager.find(PostCategory);
const postCategory = await entityManager.findOne(PostCategory, { id: 1 });
```

`postCategories`의 결과는 다음과 같을 것 입니다 :

```
[ PostCategory { id: 1, name: 'About BMW', categoryName: 'Cars' },
  PostCategory { id: 2, name: 'About Boeing', categoryName: 'Airplanes' } ]
```

그리고 `postCategory`의 결과도 다음과 같을 것 입니다 :

```
PostCategory { id: 1, name: 'About BMW', categoryName: 'Cars' }
```
