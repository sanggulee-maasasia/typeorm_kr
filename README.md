<div align="center">
  <a href="http://typeorm.io/">
    <img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" width="492" height="228">
  </a>
  <br>
  <br>
	<a href="https://travis-ci.org/typeorm/typeorm">
		<img src="https://travis-ci.org/typeorm/typeorm.svg?branch=master">
	</a>
	<a href="https://badge.fury.io/js/typeorm">
		<img src="https://badge.fury.io/js/typeorm.svg">
	</a>
	<a href="https://david-dm.org/typeorm/typeorm">
		<img src="https://david-dm.org/typeorm/typeorm.svg">
	</a>
    <a href="https://codecov.io/gh/typeorm/typeorm">
        <img alt="Codecov" src="https://img.shields.io/codecov/c/github/typeorm/typeorm.svg">
    </a>
	<a href="https://join.slack.com/t/typeorm/shared_invite/enQtNDQ1MzA3MDA5MTExLTUxNTZhM2Q4NDNhMjMzNjQ2NGM1ZjI1ZGRkNjJjYzI4OTZjMGYyYTc0MzAxYTdjMWE3ZDIxOWUzZTdlM2QxNTY">
		<img src="https://img.shields.io/badge/chat-on%20slack-blue.svg">
	</a>
  <br>
  <br>
</div>

TypeORM은 NodeJs, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, Electron 플랫폼에서 실행할 수 있는 [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping)으로, Typescript와 Javascript(ES5,ES6,ES7,ES8)로 사용할 수 있습니다.
우리의 목표는 항상 최신 Javascript 기능을 지원하고 테이블이 몇 개 없는 작은 애플리케이션부터 다중 데이터베이스를 사용하는 대규모 엔터프라이즈 애플리케이션까지 데이터베이스를 사용하는 모든 종류의 애플리케이션을 개발할 수 있도록 추가 기능을 제공하는 것입니다.

