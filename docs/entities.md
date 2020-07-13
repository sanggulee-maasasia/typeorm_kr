# 엔티티

- [엔티티란?](#what-is-entity)
- [엔티티 열 (entity column)](#엔티티-열)
  - [기본 열](#기본-열)
  - [특수 열](#특수-열)
  - [공간 열](#공간-열)
- [열 타입](#열-타입)
  - [`mysql` / `mariadb` 의 열 타입](#mysql--mariadb-의-열-타입)
  - [`postgres` / `cockroachdb` 의 열 타입](#postgres-의-열-타입)
  - [`sqlite` / `cordova` / `react-native` / `expo` 의 열 타입](#sqlite--cordova--react-native--expo-의-열-타입)
  - [`mssql` 열 타입](#mssql-열-타입)
  - [`enum` 열 타입](#enum-열-타입)
  - [`simple-array` 의 열 타입](#simple-array-열-타입)
  - [`simple-json` 의 열 타입](#simple-json-열-타입)
  - [Columns with generated values](#값이-생성되는-열)
- [열 옵션](#열-옵션)

## 엔티티란?

엔티티는 데이터베이스 테이블(MongoDB의 경우에는 collection)에 매핑되는 클래스입니다. 새 클래스를 만들어서 엔티티로 정의하고 `@Entity()` 로 표시합니다 :

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

이렇게 하면 다음 데이터베이스 테이블이 생성됩니다 :

```shell
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| firstName   | varchar(255) |                            |
| lastName    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

기본적인 엔티티는 열과 관계로 이루어져 있습니다.
각 엔티티는 **반드시** 기본 열(MongoDB의 경우 ObjectId 열)을 가져야 합니다.

각 엔티티는 connection 옵션에 등록해야 합니다 :

```typescript
import { createConnection, Connection } from 'typeorm';
import { User } from './entity/User';

const connection: Connection = await createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: [User],
});
```

또는 모든 엔티티가 들어있는 디렉토리를 지정할 수도 있으며, 이때 디렉토리안의 모든 엔티티가 로드됩니다 :

```typescript
import { createConnection, Connection } from 'typeorm';

const connection: Connection = await createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
  entities: ['entity/*.js'],
});
```

`User` 엔티티에 대체 테이블 이름을 사용하려면 `@Entity("my_users")`처럼 Entity 데코레이터 안에 사용할 테이블 이름을 넣어주세요.
애플리케이션의 모든 데이터베이스 테이블에 기본 접두사를 설정하고 싶으면 connection 옵션의 entityPrefix를 지정하십시오.

엔티티 생성자를 사용하는 경우 그 인수는 **optional** 해야합니다. ORM은 데이터베이스에서 로드할 때 엔티티 클래스의 인스턴스를 생성하므로, 따라서 생성자의 인수를 알지 못합니다.

`@Entity` 에 대한 더 자세한 내용은 [Decorators reference](decorator-reference.md)를 참조하세요.

## 엔티티 열

데이터베이스 테이블은 열로 이루어지므로 엔티티도 열로 이루어져야 합니다.
`@Column` 로 표시된 엔티티 클래스의 속성들은 데이터베이스 테이블의 열과 매핑됩니다.

### 기본 열

각 엔티티는 적어도 하나의 기본 열을 가지고 있어야합니다.
기본 열에는 여러가지의 유형이 존재합니다 :

- `@PrimaryColumn()`은 모든 타입의 값을 사용하는 기본 열을 생성합니다. 열 유형을 지정할 수 있습니다. 열 타입을 지정하지 않으면 속성 타입에서 추론하여 지정합니다. 아래 예시는 저장하기 전에 수동으로 할당해야 하는 int로 id를 만듭니다.

```typescript
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;
}
```

- `@PrimaryGeneratedColumn()`은 자동으로 값이 증가되는 기본 열을 생성합니다. `auto-increment`/`serial`/`sequence` (데이터베이스에 따라 다름)로 `int` 열을 생성합니다. 저장하기전에 값을 수동으로 할당할 필요가 없고, 값이 자동으로 증가합니다.

```typescript
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
}
```

- `@PrimaryGeneratedColumn("uuid")`은 uuid를 사용하여 자동으로 값이 증가되는 기본 열을 생성합니다. uuid는 고유한 문자열 id입니다. 저장하기전에 값을 수동으로 할당할 필요가 없고, 값이 자동으로 증가합니다.

```typescript
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
```

복합 개인 열이 있을 수 있습니다:

```typescript
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  firstName: string;

  @PrimaryColumn()
  lastName: string;
}
```

`save`를 통해서 엔티티를 저장할 때 항상 지정된 엔티티의 ID를 가진 엔티티를 데이터베이스에서 찾으려고 시도합니다. id/ids가 발견되면 데이터베이스에서 이 행을 업데이트하고, id를 발견하지 못하면 새로운 행이 삽입됩니다.

id로 엔티티를 찾으려면 `manager.findOne` 이나 `repository.findOne`을 사용할 수 있습니다. 예시 :

```typescript
// 단일 기본키와 id로 찾기
const person = await connection.manager.findOne(Person, 1);
const person = await connection.getRepository(Person).findOne(1);

// 복합 기본키와 id로 찾기
const user = await connection.manager.findOne(User, { firstName: 'Timber', lastName: 'Saw' });
const user = await connection.getRepository(User).findOne({ firstName: 'Timber', lastName: 'Saw' });
```

### 특수 열

추가 기능을 사용할 수 있는 몇 가지 특수 열 타입이 있습니다:

- `@CreateDateColumn`은 엔티티의 삽입 날짜로 자동 설정되는 특수 열입니다. 자동으로 설정되기 때문에 이 열에 대해서는 설정한 필요가 없습니다.

- `@UpdateDateColumn`은 entity manager나 repository의 `save`가 호출 될 때마다 자동으로 엔티티의 업데이트 시간으로 설정되는 특수 열입니다. 자동으로 설정되기 때문에 이 열에 대해서는 설정한 필요가 없습니다.

- `@DeleteDateColumn`은 entity manager나 repository의 soft-delete가 호출 될 때마다 자동으로 엔티티의 삭제 시간으로 설정되는 특수 열 입니다. 자동으로 설정되기 때문에 이 열에 대해서는 설정한 필요가 없습니다. @DeleteDateColumn이 설정되면, 기본 범위 값은 "non-deleted" 입니다.

- `@VersionColumn`은 entity manager나 repository의 `save`가 호출 될 때 마다 자동으로 엔티티의 버전(증가되는 숫자)으로 설정 되는 특수 열입니다. 자동으로 설정되기 때문에 이 열에 대해서는 설정한 필요가 없습니다.

### 공간 열

MSSQL, MySQL / MariaDB, 그리고 PostgreSQL 모두 공간 열을 지원합니다. Typeorm의 지원은 데이터베이스마다 약간씩 다르며, 특히 열의 이름이 매우 다릅니다.

MSSQL, MySQL / MariaDB의 TypeORM 지원에서는 지오메트리가 [well-known text
(WKT)](https://en.wikipedia.org/wiki/Well-known_text)와 함께 제공될 것으로 예상 되므로, 지오메트리 열에 `string` 유형으로 태그를 지원해야 합니다.

TypeORM의 postgres 지원에서는 [GeoJSON](http://geojson.org/)을 교환 형식으로 사용하기 때문에, 지오매트리 열은 [`geojson`
types](https://www.npmjs.com/package/@types/geojson)를 가져온 뒤에 다른 `object` 나 `Geometry`(또는 하위 클래스, 예를 들면 `Point`)로 태그 지정 되어야 합니다.

TypeORM은 올바른 동작을 하려고 하지만, 언제 어떤값이 삽입 되는지 또는 PostGIS의 함수 결과가 지오매트리로 취급되어야 하는지 항상 판단 할 수는 없습니다. 그 결과, 다음과 유사한 코드를 작성 할 수 있습니다. 여기서 값은 GeoJSON에서 PostGIS 지오메트리로 변환 되고, `json`은 GeoJSON이 됩니다 :

```typescript
const origin = {
  type: 'Point',
  coordinates: [0, 0],
};

await getManager()
  .createQueryBuilder(Thing, 'thing')
  // 문자열화된 GeoJSON을 SRID와 일치하는 지오메트리로 변환합니다.
  // table specification
  .where('ST_Distance(geom, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(geom))) > 0')
  .orderBy({
    'ST_Distance(geom, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(geom)))': {
      order: 'ASC',
    },
  })
  .setParameters({
    // GeoJSON을 문자열화 합니다.
    origin: JSON.stringify(origin),
  })
  .getMany();

await getManager()
  .createQueryBuilder(Thing, 'thing')
  // 지오메트리 결과를 GeoJSON으로 변환시키고, treated as JSON
  // (TypeORM이 역직렬화 했다는 걸 알수 있도록 함)
  .select('ST_AsGeoJSON(ST_Buffer(geom, 0.1))::json geom')
  .from('thing')
  .getMany();
```

## 열 타입

TypeORM은 기본적으로 많이 사용되는 데이터베이스 열 타입을 모두 지원합니다. 열 타입은 데이터베이스 유형에 따라 다르며, 이것은 데이터베이스 스키마가 어떻게 보이는지에 대한 더 많은 유연성을 제공합니다.

`@Column`의 첫번째 파라미터로 열 타입을 지정할 수도 있고, `@Column`의 열 옵션을 지정할 수도 있습니다. 예를 들면 :

```typescript
@Column("int")
```

또는

```typescript
@Column({ type: "int" })
```

타입 매개변수를 추가하려면 열 옵션을 통하면 됩니다. 예를 들면 :

```typescript
@Column("varchar", { length: 200 })
```

또는

```typescript
@Column({ type: "int", width: 200 })
```

> `bigint` 유형에 대한 참고: SQL 데이터베이스에서 사용되는 `bigint` 열 타입은 정규 `number` 타입에 맞지 않고 속성을 `string`으로 맵핑합니다.

### `mysql` / `mariadb` 의 열 타입

`bit`, `int`, `integer`, `tinyint`, `smallint`, `mediumint`, `bigint`, `float`, `double`,
`double precision`, `dec`, `decimal`, `numeric`, `fixed`, `bool`, `boolean`, `date`, `datetime`,
`timestamp`, `time`, `year`, `char`, `nchar`, `national char`, `varchar`, `nvarchar`, `national varchar`,
`text`, `tinytext`, `mediumtext`, `blob`, `longtext`, `tinyblob`, `mediumblob`, `longblob`, `enum`, `set`,
`json`, `binary`, `varbinary`, `geometry`, `point`, `linestring`, `polygon`, `multipoint`, `multilinestring`,
`multipolygon`, `geometrycollection`

### `postgres` 의 열 타입

`int`, `int2`, `int4`, `int8`, `smallint`, `integer`, `bigint`, `decimal`, `numeric`, `real`,
`float`, `float4`, `float8`, `double precision`, `money`, `character varying`, `varchar`,
`character`, `char`, `text`, `citext`, `hstore`, `bytea`, `bit`, `varbit`, `bit varying`,
`timetz`, `timestamptz`, `timestamp`, `timestamp without time zone`, `timestamp with time zone`,
`date`, `time`, `time without time zone`, `time with time zone`, `interval`, `bool`, `boolean`,
`enum`, `point`, `line`, `lseg`, `box`, `path`, `polygon`, `circle`, `cidr`, `inet`, `macaddr`,
`tsvector`, `tsquery`, `uuid`, `xml`, `json`, `jsonb`, `int4range`, `int8range`, `numrange`,
`tsrange`, `tstzrange`, `daterange`, `geometry`, `geography`, `cube`

### `cockroachdb` 의 열 타입

`array`, `bool`, `boolean`, `bytes`, `bytea`, `blob`, `date`, `numeric`, `decimal`, `dec`, `float`,
`float4`, `float8`, `double precision`, `real`, `inet`, `int`, `integer`, `int2`, `int8`, `int64`,
`smallint`, `bigint`, `interval`, `string`, `character varying`, `character`, `char`, `char varying`,
`varchar`, `text`, `time`, `time without time zone`, `timestamp`, `timestamptz`, `timestamp without time zone`,
`timestamp with time zone`, `json`, `jsonb`, `uuid`

> 참고: CockroachDB는 모든 숫자 데이터 타입을 `string`으로 반환한다. 그러나 열 타입을 생략하고 속성을 number로 정의하면
> ORM이 `parseInt`로 string에서 number로 변환시켜줍니다.

### `sqlite` / `cordova` / `react-native` / `expo` 의 열 타입

`int`, `int2`, `int8`, `integer`, `tinyint`, `smallint`, `mediumint`, `bigint`, `decimal`,
`numeric`, `float`, `double`, `real`, `double precision`, `datetime`, `varying character`,
`character`, `native character`, `varchar`, `nchar`, `nvarchar2`, `unsigned big int`, `boolean`,
`blob`, `text`, `clob`, `date`

### `mssql` 의 열 타입

`int`, `bigint`, `bit`, `decimal`, `money`, `numeric`, `smallint`, `smallmoney`, `tinyint`, `float`,
`real`, `date`, `datetime2`, `datetime`, `datetimeoffset`, `smalldatetime`, `time`, `char`, `varchar`,
`text`, `nchar`, `nvarchar`, `ntext`, `binary`, `image`, `varbinary`, `hierarchyid`, `sql_variant`,
`timestamp`, `uniqueidentifier`, `xml`, `geometry`, `geography`, `rowversion`

### `oracle` 의 열 타입

`char`, `nchar`, `nvarchar2`, `varchar2`, `long`, `raw`, `long raw`, `number`, `numeric`, `float`, `dec`,
`decimal`, `integer`, `int`, `smallint`, `real`, `double precision`, `date`, `timestamp`, `timestamp with time zone`,
`timestamp with local time zone`, `interval year to month`, `interval day to second`, `bfile`, `blob`, `clob`,
`nclob`, `rowid`, `urowid`

### `enum` 열 타입

`enum` 열 타입은 `postgres`와 `mysql` 에서 지원됩니다. 다양한 열 정의가 가능합니다 :
typescript에서 enum을 사용하면 :

```typescript
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role: UserRole;
}
```

> 참고: 문자열, 숫자 그리고 이질적인 enums가 지원됩니다.

enum 값과 배열을 함께 사용하면 :

```typescript
export type UserRoleType = "admin" | "editor" | "ghost",

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ["admin", "editor", "ghost"],
        default: "ghost"
    })
    role: UserRoleType
}
```

### `set` 열 타입

`set` 열 타입은 `mariadb`와 `mysql` 에서 지원됩니다. 다양한 열 정의가 가능합니다 :

typescript에서 enum을 사용하면 :

```typescript
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'set',
    enum: UserRole,
    default: [UserRole.GHOST, UserRole.EDITOR],
  })
  roles: UserRole[];
}
```

배열과 함께 `set` 값을 사용하면 :

```typescript
export type UserRoleType = "admin" | "editor" | "ghost",

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "set",
        enum: ["admin", "editor", "ghost"],
        default: ["ghost", "editor"]
    })
    roles: UserRoleType[]
}
```

### `simple-array` 열 타입

`simple-array` 는 단일 문자열에 원시 배열값을 저장할 수 있는 특수 열 타입입니다.
모든 값은 콤마로 구분됩니다. 예시 :

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  names: string[];
}
```

