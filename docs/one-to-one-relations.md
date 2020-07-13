# 일대일 관계

일대일 관계는 A가 B의 한 인스턴스만 포함하고, B는 A의 한 인스턴스만 포함하는 관계입니다. `User` 와 `Profile` 엔티티를 예시로 봅시다. User는 단일 Profile만 가질 수 있으며, Profile은 단일 user만 소유하고 있습니다.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne((type) => Profile)
  @JoinColumn()
  profile: Profile;
}
```

`profile` 에 `@OneToOne`을 추가하고 profile이 될 대상 관계 유형을 지정하세요. 또한 `@JoinColumn` 을 추가했는데, 이것은 반드시 관계의 한쪽에만 설정되어야 합니다. `@JoinColumn` 을 설정한 옆면, 그 옆 테이블에는 대상 엔티티 테이블에 대한 "relation id"와 외래 키가 들어 있습니다.

이 예제는 다음 테이블을 생성합니다 :

```shell
+-------------+--------------+----------------------------+
|                        profile                          |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| gender      | varchar(255) |                            |
| photo       | varchar(255) |                            |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
| profileId   | int(11)      | FOREIGN KEY                |
+-------------+--------------+----------------------------+
```

`@JoinColumn`은 데이터베이스 테이블의 외부 키가 있어야 하는 측면인 관계 한 쪽에만 설정되어야 합니다.

이러한 관계를 저장하는 방법 예제 :

```typescript
const profile = new Profile();
profile.gender = 'male';
profile.photo = 'me.jpg';
await connection.manager.save(profile);

const user = new User();
user.name = 'Joe Smith';
user.profile = profile;
await connection.manager.save(user);
```

cascade가 활성화 된 상태에서 한번의 `save` 호출이면 관계를 저장할 수 있습니다.

내부에 profile이 있는 user를 로드하려면 `FindOptions` 에 관계를 지정해야 합니다 :

```typescript
const userRepository = connection.getRepository(User);
const users = await userRepository.find({ relations: ['profile'] });
```

아니면 `QueryBuilder`를 이용하여 조인 할 수 있습니다 :

```typescript
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.profile', 'profile')
  .getMany();
```

관계에서 eager loading을 활성화 하면 관계를 지정하거나 연결할 필요가 없습니다 - 항상 자동으로 로드됩니다.

관계는 단방향과 양방향일 수 있습니다. 단방향은 한쪽에 있는 관계 데코레이터와의 관계입니다. 양방향은 양쪽에 있는 관계 데코레이터와의 관계 입니다.

방금 단방향 관계를 만들었으니 이제 양방향을 만들어 봅시다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;

  @OneToOne((type) => User, (user) => user.profile) // 두번째 인수로 반대쪽을 지정하세요.
  user: User;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne((type) => Profile, (profile) => profile.user) // 두번째 인수로 반대쪽을 지정하세요.
  @JoinColumn()
  profile: Profile;
}
```

방금 양방향 관계를 만들어 보았습니다. 참고: 관계의 반대쪽은 `@JoinColumn`을 가질 수 없습니다. `@JoinColumn` 는 외래키를 소유할 관계의 테이블에 있어야 합니다.

양방향 관계에서 `QueryBuilder`를 사용하여 양쪽에서 관계 join을 할 수 있습니다 :

```typescript
const profiles = await connection
  .getRepository(Profile)
  .createQueryBuilder('profile')
  .leftJoinAndSelect('profile.user', 'user')
  .getMany();
```