TypeORM은 현존하는 Javascript ORM들과는 다르게, [Active Record](./src/docs/guides/active-record-data-mapper.md#Active-Record-패턴이란), [Data Mapper](./src/docs/guides/active-record-data-mapper.md#Data-mapper-패턴이란) 패턴을 지원합니다. 이는 여러분들이 높은 퀄리티의 느슨한 결합을 지원하고 확장가능하며 유지보수가 가능한 애플리케이션을 가장 생산적인 방법으로 작성할 수 있다는것을 의미합니다.

TypeORM은 [Hibernate](http://hibernate.org/orm/), [Doctrine](http://www.doctrine-project.org/), [Entity Framework](https://www.asp.net/entity-framework)와 같은 ORM들에 많은 영향을 받았습니다.

TypeORM의 몇가지 특징을 꼽자면 :

- [DataMapper](./src/docs/guides/active-record-data-mapper.md#Data-mapper-패턴이란)와 [ActiveRecord](./src/docs/guides/active-record-data-mapper.md#Active-Record-패턴이란) 둘다 지원합니다. (선택하세요)
- entities와 columns
- 데이터베이스별 column 타입들
- 엔티티 관리자(Entity manager)
- repositories와 custom repositories
- 깔끔한 객체 관계 모델
- associations (relations)
- 열정적인 관계(eager relations)와 게으른 관계(lazy relations)
- 단방향과 쌍방향, 그리고 자기 참조 관계
- 다중 상속 패턴
- cascades
- indices
- transactions
- 연결 풀(connection poling)
- 이중화(replication)
- 다중 데이터베이스 연결을 사용합니다.
- 여러 데이터베이스 유형으로 작업 가능
- 데이터베이스, 스키마 간의 쿼리
- 우아한 문법과 유연하고 강력한 QueryBuilder
- left join과 inner joins
- 조인을 사용해 쿼리에 적절한 페이지 지정
- 쿼리 캐싱
- 원시 결과값 스트리밍
- 로깅(logging)
- 청취자(listeners)와 구독자(subscribers) (hooks)
- 테이블 폐쇄 패턴(closure table pattern) 지원
- 모델 또는 별도의 설정파일을 통한 스키마 선언
- json / xml / yml / env 형식의 연결 설정
- MySQL / MariaDB / Postgres / CockroachDB / SQLite / Microsoft SQL Server / Oracle / SAP Hana / sql.js 지원
- MongoDB NoSQL 데이터베이스 지원
- NodeJS / Browser / Ionic / Cordova / React Native / NativeScript / Expo / Electron 환경에서 작동합니다.
- TypeScript와 JavaScript 지원
- 생산된 코드는 성능이 우수하고 유연하며, 깨끗하고 유지 가능합니다.
- 가능한 모든 모범 사례 적용
- CLI

그 밖에도 많은 특징들이 있습니다...

TypeORM을 사용한 모델은 다음과 같을 것 입니다:

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
  age: number;
}
```

도메인 논리는 다음과 같습니다:

```typescript
const user = new User();
user.firstName = 'Timber';
user.lastName = 'Saw';
user.age = 25;
await repository.save(user);

const allUsers = await repository.find();
const firstUser = await repository.findOne(1); // find by id
const timber = await repository.findOne({ firstName: 'Timber', lastName: 'Saw' });

await repository.remove(timber);
```

또는 `ActiveRecord`를 사용한다면, 다음을 사용 할 수도 있습니다:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}
```

도메인 논리는 다음과 같습니다:

```typescript
const user = new User();
user.firstName = 'Timber';
user.lastName = 'Saw';
user.age = 25;
await user.save();

const allUsers = await User.find();
const firstUser = await User.findOne(1);
const timber = await User.findOne({ firstName: 'Timber', lastName: 'Saw' });

await timber.remove();
```

## 설치

1. npm 패키지를 설치하십시오 :

   `npm install typeorm --save`

2. `reflect-metadata`를 설치해야합니다 :

   `npm install reflect-metadata --save`

   그리고 앱의 글로벌 위치에서 import 합니다. (예를 들면 app.ts):

   `import "reflect-metadata";`

3. node설치가 필요할 수도 있습니다:

   `npm install @types/node --save`

4. 데이터베이스 드라이버를 설치하십시오:

   - **MySQL**이거나 **MariaDB**의 경우

     `npm install mysql --save` (mysql2 대신에 설치할 수도 있습니다)

   - **PostgreSQL**이거나 **CockroachDB**의 경우

     `npm install pg --save`

   - **SQLite**의 경우

     `npm install sqlite3 --save`

   - **Microsoft SQL Server**의 경우

     `npm install mssql --save`

   - **sql.js**의 경우

     `npm install sql.js --save`

   - **Oracle**의 경우

     `npm install oracledb --save`

     Oracle 드라이버가 작동하게 하려면, [해당](https://github.com/oracle/node-oracledb) 사이트의 설치지침을 따라야합니다.

- **SAP Hana**의 경우

  ```
  npm config set @sap:registry https://npm.sap.com
  npm i @sap/hana-client
  npm i hdb-pool
  ```

- **MongoDB**의 경우 (experimental)

  `npm install mongodb --save`

- **NativeScript**, **react-native**이거나 **Cordova**의 경우

  [지원되는 플랫폼](https://github.com/typeorm/typeorm/blob/master/docs/supported-platforms.md)을 확인하십시오.

사용할 데이터베이스에 따라 이중에서 _하나만_ 설치하십시오.

##### TypeScript 설정

타입스크립트 버전이 **3.3**보다 높은지 확인하십시오, 그리고 `tsconfig.json`에서 다음 설정을 사용하도록 했는지 확인하십시오:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

컴파일러 옵션의 `lib` 섹션에서 `es6`을 사용하도록 설정하거나, `@types`에서 `es6-shim`을 설치해야 할 수도 있습니다.

## 빠른 시작

TypeORM을 시작하는 가장 빠른 방법은 CLI 커맨드를 사용하여 시작 프로젝트를 만드는 것입니다. 빠른 시작은 Nodejs 애플리케이션에서 TypeORM을 사용할때만 작동합니다. 다른 플랫폼을 사용중일경우 [단계별 지침서](#단계별-지침서)를 진행하십시오.

먼저, TypeORM을 전역적으로 설치합니다 :

```
npm install typeorm -g
```

그 다음, 새 프로젝트를 만들고싶은 경로에 가서 다음 커맨드를 실행하십시오 :

```
typeorm init --name MyProject --database mysql
```

여기서 `name`은 여러분의 프로젝트 혹은 데이터베이스 이름을, `database`는 여러분이 사용할 데이터베이스입니다.
데이터베이스는 다음 값들 중 하나가 될 수 있습니다 : `mysql`, `mariadb`, `postgres`, `cockroachdb`, `sqlite`, `mssql`, `oracle`, `mongodb`,
`cordova`, `react-native`, `expo`, `nativescript`.

이 명령은 다음 파일을 사용하여 `MyProject` 디렉토리에 새 프로젝트를 생성합니다 :

```
MyProject
├── src              // TypeScript 코드 위치
│   ├── entity       // entity가 저장되는 위치
│   │   └── User.ts  // 샘플 entity
│   ├── migration    // migration이 저장되는 위치
│   └── index.ts     // 앱의 시작포인트
├── .gitignore       // 표준 .gitignore 파일
├── ormconfig.json   // ORM 및 데이터베이스 연결 설정
├── package.json     // node 모듈 종속성
├── README.md        // 간단한 readme 파일
└── tsconfig.json    // Typescript 컴파일러 설정
```

> 기존의 node 프로젝트에서도 `typeorm init` 명령을 사용할수 있지만, 이미 존재하는 일부 파일을 재정의 할 수 있으니 주의하십시오.

다음 단계는 새로운 프로젝트 종속성을 설치해보는 것입니다:

```
cd MyProject
npm install
```

설치가 진행되는 동안, `ormconfig.json`파일을 편집하고 데이터베이스 connection 설정을 넣으십시오:

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "test",
  "password": "test",
  "database": "test",
  "synchronize": true,
  "logging": false,
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"]
}
```

대부분의 경우 `host`, `username`, `password`, `database` 그리고 `port` 설정만 하면 됩니다.

설정과 모든 node 모듈이 설치되면, 애플리케이션을 실행할 수 있습니다:

```
npm start
```

애플리케이션이 성공적으로 실행되고 새로운 유저를 데이터베이스에 삽입해야합니다. 이 프로젝트를 진행하면서 필요한 다른 모듈을 통합하고 더 많은 entity를 만들 수 있습니다.

> `typeorm init --name MyProject --database mysql --express` 명령어를 실행하면 express가 설치된 프로젝트를 생성할 수 있습니다.

## 단계별 지침서

ORM에게 무엇을 기대하고 있습니까? 우선, 유지 관리하기 어려운 SQL쿼리를 많이 작성하지 않고도 데이터베이스 테이블을 생성하고, 검색/삽입/업데이트/삭제 할 수 있습니다. 이 안내서에서는 어떻게 처음부터 Typeorm을 설정하고 ORM에서 기대한 것을 수행하는 방법을 보여줍니다.

### 모델(Model) 생성

데이터베이스 작업은 테이블 생성에서부터 시작됩니다. 어떻게 TypeORM이 테이블을 만들도록 할수있을까요? 바로 모델을 통하는 것입니다. 앱의 모델은 데이터베이스 테이블과 일맥상통합니다.

예를 들어, `Photo` 모델이 있다고 생각해 봅시다.

```typescript
export class Photo {
  id: number;
  name: string;
  description: string;
  filename: string;
  views: number;
  isPublished: boolean;
}
```

그리고 당신은 데이터베이스에 사진을 저장하길 원합니다. 그 데이터베이스에 사진을 저장하려면 먼저 데이터베이스 테이블이 필요하며, 데이터베이스 테이블은 _entites_ 로 정의된 모델의 경우에만 생성됩니다.

### 엔티티(entity) 생성

_entity_ 는 `@Entity` 데코레이터가 달린 모델입니다. 데이터베이스 테이블은 이런 모델에 대하여 생성됩니다. TypeORM을 사용하여 entity와 작업하는 경우, 불러오기/삽입/업데이트/삭제 및 다른 작업을 어디서나 수행 할 수 있습니다.

아까 만들었던 `Photo` 모델을 엔티티로 만들어봅시다:

```typescript
import { Entity } from 'typeorm';

@Entity()
export class Photo {
  id: number;
  name: string;
  description: string;
  filename: string;
  views: number;
  isPublished: boolean;
}
```

이제 `Photo` 엔티티에 대한 데이터베이스 테이블이 생성되었으며 앱의 어느곳에서나 사용 할 수 있습니다. 우리는 데이터베이스 테이블을 만들었습니다. 하지만 열(columns)없이 어떻게 테이블이 존재한다고 말할 수 있을까요? 테이블에 대하여 열을 몇 개 만들어 봅시다.

### 테이블 열(columns) 추가

데이터베이스 열을 추가하려면, 열로 만들고 싶은 엔티티의 속성에 `@Column` 데코레이터를 달아주면 됩니다.

```typescript
import { Entity, Column } from 'typeorm';

@Entity()
export class Photo {
  @Column()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  filename: string;

  @Column()
  views: number;

  @Column()
  isPublished: boolean;
}
```

이제 `id`, `name`, `description`, `filename`, `views`, `isPublished` 열이 `photo` 테이블에 추가 되었습니다. 데이터베이스의 열 타입은 엔티티의 속성에서 사용된 타입에서 추론되어 사용됩니다. 예를 들어, `number`타입의 경우 `integer`, `string`은 `varchar`, `boolean`은 `bool`으로 변환됩니다. 그러나 `@Column` 데코레이터에 열 유형을 명시적으로 지정하여 데이터베이스가 지원하는 열 유형을 사용할 수 있습니다.

우리는 데이터베이스 테이블에 열을 추가했지만, 아직 한가지 남은게 있습니다. 각 데이터베이스 테이블에는 기본 키를 가진 열이 필요합니다.

### 기본 열 만들기

각 엔티티는 기본 키를 가진 열이 하나 이상 `존재해야합니다`. 이건 요구사항이며 반드시 지켜야합니다. 열을 기본 키로 바꾸려면 `@PrimaryColumn` 데코레이터를 사용해야 합니다.

```typescript
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  filename: string;

  @Column()
  views: number;

  @Column()
  isPublished: boolean;
}
```

### 자동 생성 열 만들기

이제, 자동으로 생성되는 id 열(auto-increment / sequence / serial / generated identity column 들과 같은 이름으로 알려진)을 만들고 싶다고 가정해봅시다 . 그렇게 하려면 `@PrimaryColumn` 데코레이터를 `@PrimaryGeneratedColumn` 데코레이터로 변경해야 합니다:

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  filename: string;

  @Column()
  views: number;

  @Column()
  isPublished: boolean;
}
```

### 열 데이터 타입

다음으로, 데이터 타입을 수정해봅시다. 기본적으로, string은 varchar(255)와 유사한 타입으로 매핑됩니다 (데이터베이스 유형에따라 달라질 수 있습니다). Number는 interger랑 유사한 타입으로 매핑됩니다 (데이터베이스 유형에따라 달라질 수 있습니다). 우리는 열들이 varchar나 interger로 한정되는것을 원하지 않습니다. 올바른 데이터 타입을 설정합시다:

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('double')
  views: number;

  @Column()
  isPublished: boolean;
}
```

데이터베이스마다 열의 타입이 다릅니다. 데이터베이스가 지원하는 모든 타입을 사용할 수 있습니다. 지원하는 열의 타입에 대한 더 많은 정보는
[여기](./src/docs/entity/entities.md#열-타입)를 참조하세요.

### 데이터베이스 연결 만들기

이제 엔티티가 생성되면 `index.ts`(또는 `app.ts`) 파일을 만들고 connection을 설정합시다.

```typescript
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin',
  database: 'test',
  entities: [Photo],
  synchronize: true,
  logging: false,
})
  .then((connection) => {
    // 여기서 엔티티 작업을 할 수 있습니다.
  })
  .catch((error) => console.log(error));
