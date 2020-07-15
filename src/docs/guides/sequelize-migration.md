# sequelize에서 TypeORM으로 마이그레이션

- [연결 설정](#연결-설정)
- [스키마 동기화](#스키마-동기화)
- [모델 만들기](#모델-만들기)
- [다른 모델 설정](#다른-모델-설정)
- [모델 작업](#모델-작업)

## 연결 설정

sequelize에서 다음과 같이 연결을 만듭니다 :

```javascript
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
```

TypeORM에서 다음과 같이 연결을 만듭니다 :

```typescript
import { createConnection } from 'typeorm';

createConnection({
  type: 'mysql',
  host: 'localhost',
  username: 'username',
  password: 'password',
})
  .then((connection) => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
```

그런 다음 `getConnection`을 사용하여 앱의 모든 위치에서 연결 인스턴스를 가져올 수 있습니다.

더 자세한 내용은[Connections](../connection/working-with-connection.md)를 참조하세요.

## 스키마 동기화

sequelize에서 다음과 같이 스키마를 동기화합니다 :

```javascript
Project.sync({ force: true });
Task.sync({ force: true });
```

TypeORM에서는 그저 `synchronize: true`를 연결옵션에 추가하기만 하면 됩니다:

```typescript
createConnection({
  type: 'mysql',
  host: 'localhost',
  username: 'username',
  password: 'password',
  synchronize: true,
});
```

## 모델 만들기

모델이 sequelize에서 정의되는 방법은 다음과 같습니다 :

```javascript
module.exports = function (sequelize, DataTypes) {
  const Project = sequelize.define('project', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
  });

  return Project;
};
```

```javascript
module.exports = function (sequelize, DataTypes) {
  const Task = sequelize.define('task', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    deadline: DataTypes.DATE,
  });

  return Task;
};
```

TypeORM에서는 이러한 모형을 엔티티라고 하며 다음과 같이 정의할 수 있습니다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
```

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  deadline: Date;
}
```

파일당 하나의 엔티티 클래스를 정의하는 것이 좋습니다. TypeORM을 사용하면
클래스를 데이터베이스 모델로 사용할 수 있으며 모델의 어떤 부분이
데이터베이스 테이블의 일부가 될 것인지를 정의할 수 있는 선언적인 방법을 제공합니다.
TypeScript의 강력한 기능은 클래스에서 사용할 수 있는 유형 암시 및 기타 유용한 기능을 제공합니다.

자세한 내용은 [Entities and columns](../entity/entities.md)를 참조하세요.

## 다른 모델 설정

sequelize는 다음과 같습니다 :

```javascript
flag: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
```

다음과 같이 TypeORM에서 달성할 수 있습니다 :

```typescript
@Column({ nullable: true, default: true })
flag: boolean;
```

sequelize는 다음과 같습니다 :

```javascript
flag: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
```

다음과 같이 TypeORM에 기록됩니다 :

```typescript
@Column({ default: () => "NOW()" })
myDate: Date;
```

sequelize는 다음과 같습니다 :

```javascript
someUnique: { type: Sequelize.STRING, unique: true },
```

다음과 같이 TypeORM에서 달성할 수 있습니다 :

```typescript
@Column({ unique: true })
someUnique: string;
```

sequelize는 다음과 같습니다 :

```javascript
fieldWithUnderscores: { type: Sequelize.STRING, field: "field_with_underscores" },
```

TypeORM에서 다음과 같이 해석합니다 :

```typescript
@Column({ name: "field_with_underscores" })
fieldWithUnderscores: string;
```

sequelize는 다음과 같습니다 :

```javascript
incrementMe: { type: Sequelize.INTEGER, autoIncrement: true },
```

다음과 같이 TypeORM에서 달성할 수 있습니다 :

```typescript
@Column()
@Generated()
incrementMe: number;
```

sequelize는 다음과 같습니다 :

```javascript
identifier: { type: Sequelize.STRING, primaryKey: true },
```

다음과 같이 TypeORM에서 달성할 수 있습니다 :

```typescript
@Column({ primary: true })
identifier: string;
```

`createDate` 및 `updateDate`와 같은 열을 생성하려면 엔티티에서 두 개의 열(필요한 이름으로 이름 지정)을 정의해야 합니다.

```typescript
@CreateDateColumn();
createDate: Date;

@UpdateDateColumn();
updateDate: Date;
```

### 모델 작업

sequelize에서 새 모델을 만들고 저장하려면 다음과 같이 적습니다 :

```javascript
const employee = await Employee.create({ name: 'John Doe', title: 'senior engineer' });
```

TypeORM에서는 여러 가지 방법으로 새 모델을 만들고 저장할 수 있습니다 :

```typescript
const employee = new Employee(); // you can use constructor parameters as well
employee.name = 'John Doe';
employee.title = 'senior engineer';
await getRepository(Employee).save(employee);
```

또는 active record 패턴

```typescript
const employee = Employee.create({ name: 'John Doe', title: 'senior engineer' });
await employee.save();
```

데이터베이스에서 기존 엔티티를 로드하고 해당 속성의 일부를 바꾸려면 다음 방법을 사용할 수 있습니다.

```typescript
const employee = await Employee.preload({ id: 1, name: 'John Doe' });
```

더 자세한 내용은 [Active Record vs Data Mapper](active-record-data-mapper.md) 및 [Repository API](../entityManagerAndRepository/repository-api.md)를 참조하세요..

sequelize의 속성에 엑세스하려면 다음을 수행하세요 :

```typescript
console.log(employee.get('name'));
```

TypeORM에서는 다음을 간단히 수행할 수 있습니다 :

```typescript
console.log(employee.name);
```

sequelize에서 인덱스를 만드려면 다음을 수행합니다 :

```typescript
sequelize.define(
  'user',
  {},
  {
    indexes: [
      {
        unique: true,
        fields: ['firstName', 'lastName'],
      },
    ],
  },
);
```

TypeORM에서는 다음을 수행합니다 :

```typescript
@Entity()
@Index(['firstName', 'lastName'], { unique: true })
export class User {}
```

더 자세한 내용은 [Indices](../advancedTopics/indices.md)를 참조하세요.
