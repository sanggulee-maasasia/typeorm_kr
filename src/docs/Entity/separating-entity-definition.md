# Separating Entity Definition

- [스키마 정의](#스키마-정의)
- [스키마 확장](#스키마-확장)
- [스키마 사용](#스키마-사용)

## 스키마 정의

데코레이터를 사용하여 모델에서 엔티티와 열을 바로 정의 할 수 있습니다. 하지만 일부의 사람들은 TypeORM에서 "entity schemas"라고 부르는 별도의 파일 내에 엔티티와 열을 정의하는 것을 선호합니다.

간단한 정의 예시 :

```ts
import { EntitySchema } from 'typeorm';

export const CategoryEntity = new EntitySchema({
  name: 'category',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
  },
});
```

관계에 대한 예시 :

```ts
import { EntitySchema } from 'typeorm';

export const PostEntity = new EntitySchema({
  name: 'post',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  relations: {
    categories: {
      type: 'many-to-many',
      target: 'category', // CategoryEntity
    },
  },
});
```

완전한 예시 :

```ts
import { EntitySchema } from 'typeorm';

export const PersonSchema = new EntitySchema({
  name: 'person',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    firstName: {
      type: String,
      length: 30,
    },
    lastName: {
      type: String,
      length: 50,
      nullable: false,
    },
    age: {
      type: Number,
      nullable: false,
    },
  },
  checks: [{ expression: `"firstName" <> 'John' AND "lastName" <> 'Doe'` }, { expression: `"age" > 18` }],
  indices: [
    {
      name: 'IDX_TEST',
      unique: true,
      columns: ['firstName', 'lastName'],
    },
  ],
  uniques: [
    {
      name: 'UNIQUE_TEST',
      columns: ['firstName', 'lastName'],
    },
  ],
});
```

엔티티가 typesafe하길 원하면 모델을 정의하고 스키마 정의에서 지정할 수 있습니다 :

```ts
import { EntitySchema } from 'typeorm';

export interface Category {
  id: number;
  name: string;
}

export const CategoryEntity = new EntitySchema<Category>({
  name: 'category',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
  },
});
```

## 스키마 확장

데코레이터 접근 방법을 사용할 때 기본 열을 추상 클래스로 확장하는것은 간단하고 쉽습니다. 예를 들어, `id`, `createdAt`, `updatedAt` 열은 `BaseEntity`에 정의 될 수 있습니다. 더 자세한 설명을 원하면, [concrete table inheritance](entity-inheritance.md#concrete-table-inheritance) 문서를 읽어보세요.

`EntitySchema` 접근방법을 사용할 때는 불가능합니다. 하지만, `Spread Operator` (`...`)를 유리하게 사용할 수 있습니다.

위의 `Category` 예제를 다시 생각해보세요. 기본 열 설명을 `extract`하여 다른 스키마에 걸쳐 재사용 하세요. 이는 다음과 같은 방법으로 할 수 있습니다 :

```ts
import { EntitySchemaColumnOptions } from 'typeorm';

export const BaseColumnSchemaPart = {
  id: {
    type: Number,
    primary: true,
    generated: true,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: 'created_at',
    type: 'timestamp with time zone',
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updated_at',
    type: 'timestamp with time zone',
    updateDate: true,
  } as EntitySchemaColumnOptions,
};
```

이제 다음과 같이 `BaseColumnSchemaPart`를 다른 스키마 모델에 사용할 수 있습니다 :

```ts
export const CategoryEntity = new EntitySchema<Category>({
  name: 'category',
  columns: {
    ...BaseColumnSchemaPart,
    // CategoryEntity에는 지금 정의된 id, createdAt, updatedAt 열이 있습니다!
    // 또는 다음과 같이 정의된 새 필드가 있습니다.
    name: {
      type: String,
    },
  },
});
```

`extended` 열을 `Category` 인터페이스에도 추가해야한단 것을 명심하세요 (`export interface Category extend BaseEntity`를 통해).

## 스키마 사용

물론, 리포지토리나 엔티티 매니저에서 데코레이터를 사용할 때 처럼 정의된 스키마를 사용 할 수 있습니다. 일부 데이터를 가져오거나 데이터베이스를 조작하려면 이전에 정의된 `Category` 예시(`interface` 및 `CategoryEnttiy` 스키마 포함)를 고려하십시오.

```ts
// 데이터 요청
const categoryRepository = getRepository<Category>(CategoryEntity);
const category = await categoryRepository.findOne(1); // category가 올바른 타입입니다!

// 새 category를 데이터베이스에 삽입합니다.
const categoryDTO = {
  // ID가 자동 생성된다는것을 참고 하세요.
  name: 'new category',
};
const newCategory = await categoryRepository.save(categoryDTO);
```
