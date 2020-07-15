# 다대일 / 일대다 관계

다대일 / 일대다 관계는 A가 B의 인스턴스를 다수 포함하고 있고, B는 A의 인스턴스를 하나만 포함하는 관계입니다. `User`와 `Photo` 엔티티의 예시로 봅시다. User는 다수의 photo를 가질 수 있지만, photo는 하나의 user만 소유합니다.

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne((type) => User, (user) => user.photos)
  user: User;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Photo, (photo) => photo.user)
  photos: Photo[];
}
```

`photos` 속성에 `@OneToMany`를 추가하고 대상 관계 타입을 `Photo`로 지정했습니다.
`@ManyToOne` / `@OneToMany` 관계에서 `@JoinColumn`은 생략 가능합니다. `@OneToMany`는 `@ManyToOne` 없이는 존재 할 수 없습니다. `@OneToMany`를 사용하려면 `@ManyToOne`이 필요합니다. 그러나, 반대의 경우엔 필요하지 않습니다: `@ManyToOne` 관계에만 신경을 쓴다면 관련 엔티티에 `@OneToMany`를 달지 않고도 정의할 수 있습니다. `@ManyToOne`을 설정한 경우 - 관련된 엔티티가 "관계 id" 와 외래키를 갖습니다.

이 예제는 다음 테이블을 생성합니다 :

```shell
+-------------+--------------+----------------------------+
|                         photo                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| url         | varchar(255) |                            |
| userId      | int(11)      | FOREIGN KEY                |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
+-------------+--------------+----------------------------+
```

이러한 관계를 저장하는 방법 예시 :

```typescript
const photo1 = new Photo();
photo1.url = 'me.jpg';
await connection.manager.save(photo1);

const photo2 = new Photo();
photo2.url = 'me-and-bears.jpg';
await connection.manager.save(photo2);

const user = new User();
user.name = 'John';
user.photos = [photo1, photo2];
await connection.manager.save(user);
```

또는 해볼 수 있는 대안 :

```typescript
const user = new User();
user.name = 'Leo';
await connection.manager.save(user);

const photo1 = new Photo();
photo1.url = 'me.jpg';
photo1.user = user;
await connection.manager.save(photo1);

const photo2 = new Photo();
photo2.url = 'me-and-bears.jpg';
photo2.user = user;
await connection.manager.save(photo2);
```

cascade가 활성화 된 상태에서 한번의 `save` 호출이면 관계를 저장할 수 있습니다.

내부에 photo가 있는 user를 로드하려면 `FindOptions` 에 관계를 지정해야 합니다 :

```typescript
const userRepository = connection.getRepository(User);
const users = await userRepository.find({ relations: ['photos'] });

// 혹은 반대쪽에서

const photoRepository = connection.getRepository(Photo);
const photos = await photoRepository.find({ relations: ['user'] });
```

아니면 `QueryBuilder`를 사용해 조인 시킬 수 있습니다 :

```typescript
const users = await connection
  .getRepository(User)
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.photos', 'photo')
  .getMany();

// 혹은 반대쪽에서

const photos = await connection
  .getRepository(Photo)
  .createQueryBuilder('photo')
  .leftJoinAndSelect('photo.user', 'user')
  .getMany();
```

관계에서 eager loading을 활성화 하면 관계를 지정하거나 연결할 필요가 없습니다 - 항상 자동으로 로드됩니다.
