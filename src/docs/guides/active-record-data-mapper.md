# Active Record vs Data Mapper

- [Active Record 패턴이란?](#Active-Record-패턴이란?)
- [Data Mapper 패턴이란?](#Data-Mapper-패턴이란?)
- [어떤걸 선택해야 하나요?](#어떤걸-선택해야-하나요?)

## Active Record 패턴이란?

TypeORM에서는 Active Record 및 Data Mapper 패턴을 모두 사용할 수 있습니다.

Active Record 접근방식을 사용하면, 모델 자체 내의 모든 쿼리 메소드를 정의하고 모델 메소드를 사용하여
객체를 저장, 제거 및 로드할 수 있습니다.

간단히 말해, Active Record 패턴은 모델 내의 데이터베이스에 엑세스하는 접근 방식입니다.
Active Record 패턴에 대해 더 자세한 내용은 [Wikipedia](https://en.wikipedia.org/wiki/Active_record_pattern)를 참조하세요.

예제:

```typescript
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;
}
```

모든 Active Record 엔티티는 `BaseEntity` 클래스를 확장해야 하며, 이 클래스는 엔티티와 함께 작업할 수 있는
메소드를 제공합니다. 이러한 엔티티를 사용하는 방법의 예시는 다음과 같습니다 :

```typescript
// example how to save AR entity
const user = new User();
user.firstName = 'Timber';
user.lastName = 'Saw';
user.isActive = true;
await user.save();

// example how to remove AR entity
await user.remove();

// example how to load AR entities
const users = await User.find({ skip: 2, take: 5 });
const newUsers = await User.find({ isActive: true });
const timber = await User.findOne({ firstName: 'Timber', lastName: 'Saw' });
```

`BaseEntity`에는 표준 `Repository`의 메소드가 대부분 존재합니다. 대부분의 경우 Active Record 엔티티와 함께
`Repository` 또는 `EntityManager`를 사용할 필요가 없습니다.

이제 이름과 성을 기준으로 사용자를 반환하는 함수를 만들려고 합니다.
`User` 클래스에서 정적 메서드와 같은 기능을 생성할 수 있습니다 :

```typescript
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;

  static findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder('user')
      .where('user.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', { lastName })
      .getMany();
  }
}
```

그리고 다른 방법과 마찬가지로 사용합니다 :

```typescript
const timber = await User.findByName('Timber', 'Saw');
```

## Data Mapper 패턴이란?

TypeORM에서는 Active Record 및 Data Mapper 패턴을 모두 사용할 수 있습니다.

Data Mapper 접근 방식을 사용하면, "repositories"라는 별도의 클래스에서 모든 쿼리 메소드를 정의하고
리포지토리를 사용하여 객체를 저장, 제거 및 로드할 수 있습니다. Data Mapper에서 엔티티는 매우 멍청합니다.
엔티티는 속성을 정의하고 "dummy" 메소드를 사용할 수 있습니다.

간단히 말해, Data Mapper는 모델 대신 리포지토리 내의 데이터베이스에 엑세스하는 접근 방식입니다.
더 자세한 내용은 [Wikipedia](https://en.wikipedia.org/wiki/Data_mapper_pattern)를 참조하세요.

예제:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;
}
```

이러한 엔티티를 사용하는 방법의 예는 다음과 같습니다 :

```typescript
const userRepository = connection.getRepository(User);

// example how to save DM entity
const user = new User();
user.firstName = 'Timber';
user.lastName = 'Saw';
user.isActive = true;
await userRepository.save(user);

// example how to remove DM entity
await userRepository.remove(user);

// example how to load DM entities
const users = await userRepository.find({ skip: 2, take: 5 });
const newUsers = await userRepository.find({ isActive: true });
const timber = await userRepository.findOne({ firstName: 'Timber', lastName: 'Saw' });
```

이제 이름과 성을 기준으로 사용자를 반환하는 함수를 만들려고 합니다. "custom repository"에서 이러한 기능을 만들 수 있습니다.

```typescript
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository()
export class UserRepository extends Repository<User> {
  findByName(firstName: string, lastName: string) {
    return this.createQueryBuilder('user')
      .where('user.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', { lastName })
      .getMany();
  }
}
```

그리고 다음과 같이 사용합니다 :

```typescript
const userRepository = connection.getCustomRepository(UserRepository);
const timber = await userRepository.findByName('Timber', 'Saw');
```

더 자세한 내용은 [custom repositories](../entityManagerAndRepository/custom-repository.md)를 참조하세요.

## 어떤걸 선택해야 하나요?

결정은 당신에게 달려 있습니다. 두 전략 모두 각자의 단점과 장점을 가지고 있습니다.

소프트웨어 개발 시 항상 염두에 두어야 할 사항 중 하나는 애플리케이션을 어떻게 유지관리할 것인가 하는 것입니다.
`Data Mapper` 접근 방식은 유지 보수성을 지원하므로 더 큰 규모의 애플리케이션에서 더욱 효과적입니다.
`Active Record` 접근 방식을 사용하면 소규모 앱에서 잘 작동하는 단순성을 유지할 수 있습니다.
그리고 단순성은 항상 유지 보수성을 향상시키는 열쇠입니다.