```typescript
const user = new User();
user.names = ['Alexander', 'Alex', 'Sasha', 'Shurik'];
```

단일 데이터베이스 열에 `Alexander,Alex,Sasha,Shurik` 값으로 저장됩니다. 데이터베이스에서 데이터를 로드할 때, 이름은 저장한 것처럼 이름 배열로 반환됩니다.

입력하는 값에 쉼표가 **있으면 안된다**는 점에 유의 하세요.

### `simple-json` 열 타입

`simple-json`은 JSON.stringify를 통해 데이터베이스에 저장할 수 있는 값을 저장 할 수 있는 특수 열 타입 입니다. 데이터베이스에 json 타입이 없고 번거로움 없이 객체를 저장하고 불러오려는 경우 매우 유용합니다.
예시 :

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  profile: { name: string; nickname: string };
}
```

```typescript
const user = new User();
user.profile = { name: 'John', nickname: 'Malkovich' };
```

단일 데이터베이스 열에 `{"name": "John", "nickname": "Malkovich"}` 값으로 저장됩니다. 데이터베이스에서 데이터를 불러올때, JSON.parse를 통해 object/array/primitive 값을 갖게 됩니다.

### 값이 생성되는 열

`@Generated` 데코레이터를 통해 값이 생성되는 열을 만들 수 있습니다. 예시 :

```typescript
@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;
}
```

`uuid` 값이 자동으로 생성되어 데이터베이스 안에 저장됩니다.

"uuid" 외에도 "increment" 나 "rowid" (CockroachDB 전용) 생성 타입이 있지만, 이러한 유형의 생성 타입을 가진 일부 데이터베이스 플랫폼에는 몇가지 제한이 있습니다. ( 예를 들어 일부 데이터베이스에는 하나의 증가열만 가질 수 있다던지, 일부는 기본 키가 되기위해 increment를 요구합니다.)

## Column options

열 옵션은 엔티티 열에 대한 추가 옵션을 정의합니다. `@Column`에 추가 옵션을 정의할 수 있습니다 :

```typescript
@Column({
    type: "varchar",
    length: 150,
    unique: true,
    // ...
})
name: string;
```

`ColumnOptions`의 사용가능한 옵션 목록 :

- `type: ColumnType` - 열 타입. [위에](#column-types) 나열 된 타입중 하나 입니다.

- `type: ColumnType` - 열 타입. 위에 나열 된 타입중 하나 입니다.

- `name: string` - 데이터베이스 테이블의 열 이름. 기본적으로 열 이름은 속성의 이름에서 생성됩니다. 이름을 지정하여 변경할 수 있습니다.

- `length: number` - 열 타입의 길이. 예를 들어 varchar(150) 유형을 생성하려면 열 유형 및 길이 옵션을 지정하세요.

- `width: number` - 열 타입의 디스플레이 너비. [MySQL integer types](https://dev.mysql.com/doc/refman/5.7/en/integer-types.html)에서만 사용됩니다.

- `onUpdate: string` - `ON UPDATE` 트리거입니다. [MySQL](https://dev.mysql.com/doc/refman/5.7/en/timestamp-initialization.html)에서만 사용됩니다.

- `nullable: boolean` - 데이터베이스에서 열을 `NULL`로 만들거나 `NOT NULL`로 만듭니다. 열의 기본값은 `nullable: false` 입니다.

- `update: boolean` - 열 값이 `save` 명령에 의해서 업데이트 되는지 여부를 나타냅니다. false라면 처음 객체를 삽입할때만 이 값을 쓸 수 있습니다. 기본값은 `true` 입니다.

- `insert: boolean` - 객체를 처음 삽입할때 열 값이 설정되는지 여부를 나타냅니다. 기본값은 `true`입니다.

- `select: boolean` - 쿼리를 만들 때 기본적으로 이 열을 숨길지 여부를 정의하세요. false로 설정하면 열 데이터는 표준 쿼리와 함께 표시되지 않습니다. 기본값은 `select: true` 입니다.

- `default: string` - 데이터베이스 수준 열에 `DEFAULT` 값을 추가합니다.

- `primary: boolean` - 기본열로 표시합니다. `@PrimaryColumn`을 사용하는 것과 같습니다.

- `unique: boolean` - 고유한 열로 표시합니다. (unique 제약조건을 만듭니다)

- `comment: string` - 데이터베이스 열에 대한 코멘트입니다. 모든 데이터베이스 타입에 지원되지는 않습니다.

- `precision: number` - 값에 대해 저장되는 최대 자릿수인 십진수(정확한 숫자) 열(십진수 열에만 해당)에 대한 정밀도. 일부 열 유형에 사용됩니다.

- `scale: number` - 십진수(정확한 숫자) 열의 크기(십진수 열의 경우에만 해당)는 소수점 오른쪽에 있는 자릿수를 나타내며 precision보다 크면 안 됩니다. 일부 열 유형에서 사용됩니다.

- `zerofill: boolean` - `ZEROFILL` 속성을 숫자열에 적용합니다. MySQL에서만 사용할수 있습니다. `true`라면, MySQL이 자동으로 `UNSIGNED` 속성을 열에 추가합니다.

- `unsigned: boolean` - `UNSIGNED` 속성을 숫자열에 적용합니다. MySQL에서만 사용할수 있습니다.

- `charset: string` - 열의 character set을 정의합니다. 모든 데이터 베이스를 지원하지는 않습니다.

- `collation: string` - 열의 collaction을 정의합니다.

- `enum: string[]|AnyEnum` - 허용된 enum 목록을 지정하기 위해 enum 열 타입에서 사용됩니다. 값의 배열을 지정하거나 enum 클래스를 지정할 수 있습니다.

- `asExpression: string` - 생성된 열의 표현식. [MySQL](https://dev.mysql.com/doc/refman/5.7/en/create-table-generated-columns.html)에서만 사용 할 수 있습니다.

- `generatedType: "VIRTUAL"|"STORED"` - 생성된 열의 타입. [MySQL](https://dev.mysql.com/doc/refman/5.7/en/create-table-generated-columns.html)에서만 사용 할 수 있습니다.

- `hstoreType: "object"|"string"` - `HSTORE` 열의 타입을 반환합니다. 반환값은 string 혹은 object입니다. [Postgres](https://www.postgresql.org/docs/9.6/static/hstore.html)에서만 사용할 수 있습니다.

- `array: boolean` - 배열이 가능한 postgres와 cockroachdb 열 타입에 사용됩니다. (예시: int[])

- `tarnsformer: { from(value: DatabaseType): EntityType, to(value: EntityType): DatabaseType }` - 임의 타입인 `EntityType`의 속성을 데이터베이스에서 지원하는 타입 `DatabaseType`으로 정리하는데 사용됩니다. transformer 배열도 지원되며, 쓸때는 자연스러운 순서대로, 읽을때는 역순으로 적용됩니다. 예를 들어, `[lowercase, encrypt]`는 먼저 문자열을 소문자로 하고, 쓸때 암호화를 하며 해독후 읽을때는 아무것도 하지 않습니다.

참고: 이러한 열 옵션들은 RDBMS에 따라 다르며, `MongoDB`에서는 사용할 수 없습니다.

## 엔티티 상속

엔티티 상속을 사용해 코드 중복을 줄일 수 있습니다.

예를 들어, `Photo`, `Question`, `Post` 엔티티를 가지고 있다고 해봅시다 :

```typescript
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  size: string;
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  answersCount: number;
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  viewCount: number;
}
```

보다시피 모든 엔티티에 `id`, `title`, `description`와 같은 중복 열이 있습니다. 중복을 줄이고 더 나은 추상화를 위해 `Content` 라고 불리는 기본 클래스를 만들 수 있습니다:

```typescript
export abstract class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
@Entity()
export class Photo extends Content {
  @Column()
  size: string;
}

