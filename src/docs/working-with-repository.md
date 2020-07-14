# 리포지토리란?

`Repository`는 `EntityManager`와 동일하지만, 그 운영은 concrete 엔티티에 한정됩니다.

`getRepository(Entity),Connection#getRepository,EntityManager#getRepository`를 통해 리포지토리에 엑세스 할 수 있습니다.

예시:

```typescript
import { getRepository } from 'typeorm';
import { User } from './entity/User';

const userRepository = getRepository(User); // getConnection().getRepository() 나 getManager().getRepository()를 통해 구해올 수 있습니다.
const user = await userRepository.findOne(1);
user.name = 'Umed';
await userRepository.save(user);
```

리포지토리에는 3가지 유형이 존재합니다.

- `Repository` - 일반적인 엔티티 리포지토리.

- `TreeRepository` - 리포지토리, 트리 엔티티에 사용되는 `Repository` 확장(예를 들면 `@Tree` 데코레이터로 표시된 엔티티).
  트리 구조를 다루는 특별한 방법이 있습니다.
- `MongoRepository` - MongoDB에서만 사용되는 특별한 함수들이 있는 리포지토리.
