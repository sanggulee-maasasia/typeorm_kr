# MongoDB

- [MongoDB 지원](#MongoDB-지원)
- [엔티티 및 열 정의](#엔티티-및-열-정의)
- [하위 문서 정의 (포함 문서)](<#하위-문서-정의-(포함-문서)>)
- [`MongoEntityManager` 및 `MongoRepository` 사용](#MongoEntityManager-및-MongoRepository-사용)

## MongoDB 지원

TypeORM는 기본 MongoDB를 지원합니다. 대부분의 TypeORM 기능은 RDBMS 전용이며,
이 페이지에는 모든 MongoDB 관련 기능 설명서가 포함되어 있습니다.

## 엔티티 및 열 정의

엔티티 및 열을 정의하는 것은 관계형 데이터베이스에서와 거의 동일합니다. 주요 차이점은
`@PrimaryColumn` 또는 `@PrimaryGeneratedColumn` 대신 `@ObjectIdColumn`을 사용해야 한다는 것입니다.

간단한 엔티티 예시 :

```typescript
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

그리고 이렇게 앱을 부팅할 수 있습니다 :

```typescript
import { createConnection, Connection } from 'typeorm';

const connection: Connection = await createConnection({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'test',
});
```

## 하위 문서 정의 (포함 문서)

MongoDB는 객체와 객체를 객체(또는 문서 내부) 내부에 저장하므로 TypeORM에서도 동일하게 할 수 있습니다.

```typescript
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

export class Profile {
  @Column()
  about: string;

  @Column()
  education: string;

  @Column()
  career: string;
}
```

```typescript
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

export class Photo {
  @Column()
  url: string;

  @Column()
  description: string;

  @Column()
  size: number;

  constructor(url: string, description: string, size: number) {
    this.url = url;
    this.description = description;
    this.size = size;
  }
}
```

```typescript
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column((type) => Profile)
  profile: Profile;

  @Column((type) => Photo)
  photos: Photo[];
}
```

이 엔티티를 저장할 경우 :

```typescript
import { getMongoManager } from 'typeorm';

const user = new User();
user.firstName = 'Timber';
user.lastName = 'Saw';
user.profile = new Profile();
user.profile.about = 'About Trees and Me';
user.profile.education = 'Tree School';
user.profile.career = 'Lumberjack';
user.photos = [
  new Photo('me-and-trees.jpg', 'Me and Trees', 100),
  new Photo('me-and-chakram.jpg', 'Me and Chakram', 200),
];

const manager = getMongoManager();
await manager.save(user);
```

다음 문서가 데이터베이스에 저장됩니다 :

```json
{
  "firstName": "Timber",
  "lastName": "Saw",
  "profile": {
    "about": "About Trees and Me",
    "education": "Tree School",
    "career": "Lumberjack"
  },
  "photos": [
    {
      "url": "me-and-trees.jpg",
      "description": "Me and Trees",
      "size": 100
    },
    {
      "url": "me-and-chakram.jpg",
      "description": "Me and Chakram",
      "size": 200
    }
  ]
}
```

## MongoEntityManager 및 MongoRepository 사용

`EntityManager` 내에서 대부분의 메서드를 사용할 수 있습니다
(`query` 및 `transaction`과 같은 RDBMS 관련 메서드는 제외). 예제 :

```typescript
import { getManager } from 'typeorm';

const manager = getManager(); // or connection.manager
const timber = await manager.findOne(User, { firstName: 'Timber', lastName: 'Saw' });
```

MongoDB의 경우 `EntityManager`를 확장하는 별도의 `MongoEntityManager`가 있습니다.

```typescript
import { getMongoManager } from 'typeorm';

const manager = getMongoManager(); // or connection.mongoManager
const timber = await manager.findOne(User, { firstName: 'Timber', lastName: 'Saw' });
```

`MongoEntityManager` 처럼 별도의 `Repository`를 확장한 `MongoRepository`가 있습니다:

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User); // or connection.getMongoRepository
const timber = await userRepository.findOne({ firstName: 'Timber', lastName: 'Saw' });
```

find()에서 고급 옵션을 사용합니다:

Equal:

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
const timber = await userRepository.find({
  where: {
    firstName: { $eq: 'Timber' },
  },
});
```

LessThan:

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
const timber = await userRepository.find({
  where: {
    age: { $lt: 60 },
  },
});
```

In:

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
const timber = await userRepository.find({
  where: {
    firstName: { $in: ['Timber', 'Zhang'] },
  },
});
```

Not in:

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
const timber = await userRepository.find({
  where: {
    firstName: { $not: { $in: ['Timber', 'Zhang'] } },
  },
});
```

Or:

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
const timber = await userRepository.find({
  where: {
    $or: [{ firstName: 'Timber' }, { firstName: 'Zhang' }],
  },
});
```

하위 문서 쿼리

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
// Query users with education Tree School
const users = await userRepository.find({
  where: {
    'profile.education': { $eq: 'Tree School' },
  },
});
```

하위문서 배열의 쿼리

```typescript
import { getMongoRepository } from 'typeorm';

const userRepository = getMongoRepository(User);
// Query users with photos of size less than 500
const users = await userRepository.find({
  where: {
    'photos.size': { $lt: 500 },
  },
});
```

`MongoEntityManager`와 `MongoRepository`에는 유용한 MongoDB별 방법이 많이 포함되어 있습니다.

#### `createCursor`

MongoDB의 결과를 반복하는 데 사용할 수 있는 쿼리의 커서를 만듭니다.

#### `createEntityCursor`

MongoDB의 결과를 반복하는 데 사용할 수 있는 쿼리의 커서를 만듭니다.
그러면 각 결과를 엔티티 모델로 변환하는 수정된 커서 버전이 반환됩니다.

#### `aggregate`

컬렉션에 대해 집계 프레임워크 파이프라인을 실행합니다.

#### `bulkWrite`

유연한 API 없이 bulkWrite 작업을 수행합니다.

#### `count`

db에서 쿼리와 일치하는 문서 수를 계산합니다.

#### `createCollectionIndex`

db 및 콜렉션에 인덱스를 작성합니다.

#### `createCollectionIndexes`

컬렉션에 여러 인덱스를 만듭니다. 이 메소드는 MongoDB 2.6 이상에서만 지원됩니다. 이전 버전의
MongoDB는 지원되지 않는 명령 에러를 발생시킵니다.
인덱스 사양은 http://docs.mongodb.org/manual/reference/command/createIndexes/ 에 정의되어 있습니다.

#### `deleteMany`

MongoDB에서 여러 문서를 삭제합니다.

#### `deleteOne`

MongoDB에서 문서를 삭제합니다.

#### `distinct`

distinct 명령은 콜렉션 전체에 걸쳐 지정된 키에 대한 distinct 값 목록을 반환합니다.

#### `dropCollectionIndex`

이 컬렉션에서 인덱스를 삭제합니다.

#### `dropCollectionIndexes`

컬렉션에서 모든 인덱스를 삭제합니다.

#### `findOneAndDelete`

문서를 찾아 하나의 원자 작업에서 삭제하십시오. 작업 시간동안 쓰기 잠금이 필요합니다.

#### `findOneAndReplace`

문서를 찾아 한 번의 원자 작업으로 교체하십시오. 작업 기간 동안 쓰기 잠금이 필요합니다.

#### `findOneAndUpdate`

문서를 찾아 한 번의 원자 작업으로 업데이트하십시오. 작업 기간 동안 쓰기 잠금이 필요합니다.

#### `geoHaystackSearch`

컬렉션에서 geo haystack 인덱스를 사용하여 geo 검색을 실행합니다.

#### `geoNear`

geoNear 커맨드를 실행하여 컬렉션의 항목을 검색합니다.

#### `group`

컬렉션에서 그룹 커맨드를 실행합니다.

#### `collectionIndexes`

컬렉션의 모든 인덱스를 검색합니다.

#### `collectionIndexExists`

컬렉션에 인덱스가 있는지 검색합니다.

#### `collectionIndexInformation`

이 컬렉션 인덱스 정보를 검색합니다.

#### `initializeOrderedBulkOp`

대량 쓰기 작업을 시작하면 작업이 추가 된 순서대로 순차적으로 실행되어
각 스위치 유형에 대해 새 작업이 생성됩니다.

#### `initializeUnorderedBulkOp`

순서가 잘못된 배치 쓰기 작업을 시작하십시오. 모든 작업은 순서대로 실행 된
삽입 / 업데이트 / 제거 명령으로 버퍼링됩니다.

#### `insertMany`

MongoDB에 문서 배열을 삽입합니다.

#### `insertOne`

MongoDB에 단일 문서를 삽입합니다.

#### `isCapped`

컬렉션이 capped collection인지 여부를 반환합니다.

#### `listCollectionIndexes`

컬렉션에 대한 모든 인덱스 정보 목록을 가져옵니다.

#### `mapReduce`

컬렉션에서 맵 축소를 실행합니다. out에 대한 인라인 옵션은 컬렉션이 아닌 결과 배열을 반환합니다.

#### `parallelCollectionScan`

전체 컬렉션을 병렬로 판독할 수 있도록 컬렉션에 대해 N개의 병렬 커서 수를 반환합니다.
반환된 결과에 대한 정렬 보증이 없습니다.

#### `reIndex`

컬렉션의 모든 인덱스 reindex 경고: reindex는 차단 작업이며(인덱스는 foreground에서 재빌드됩니다),
큰 컬렉션의 경우 속도가 느려집니다.

#### `rename`

기존의 컬렉션 이름을 변경합니다.

#### `replaceOne`

MongoDB의 문서를 교체합니다.

#### `stats`

모든 컬렉션 통계를 가져옵니다.

#### `updateMany`

필터를 기반으로 컬렉션 내의 여러 문서를 업데이트합니다.

#### `updateOne`

필터를 기반으로 컬렉션 내의 단일 문서를 업데이트합니다.