```

이 예제에서는 MySQL을 사용했지만, 지원되는 다른 데이터베이스는 모두 사용 가능합니다.
다른 데이터베이스를 사용하려면, 단순히 `type` 옵션을 사용할 다른 데이터베이스로 바꾸면 됩니다: `mysql`, `mariadb`, `postgres`, `cockroachdb`, `sqlite`, `mssql`, `oracle`, `cordova`, `nativescript`, `react-native`, `expo` 또는 `mongodb`.
또한 자신의 호스트, 포트, 사용자 이름, 비밀번호 및 데이터베이스 설정을 사용해야 합니다.

이 connection의 엔티티 리스트에 Photo 엔티티를 추가했습니다. 이 connection에 사용중인 엔티티들은 모두 리스트에 나열되어 있어야합니다.

`synchronize`를 설정하면 애플리케이션이 실행할때마다 엔티티와 데이터베이스가 동기화됩니다. (migration)

### 디렉토리에서 모든 엔티티 불러오기

나중에 엔티티를 더 많이 만들면, 계속해서 connection 설정에 엔티티를 추가해줘야 합니다. 이는 매우 불편하므로, 대신에 모든 엔티티가 연결되고, connection에 사용할 디렉토리를 지정할 수 있습니다:

```typescript
import { createConnection } from 'typeorm';

createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'admin',
  database: 'test',
  entities: [__dirname + '/entity/*.js'],
  synchronize: true,
})
  .then((connection) => {
    // 여기서 엔티티 작업을 할 수 있습니다.
  })
  .catch((error) => console.log(error));
```

그러나 이 방법에 주의하세요. `ts-node`를 사용중이라면 `.ts`파일의 경로를 대신 지정 해야합니다. `outDir`을 사용중이라면 outDir 디렉토리 내의 `.js`파일의 경로를 지정해야합니다. `outDir`을 사용중이며 엔터티를 제거하거나 이름을 변경할 때는 outDir 디렉토리를 지우고 프로젝트를 다시 컴파일 하세요. 원본 `.ts`파일을 제거할 때 컴파일 된 `.js`버전이 디렉토리에서 제거되지않고 outDir 디렉토리에 존재하기 때문에 TypeORM에 의해 로드 됩니다.

### 애플리케이션 실행

이제 `index.ts`를 실행하면 데이터베이스와의 연결이 초기화되고 photos 테이블이 생성됩니다.

```shell
+-------------+--------------+----------------------------+
|                         photo                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(100) |                            |
| description | text         |                            |
| filename    | varchar(255) |                            |
| views       | int(11)      |                            |
| isPublished | boolean      |                            |
+-------------+--------------+----------------------------+
```

### 데이터베이스 생성 및 사진 삽입

이제 새 사진을 만들어 데이터베이스에 저장해보겠습니다:

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection(/*...*/)
  .then((connection) => {
    let photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.views = 1;
    photo.isPublished = true;

    return connection.manager.save(photo).then((photo) => {
      console.log('Photo has been saved. Photo id is', photo.id);
    });
  })
  .catch((error) => console.log(error));
```

엔티티가 저장되면 새로 생성된 ID를 얻을 수 있습니다. `save` 메소드는 전달한 것과 똑같은 객체를 반환합니다. 이때 새로운 객체가 아니라 "id"를 바꿔서 반환합니다.

### async/await 구문 사용

최신 ES8(ES2017) 기능의 이점을 활용하고 async/await 구문을 사용하세요:

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection(/*...*/)
  .then(async (connection) => {
    let photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.views = 1;
    photo.isPublished = true;

    await connection.manager.save(photo);
    console.log('Photo has been saved');
  })
  .catch((error) => console.log(error));
```

### 엔티티 관리자(EntityManager) 사용하기

우리는 새 사진을 만들어서 데이터베이스에 저장했습니다. 그걸 저장하기 위해 `EntityManager`를 사용했었죠. entity manager를 사용하면 앱에 존재하는 모든 entity를 조작할 수 있습니다. 예를 들어, 저장된 엔티티를 불러온다고 하면 :

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection(/*...*/)
  .then(async (connection) => {
    /*...*/
    let savedPhotos = await connection.manager.find(Photo);
    console.log('All photos from the db: ', savedPhotos);
  })
  .catch((error) => console.log(error));
```

`savedPhotos`는 데이터베이스에서 가져온 데이터가 있는 Photo 객체 배열이 됩니다.

EntityManager에 대한 더 자세한 부분은 [여기](./src/docs/entityManagerAndRepository/working-with-entity-manager.md)를 참조하세요.

### 저장소(Repository) 사용하기

