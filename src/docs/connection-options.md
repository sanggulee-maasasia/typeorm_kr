# Connection Options

- [`ConnectionOptions` 이란](#connectionoptions-이란)
- [일반적인 connection 옵션](#일반적인-connection-옵션)
- [`mysql` / `mariadb` connection 옵션](#mysql--mariadb-connection-옵션)
- [`postgres` / `cockroachdb` connection 옵션](#postgres--cockroachdb-connection-옵션)
- [`sqlite` connection 옵션](#sqlite-connection-옵션)
- [`cordova` connection 옵션](#cordova-connection-옵션)
- [`react-native` connection 옵션](#react-native-connection-옵션)
- [`nativescript` connection 옵션](#nativescript-connection-옵션)
- [`mssql` connection 옵션](#mssql-connection-옵션)
- [`mongodb` connection 옵션](#mongodb-connection-옵션)
- [`sql.js` connection 옵션](#sqljs-connection-옵션)
- [`expo` connection 옵션](#expo-connection-옵션)
- [Connection 옵션 예시](#connection-옵션-example)

## `ConnectionOptions` 이란

`ConnectionOption` 은 `createConnection` 또는 `ormconfig` 파일에서 정의하기 위해 전달하는 연결 구성입니다. 서로 다른 데이터베이스들은 서로 고유한 connectionOption을 가지고 있습니다.

## 일반적인 connection 옵션

- `type` - 데이터베이스 타입. 사용할 데이터베이스 엔진을 지정해야합니다. 사용 가능한 값은 다음과 같습니다. "mysql", "postgres", "cockroachdb", "mariadb", "sqlite", "cordova", "nativescript", "oracle", "mssql", "mongodb", "sqljs", "react-native". 이 옵션은 **필수**입니다.

- `name` - connection의 이름. `getConnection(name: string)` 이나 `ConnectionManager.get(name: string)` 을 사용하면 필요한 connection을 얻을 수 있습니다. connection의 이름은 다른 connection의 이름과 같을 수 없으며, 모두 고유한 이름이어야 합니다. 이름이 지정되지 않은 경우에는 "default"가 됩니다.

- `extra` - 기본 드라이버에 전달할 추가 connection 옵션. 기본 데이터베이스 드라이버에 추가 설정을 전달하려면 이 옵션을 사용하세요.

- `entities` - 이 connection에서 로드하고 사용할 엔티티 또는 엔티티 스키마. 엔티티 클래스, 엔티티 스키마 클래스 및 로드할 디렉토리 경로 모두 허용합니다. 디렉토리 경로의 경우에는 glob 패턴을 지원합니다. (예시: `entities: [Post, Category, "entity/*.js", "modules/**/entity/*.js"]`) Entity에 대한 자세한 내용은 [여기](./entities.md), Entity Schema의 자세한 내용은 [여기](separating-entity-definition.md)를 참조하세요.

- `subscribers` - connection에서 로드하고 사용할 subscribers. 엔티티 클래스와 로드할 디렉토리를 허용합니다. 디렉토리는 glob 패턴을 지원합니다. (예시: `subscribers: [PostSubscriber, AppSubscriber, "subscriber/*.js", "modules/**/subscriber/*.js"]`) Subscribers에 대한 자세한 내용은 [여기](listeners-and-subscribers.md)를 참조하세요.

- `migrations` - connection에서 로드하고 사용할 Migrations. migration 클래스와 디렉토리를 허용합니다. 디렉토리는 glob 패턴을 지원합니다.
  (예시 : `migrations: [FirstMigration, SecondMigration, "migration/*.js", "modules/**/migration/*.js"]`)
  Migrations에 대한 자세한 내용은 [여기]](./migrations.md)를 참조하세요.

- `logging` - 로깅 여부를 나타냅니다. 설정값이 `true` 일 경우 쿼리와 에러 로깅을 활성화합니다. 다른 로깅을 활성화하도록 할 수도 있습니다. (예시: ["query", "error", "schema"]) Logging에 대한 자세한 내용은 [여기](./logging.md)를 참조하세요.

- `logger` - 로깅을 위해 사용할 로거. 사용 가능한 값은 "advanced-console", "simple-console", "file". 기본값은 "advanced-console" 입니다. `Logger` 인터페이스를 구현하는 logger 클래스를 지정할 수도 있습니다. logger에 대한 자세한 내용은 [여기](./logging.md)를 참조하세요.

- `maxQueryExecutionTime` - 쿼리 실행 시간이 지정된 최대 실행 시간(milliseconds)을 초과하면 logger가 이 쿼리를 기록합니다.

- `namingStrategy` - Naming Strategy는 데이터베이스에서 테이블과 열의 이름을 정할때 사용됩니다. Naming Strategy에 대한 자세한 내용은
  [여기](./naming-strategy.md)를 참조하세요.

- `entityPrefix` - 이 데이터베이스 connection의 모든 테이블 (혹은 콜렉션)에 문자열 접두어를 지정합니다.

- `dropSchema` - connection이 연결 될 때마다 스키마를 drop합니다. 이 옵션에 주의하고, 프로덕션 환경에서는 이 옵션을 사용하지 마세요. 그렇지 않으면 모든 프로덕션 데이터를 잃을 수도 있습니다. 이 옵션은 디버그나 개발중에 유용합니다.

- `synchronize` - 앱이 실행될 때 마다 자동으로 데이터베이스 스키마를 생성 할지 여부를 나타냅니다. 이 옵션에 주의하고, 프로덕션 환경에서는 이 옵션을 사용하지 마세요. 그렇지 않으면 프로덕션 데이터를 잃을 수도 있습니다. 이 옵션은 디버그나 개발 중에 유용합니다. 이 옵션 대신에 CLI에서 schema:sync 명령을 실행 할 수도 있습니다.
  MongoDB의 경우에는 스키마가 존재하지 않기 때문에, 스키마를 생성하지 않습니다.
  대신에, 그저 index를 생성하는 것으로 동기화 됩니다.

- `migrationsRun` - 앱이 실행 될 때마다 자동으로 migrations을 실행 할지 여부를 나타냅니다. 이 옵션 대신에 CLI에서 migration:run 명령을 실행 할 수도 있습니다.

- `migrationsTableName` - 실행된 migration의 정보를 담고있는 데이터베이스 테이블의 이름입니다. 기본적으로 이 테이블을 "migrations"라고 부릅니다.

- `cache` - 엔티티 결과를 캐싱하도록 설정합니다. 여기서 캐시 탕비이나 다른 캐시 옵션을 구현 할 수도 있습니다. 캐싱에 관한 자세한 내용은 [여기](./caching.md)를 참조하세요.

- `cli.entitiesDir` - CLI에서 기본적으로 entities를 생성해야 하는 디렉토리입니다.

- `cli.migrationsDir` - CLI에서 기본적으로 migrations를 생성해야 하는 디렉토리입니다.

- `cli.subscribersDir` - CLI에서 기본적으로 subscribers를 생성해야 하는 디렉토리 입니다.

## `mysql` / `mariadb` connection 옵션

- `url` - 연결을 수행하는 connection url. 다른 연결 옵션은 url에 설정된 값을 재정의 한다는걸 유의하세요.

- `host` - 데이터베이스 호스트

- `port` - 데이터베이스 호스트의 포트. 기본 mysql 포트는 '3306'입니다.

- `username` - 데이터베이스 유저의 이름.

- `password` - 데이터베이스 비밀번호

- `database` - 데이터베이스 이름

- `charset` - connection을 위한 문자셋. mysql의 sql-level(예: utf8_general_ci)에서는 "collaction"이라고 부릅니다. sql-level의 문자셋이 지정되면(예: utf8mb4) 해당 문자셋에 기본 collaction이 사용됩니다. (기본값: UTF8_GENERAL_CI)

- `timezone` - MySQL 서버에 구성된 표준 시간대. 이는 서버의 날짜/시간 값을 JavaScript Date 객체에 타입캐스트 하는데 사용되며, 그 반대의 경우도 사용됩니다.
  이 값은 `local`, `Z`, `+HH:MM` 이나 `-HH:MM` 형식의 오프셋일 수 있습니다. (기본값: `local`)

- `connectTimeout` - MySQL 서버에 처음으로 연결하는 동안 timeout이 발생하기 전까지의 밀리초. (기본값: 10000)

- `acquireTimeout` - MySQL 서버에 처음으로 연결하는 동안 timeout이 발생하기 전 까지의 밀리초. TCP 연결 timeout을 관리한다는 점에서 connectTimeout이랑은 다릅니다. (기본값: 10000)

- `insecureAuth` - 이전 (안전하지 않은) 인증방법을 요청하는 MySQL 인스턴스에 연결할 수 있도록 허용합니다. (기본값: `false`)

- `supportBigNumbers` - 데이터베이스에서 큰 숫자(`BIGINT` 나 `DECIMAL` 열)를 처리할 때 이 옵션을 사용하세요. (기본값: false)

- `bigNumberStrings` - `supportBigNumbers` 와 `bigNumberStrings`를 모두 활성화하면 항상 큰 숫자(`BIGINT` 및 `DECIMAL`)가 JavaScript String 객체로 반환됩니다. (기본값: `true`). `supportBigNumber`만 사용하도록 설정하면 큰 숫자가 [JavaScript Number 객체](http://ecma262-5.com/ELS5_HTML.htm#Section_8.5)로 정확하게 표현할 수 없는 경우(이 현상은 `[-2^53, +2^53] 범위를 초과할 때 발생합니다)에만 String 객체로 반환되며, 그렇지 않으면 큰 숫자는 Number 객체로 반환됩니다.

- `dateStrings` - 날짜 타입을(`TIMESTAMP`, `DATETIME`, `DATE`) JavaScript
  Date 객체로 확장하지 않고 문자열로 반환하도록 강제로 적용합니다. 사용 가능한 값은 다음과 같습니다: true / false 혹은 문자열로 유지할 type의 이름들에 대한 배열일 수 있습니다.(기본값: `false`)

- `debug` - 프로토콜의 세부정보를 stdout으로 출력합니다. true / false 혹은 출력해야하는 패킷타입의 이름 배열일 수 있습니다.(기본값: `false`)

<!-- 번역 -->

- `trace` - Generates stack traces on Error to include call site of library entrance ("long stack traces").
  Slight performance penalty for most calls. (Default: `true`)

- `multipleStatements` - 쿼리마다 여러 mysql문을 허용합니다. sql injection 공격의 범위가 늘어날 수 있으니 주의하십시오. (기본값: `false`)

- `legacySpatialSupport` - mysql 8에서 삭제된 GeomFromText 및 AsText와 같은 공간함수를 사용합니다. (기본값: `true`)

* `flags` - 기본 연결 플래그가 아닌 다른 연결 플래그의 목록. 기본 연결 플래그를 블랙리스트에 추가할 수도 있습니다. [connection Flags](https://github.com/mysqljs/mysql#connection-flags)에 대한 더 자세한 내용은 여기를 참조하세요.

- `ssl` - ssl 파라미터가 있는 객체 또는 ssl 프로파일 이름을 포함하는 문자열. [SSL 옵션](https://github.com/mysqljs/mysql#ssl-options)을 참조하세요.

## `postgres` / `cockroachdb` connection 옵션

- `url` - 연결을 수행하는 connection url. 다른 연결 옵션은 url에 설정된 값을 재정의 한다는걸 유의하세요.

- `host` - 데이터베이스 호스트.

- `port` - 데이터베이스 호스트의 포트. postgres의 기본 포트번호는 `5432`입니다.

- `username` - 데이터베이스 유저의 이름.

- `password` - 데이터베이스 비밀번호.

- `database` - 데이터베이스 이름.

- `schema` - 스키마의 이름. 기본값은 "public" 입니다.

- `connectTimeoutMS` - postgres 서버에 처음 연결하는 동안에 timeout이 발생하기 전까지의 밀리초입니다. undefined 나 0일경우, timeout 이 발생하지 않습니다. 기본값은 `undefined` 입니다.

- `ssl` - ssl 파라미터가 있는 객체. [TLS/SSL](https://node-postgres.com/features/ssl)을 참조하세요.

- `uuidExtension` - UUID 생성시 사용할 postgres extension입니다. 기본값은 `uuid-ossp` 입니다. `uuid-ossp` 를 사용할 수 없는 경우 `pgcrypto` 로 변경할 수 있습니다.

- `poolErrorHandler` - 기본 풀에서 `'error'` 이벤트를 발생시킬때 실행되는 함수. 단일 파라미터(에러 인스턴스)를 사용하고 로깅을 `warn` 레벨로 기본 설정합니다.

## `sqlite` connection 옵션

- `database` - 데이터베이스 경로. 예를 들면 "./mydb.sql"

## `cordova` connection 옵션

- `database` - 데이터베이스 이름

- `location` - 데이터베이스를 저장할 위치. options에 대해서는 [cordova-sqlite-storage](https://github.com/litehelpers/Cordova-sqlite-storage#opening-a-database)를 참조하세요.

## `react-native` connection 옵션

- `database` - 데이터베이스 이름

- `location` - 데이터베이스를 저장할 위치. options에 대해서는 [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage#opening-a-database) 를 참조하세요.

## `nativescript` connection 옵션

- `database` - 데이터베이스 이름

## `mssql` connection 옵션

- `url` - 연결을 수행하는 connection url. 다른 연결 옵션은 url에 설정된 값을 재정의 한다는걸 유의하세요.

- `host` - 데이터베이스 호스트.

- `port` - 데이터베이스 호스트의 포트. mssql의 기본 포트는 `1443` 입니다.

- `username` - 데이터베이스 유저이름.

- `password` - 데이터베이스 비밀번호.

- `database` - 데이터베이스 이름.

- `schema` - 스키마의 이름. 기본값은 "public" 입니다.

- `domain` - 도메인을 한번 설정하면, 드라이버가 도메인 로그인을 사용해 SQL 서버에 연결합니다.

- `connectionTimeout` - 연결 시간 제한(ms) (기본값: 15000)

- `requestTimeout` - 요청 시간 제한 (ms) (기본값: 15000). note: msnodesqlv8 드라이버는 1초 미만의 시간에 대해서는 지원하지 않습니다.

- `stream` - 콜백의 argument로 한번에 반환하는것 대신에 레코드 세트/행을 stream 합니다 (기본값: false). 또한 각 요청에 따라 독립적으로 stream을 활성화 시킬 수 있습니다 (`request.stream = true`). 많은 수의 행으로 작업할 계획이라면 항상 true로 설정하세요.

- `pool.max` - pool에 있을 수 있는 connection의 최대 개수를 나타냅니다. (기본값: 10)

- `pool.min` - pool에 있을 수 있는 connection의 최소 개수를 나타냅니다. (기본값: 0)

- `pool.maxWaitingClients` - 허용되는 최대 대기 요청 수, 이벤트 루프의 주기에서 에러와 함께 콜백 됩니다.

- `pool.testOnBorrow` - 클라이언트에게 리소스를 제공하기 전에 풀에서 리소스를 검증하는지 여부. `factory.validate` 나 `factory.validateaAsync` 를 지정해야 합니다.

- `pool.acquireTimeoutMillis` - timeout 전에 `acquire` 호출이 리소스를 기다리는 최대 시간 (기본값: 제한없음), 해당 옵션을 사용할 때는 0이 아닌 양의 정수의 값을 가져야합니다.

- `pool.fifo` - 값이 true 일경우 가장 오래된 리소스부터 먼저 할당됩니다. 값이 false일 경우 가장 최근에 생긴 리소스부터 먼저 할당됩니다. 이는 실제로 대기열에서 풀의 동작을 스택으로 바꿉니다. (기본값: true)

- `pool.priorityRange` - 1에서 x 사이의 int 값일 경우, 사용가능한 리소스가 없을 때 borrowers는 상대적 우선순위를 지정할 수 있습니다. 예시를 확인하세요. (기본값: `1`)

- `pool.autostart` - 생성자가 호출된 후에 풀에서 리소스 생성등을 시작할 경우. (기본값:`true`)

- `pool.evictionRunIntervalMillis` - eviction check 실행 빈도. (기본값: `0`) (실행되지 않음)

- `pool.numTestsPerRun` - 각 eviction run을 체크할 리소스의 수. (기본값: `3`)

- `pool.softIdleTimeoutMillis` - 적어도 "최소한의 유휴" 개체 인스턴스가 풀에 남아 있다는 추가 조건과 함께 유휴 개체 제거자에 의해 제거될 수 있기 전에 물체가 풀에 유휴 상태로 있을 수 있는 시간. (기본값: `-1`) (아무것도 제거되지 않음)

- `pool.idelTimeoutMillis` - 유휴 시간으로 인해 개체를 제거하기 전에 풀에서 유휴 상태로 있을 수 있는 최소 시간. `softIdleTimeoutMillis` 를 대신합니다. (기본값: `30000`)

- `pool.errorHandler` - 기본 풀에서 `error` 이벤트를 발생시킬때 실행되는 함수. 단일 파라미터(에러 인스턴스)를 사용하고 로깅을 `warn` 레벨로 기본 설정합니다.

- `options.fallbackToDefaultDb` - 기본적으로, `options.database` 에 의한 데이터베이스 요청에 엑세스 할 수 없는 경우 connection이 실패하고 에러가 발생합니다.
  그러나, `options.fallbackToDefaultDb` 가 `true` 로 설정된 경우 유저의 기본 데이터베이스를 대신 사용합니다. (기본값: `false`)

- `options.instanceName` - 연결할 인스턴스의 이름. SQL server brower 서비스가 데이터베이스 서버에서 실행 중이어야하며, UDP 1434 포트에 연결 할 수 있어야 합니다. `port` 와 상호 배타적입니다. (기본값 없음)

- `options.enableAnsiNullDefault` - 값이 true 일 경우 초기 sql에서 SET ANSI_NULL_DFLT_ON ON 이 설정됩니다. 이는 기본적으로 새 열이 null일수도 있다는 것을 의미합니다 (기본값: true). 자세한 내용은 [T-SQL documentation](https://msdn.microsoft.com/en-us/library/ms187375.aspx)를 참조하세요.

- `options.cancelTimeout` - 요청 취소(거부)가 실패한 것으로 간주되기 전까지의 시간 (밀리초) (기본값: `5000`)

- `options.packetSize` - TDS 패킷의 크기 (서버와의 협의에 따라 다름). 2의 거듭제곱이어야 합니다. (기본값: `4096`)

- `options.useUTC` - UTC 또는 local 시간으로 시간 값을 전달할지 여부를 결정하는 boolean 입니다. (기본값: `true`)

- `options.abortTransactionOnError` - 지정된 트랜잭션을 실행중에 에러가 발생하면 트랜잭션을 자동으로 롤백할지 여부를 결정하는 boolean 입니다. 연결의 초기 sql 단계중에 `SET XACT_ABORT` 에 대한 값을 결정합니다.

- `options.localAddress` - SQL 서버에 연결할 때 사용할 네트워크 인터페이스 (ip 주소)를 나타내는 문자열 입니다.

- `options.useColumnNames` - 행을 배열 또는 키-값 콜렉션으로 반환할지 여부를 결정하는 boolean 입니다.

- `options.camelCaseColumns` - 반환된 열의 첫 글자를 소문자로 변환할 것인지 여부를 제어하는 boolean. `columnNAmeReplacer` 을 제공하는 경우 이 값은 무시됩니다. (기본값: `false`)

- `options.isolationLevel` - 트랜잭션을 실행할 기본 격리 수준. 격리 수준은 `require('tedious').ISOLATION_LEVEL` 에서 사용할 수 있습니다.

  - `READ_UNCOMMITTED`
  - `READ_COMMITTED`
  - `REPEATABLE_READ`
  - `SERIALIZABLE`
  - `SNAPSHOT`

  (기본값: `READ_COMMITTED`)

- `options.connectionIsolationLevel` - 새로운 connection 에 대한 기본 격리 수준. 모든 트랜잭션 외의 쿼리는 이 설정으로 실행됩니다. 격리 수준은 `require('tedious').ISOLATION_LEVEL` 에서 사용할 수 있습니다.

  - `READ_UNCOMMITTED`
  - `READ_COMMITTED`
  - `REPEATABLE_READ`
  - `SERIALIZABLE`
  - `SNAPSHOT`

  (기본값): `READ_COMMITTED`)

- `options.readOnlyIntent` - connection 이 SQL 서버 가용성 그룹에 읽기 전용 엑세스를 요청할지 여부를 결정하는 boolean 입니다. 더 많은 정보를 원하면, 여기를 보세요. (기본값: `false`)

- `options.encrypt` - 연결 암호화를 사용할지 여부를 결정하는 boolean 입니다. Windows Azure를 사용중이라면 true 로 설정하세요. (기본값: `false`)

- `options.cryptoCredentialsDetails` - 암호화를 사용할 경우, [tls.createSecurePair](http://nodejs.org/docs/latest/api/tls.html#tls_tls_createsecurepair_credentials_isserver_requestcert_rejectunauthorized) 를 호출할 때 첫번째 인수에 사용될 객체가 제공될 수 있습니다. (기본값: `false`)

- `options.rowCollectionOnDone` - 값이 true 일 경우 요청의 `*done` 이벤트에서 수신된 행이 노출됩니다. done, [doneInProc](http://tediousjs.github.io/tedious/api-request.html#event_doneInProc), [doneProc](http://tediousjs.github.io/tedious/api-request.html#event_doneProc) 를 참조하십시오. (기본값: `false`)

주의: 많은 행을 수신할 경우에 이 옵션을 활성화하면 메모리 사용량이 과도하게 늘어날 수 있습니다.

- `options.rowCollectionOnRequestCompletion` - 값이 true 일 경우 요청 완료 콜백에서 수신된 행이 노출됩니다. [new Request](http://tediousjs.github.io/tedious/api-request.html#function_newRequest)를 참조하십시오. (기본값: `false`)

주의: 많은 행을 수신할 경우에 이 옵션을 활성화하면 메모리 사용량이 과도하게 늘어날 수 있습니다.

- `options.tdsVersion` - 사용할 TDS 버전. 서버가 지정된 버전을 지원하지 않는 경우, 협의된 버전이 대신 사용됩니다. 버전은 `require('tedious').TDS_VERSION` 에서 구할 수 있습니다.

  - `7_1`
  - `7_2`
  - `7_3_A`
  - `7_3_B`
  - `7_4`

(기본값: `7_4`)

- `options.debug.packet` - 패킷 세부 정보를 설명하는 텍스트로 디버그 이벤트를 내보낼지 여부를 제어하는 boolean 입니다. (기본값: `false`)

- `options.debug.data` - 패킷 데이터의 세부 정보를 설명하는 텍스트로 디버그 이벤트를 내보낼지 여부를 제어하는 boolean 입니다. (기본값:`false`)

- `options.debug.payload` - 패킷 payload의 세부 정보를 설명하는 텍스트로 디버그 이벤트를 내보낼지 여부를 제어하는 boolean 입니다. (기본값: `false`)

- `options.debug.token` - 토큰 스트림 토큰을 설명하는 텍스트로 디버그 이벤트를 내보낼지 여부를 제어하는 boolean 입니다. (기본값: `false`)

## `mongodb` connection 옵션

- `url` - 연결을 수행하는 connection url. 다른 connection 옵션은 url에 설정된 값을 재정의 한다는걸 유의하세요.

- `host` - 데이터베이스 호스트.

- `port` - 데이터베이스 호스트의 포트. mongodb 의 기본 port 는 `27017` 입니다.

- `database` - 데이터베이스 이름.

- `poolsize` - 각 개별의 서버나 프록시 연결의 최대 풀 크기를 지정합니다.

- `ssl` - ssl 연결을 사용합니다 (ssl을 지원하는 mongod 서버가 필요합니다). (기본값: `false`)

- `sslValidate` - ca에 대해 mongod 서버 인증서를 확인합니다 (ssl을 지원하는 2.4버전 이상의 mongod 서버가 필요합니다). (기본값: `true`)

- `sslCA` - 버퍼 혹은 문자열으로 유효한 인증서의 배열. (ssl을 지원하는 2.4버전 이상의 mongod 서버가 필요합니다).

- `sslCert` - 표시할 인증서를 포함하고 있는 문자열 혹은 버퍼. (ssl을 지원하는 2.4버전 이상의 mongod 서버가 필요합니다).

- `sslKey` - 표시할 인증서 개인 키를 포함하고 있는 문자열 혹은 버퍼. (ssl을 지원하는 2.4버전 이상의 mongod 서버가 필요합니다).

- `sslPass` - 인증서 비밀번호를 포함하고 있는 문자열 혹은 버퍼. (ssl을 지원하는 2.4버전 이상의 mongod 서버가 필요합니다).

- `autoReconnect` - 오류가 발생하면 다시 연결합니다. (기본값: `true`)

- `noDelay` - TCP 소켓의 NoDelay 옵션입니다. (기본값: `true`)

- `keepAlive` - TCP 소켓에서 keepAlive를 시작하기 전까지 대기한 시간. (밀리초)
  (기본값: `30000`)

- `connectTimeoutMS` - TCP connection의 timeout 설정입니다. (기본값: `30000`)

- `socketTimeoutMS` - TCP 소켓의 timeout 설정입니다 (기본값: `360000`).

- `reconnectTries` - 서버가 #번 다시 연결을 시도합니다 (기본값: `30`).

- `reconnectInterval` - 서버가 재시도 사이사이에 #밀리초만큼 대기합니다 (기본값: `1000`).

- `ha` - 고성능 모니터링을 설정합니다 (기본값: `true`).

- `haInterval` - 각각의 replicaset 상태 체크 사이의 시간 (기본값: `10000,5000`).

- `replicaSet` - 연결 할 replicaSet의 이름.

- `acceptableLatencyMS` - Sets the range of servers to pick when using NEAREST (lowest ping ms + the latency fence,
  ex: range of 1 to (1 + 15) ms). Default: `15`.

- `secondaryAcceptableLatencyMS` - Sets the range of servers to pick when using NEAREST (lowest ping ms + the latency
  fence, ex: range of 1 to (1 + 15) ms). Default: `15`.

- `connectWithNoPrimary` - Sets if the driver should connect even if no primary is available. Default: `false`.

- `authSource` - If the database authentication is dependent on another databaseName.

- `w` - The write concern.

- `wtimeout` - The write concern timeout value.

- `j` - Specify a journal write concern. Default: `false`.

- `forceServerObjectId` - Force server to assign \_id values instead of driver. Default: `false`.

- `serializeFunctions` - Serialize functions on any object. Default: `false`.

- `ignoreUndefined` - Specify if the BSON serializer should ignore undefined fields. Default: `false`.

- `raw` - Return document results as raw BSON buffers. Default: `false`.

- `promoteLongs` - Promotes Long values to number if they fit inside the 53 bits resolution. Default: `true`.

- `promoteBuffers` - Promotes Binary BSON values to native Node Buffers. Default: `false`.

- `promoteValues` - Promotes BSON values to native types where possible, set to false to only receive wrapper types.
  Default: `true`.

- `domainsEnabled` - Enable the wrapping of the callback in the current domain, disabled by default to avoid perf hit.
  Default: `false`.

- `bufferMaxEntries` - Sets a cap on how many operations the driver will buffer up before giving up on getting a
  working connection, default is -1 which is unlimited.

- `readPreference` - The preferred read preference.

  - `ReadPreference.PRIMARY`
  - `ReadPreference.PRIMARY_PREFERRED`
  - `ReadPreference.SECONDARY`
  - `ReadPreference.SECONDARY_PREFERRED`
  - `ReadPreference.NEAREST`

- `pkFactory` - A primary key factory object for generation of custom \_id keys.

- `promiseLibrary` - A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible.

- `readConcern` - Specify a read concern for the collection. (only MongoDB 3.2 or higher supported).

- `maxStalenessSeconds` - Specify a maxStalenessSeconds value for secondary reads, minimum is 90 seconds.

- `appname` - The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this
  value in the server log upon establishing each connection. It is also recorded in the slow query log and profile
  collections

- `loggerLevel` - Specify the log level used by the driver logger (`error/warn/info/debug`).

- `logger` - Specify a customer logger mechanism, can be used to log using your app level logger.

- `authMechanism` - Sets the authentication mechanism that MongoDB will use to authenticate the connection.

## `sql.js` connection 옵션

- `database`: The raw UInt8Array database that should be imported.

- `sqlJsConfig`: Optional initialize config for sql.js.

- `autoSave`: Whether or not autoSave should be disabled. If set to true the database will be saved to the given file location (Node.js) or LocalStorage element (browser) when a change happens and `location` is specified. Otherwise `autoSaveCallback` can be used.

- `autoSaveCallback`: A function that get's called when changes to the database are made and `autoSave` is enabled. The function gets a `UInt8Array` that represents the database.

- `location`: The file location to load and save the database to.

- `useLocalForage`: Enables the usage of the localforage library (https://github.com/localForage/localForage) to save & load the database asynchronously from the indexedDB instead of using the synchron local storage methods in a browser environment. The localforage node module needs to be added to your project and the localforage.js should be imported in your page.

## `expo` connection options

- `database` - Name of the database. For example, "mydb".
- `driver` - The Expo SQLite module. For example, `require('expo-sqlite')`.

## Connection options example

Here is a small example of connection options for mysql:

```typescript
{
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    logging: true,
    synchronize: true,
    entities: [
        "entity/*.js"
    ],
    subscribers: [
        "subscriber/*.js"
    ],
    entitySchemas: [
        "schema/*.json"
    ],
    migrations: [
        "migration/*.js"
    ],
    cli: {
        entitiesDir: "entity",
        migrationsDir: "migration",
        subscribersDir: "subscriber"
    }
}
```
