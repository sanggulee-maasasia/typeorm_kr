# 관계

- [관계란?](#관계란?)
- [관계 옵션](#관계-옵션)
- [Cascades](#cascades)
- [`@JoinColumn` 옵션](#joincolumn-옵션)
- [`@JoinTable` 옵션](#jointable-옵션)

## 관계란?

관계는 관련된 엔티티와 쉽게 작업할 수 있도록 도와줍니다. 여러 유형의 관계가 존재합니다 :

- [one-to-one](./one-to-one-relations.md) 을 사용하는 `@OneToOne`
- [many-to-one](./many-to-one-one-to-many-relations.md)을 사용하는 `@ManyToOne`
- [one-to-many](./many-to-one-one-to-many-relations.md) 을 사용하는 `@OneToMany`
- [many-to-many](./many-to-many-relations.md) 을 사용하는 `@ManyToMany`

## 관계 옵션

There are several options you can specify for relations:

- `eager: boolean` - true로 설정하면, `find*` 메소드 혹은 `QueryBuilder`를 사용할때 항상 메인 엔티티가 같이 로드됩니다.

- `cascade: boolean | ("insert" | "update")[]` - true로 설정하면, 관련된 객체가 데이터베이스에 삽입 및 업데이트 됩니다. [cascade 옵션](#cascade-options) 배열을 지정할 수도 있습니다.

- `onDelete: "RESTRICT" | "CASCADE" | "SET NULL"` - 참조된 객체가 삭제될 때, 외래키의 작동방식을 지정합니다.

- `primary: boolean` - 관계의 열이 기본 열이 될 것인지 여부를 나타냅니다.

- `nullable: boolean` - 관계의 열이 null인지 아닌지 여부를 나타냅니다. 기본적으로는 null 입력이 가능합니다.

## Cascades

Cascades 예제:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Question, (question) => question.categories)
  questions: Question[];
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToMany((type) => Category, (category) => category.questions, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];
}
```

```typescript
const category1 = new Category();
category1.name = 'animals';

const category2 = new Category();
category2.name = 'zoo';

const question = new Question();
question.categories = [category1, category2];
await connection.manager.save(question);
```

이 예제에서 볼 수 있듯이 `category1` 과 `category2`에 대해 `save`를 호출하지 않았습니다. 그것들은 자동으로 삽입 될 것 입니다. `cascade`를 true로 설정했기 때문입니다.

명심하세요. 큰 힘은 큰 책임을 가져오는 법입니다. cascade는 관계와 함께 작업하기 쉽고 좋은 방법으로 보일수도 있지만, 원하지않는 어떤 객체가 데이터베이스에 저장될 때 버그와 보안 문제를 가져올 수도 있습니다. 또한, 데이터베이스에 새 객체를 저장할 때 덜 명시적인 방법을 제공합니다.

### Cascade Options

The `cascade` option can be set as a `boolean` or an array of cascade options `("insert", "update")[]`.

기본값은 `false`이며, cascade가 없다는 뜻입니다. `cascade: true`로 설정하면 모든 cascade가 활성화됩니다. 배열을 제공하여 옵션을 지정할 수도 있습니다.

예를 들면 :

```typescript
@Entity(Post)
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  // category에 대한 전체 cascade.
  @ManyToMany((type) => PostCategory, {
    cascade: true,
  })
  @JoinTable()
  categories: PostCategory[];

  // Cascade insert는 이 관계에 새로운 PostDetails 인스턴스가 설정된 경우
  // 이 Post 엔티티를 저장할 때 자동으로 DB에 삽입됨을 의미합니다.
  @ManyToMany((type) => PostDetails, (details) => details.posts, {
    cascade: ['insert'],
  })
  @JoinTable()
  details: PostDetails[];

  // cascade update는 기존 PostImage에 변경 사항이 있을 경우,
  // 이 Post 엔티티를 저장할 때 db에 자동으로 업데이트 됨을 의미합니다.
  @ManyToMany((type) => PostImage, (image) => image.posts, {
    cascade: ['update'],
  })
  @JoinTable()
  images: PostImage[];

  // cascade insert & update는 새로운 PostInformation 인스턴스나
  // 기존 인스턴스에 대한 업데이트가 있는 경우 이 Post 엔티티를 저장할 때
  // 자동으로 삽입되거나 업데이트됨을 의미한다.
  @ManyToMany((type) => PostInformation, (information) => information.posts, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  informations: PostInformation[];
}
```

## `@JoinColumn` 옵션

`@JoinColumn`은 외래키를 사용하여 조인 열을 포함하는 관계를 정의할 뿐만 아니라, 조인 열 이름과 참조된 열 이름을 커스터마이즈 할 수 있습니다.

`@JoinColumn`을 설정하면, 자동으로 `propertyName + referencedColumnName` 이라는 열이 데이터 베이스에 생성됩니다. 예시 :

```typescript
@ManyToOne(type => Category)
@JoinColumn() // 이 데코레이터의 경우 @ManyToOne이면 선택사항이지만, @OneToOne이라면 필수사항입니다.
category: Category;
```

이 코드는 데이터베이스에 `categoryId` 열을 생성합니다. 데이터베이스에서 이 이름을 변경하려면 커스텀 조인 열 이름을 지정하세요 :

```typescript
@ManyToOne(type => Category)
@JoinColumn({ name: "cat_id" })
category: Category;
```

조인 열은 항상 일부 다른 열을 참조합니다(외래키를 사용해서). 기본적으로 관계는 항상 관련 엔티티의 기본 열을 가르킵니다. 관련 엔터티의 다른 열과 관계를 생성하려면 `@JoinColumn` 에서도 해당 열을 지정하세요.

```typescript
@ManyToOne(type => Category)
@JoinColumn({ referencedColumnName: "name" })
category: Category;
```

The relation now refers to `name` of the `Category` entity, instead of `id`.
Column name for that relation will become `categoryName`.

You can also join multiple columns. Note that they do not reference the primary column of the related entity by default: you must provide the referenced column name.

```typescript
@ManyToOne(type => Category)
@JoinColumn([
    { name: "category_id", referencedColumnName: "id" },
    { name: "locale_id", referencedColumnName: "locale_id" }
])
category: Category;
```

## `@JoinTable` 옵션

`@JoinTable`은 `many-to-many` 관계에서 사용되며 "junction" 테이블의 조인 열을 설명합니다. junction 테이블은 TypeORM이 관련 엔티티를 참조하는 열로 자동 생성되는 특별한 별도 테이블입니다. `@JoinColumn`을 사용하여 연결 테이블 및 참조된 열 이름을 변경할 수 있습니다: 생성된 "junction" 테이블의 이름도 변경할 수 있습니다.

```typescript
@ManyToMany(type => Category)
@JoinTable({
    name: "question_categories", // 이 관계의 junction 테이블에 대한 테이블 이름
    joinColumn: {
        name: "question",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "category",
        referencedColumnName: "id"
    }
})
categories: Category[];
```

테이블에 복합 기본키가 있는 경우, 속성의 배열을 `@JoinTable`에 전송해야 합니다.