이제 코드를 리팩토링하여 `EntityManager`대신에 `Repository`로 바꿔봅시다. 각 엔티티에는 해당 엔티티의 모든 조작을 처리하는 Repository가 있습니다. 다뤄야 할 엔티티가 많을때, Repository는 EntityManager보다 편리합니다 :

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection(/*...*/)
  .then(async (connection) => {
    let photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.views = 1;
    photo.isPublished = true;

    let photoRepository = connection.getRepository(Photo);

    await photoRepository.save(photo);
    console.log('Photo has been saved');

    let savedPhotos = await photoRepository.find();
    console.log('All photos from the db: ', savedPhotos);
  })
  .catch((error) => console.log(error));
```

Repository에 대한 자세한 정보는 [여기](./src/docs/entityManagerAndRepository/working-with-repository.md)를 참조하세요.

### 데이터베이스에서 데이터 가져오기

repository를 이용하여 더 많은 load 작업을 시도해 보겠습니다 :

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection(/*...*/)
  .then(async (connection) => {
    /*...*/
    let allPhotos = await photoRepository.find();
    console.log('All photos from the db: ', allPhotos);

    let firstPhoto = await photoRepository.findOne(1);
    console.log('First photo from the db: ', firstPhoto);

    let meAndBearsPhoto = await photoRepository.findOne({ name: 'Me and Bears' });
    console.log('Me and Bears photo from the db: ', meAndBearsPhoto);

    let allViewedPhotos = await photoRepository.find({ views: 1 });
    console.log('All viewed photos: ', allViewedPhotos);

    let allPublishedPhotos = await photoRepository.find({ isPublished: true });
    console.log('All published photos: ', allPublishedPhotos);

    let [allPhotos, photosCount] = await photoRepository.findAndCount();
    console.log('All photos: ', allPhotos);
    console.log('Photos count: ', photosCount);
  })
  .catch((error) => console.log(error));
```

### 데이터베이스에서 데이터 업데이트

이제 데이터베이스에서 단일 사진을 가져오고 난 뒤에 업데이트 후 저장해 보겠습니다 :

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection(/*...*/)
  .then(async (connection) => {
    /*...*/
    let photoToUpdate = await photoRepository.findOne(1);
    photoToUpdate.name = 'Me, my friends and polar bears';
    await photoRepository.save(photoToUpdate);
  })
  .catch((error) => console.log(error));
```

이제 `id = 1`인 photo는 데이터베이스에서 업데이트 될 것입니다.

### 데이터베이스에서 데이터 삭제

이제 데이터베이스에서 photo를 지워봅시다 :

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

createConnection(/*...*/)
  .then(async (connection) => {
    /*...*/
    let photoToRemove = await photoRepository.findOne(1);
    await photoRepository.remove(photoToRemove);
  })
  .catch((error) => console.log(error));
```

이제 `id = 1`인 photo는 데이터베이스에서 삭제 될 것입니다.

### 일대일 관계(one-to-one relation) 생성

다른 클래스와 일대일 관계를 만들어 봅시다.
`PhotoMetadata.ts`에 새 클래스를 만들어 봅시다. 이 PhotoMetadata 클래스에는 photo에 대한 메타정보가 포함되어 있습니다.

```typescript
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class PhotoMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  height: number;

  @Column('int')
  width: number;

  @Column()
  orientation: string;

  @Column()
  compressed: boolean;

  @Column()
  comment: string;

  @OneToOne((type) => Photo)
  @JoinColumn()
  photo: Photo;
}
```

여기에는 `@OneToOne`이라는 새로운 데코레이터가 사용됐습니다. 이 데코레이터는 두 엔티티 사이에서 일대일 관계를 맺도록 만들어줍니다. `type => Photo`는 관계를 맺고자하는 엔티티의 클래스를 반환하는 함수입니다. 언어의 특수성 때문에 클래스를 직접 사용하는 대신에 클래스를 반환하는 기능을 사용할 수 밖에 없었습니다. `() => Photo`로 작성할 수도 있지만, 코드 가독성을 높이기 위해 `type => Photo`로 사용합니다. type 변수는 아무것도 포함하지 않습니다.

`@JoinColumn` 데코레이터도 추가했는데, 이는 관계의 이쪽. 즉 PhotoMetadata쪽이 관계를 소유할것임을 나타냅니다. 관계는 단방향과 쌍방향일 수 있습니다. 관계사이에서 한쪽만 관계를 소유할 수 있습니다. `@JoinColumn` 데코레이터는 관계를 소유하고있는 쪽에서 표시해주면 됩니다.

If you run the app, you'll see a newly generated table, and it will contain a column with a foreign key for the photo relation:

```shell
+-------------+--------------+----------------------------+
|                     photo_metadata                      |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| height      | int(11)      |                            |
| width       | int(11)      |                            |
| comment     | varchar(255) |                            |
| compressed  | boolean      |                            |
| orientation | varchar(255) |                            |
| photoId     | int(11)      | FOREIGN KEY                |
+-------------+--------------+----------------------------+
```

### 일대일 관계 저장

Now let's save a photo, its metadata and attach them to each other.

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import { PhotoMetadata } from './entity/PhotoMetadata';

createConnection(/*...*/)
  .then(async (connection) => {
    // photo 생성
    let photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.isPublished = true;

    // photo metadata 생성
    let metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = 'cybershoot';
    metadata.orientation = 'portait';
    metadata.photo = photo; // 이런식으로 둘을 연결합니다

    // entity repository를 가져옵니다
    let photoRepository = connection.getRepository(Photo);
    let metadataRepository = connection.getRepository(PhotoMetadata);

    // 먼저 photo를 저장합니다
    await photoRepository.save(photo);

    // photo가 저장됐습니다. 이제 photo 메타데이터를 저장해야합니다
    await metadataRepository.save(metadata);

    // done
    console.log('Metadata is saved, and relation between metadata and photo is created in the database too');
  })
  .catch((error) => console.log(error));
