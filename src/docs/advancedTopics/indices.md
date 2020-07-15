# 인덱스

- [열 인덱스](#열-인덱스)
- [고유 인덱스](#고유-인덱스)
- [여러 열이 있는 인덱스](#여러-열이-있는-인덱스)
- [공간 인덱스](#공간-인덱스)
- [동기화 비활성화](#동기화-비활성화)

## 열 인덱스

인덱스를 작성할 열에 `@Index`를 사용하여 특정 열에 대한 데이터베이스 인덱스를 작성할 수 있습니다.
엔티티의 모든 열에 대한 인덱스를 작성할 수 있습니다. 예시 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  firstName: string;

  @Column()
  @Index()
  lastName: string;
}
```

인덱스 이름을 지정할 수도 있습니다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('name1-idx')
  @Column()
  firstName: string;

  @Column()
  @Index('name2-idx')
  lastName: string;
}
```

## 고유 인덱스

고유한 인덱스를 생성하려면 인덱스 옵션에서 `{ unique: true }`를 지정해야합니다.

> 참고: CockroachDB는 `UNIQUE` 제약으로 단일 인덱스를 저장합니다.

```typescript
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  firstName: string;

  @Column()
  @Index({ unique: true })
  lastName: string;
}
```

## 여러 열이 있는 인덱스

여러 열이 있는 인덱스를 만드려면 엔티티 자체에 `@index`를 추가하고 인덱스에 포함할 모든 열 속성 이름을
지정해야 합니다. 예시 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['firstName', 'lastName'])
@Index(['firstName', 'middleName', 'lastName'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;
}
```

## 공간 인덱스

MySQL 및 PostgreSQL (PostGIS가 존재할 때) 두 가지 모두 공간 인덱스를 지원합니다.

MySQL에서 열에 공간 인덱스를 만드려면 공간 타입(`geometry`, `point`, `linestring`, `polygon`, `multipoint`, `multilinestring`, `multipolygon`, `geometrycollection`)
을 사용하는 열에 `spatial: true` 라는 `Index`를 추가합니다 :

```typescript
@Entity()
export class Thing {
  @Column('point')
  @Index({ spatial: true })
  point: string;
}
```

PostgreSQL에서 열에 공간 인덱스를 만드려면 공간 타입(`geometry`, `geography`) 을 사용하는 열에
`spatial: true` 라는 `Index`를 추가합니다 :

```typescript
@Entity()
export class Thing {
  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Index({ spatial: true })
  point: Geometry;
}
```

## 동기화 비활성화

기존 데이터베이스 인덱스에 대한 정보를 가져오고 자동으로 동기화하는 여러 가지 문제와
다른 데이터베이스 세부 사항이 있기 때문에 TypeORM은 일부 인덱스 옵션 및 정의(예: `lower`, `pg_trgm`)를 지원하지 않습니다.
이러한 경우 원하는 인덱스 서명을 사용하여 수동으로(예: 마이그레이션) 인덱스를 생성해야 합니다.
동기화 중에 TypeORM이 이러한 인덱스를 무시하도록 하려면
`@Index` 데코레이터에서 `synchronize: false` 옵션을 사용합니다.

예를 들어, 대/소문자를 구분하지 않는 비교를 통해 인덱스를 만듭니다:

```sql
CREATE INDEX "POST_NAME_INDEX" ON "post" (lower("name"))
```

그 후에는 다음 스키마 동기화에서 삭제되지 않도록 이 인덱스에 대한 동기화를 비활성화해야 합니다:

```ts
@Entity()
@Index('POST_NAME_INDEX', { synchronize: false })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```
