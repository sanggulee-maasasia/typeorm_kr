# 엔티티 매니저란?

`EntityManager` 를 사용하면 모든 엔티티를 관리 (삽입,업데이트,삭제,로드 등) 할 수 있습니다.
EntityManager는 한 장소에 있는 모든 엔티티 리포지토리의 콜렉션과 같습니다.

`getManager()` 또는 `Connection`을 통해 엔티티 관리자에 엑세스 할 수 있습니다.
사용 예시:

```typescript
import { getManager } from 'typeorm';
import { User } from './entity/User';

const entityManager = getManager(); // you can also get it via getConnection().manager
const user = await entityManager.findOne(User, 1);
user.name = 'Umed';
await entityManager.save(user);
```