```

### 관계의 역측면

관계는 단방향과 쌍방향으로 구성됩니다. 현재 PhotoMetadata와 Photo의 사이는 단방향 관계로 이루어져 있습니다. 관계의 소유주는 PhotoMetadata인데 Photo는 PhotoMetadata에 대한 어떠한 정보도 알지 못합니다. 이로 인해 Photo에서 PhotoMetadata로 접근하는것이 복잡해집니다. 이문제를 해결하려면 역관계를 추가하고, PhotoMetadata와 Photo간을 쌍방향 관계로 만들어야합니다. 엔티티를 수정해봅시다 :

```typescript
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class PhotoMetadata {
  /* ... other columns */

  @OneToOne((type) => Photo, (photo) => photo.metadata)
  @JoinColumn()
  photo: Photo;
}
```

```typescript
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { PhotoMetadata } from './PhotoMetadata';

@Entity()
export class Photo {
  /* ... other columns */

  @OneToOne((type) => PhotoMetadata, (photoMetadata) => photoMetadata.photo)
  metadata: PhotoMetadata;
}
```

`photo => photo.metadata` 은 관계의 역측의 이름을 반환하는 함수입니다. 여기서는 Photo 클래스의 Metadata 속성이 Photo 클래스의 PhotoMetadata를 저장하는 공간임을 보여줍니다. 사진의 속성을 반환하는 함수를 전달하는 대신 간단히 문자열을 `@OneToOne` 데코레이터에 전달할 수도 있습니다(예: "metadata"). 그러나 우리는 리팩토링을 보다 쉽게 하기 위해 이 함수 타입 접근법을 사용했습니다.

`@JoinColumn` 데코레이터는 관계의 한쪽에만 설정해야합니다. 어느쪽이던 이 데코레이터를 달고있는 쪽이 관계의 소유주가 될 것입니다. 관계의 소유주는 데이터베이스에 외래키를 포함한 열을 가지게됩니다.

### 관계와 함께 객체 불러오기

단일 쿼리를 통해 photo와 photo metadata를 불러오겠습니다. 방법이 두가지가 있는데, `find*` 함수를 쓰거나 `queryBuilder` 기능을 사용하는 방법이 있습니다. 그중에서 `find*` 함수를 먼저 써보겠습니다. `find*` 함수를 사용하면 `FindOneOptions` / `FindManyOptions` 인터페이스를 이용하여 객체를 지정할 수 있게 됩니다.

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import { PhotoMetadata } from './entity/PhotoMetadata';

createConnection(/*...*/)
  .then(async (connection) => {
    /*...*/
    let photoRepository = connection.getRepository(Photo);
    let photos = await photoRepository.find({ relations: ['metadata'] });
  })
  .catch((error) => console.log(error));
```

여기서는 photos에 데이터베이스의 사진배열이 포함되며 각각의 photo에는 photometadata가 포함됩니다. Find 옵션에 대한 더 자세한 부분은 [이 지침서](./src/docs/entityManagerAndRepository/find-options.md)를 참조하세요.

find 옵션을 사용하는건 편하고 간단하지만, 좀 더 복잡한 쿼리를 원한다면 `QueryBuilder`를 대신 사용해야 합니다. `QueryBuilder`를 사용하면 보다 복합적인 쿼리를 우아하게 사용할 수 있습니다 :

```typescript
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';
import { PhotoMetadata } from './entity/PhotoMetadata';

createConnection(/*...*/)
  .then(async (connection) => {
    /*...*/
    let photos = await connection
      .getRepository(Photo)
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.metadata', 'metadata')
      .getMany();
  })
  .catch((error) => console.log(error));
```

`QueryBuilder`는 대부분의 복잡한 sql 쿼리문을 생성하고 실행할 수 있게 해줍니다.
`QueryBuilder`를 사용할때는 sql 쿼리를 만든다고 생각하세요. 이 예시에서, "photo"와 "metadata"는 선택한 사진에게 부여한 별칭입니다. 별칭을 사용해 선택한 데이터의 열이나 속성에 접근하세요.

### cascade를 사용하여 관련 객체 자동 저장하기

관계에서 cascade 옵션을 사용 할 경우 사진을 별도로 저장하지 않고 메타 데이터 객체를 개별적으로 저장할 수 있습니다. photo의 `@OneToOne` 데코레이터를 약간만 바꿔봅시다 :

```typescript
export class Photo {
  /// ... 다른 열(column)들

  @OneToOne((type) => PhotoMetadata, (metadata) => metadata.photo, {
    cascade: true,
  })
  metadata: PhotoMetadata;
}
```

`cascade` 를 사용하면 photo를 따로 저장하지 않고도 메타데이터 객체를 따로 저장할 수 있습니다. 이제 우리는 단순히 Photo객체를 저장할 수 있고, cascade 옵션때문에 metadata 객체도 자동으로 저장 될 것입니다.

