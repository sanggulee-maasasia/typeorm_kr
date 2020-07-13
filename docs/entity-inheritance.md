# 엔티티 상속

- [콘크리트 테이블 상속](#콘크리트-테이블-상속)
- [단일 테이블 상속](#단일-테이블-상속)
- [임베디드 사용](#임베디드-사용)

## 콘크리트 테이블 상속

엔티티 상속 패턴을 사용하여 코드의 중복을 줄일 수 있습니다. 가장 단순하고 효과적인것은 콘크리트 테이블 상속입니다.

예를 들어, `Photo`, `Question`, `Post` 엔티티가 있다고 해봅시다 :

```typescript
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  size: string;
}
```

```typescript
@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  answersCount: number;
}
```

```typescript
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  viewCount: number;
}
```

모든 엔티티에 `id`, `title`, `description`과 같은 공통적인 열이 있습니다. 중복을 줄이고, 더 나은 추상화를 위해 우리는 `Content`라고 불리는 기본 클래스를 만들 수 있습니다 :

```typescript
export abstract class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
```

```typescript
@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}
```

```typescript
@Entity()
export class Question extends Content {
  @Column()
  answersCount: number;
}
```

```typescript
@Entity()
export class Post extends Content {
  @Column()
  viewCount: number;
}
```

부모 엔티티(부모가 다른 엔티티도 확장할 수 있음)의 모든 열(연결, embeds, 등등..)은 최종 엔티티에서 상속되고 생성될 것입니다.

이 예제에서는 3개의 테이블이 생성 될것입니다 - `photo`, `question`, `post`.

## 단일 테이블 상속

TypeORM은 또한 단일 테이블 상속도 지원합니다. 단일 테이블 상속은 고유한 속성을 가진 클래스가 여러 개 일때의 패턴이지만, 데이터베이스에서는 동일한 테이블에 저장됩니다.

```typescript
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
```

```typescript
@ChildEntity()
export class Photo extends Content {
  @Column()
  size: string;
}
```

```typescript
@ChildEntity()
export class Question extends Content {
  @Column()
  answersCount: number;
}
```

```typescript
@ChildEntity()
export class Post extends Content {
  @Column()
  viewCount: number;
}
```

`Content`라고 불리는 단일 테이블이 생성되고 photo, question, post의 모든 인스턴스가 이 테이블에 저장됩니다.

## 임베디드 사용

앱에서 `embedded columns`를 사용하여(상속보다 컴포지션을 사용하여) 중복을 줄일 수 있는 놀라운 방법이 있습니다.
embedded entities에 대한 자세한 내용은 [여기](./embedded-entities.md)를 참조하세요.