@Entity()
export class Question extends Content {
  @Column()
  answersCount: number;
}

@Entity()
export class Post extends Content {
  @Column()
  viewCount: number;
}
```

부모 엔티티(부모는 다른 엔티티도 확장할 수 있음)의 모든 열(관계, embed, 등등..)은 최종 엔티티에서 상속되고 생성됩니다.

## 트리 엔티티

TypeORM은 트리구조를 저장하는 인접 리스트와 Closure 테이블 패턴을 지원합니다.

### 인접 리스트

인접 리스트는 자체 참조가 있는 간단한 모델입니다. 이 접근 방법의 이점은 간단하다는 것이지만, 조인 제한으로 인해 큰 트리를 한번에 로드할 수 없다는 점입니다.
예시 :

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany((type) => Category, (category) => category.children)
  parent: Category;

  @ManyToOne((type) => Category, (category) => category.parent)
  children: Category;
}
```

### closure 테이블

closure 테이블은 부모와 자식간의 관계를 특별한 방법으로 별도의 테이블에 저장합니다. 이는 읽기와 쓰기에 모두 효과적입니다. clouser 테이블에 대해 자세히 알아보려면 [Bill Karwin의 멋진 프레젠테이션](https://www.slideshare.net/billkarwin/models-for-hierarchical-data)을 보십시오.
예시 :

```typescript
import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn } from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @TreeLevelColumn()
  level: number;
}
```