```typescript
createConnection(options)
  .then(async (connection) => {
    // Photo 객체 생성
    let photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.isPublished = true;

    // PhotoMetadata 객체 생성
    let metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = 'cybershoot';
    metadata.orientation = 'portait';

    photo.metadata = metadata; // 이런식으로 연결

    // repository를 가져옵니다
    let photoRepository = connection.getRepository(Photo);

    // photo와 metadata 저장
    await photoRepository.save(photo);

    console.log('Photo is saved, photo metadata is saved too.');
  })
  .catch((error) => console.log(error));
```

이전처럼 metadata의 `photo` 속성이 아닌 photo의 `metadata` 속성을 설정했다는 점에 유의하세요. `cascade` 는 photo를 photo쪽 metadata에 연결할때만 작동합니다. metadata쪽에서 설정했다면, metadata는 자동으로 저장되지 않습니다.

### 다대일(many-to-one) / 일대다(one-to-many) 연결 만들기

다대일 / 일대다 관계를 만들어봅시다.
사진 한장당 하나의 작가가 있고, 작가 한명당 여러장의 사진을 가질 수 있다고 해봅시다.
먼저, `Author` 클래스를 만들어봅시다 :

```typescript
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Photo, (photo) => photo.author) // note: we will create author property in the Photo class below
  photos: Photo[];
}
```

`Author` 클래스는 관계의 반대면을 포함하고 있습니다. `OneToMany` 는 항상 관계의 반대면이며 다른측면에 있는 `ManyToOne` 이 없으면 존재할 수 없는 관계입니다.

이제 관계의 소유자측면을 Photo 엔티티에 추가해봅시다 :

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PhotoMetadata } from './PhotoMetadata';
import { Author } from './Author';

@Entity()
export class Photo {
  /* ... 다른 열들 */

  @ManyToOne((type) => Author, (author) => author.photos)
  author: Author;
}
```

다대일 / 일대다 관계에서 다대일 관계는 항상 관계의 소유주입니다. 이는 사용하는 클래스가 `@ManyToOne` 관련 객체의 id를 저장한다는 것을 의미합니다.

애플리케이션을 실행하면, ORM이 `author` table을 만들것입니다:

```shell
+-------------+--------------+----------------------------+
|                          author                         |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
+-------------+--------------+----------------------------+
```

또한 `photo` 테이블을 수정하고, 새로운 `author` 열과 함께 외래키가 생성됩니다:

```shell
+-------------+--------------+----------------------------+
|                         photo                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(255) |                            |
| description | varchar(255) |                            |
| filename    | varchar(255) |                            |
| isPublished | boolean      |                            |
| authorId    | int(11)      | FOREIGN KEY                |
+-------------+--------------+----------------------------+
```

### 다대다(many-to-many) 관계 생성

다대일 / 다대다 관계를 만들어봅시다. 사진이 다수의 앨범에 있을수 있고, 앨범은 다수의 사진을 포함할 수 있다고 해봅시다.
`Album` 클래스를 만들어 보겠습니다 :

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Photo, (photo) => photo.albums)
  @JoinTable()
  photos: Photo[];
}
```

`@JoinTable` 은 관계의 소유자임을 특정하기 위해 필요합니다.

이제 `Photo` 클래스에 관계의 반대면을 추가 해 봅시다 :

```typescript
export class Photo {
  /// ... 다른 열들

  @ManyToMany((type) => Album, (album) => album.photos)
  albums: Album[];
}
```

앱을 실행하면, ORM이 **album_photos_photo_album** _접합테이블_ 을 생성할 것입니다 :

```shell
+-------------+--------------+----------------------------+
|                album_photos_photo_albums                |
+-------------+--------------+----------------------------+
| album_id    | int(11)      | PRIMARY KEY FOREIGN KEY    |
| photo_id    | int(11)      | PRIMARY KEY FOREIGN KEY    |
+-------------+--------------+----------------------------+
```

ORM의 connection에 `Album` 클래스를 등록하는걸 잊지 마세요 :

```typescript
const options: ConnectionOptions = {
  // ... 다른 옵션
  entities: [Photo, PhotoMetadata, Author, Album],
};
```

이제 albums와 photos를 데이터베이스에 삽입해 봅시다 :

```typescript
let connection = await createConnection(options);

// 몇 개의 Album 생성
let album1 = new Album();
album1.name = 'Bears';
await connection.manager.save(album1);

let album2 = new Album();
album2.name = 'Me';
await connection.manager.save(album2);

// 몇 개의 Photo 생성
let photo = new Photo();
photo.name = 'Me and Bears';
photo.description = 'I am near polar bears';
photo.filename = 'photo-with-bears.jpg';
photo.albums = [album1, album2];
await connection.manager.save(photo);

// photo는 저장됐고 albums는 photo에 첨부되었습니다.
// 이제 저장한것들을 불러옵니다 :
const loadedPhoto = await connection.getRepository(Photo).findOne(1, { relations: ['albums'] });
```

`loadedPhoto` 는 다음과 같을 것입니다:

```typescript
{
    id: 1,
    name: "Me and Bears",
    description: "I am near polar bears",
    filename: "photo-with-bears.jpg",
    albums: [{
        id: 1,
        name: "Bears"
    }, {
        id: 2,
        name: "Me"
    }]
}
```

### QueryBuilder 사용하기

