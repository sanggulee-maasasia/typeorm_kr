# 임베디드 엔티티

`embedded columns`를 사용하여 애플리케이션에서 중복을 줄일 수 있는 놀라운 방법이 있습니다. 임베디드 열은 자체 열이 있는 클래스를 받아들여 해당 열을 현재 엔터티의 데이터베이스 테이블에 병합하는 열입니다.

`User`, `Empolyee`, `Student` 엔티티를 가지고 있다고 해봅시다. 모든 엔티티에는 공통적으로 `first name`과 `last name` 속성을 가지고 있습니다.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  salary: string;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  faculty: string;
}
```

우리가 할수있는건 새 클래스를 만들어 해당 열에서 `firstname` 및 `lastname` 중복을 줄이는 것입니다 :

```typescript
import { Column } from 'typeorm';

export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}
```

그런 다음 엔터티에서 해당 열을 "connect"할 수 있습니다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Name } from './Name';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column((type) => Name)
  name: Name;

  @Column()
  isActive: boolean;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Name } from './Name';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: string;

  @Column((type) => Name)
  name: Name;

  @Column()
  salary: number;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Name } from './Name';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: string;

  @Column((type) => Name)
  name: Name;

  @Column()
  faculty: string;
}
```

`name` 엔티티에 정의된 모든 열이 `user`, `employee`, `student`에 병합되었습니다 :

```shell
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| nameFirst   | varchar(255) |                            |
| nameLast    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                        employee                         |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| nameFirst   | varchar(255) |                            |
| nameLast    | varchar(255) |                            |
| salary      | int(11)      |                            |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                         student                         |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| nameFirst   | varchar(255) |                            |
| nameLast    | varchar(255) |                            |
| faculty     | varchar(255) |                            |
+-------------+--------------+----------------------------+
```

이러한 방식으로 엔티티 클래스의 코드 중복이 줄어듭니다. 임베디드 클래스에서 필요한만큼 열 ( 혹은 관계 ) 를 가질 수 있습니다. 또는 임베디드 클래스 안에 임베디드 열을 만들 수도 있습니다.
