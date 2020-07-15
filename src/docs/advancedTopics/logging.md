# 로깅

- [로깅 활성화](#로깅-활성화)
- [로깅 옵션](#로깅-옵션)
- [장기 실행 쿼리 기록](#장기-실행-쿼리-기록)
- [기본 로거 변경](#기본-로거-변경)
- [사용자 정의 로거 사용](#사용자-정의-로거-사용)

## 로깅 활성화

연결 옵션에서 `logging: true` 를 설정하기만 하면 모든 쿼리 및 오류를 로깅할 수 있습니다 :

```typescript
{
    name: "mysql",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    ...
    logging: true
}
```

## 로깅 옵션

연결 옵션에서 다양한 유형의 로깅을 사용하도록 설정할 수 있습니다 :

```typescript
{
    host: "localhost",
    ...
    logging: ["query", "error"]
}
```

실패한 쿼리의 로깅만 사용하도록 설정하려면 `error` 만 추가합니다 :

```typescript
{
    host: "localhost",
    ...
    logging: ["error"]
}
```

사용할 수 있는 다른 옵션은 다음과 같습니다 :

- `query` - 모든 쿼리를 기록합니다.
- `error` - 실패하거나 에러가난 모든 쿼리를 기록합니다.
- `schema` - 스키마 빌드 프로세스를 기록합니다.
- `warn` - 내부 orm 경고를 기록합니다.
- `info` - 내부 orm 정보 메시지를 기록합니다.
- `log` - 내부 orm 로그 메시지를 기록합니다.

필요한만큼 옵션을 지정할 수 있습니다. 모든 로깅을 사용하도록 설정하려면 `logging: "all"` 만 지정하면 됩니다:

```typescript
{
    host: "localhost",
    ...
    logging: "all"
}
```

## 장기 실행 쿼리 기록

성능 이슈가 있는 경우, 연결 옵션에 `maxQueryExecution`을 설정하여 실행시간이 너무 오래걸리는 쿼리를 기록할 수 있습니다 :

```typescript
{
    host: "localhost",
    ...
    maxQueryExecutionTime: 1000
}
```

이 코드는 `1초` 이상 실행되는 모든 쿼리를 기록합니다.

## Changing default logger

TypeORM은 4가지 유형의 로거 유형이 지원됩니다 :

- `advanced-console` - 색상 및 SQL 구문 강조 표시를 사용하여 모든 메시지를 콘솔에 기록하는 기본 로거입니다 ([chalk](https://github.com/chalk/chalk) 사용).
- `simple-console` - 이 로거는 advanced 로거와 정확히 동일하지만 색상 강조 표시를 사용하지 않는 간단한 콘솔 로거입니다.
  문제가 있거나 색상이 지정된 로그를 싫어하는 경우 이 로거를 사용할 수 있습니다.
- `file` - 이 로거는 프로젝트의 루트 폴더에 있는 ormlogs.log에 모든 로그를 기록합니다. (`package.json` 및 `ormconfig.json`이랑 같은 디렉토리에 존재합니다)
- `debug` - 이 로거는 debug package(링크)를 사용하여 주변 변수 `DEBUG=typeorm:*` 로깅 세트를 켭니다(기록 옵션은 이 로거에 영향을 주지 않습니다).

연결 옵션에서 다음 중 하나를 사용하도록 설정할 수 있습니다 :

```typescript
{
    host: "localhost",
    ...
    logging: true,
    logger: "file"
}
```

## 사용자 정의 로거 사용

`Logger` 인터페이스를 구현하여 고유한 로거 클래스를 생성할 수 있습니다:

```typescript
import { Logger } from 'typeorm';

export class MyCustomLogger implements Logger {
  // implement all methods from logger class
}
```

그리고 연결 옵션에서 지정합니다:

```typescript
import { createConnection } from 'typeorm';
import { MyCustomLogger } from './logger/MyCustomLogger';

createConnection({
  name: 'mysql',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'test',
  password: 'test',
  database: 'test',
  logger: new MyCustomLogger(),
});
```

`ormconfig` 파일에 연결 옵션을 정의한 경우 다음과 같은 방법으로 연결 옵션을 사용하고 재정의할 수 있습니다 :

```typescript
import { createConnection, getConnectionOptions } from 'typeorm';
import { MyCustomLogger } from './logger/MyCustomLogger';

// getConnectionOptions will read options from your ormconfig file
// and return it in connectionOptions object
// then you can simply append additional properties to it
getConnectionOptions().then((connectionOptions) => {
  return createConnection(
    Object.assign(connectionOptions, {
      logger: new MyCustomLogger(),
    }),
  );
});
```

사용 가능한 경우 Logger 메서드는 `QueryRunner` 를 받을 수 있습니다. 추가 데이터를 기록하려는 경우 유용합니다.
또한 query runner를 통해 지속/제거 중에 전달된 추가 데이터에 액세스할 수 있습니다. 예제 :

```typescript
// user sends request during entity save
postRepository.save(post, { data: { request: request } });

// in logger you can access it this way:
logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const requestUrl = queryRunner && queryRunner.data["request"] ? "(" + queryRunner.data["request"].url + ") " : "";
    console.log(requestUrl + "executing query: " + query);
}
```