QueryBuilder를 사용하여 거의 모든 복잡한 sql 쿼리를 작성할 수 있습니다. 예를 들어, 다음을 수행 할 수 있습니다 :

```typescript
let photos = await connection
  .getRepository(Photo)
  .createQueryBuilder('photo') // 첫번째 인수는 별칭입니다. 별칭은 당신이 선택하고자하는 사진입니다. 별칭은 반드시 지정해야 합니다.
  .innerJoinAndSelect('photo.metadata', 'metadata')
  .leftJoinAndSelect('photo.albums', 'album')
  .where('photo.isPublished = true')
  .andWhere('(photo.name = :photoName OR photo.name = :bearName)')
  .orderBy('photo.id', 'DESC')
  .skip(5)
  .take(10)
  .setParameters({ photoName: 'My', bearName: 'Mishka' })
  .getMany();
```

이 쿼리는 "My" 혹은 "Mishka" 이름으로 게시된 모든 Photo들을 선택합니다. 5번째 위치에서 결과를 선택하고(페이지네이션 오프셋),
10개의 결과만 선택합니다 (페이지네이션 제한). 선택된 결과들은 id 내림차순으로 정렬됩니다.
photo의 album이랑은 left-join을, metadata와는 innerjoin합니다.

애플리케이션을 작성하면서 queryBuilder를 자주 쓰이게 될 것입니다. QueryBuilder에 대한 자세한 내용은 [여기](./src/docs/queryBuilder/select-query-builder.md)를 참조하세요.

## 예시

사용 예시는 samples의 [sample](https://github.com/typeorm/typeorm/tree/master/sample)를 살펴보세요.

복제하고 시작할 수 있는 몇가지 리포지토리들이 있습니다:

- [Example how to use TypeORM with TypeScript](https://github.com/typeorm/typescript-example)
- [Example how to use TypeORM with JavaScript](https://github.com/typeorm/javascript-example)
- [Example how to use TypeORM with JavaScript and Babel](https://github.com/typeorm/babel-example)
- [Example how to use TypeORM with TypeScript and SystemJS in Browser](https://github.com/typeorm/browser-example)
- [Example how to use Express and TypeORM](https://github.com/typeorm/typescript-express-example)
- [Example how to use Koa and TypeORM](https://github.com/typeorm/typescript-koa-example)
- [Example how to use TypeORM with MongoDB](https://github.com/typeorm/mongo-typescript-example)
- [Example how to use TypeORM in a Cordova/PhoneGap app](https://github.com/typeorm/cordova-example)
- [Example how to use TypeORM with an Ionic app](https://github.com/typeorm/ionic-example)
- [Example how to use TypeORM with React Native](https://github.com/typeorm/react-native-example)
- [Example how to use TypeORM with Nativescript-Vue](https://github.com/typeorm/nativescript-vue-typeorm-sample)
- [Example how to use TypeORM with Nativescript-Angular](https://github.com/betov18x/nativescript-angular-typeorm-example)
- [Example how to use TypeORM with Electron using JavaScript](https://github.com/typeorm/electron-javascript-example)
- [Example how to use TypeORM with Electron using TypeScript](https://github.com/typeorm/electron-typescript-example)

## 확장

TypeORM과의 작업 및 다른 모듈과의 통합을 단순화하는 몇 가지 확장 기능이 있습니다 :

- [TypeORM + GraphQL framework](http://vesper-framework.com)
- [TypeORM integration](https://github.com/typeorm/typeorm-typedi-extensions) with [TypeDI](https://github.com/pleerock/typedi)
- [TypeORM integration](https://github.com/typeorm/typeorm-routing-controllers-extensions) with [routing-controllers](https://github.com/pleerock/routing-controllers)
- Models generation from existing database - [typeorm-model-generator](https://github.com/Kononnable/typeorm-model-generator)
- Fixtures loader - [typeorm-fixtures-cli](https://github.com/RobinCK/typeorm-fixtures)

## 기여

[기여도](https://github.com/typeorm/typeorm/blob/master/CONTRIBUTING.md)와
[개발 환경](https://github.com/typeorm/typeorm/blob/master/DEVELOPER.md)을 설정하는 방법에 대해 알아보십시오.

이 프로젝트는 다음과 같은 기여를 하는 모든 사람들 덕분에 존재합니다:

<a href="https://github.com/typeorm/typeorm/graphs/contributors"><img src="https://opencollective.com/typeorm/contributors.svg?width=890&showBtn=false" /></a>

## 스폰서

오픈 소스는 어렵고 시간이 많이 걸립니다.
만약 당신이 TypeORM의 미래에 투자하기를 원한다면 당신은 스폰서가 되어 우리의 핵심팀이 TypeORM의 개선사항과 새로운 기능에 더 많은 시간을 할애하도록 할 수 있습니다.
[후원하기](https://opencollective.com/typeorm)

<a href="https://opencollective.com/typeorm" target="_blank"><img src="https://opencollective.com/typeorm/tiers/sponsor.svg?width=890"></a>

## 골드 스폰서

골드스폰서가 되어 TypeORM의 핵심기여자들로부터 프리미엄 기술지원을 받으십시오. [골드스폰서 후원하기](https://opencollective.com/typeorm)

<a href="https://opencollective.com/typeorm" target="_blank"><img src="https://opencollective.com/typeorm/tiers/gold-sponsor.svg?width=890"></a>
