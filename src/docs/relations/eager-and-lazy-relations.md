# Eager and Lazy Relations

## Eager relations

열정적인 관계는 데이터베이스에서 엔티티를 로드할 때마다 자동으로 관계를 로드해옵니다.

예제 :

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
    eager: true,
  })
  @JoinTable()
  categories: Category[];
}
```

이제 questions을 로드할 때 마다 조인이나 관계를 지정할 필요가 없어졌습니다 자동으로 로드됩니다 :

```typescript
const questionRepository = connection.getRepository(Question);

// question은 categories와 함께 로드 됩니다.
const questions = await questionRepository.find();
```

열정적인 관계는 `find*` 메소드를 사용할 때만 작동합니다. `QueryBuilder`를 사용할 경우 열정적인 관계는 비활성화 되고 관계를 불러오려면 `leftJoinAndSelect` 를 사용해야 합니다. 열정적인 관계는 관계의 한쪽에서만 사용 할 수 있습니다. `eager: true`를 관계의 양쪽에서 사용하는 것은 허용되지 않습니다.

## 게으른 관계

게으른 관계에 있는 엔티티는 한번 엑세스하면 로드됩니다. 그러한 관계에는 `Promise`가 있어야 합니다. promise에는 값을 저장하고 로드하면, promise도 같이 반환됩니다. 예제 :

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
  questions: Promise<Question[]>;
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

  @ManyToMany((type) => Category, (category) => category.questions)
  @JoinTable()
  categories: Promise<Category[]>;
}
```

`categories`는 Promise 입니다. 이는 게으르고 값이 존재하는 Promise만 저장할 수 있다는 뜻입니다.

이러한 관계를 저장하는 방법 예시 :

```typescript
const category1 = new Category();
category1.name = 'animals';
await connection.manager.save(category1);

const category2 = new Category();
category2.name = 'zoo';
await connection.manager.save(category2);

const question = new Question();
question.categories = Promise.resolve([category1, category2]);
await connection.manager.save(question);
```

게으른 관계 안에서 객체를 로드하는 방법 예시 :

```typescript
const question = await connection.getRepository(Question).findOne(1);
const categories = await question.categories;
// 이제 모든 questions의 categories가 변수 "categories"에 포함됩니다.
```

참고: 다른 언어(JAVA, PHP, etc.)에서 왔으며 게으른 관계를 사용하는데 익숙하다면 주의하십시오. 그 언어들은 비동기적이지 않고, 게으른 로딩은 다른 방식으로 이루어지기 때문에 Promise와 함께 작동하지 않습니다. JavaScript 및 NodeJs에서는 지연로드 관계를 사용하려면 promise를 사용해야 합니다. 이는 비표준 기술이며 TypeORM에서 테스트를 고려하고 있습니다.
