# 트리 엔티티

TypeORM은 트리 구조를 저장할 수 있는 인접 리스트와 Closure 테이블 패턴을 지원합니다. 자세한 내용은 [Bill Karwin의 멋진 프레젠테이션](https://www.slideshare.net/billkarwin/models-for-hierarchical-data)을 참고하세요.

- [인접 리스트](#인접-리스트)
- [Nested set](#nested-set)
- [Materialized Path (aka Path Enumeration)](#구체화된-경로-aka-열거형-경로)
- [Closure 테이블](#closure-테이블)
- [트리 엔티티 작업](#working-with-tree-entities)

## 인접 리스트

인접 리스트는 자기 참조를 하는 간단한 모델입니다. 이 접근 방법의 이점은 간단하다는 점이지만, 단점은 조인 제한때문에 큰 트리는 한번에 로드 할수 없다는 것입니다.
인접 리스트를 사용했을때 얻는 이점에 대해 더 자세한 내용은 [Matthew Schinckel의 아티클](http://schinckel.net/2014/09/13/long-live-adjacency-lists/)을 확인하세요. 예제 :

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne((type) => Category, (category) => category.children)
  parent: Category;

  @OneToMany((type) => Category, (category) => category.parent)
  children: Category[];
}
```

## Nested set

Nested set은 데이터베이스에 트리구조를 저장하는 또다른 패턴입니다. 이는 읽기에는 매우 편리하지만, 쓰기에는 좋지 않습니다. nested set에서는 여러개의 루트를 가질 수 없습니다. 예제 :

```typescript
import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn } from 'typeorm';

@Entity()
@Tree('nested-set')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}
```

## 구체화된 경로 (aka 열거형 경로)

구체화된 경로(열거형 경로)는 데이터베이스에 트리구조를 저장하는 또다른 패턴입니다. 이는 간단하고 효과적입니다. 예제 :

```typescript
import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn } from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}
```

## Closure 테이블

Closure 테이블은 부모와 자식간의 관계를 분리된 테이블에 저장하는 특별한 방법입니다. 이는 읽기와 쓰기에 모두 효율적입니다. 예시 :

```typescript
import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn } from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}
```

### 참고:

컴포넌트의 부모를 업데이트하거나 삭제하는것은 아직 구현되지 않았습니다([관련 이슈 확인](https://github.com/typeorm/typeorm/issues/2032)). 이러한 작업중 하나를 수행하려면 closure 테이블을 명시적으로 업데이트 해야합니다.

## 트리 엔티티 작업

서로 바인드 된 트리 엔티티를 만들때 자녀에게 부모 엔티티를 설정하고 저장하는것이 중요합니다.
예를 들면 :

```typescript
const manager = getManager();

const a1 = new Category('a1');
a1.name = 'a1';
await manager.save(a1);

const a11 = new Category();
a11.name = 'a11';
a11.parent = a1;
await manager.save(a11);

const a12 = new Category();
a12.name = 'a12';
a12.parent = a1;
await manager.save(a12);

const a111 = new Category();
a111.name = 'a111';
a111.parent = a11;
await manager.save(a111);

const a112 = new Category();
a112.name = 'a112';
a112.parent = a11;
await manager.save(a112);
```

이러한 트리를 로드하려면 `TreeRepository` 를 사용하세요 :

```typescript
const manager = getManager();
const trees = await manager.getTreeRepository(Category).findTrees();
```

`trees`는 다음과 같을 것 입니다 :

```json
[
  {
    "id": 1,
    "name": "a1",
    "children": [
      {
        "id": 2,
        "name": "a11",
        "children": [
          {
            "id": 4,
            "name": "a111"
          },
          {
            "id": 5,
            "name": "a112"
          }
        ]
      },
      {
        "id": 3,
        "name": "a12"
      }
    ]
  }
]
```

`TreeRepository`를 통해 트리엔티티와 작업할 수 있는 다른 특별한 메소드들이 있습니다 :

- `findTrees` - 데이터베이스의 모든 트리, 모든 자식, 자식의 자식, 등등.. 을 반환합니다.

```typescript
const treeCategories = await repository.findTrees();
// 서브 범주의 안쪽까지 포함한 루트 범주 반환
```

- `findRoots` - 조상이 없는 루트 엔티티를 모두 찾습니다. 자식 잎은 불러오지 않습니다.

```typescript
const rootCategories = await repository.findRoots();
// 서브 범주의 안쪽까지 포함한 루트 범주 반환
```

- `findDescendants` - 주어진 엔티티의 모든 자식(자손)을 가져옵니다. 모두 flat 배열로 반환됩니다.

```typescript
const children = await repository.findDescendants(parentCategory);
// 부모 카테고리의 직접 서브카테고리(중첩된 카테고리는 제외)를 반환
```

- `findDescendantsTree` - 주어진 엔티티의 모든 자식(자손)을 가져옵니다. 서로 중첩된(nested) 트리로 반환합니다.

```typescript
const childrenTree = await repository.findDescendantsTree(parentCategory);
// 부모 카테고리의 직접 서브카테고리(중첩된 카테고리 포함)를 반환
```

- `createDescendantsQueryBuilder` - 트리에서 엔티티의 자손을 가져오는데 사용될 QueryBuilder를 생성합니다.

```typescript
const children = await repository
  .createDescendantsQueryBuilder('category', 'categoryClosure', parentCategory)
  .andWhere("category.type = 'secondary'")
  .getMany();
```

- `countDescendants` - 엔티티 자손의 수를 가져옵니다.

```typescript
const childrenCount = await repository.countDescendants(parentCategory);
```

- `findAncestors` - 주어진 엔티티의 모든 부모(조상)을 가져옵니다. 모두 flat 배열로 반환됩니다.

```typescript
const parents = await repository.findAncestors(childCategory);
// 자식 카테고리의 직접 부모 카테고리 반환 (부모의 부모 제외)
```

- `findAncestorsTree` - 주어진 엔티티의 모든 부모(조상)을 가져옵니다. 서로 중첩된(nested) 트리로 반환합니다.

```typescript
const parentsTree = await repository.findAncestorsTree(childCategory);
// 자식 카테고리의 직접 부모 카테고리 반환 (부모의 부모 포함)
```

- `createAncestorsQueryBuilder` - 트리에서 엔티티의 조상을 가져오는데 사용될 QueryBuilder를 생성합니다.

```typescript
const parents = await repository
  .createAncestorsQueryBuilder('category', 'categoryClosure', childCategory)
  .andWhere("category.type = 'secondary'")
  .getMany();
```

- `countAncestors` - 엔티티 조상의 수를 가져옵니다.

```typescript
const parentsCount = await repository.countAncestors(childCategory);
```
