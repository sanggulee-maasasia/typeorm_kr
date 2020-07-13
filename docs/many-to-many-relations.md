# 다대다 관계

- [다대다 관계란?](#다대다-관계란?)
- [다대다 관계 저장](#다대다-관계-저장)
- [다대다 관계 삭제](#다대다-관계-삭제)
- [다대다 관계 로딩](#다대다-관계-로딩)
- [양방향 관계](#양방향-관계)
- [사용자 지정 속성을 가진 다대다 관계](#사용자-지정-속성을-가진-다대다-관계)

## 다대다 관계란?

다대다 관계는 A가 B의 인스턴스를 다수 포함하고 있고, B도 A의 인스턴스를 다수 포함하고 있는 관계입니다.
`Question`과 `Category` 엔티티의 예시로 봅시다. Question은 다수의 categories를 가집니다. 그리고 각 category 역시 다수의 questions를 가집니다.

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

  @ManyToMany((type) => Category)
  @JoinTable()
  categories: Category[];
}
```

`@JoinTable()`은 `@ManyToMany` 관계를 사용할 때 필요합니다. `@JoinTable` 을 관계의 한쪽(관계의 소유주쪽)에 붙여야합니다.

이 예제는 다음 테이블을 생성합니다 :

```shell
+-------------+--------------+----------------------------+
|                        category                         |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                        question                         |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| title       | varchar(255) |                            |
| text        | varchar(255) |                            |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|              question_categories_category               |
+-------------+--------------+----------------------------+
| questionId  | int(11)      | PRIMARY KEY FOREIGN KEY    |
| categoryId  | int(11)      | PRIMARY KEY FOREIGN KEY    |
+-------------+--------------+----------------------------+
```

## 다대다 관계 저장

[cascades](./relations.md#cascades) 가 활성화 된 상태에서 한번의 `save` 호출이면 관계를 저장할 수 있습니다.

```typescript
const category1 = new Category();
category1.name = 'animals';
await connection.manager.save(category1);

const category2 = new Category();
category2.name = 'zoo';
await connection.manager.save(category2);

const question = new Question();
question.title = 'dogs';
question.text = 'who let the dogs out?';
question.categories = [category1, category2];
await connection.manager.save(question);
```

## 다대다 관계 삭제

[cascades](./relations.md#cascades) 가 활성화 된 상태에서 한번의 `save` 호출이면 관계를 삭제할 수 있습니다.

두 레코드 간의 다대다 관계를 삭제하려면 해당 필드에서 레코드를 제거한 후 저장하세요.

```typescript
const question = getRepository(Question);
question.categories = question.categories.filter((category) => {
  category.id !== categoryToRemove.id;
});
await connection.manager.save(question);
```

이렇게하면 join 테이블의 레코드만 지워집니다. `question`과 `categoryToRemove` 레코드는 여전히 존재할 것입니다.

## 관계를 cascade로 소프트 삭제

이 예제는 cascade의 소프트삭제가 어떻게 동작하는지 보여줍니다.

```typescript
const category1 = new Category();
category1.name = 'animals';

const category2 = new Category();
category2.name = 'zoo';

const question = new Question();
question.categories = [category1, category2];
const newQuestion = await connection.manager.save(question);

await connection.manager.softRemove(newQuestion);
```

이 예제를 보면 category1이나 category2에 대한 save나 softRemove가 호출되지 않았습니다. 그러나 이러한 관계 옵션의 cascade가 다음과 같이 이루어지면 자동으로 저장되고 소프트 삭제가 됩니다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany((type) => Category, (category) => category.questions, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];
}
```

## 다대다 관계 로딩

내부에 categories가 있는 question을 로드하려면 `FindOptions` 에 관계를 지정해야 합니다 :

```typescript
const questionRepository = connection.getRepository(Question);
const questions = await questionRepository.find({ relations: ['categories'] });
```

아니면 `QueryBuilder`를 사용해 조인 시킬 수 있습니다 :

```typescript
const questions = await connection
  .getRepository(Question)
  .createQueryBuilder('question')
  .leftJoinAndSelect('question.categories', 'category')
  .getMany();
```

관계에서 eager loading을 활성화 하면 관계를 지정하거나 연결할 필요가 없습니다 - 항상 자동으로 로드됩니다.

## 양방향 관계

관계는 단방향과 양방향일 수 있습니다. 단방향은 한쪽에 있는 관계 데코레이터와의 관계입니다. 양방향은 양쪽에 있는 관계 데코레이터와의 관계 입니다.

방금 단방향 관계를 만들어 봤으니 이제 양방향 관계를 만들어 봅시다 :

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

  @ManyToMany((type) => Category, (category) => category.questions)
  @JoinTable()
  categories: Category[];
}
```

관계를 양방향으로 만들어 봤습니다. 참고하세요, 반대 관계에는 `@JoinTable`이 존재하지 않습니다. `@JoinTable`은 관계의 한쪽 면에서만 있어야 합니다.

양방향 관계에서 `QueryBuilder`를 사용하면 양쪽의 관계에 join 할 수 있습니다.

```typescript
const categoriesWithQuestions = await connection
  .getRepository(Category)
  .createQueryBuilder('category')
  .leftJoinAndSelect('category.questions', 'question')
  .getMany();
```

## 사용자 지정 속성을 가진 다대다 관계

다대다 관계에 새로운 속성이 필요한 경우 새로운 엔티티를 만들어야 합니다. 예를들어
`post`와 `category` 엔티티가 `order` 열과 다대다 관계를 가지려면 두개의 `ManyToOne` 관계가 양방향과 사용자 정의 열을 가르키는 `PostToCategory` 엔티티를 생성해야 합니다.

```typescript
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post';
import { Category } from './category';

@Entity()
export class PostToCategory {
  @PrimaryGeneratedColumn()
  public postToCategoryId!: number;

  @Column()
  public postId!: number;

  @Column()
  public categoryId!: number;

  @Column()
  public order!: number;

  @ManyToOne((type) => Post, (post) => post.postToCategories)
  public post!: Post;

  @ManyToOne((type) => Category, (category) => category.postToCategories)
  public category!: Category;
}
```

또한 `Post`와 `Category`에 다음과 같은 관계를 추가해야 합니다 :

```typescript
// category.ts
...
@OneToMany(type => PostToCategory, postToCategory => postToCategory.category)
public postToCategories!: PostToCategory[];

// post.ts
...
@OneToMany(type => PostToCategory, postToCategory => postToCategory.post)
public postToCategories!: PostToCategory[];
```
