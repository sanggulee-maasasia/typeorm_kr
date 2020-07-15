# Relations FAQ

- [자기 참조 관계를 만드는 방법](#자기-참조-관계를-만드는-방법)
- [관계 join 없이 관계 id 사용하는 방법](#관계-join-없이-관계-id-사용하는-방법)
- [엔티티에서 관계 불러오는 방법](#엔티티에서-관계-불러오는-방법)
- [관계 속성에 대한 초기화 방지](#관계-속성에-대한-초기화-방지)

## 자기 참조 관계를 만드는 방법

자기참조 객체는 그들 자신과 관계가 있는 객체입니다. 이는 트리와 같은 구좆에 엔티티를 저장할 때 유용합니다. 또한 "adjacency list" 패턴은 자체 참조 관계를 사용해서 구현합니다. 예를 들어, 애플리케이션에서 categories 트리를 만들려고 합니다, 여기서 Categories는 categories를 중첩하고, 중첩된 categories는 또 다른 중첩된 categories를 중첩할 수 있습니다. 여기서 자기 참조 관계는 편리합니다. 기본적으로 자기 참조 관계는 엔티티 자체를 대상으로 하는 정기적인 관계일 뿐입니다.

예시 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToOne((type) => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategories: Category[];
}
```

## 관계 join 없이 관계 id 사용하는 방법

때때로 관련 객체를 로딩하지 않고 객체 id를 원할 수 있습니다.

그에 대한 예제 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne((type) => Profile)
  @JoinColumn()
  profile: Profile;
}
```

`profile`에 가입하지 않은 사용자를 로드하면 사용자 개체에 프로필에 대한 정보가 없을 뿐만 아니라, 프로필 ID도 제공되지 않습니다 :

```javascript
User {
  id: 1,
  name: "Umed"
}
```

그러나 이 사용자의 전체 프로필을 로드하지 않고 유저의 `profile id`만을 알고 싶을 때도 있다. 이렇게 하려면 관계에서 만든 열과 정확히 같은 `@Column` 을 사용하여 엔티티에 다른 속성을 추가하면 됩니다. 예제 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  profileId: number;

  @OneToOne((type) => Profile)
  @JoinColumn()
  profile: Profile;
}
```

이게 다입니다. 그다음에 User 객체를 로드하면 profile id가 포함되어 있습니다 :

```javascript
User {
  id: 1,
  name: "Umed",
  profileId: 1
}
```

## 엔티티에서 관계 불러오는 방법

엔티티 관계를 불러오는 가장 쉬운 방법은 `FindOptions`에서 `relations` 옵션을 사용하는 것입니다 :

```typescript
const users = await connection.getRepository(User).find({ relations: ['profile', 'photos', 'videos'] });
```

대신에 좀 더 유연한 방법은 `QueryBuilder`를 사용하는 것입니다 :

```typescript
const user = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .leftJoinAndSelect('user.photos', 'photo')
  .leftJoinAndSelect('user.videos', 'video')
  .getMany();
```

`QueryBuilder`를 사용하여 `leftJoinAndSelect` 대신에 `innerJoinAndSelect` 를 사용할 수 있습니다(`LEFT JOIN` 과 `INNER JOIN`의 차이점은 사용중인 SQL 문서를 참조하세요). 상태와 생성 순서 등에 따라 관계 데이터를 조인할 수 있습니다.

QueryBuilder에 대해 더 자세한 내용은 [`여기`](../queryBuilder/select-query-builder.md)를 참조하세요.

## 관계 속성에 대한 초기화 방지

때로는 다음과 같은 관계 속성을 초기화하는것이 유용합니다. 예제 :

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

  @ManyToMany((type) => Category, (category) => category.questions)
  @JoinTable()
  categories: Category[] = []; // see = [] 여기를 초기화
}
```

하지만 TypeORM 엔티티에서는 문제가 발생할 수 있습니다. 문제에 대해 이해하려면 먼저 초기화를 설정하지 않고 Question 엔티티를 로드해 봅시다. Question을 로드하면 다음과 같은 객체가 반환됩니다 :

```javascript
Question {
    id: 1,
    title: "Question about ..."
}
```

이제 이 객체를 내부에 저장해도 그것은 설정되지 않았기 때문에 건드리지 않을 것 입니다.

하지만 이니셜라이저가 있다면, 로드된 객체는 다음과 같습니다 :

```javascript
Question {
    id: 1,
    title: "Question about ...",
    categories: []
}
```

객체를 저장할 때 객체는 Question에 바인딩된 categories가 있는지 확인하고, category를 모두 분리합니다. 왜냐고요? `[]`와 같은 관계이거나 그 안에 있는 항목들은 거기서 어떤 것이 제거된 것처럼 간주되기 때문에, 엔티티에서 어떤 객체가 제거 되었는지 여부를 확인할 수 있는 다른 방법은 없습니다.

따라서 이와 같은 객체를 저장하면 문제가 발생하며 이전에 설정된 모든 categories가 제거됩니다.

어떻게 하면 이런 행동을 방지할 수 있을까요? 단순히 엔티티에서 배열을 초기화하지 않으면 됩니다. 생성자에게도 동일한 규칙이 적용 됩니다. 생성자에서도 초기화를 하지 마세요.
