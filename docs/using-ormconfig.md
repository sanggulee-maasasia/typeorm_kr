# Using Configuration Sources

- [환경설정 파일에서 새 연결 생성](#환경설정-파일에서-새-연결-생성)
- [`ormconfig.json` 사용하기](#ormconfigjson-사용하기)
- [`ormconfig.js` 사용하기](#ormconfigjs-사용하기)
- [환경변수 사용하기](#환경변수-사용하기)
- [`ormconfig.yml` 사용하기](#ormconfigyml-사용하기)
- [`ormconfig.xml` 사용하기](#ormconfigxml-사용하기)
- [ormconfig에 재정의된 옵션](#ormconfig에-재정의된-옵션)

## 환경설정 파일에서 새 연결 생성

<!-- 번역 -->

Most of the times you want to store your connection options in a separate configuration file.
It makes it convenient and easy to manage.
TypeORM supports multiple configuration sources.
You only need to create a `ormconfig.[format]` file in the root directory of your application (near `package.json`),
put your configuration there and in your app call `createConnection()` without any configuration passed:

```typescript
import { createConnection } from 'typeorm';

// createConnection 함수는 자동적으로 연결 옵션을 읽어옵니다.
// ormconfig 파일이나 환경 변수에서요.
const connection = await createConnection();
```

ormconfig 파일이 지원하는 포맷은 다음과 같습니다 : `.json`, `.js`, `.env`, `.yml`, `.xml`.

## `ormconfig.json` 사용하기

프로젝트 루트(package.json이 존재하는 경로)에 `ormconfig.json` 파일을 만드세요. 다음 내용을 포함해야 합니다 :

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "test",
  "password": "test",
  "database": "test"
}
```

[ConnectionOptions](./connection-options.md) 에서 다른 옵션을 지정할 수 있습니다.

여러개의 connection을 원한다면 단일 배열에 여래개의 connection을 만들면 됩니다 :

```json
[
  {
    "name": "default",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "test"
  },
  {
    "name": "second-connection",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "test"
  }
]
```

## `ormconfig.js` 사용하기

프로젝트 루트(package.json이 존재하는 경로)에 `ormconfig.js` 파일을 만드세요. 다음 내용을 포함해야 합니다 :

```javascript
module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
};
```

[ConnectionOptions](./connection-options.md) 에서 다른 옵션을 지정할 수 있습니다.
여러개의 connection을 원한다면 단일 배열에 여래개의 connection을 만들고 반환하십시오.

## 환경변수 사용하기

프로젝트 루트(package.json이 존재하는 경로)에 `.env` 나 `.ormconfig.env` 파일을 만드세요. 다음 내용을 포함해야 합니다 :

```ini
TYPEORM_CONNECTION = mysql
TYPEORM_HOST = localhost
TYPEORM_USERNAME = root
TYPEORM_PASSWORD = admin
TYPEORM_DATABASE = test
TYPEORM_PORT = 3000
TYPEORM_SYNCHRONIZE = true
TYPEORM_LOGGING = true
TYPEORM_ENTITIES = entity/*.js,modules/**/entity/*.js
```

사용할 수 있는 env 목록:

- TYPEORM_CACHE
- TYPEORM_CACHE_ALWAYS_ENABLED
- TYPEORM_CACHE_DURATION
- TYPEORM_CACHE_OPTIONS
- TYPEORM_CONNECTION
- TYPEORM_DATABASE
- TYPEORM_DEBUG
- TYPEORM_DRIVER_EXTRA
- TYPEORM_DROP_SCHEMA
- TYPEORM_ENTITIES
- TYPEORM_ENTITIES_DIR
- TYPEORM_ENTITY_PREFIX
- TYPEORM_HOST
- TYPEORM_LOGGER
- TYPEORM_LOGGING
- TYPEORM_MAX_QUERY_EXECUTION_TIME
- TYPEORM_MIGRATIONS
- TYPEORM_MIGRATIONS_DIR
- TYPEORM_MIGRATIONS_RUN
- TYPEORM_MIGRATIONS_TABLE_NAME
- TYPEORM_PASSWORD
- TYPEORM_PORT
- TYPEORM_SCHEMA
- TYPEORM_SID
- TYPEORM_SUBSCRIBERS
- TYPEORM_SUBSCRIBERS_DIR
- TYPEORM_SYNCHRONIZE
- TYPEORM_URL
- TYPEORM_USERNAME
- TYPEORM_UUID_EXTENSION

`TYPEORM_CACHE` boolean 혹은 cache 유형의 문자열이어야 합니다.

`ormconfig.env` 개발중에만 사용해야합니다. 실제 프로덕션 환경에서는 환경변수로 이러한 값들을 다 설정 가능합니다.

`env` 파일 혹은 환경변수를 사용하여 여러 연결을 저의 할 수 없습니다. 앱에 여러개의 connection이 있는 경우 대안으로 구성 저장소(configuration storage) 포맷을 사용하세요.

MYSQL용 `charset` 과 드라이버별 옵션을 전달해야 하는 경우, `TYPEORM_DRIVER_EXTRA` 변수를 JSON 형식으로 사용할 수 있다. 예시 :

```
TYPEORM_DRIVER_EXTRA='{"charset": "utf8mb4"}'
```

## `ormconfig.yml` 사용하기

프로젝트 루트(package.json이 존재하는 경로)에 `ormconfig.yml` 파일을 만드세요. 다음 내용을 포함해야 합니다 :

```yaml
default: # 기본 connection
  host: 'localhost'
  port: 3306
  username: 'test'
  password: 'test'
  database: 'test'

second-connection: # 다른 connection
  host: 'localhost'
  port: 3306
  username: 'test'
  password: 'test'
  database: 'test2'
```

사용 가능한 모든 연결 옵션을 사용할 수 있습니다.

## `ormconfig.xml` 사용하기

프로젝트 루트(package.json이 존재하는 경로)에 `ormconfig.xml` 파일을 만드세요. 다음 내용을 포함해야 합니다 :

```xml
<connections>
    <connection type="mysql" name="default">
        <host>localhost</host>
        <username>root</username>
        <password>admin</password>
        <database>test</database>
        <port>3000</port>
        <logging>true</logging>
    </connection>
    <connection type="mysql" name="second-connection">
        <host>localhost</host>
        <username>root</username>
        <password>admin</password>
        <database>test2</database>
        <port>3000</port>
        <logging>true</logging>
    </connection>
</connections>
```

사용 가능한 모든 연결 옵션을 사용할 수 있습니다.

## Typeorm에서 사용하는 구성 파일

때로는, 다른 포맷을 사용하여 여러 구성을 사용하려고 할 수 있습니다. `getConnectionOptions()` 를 호출하거나 연결 옵션 없이 `createConnection()` 을 사용하려고 할 때 Typeorm은 다음 순서로 구성을 로드하려고 시도합니다 :

1. 환경변수에서 Typeorm은 `.env` 파일이 존재하면 dotEnv를 사용하여 파일을 로드하려고 시도합니다. 환경변수 `TYPEORM_CONNECTION` 이나 `TYPEORM_URL`이 설정되면 이 방법을 사용합니다.
2. `ormconfig.env` 에서 로드합니다.
3. 다른 `ormconfig.[format]` 파일에서 로드하는데, 로드하는 순서는 다음과 같습니다 : `[js, ts, json, yml, yaml, xml]`.

typeorm은 첫번째로 유효한 방법을 사용하며 그 이외의 다른 방법은 로드하지 않는다는점에 유의 하세요. 예를들어 환경중에 설정이 발견되면 `ormconfig.[format]` 파일은 로드하지 않습니다.

## ormconfig에 재정의된 옵션

때때로 ormconfig 파일에 정의된 값을 재정의하거나 일부 TypeScript / JavaScript 로직을 구성에 추가하고 싶을지도 모릅니다.

이런 경우에는 ormconfig에서 옵션을 로드하고 `ConnectionOptions`를 빌드 한다음, `createConnection` 함수로 전달하기 전에 해당 옵션에서 원하는 모든 작업을 수행할 수 있습니다 :

```typescript
// ormconfig에서(혹은 ENV 변수) connection 옵션을 읽어옵니다.
const connectionOptions = await getConnectionOptions();

// 번역
// do something with connectionOptions,
// for example append a custom naming strategy or a custom logger
Object.assign(connectionOptions, { namingStrategy: new MyNamingStrategy() });

// 수정된 옵션으로 connection 생성
const connection = await createConnection(connectionOptions);
```
