# Custom repositories

데이터베이스 작업 방법을 포함하는 사용자 정의 리포지토리를 생성할 수 있습니다. 일반적으로 사용자 지정 리포지토리는 단일 엔티티에 대해 생성되며 특정 쿼리를 포함합니다.
예를 들어, 이름과 성을 기준으로 사용자를 검색하는 메소드 `findByName(firstName: string, lastName: string)`를 원한다고 가정해 봅시다. 이 메소드에 가장 적합한 장소는 `Repository` 이므로, `userReopsitory.findByName(...)` 처럼 부를 수 있습니다. 이 작업은 사용자 지정 리포지토리를 사용하여 수행할 수 있습니다.

사용자 정의 리포지토리를 만드는 방법에는 여러가지가 있습니다.

- [표준 리포지토리를 확장하는 사용자 정의 리포지토리](#표준-리포지토리를-확장하는-사용자-정의-리포지토리)
- [추상 리포지토리를 확장하는 사용자 정의 리포지토리](#추상-리포지토리를-확장하는-사용자-정의-리포지토리)
- [확장없는 사용자 정의 리포지토리](#확장없는-사용자-정의-리포지토리)
- [사용자 정의 리포지토리에서 트랜잭션 사용](#사용자-정의-리포지토리에서-트랜잭션-사용)

## 표준 리포지토리를 확장하는 사용자 정의 리포지토리

첫번째 방법은 `Repository` 를 확장한 사용자 정의 리포지토리를 만드는 것입니다.

예제:

```typescript
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByName(firstName: string, lastName: string) {
    return this.findOne({ firstName, lastName });
  }
}
```

그 다음 이방법을 사용하면 됩니다 :

```typescript
import { getCustomRepository } from 'typeorm';
import { UserRepository } from './repository/UserRepository';

const userRepository = getCustomRepository(UserRepository); // 또는 connection.getCustomRepository 또는 manager.getCustomRepository()
const user = userRepository.create(); // const user = new User(); 와 같습니다.
user.firstName = 'Timber';
user.lastName = 'Saw';
await userRepository.save(user);

const timber = await userRepository.findByName('Timber', 'Saw');
```

보시다시피 `getCustomRepository` 를 사용해서 리포지토리를 "get" 할 수 있으며, 리포지토리 내에 생성된 모든 메서드와 표준 엔티티 리포지토리의 모든 메서드에 액세스할 수 있습니다.

## 추상 리포지토리를 확장하는 사용자 정의 리포지토리

두번째 방법은 `AbstarctRepository`를 확장한 사용자 정의 리포지토리를 만드는 것입니다 :

```typescript
import { EntityRepository, AbstractRepository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  createAndSave(firstName: string, lastName: string) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    return this.manager.save(user);
  }

  findByName(firstName: string, lastName: string) {
    return this.repository.findOne({ firstName, lastName });
  }
}
```

그 다음 이 방법을 사용하면 됩니다 :

```typescript
import { getCustomRepository } from 'typeorm';
import { UserRepository } from './repository/UserRepository';

const userRepository = getCustomRepository(UserRepository); // 또는 connection.getCustomRepository 또는 manager.getCustomRepository()
await userRepository.createAndSave('Timber', 'Saw');
const timber = await userRepository.findByName('Timber', 'Saw');
```

이 유형의 리포지토리와 이전의 리포지토리의 차이점은 `Repository`가 가진 메소드를 모두 드러내지 않는다는 것 입니다. `AbstractRepository` 에는 public 메소드가 없으며, `manager` 와 `repository` 처럼 전부 protected 메소드입니다. 이는 고유한 public 메소드에서만 사용할 수 있습니다. `AbstractRepository` 확장은 표준 `Repository`의 메소드를 노출하고 싶지 않을때 유용합니다.

## 확장없는 사용자 정의 리포지토리

세번째 방법은 리포지토리에 아무것도 확장하지 않고 엔티티 매니저 인스턴스를 항상 허용하는 생성자를 정의하는 것입니다 :

```typescript
import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository()
export class UserRepository {
  constructor(private manager: EntityManager) {}

  createAndSave(firstName: string, lastName: string) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    return this.manager.save(user);
  }

  findByName(firstName: string, lastName: string) {
    return this.manager.findOne(User, { firstName, lastName });
  }
}
```

그 다음 이 방법을 사용하면 됩니다 :

```typescript
import { getCustomRepository } from 'typeorm';
import { UserRepository } from './repository/UserRepository';

const userRepository = getCustomRepository(UserRepository); // 또는 connection.getCustomRepository 또는 manager.getCustomRepository()
await userRepository.createAndSave('Timber', 'Saw');
const timber = await userRepository.findByName('Timber', 'Saw');
```

이 유형의 리포지토리는 아무것도 확장하지 않으며 `EntityManager`를 항상 허용하는 생성자만 정의하면 됩니다. 그런 다음 리포지토리 메소드의 어디서든지 사용할 수 있습니다. 또한 이 유형의 리포지토리는 특정한 엔티티에 바인드돼 있지 않으므로 여러 엔티티를 내부에서 조작할 수 있습니다.

## 트랜잭션에서 사용자 정의 리포지토리 사용하기와 사용자 정의 리포지토리가 서비스가 될수 없는 이유

사용자 정의 리포지토리는 서비스가 될 수 없습니다. 왜냐하면 앱에 사용자 정의 리포짙토리의 인스턴스(기본 repository나 entity manager)가 하나도 존재하지 않기 때문입니다. 앱에 다른 연결이 존재할 수 있다는 사실 외에도 repository와 manager가 트랜잭션과 다릅니다.

예제 :

```typescript
await connection.transaction(async (manager) => {
  // 트랜잭션에서는 트랜잭션에서 제공한 manager 인스턴스를 사용해야 합니다.
  // 전역 managers, repositories 나 custom repositories를 사용할 수 없습니다.
  // 왜냐하면 이 manager가 트랜잭션을 독점하고 있기 때문입니다.
  // 사용자 정의 리포지토리를 서비스형으로 쓴다고 가정해 봅시다.
  // 엔티티 매니저에는 고유한 인스턴스여야 하는 속성인 "manager"가 있습니다.
  // 하지만 전역 엔티티 manager 인스턴스가 없으며, 다음과 같을 수 없습니다.
  // 그렇기 때문에 사용자 지정 관리자는 각 엔티티 매니저에만 한정되며 서비스가 될 수 없습니다.
  // 또한 트랜잭션에서 문제 없이 사용자 정의 리포지토리를 사용할 수 있습니다 :

  const userRepository = manager.getCustomRepository(UserRepository); // 전역 getCustomRepository를 사용하지 마세요!!
  await userRepository.createAndSave('Timber', 'Saw');
  const timber = await userRepository.findByName('Timber', 'Saw');
});
```
