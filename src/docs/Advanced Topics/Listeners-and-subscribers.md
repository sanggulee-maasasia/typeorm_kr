# 엔티티 리스너 및 구독자(Entity Listeners and Subscribers)

- [엔티티 리스너란?](#엔티티-리스너란?)
  - [`@AfterLoad`](#afterload)
  - [`@BeforeInsert`](#beforeinsert)
  - [`@AfterInsert`](#afterinsert)
  - [`@BeforeUpdate`](#beforeupdate)
  - [`@AfterUpdate`](#afterupdate)
  - [`@BeforeRemove`](#beforeremove)
  - [`@AfterRemove`](#afterremove)
- [엔티티 구독자란?](#엔티티-구독자란?)

## 엔티티 리스너란?

엔티티에는 특정 엔티티 이벤트를 수신하는 사용자 정의 로직이 있는 메서드가 있을 수 있습니다.
어떤 이벤트를 듣고 싶은지에 따라 특별한 데코레이터와 함께 그 방법들을 표시해야 합니다. 예시 :

### `@AfterLoad`

엔티티에 임의의 이름을 가진 메소드를 정의하고 이를 `@AfterLoad`로 표시할 수 있으며, `QueryBuilder` 또는
리포지토리/매니저의 find 메소드를 사용하여 엔티티가 로드 될 때마다 이를 호출합니다. 예시 :

```typescript
@Entity()
export class Post {
  @AfterLoad()
  updateCounters() {
    if (this.likesCount === undefined) this.likesCount = 0;
  }
}
```

### `@BeforeInsert`

엔티티에 임의의 이름을 가진 메소드를 정의하고 이를 `@BeforeInsert`로 표시할 수 있으며,
리토지토리/매니저의 `save`를 사용하여 엔티티를 삽입하기 전에 이를 호출합니다. 예시 :

```typescript
@Entity()
export class Post {
  @BeforeInsert()
  updateDates() {
    this.createdDate = new Date();
  }
}
```

### `@AfterInsert`

엔티티에 임의의 이름을 가진 메소드를 정의하고 이를 `@AfterInsert`로 표시할 수 있으며,
리토지토리/매니저의 `save`를 사용하여 엔티티를 삽입한 후 이를 호출합니다. 예시 :

```typescript
@Entity()
export class Post {
  @AfterInsert()
  resetCounters() {
    this.counters = 0;
  }
}
```

### `@BeforeUpdate`

엔티티에 임의의 이름을 가진 메소드를 정의하고 이를 `@BeforeUpdate`로 표시할 수 있으며,
리토지토리/매니저의 `save`를 사용하여 기존 엔티티를 업데이트하기 전에 이를 호출합니다.
그러나 이는 모델에서 정보가 변경될 때만 발생합니다. 모델에서 아무것도 수정하지 않고 `save`를 실행하면
`@BeforeUpdate` 및 `@AfterUpdate`가 실행되지 않습니다. 예시 :

```typescript
@Entity()
export class Post {
  @BeforeUpdate()
  updateDates() {
    this.updatedDate = new Date();
  }
}
```

### `@AfterUpdate`

엔티티에 임의의 이름을 가진 메소드를 정의하고 이를 `@AfterUpdate`로 표시할 수 있으며,
리토지토리/매니저의 `save`를 사용하여 기존 엔티티를 업데이트한 후에 이를 호출합니다. 예시 :

```typescript
@Entity()
export class Post {
  @AfterUpdate()
  updateCounters() {
    this.counter = 0;
  }
}
```

### `@BeforeRemove`

엔티티에 임의의 이름을 가진 메소드를 정의하고 이를 `@BeforeRemove`로 표시할 수 있으며,
리토지토리/매니저의 `remove`를 사용하여 기존 엔티티를 삭제하기 전에 이를 호출합니다. 예시 :

```typescript
@Entity()
export class Post {
  @BeforeRemove()
  updateStatus() {
    this.status = 'removed';
  }
}
```

### `@AfterRemove`

엔티티에 임의의 이름을 가진 메소드를 정의하고 이를 `@BeforeRemove`로 표시할 수 있으며,
리토지토리/매니저의 `remove`를 사용하여 기존 엔티티를 삭제한 후에 이를 호출합니다. 예시 :

```typescript
@Entity()
export class Post {
  @AfterRemove()
  updateStatus() {
    this.status = 'removed';
  }
}
```

## 구독자란?

클래스를 특정 엔티티 이벤트 또는 엔티티 이벤트를 청취할 수 있는 이벤트 구독자로 표시합니다.
이벤트는 `QueryBuilder` 및 리포지토리/매니저 메소드를 사용하여 발생합니다. 예제:

```typescript
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return Post;
  }

  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<Post>) {
    console.log(`BEFORE POST INSERTED: `, event.entity);
  }
}
```

`EntitySubscriberInterface`에서 모든 메소드를 구현할 수 있습니다. 엔티티를 청취하려면 `listenTo` 메소드를 생략하고
`any`를 사용합니다.

```typescript
@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {
  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    console.log(`BEFORE ENTITY INSERTED: `, event.entity);
  }
}
```

TypeORM이 구독자를 로드하도록 [Connection Options](./connection-options.md#common-connection-options)에 `subscribers` 속성이 설정되어 있는지 확인합니다.
