# 마이그레이션(Migrations)

- [마이그레이션의 작동 방식](#마이그레이션의-작동-방식)
- [새 마이그레이션 만들기](#새-마이그레이션-만들기)
- [마이그레이션 실행 및 되돌리기](#마이그레이션-실행-및-되돌리기)
- [마이그레이션 생성](#마이그레이션-생성)
- [연결 옵션](#연결-옵션)
- [마이그레이션 API를 사용하여 마이그레이션 작성](#마이그레이션-API를-사용하여-마이그레이션-작성)

## 마이그레이션의 작동 방식

프로덕션에 들어간 후에는 모델 변경 사항을 데이터베이스에 동기화해야 합니다.
일반적으로 데이터베이스에 데이터가 저장되면 프로덕션에서 스키마 동기화에
'동기화: true'를 사용하는 것은 안전하지 않습니다. 여기서 마이그레이션이 도움이 됩니다.

마이그레이션은 데이터베이스 스키마를 업데이트하고 기존 데이터베이스에
새로운 변경사항을 적용하기 위한 SQL 쿼리가 있는 단일 파일일 뿐입니다.

이미 데이터베이스와 포스트 엔티티가 있다고 가정해 보겠습니다 :

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;
}
```

그리고 엔티티는 아무런 변경없이 수개월동안 생산 작업을 수행했습니다. 데이터베이스에 수천 개의 게시물이 있습니다.

이제 새 릴리즈를 만들고 `title`의 `name`을 바꿔야합니다. 어떻게 하시겠어요?

다음 sql 쿼리를 사용하여 새 마이그레이션을 생성해야 합니다.

```sql
ALTER TABLE "post" ALTER COLUMN "title" RENAME TO "name";
```

다음 sql 쿼리를 사용하여 새 마이그레이션을 생성해야 합니다.
이 sql 쿼리를 실행하면 데이터베이스 스키마가 새 코드베이스에서 작업할 준비가 됩니다.
TypeORM은 이러한 SQL 쿼리를 작성하고 필요할 때 실행할 수 있는 장소를 제공합니다.
이 장소를 "migrations"이라고 합니다.

## 새 마이그레이션 만들기

**전제조건**: [CLI 설치](https://typeorm.io/#/using-cli/installing-cli)

새 마이그레이션을 생성하기 전에 연결 옵션을 올바르게 설정해야 합니다 :

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "test",
  "password": "test",
  "database": "test",
  "entities": ["entity/*.js"],
  "migrationsTableName": "custom_migration_table",
  "migrations": ["migration/*.js"],
  "cli": {
    "migrationsDir": "migration"
  }
}
```

여기 세가지 옵션이 있습니다 :

- `"migrationsTableName": "migrations"` - 마이그레이션 테이블 이름이 "migrations" 과 달라야 하는 경우에만 이 옵션을 지정합니다.
- `"migrations": ["migration/*.js"]` - typeorm은 지정된 "migration" 디렉토리에서 마이그레이션을 로드해야 함을 나타냅니다.
- `"cli": { "migrationsDir": "migration" }` - CLI가 "migration" 디렉토리에 새 마이그레이션을 생성해야 함을 나타냅니다.

연결 옵션을 설정한 후에는 CLI를 사용하여 새 마이그레이션을 생성할 수 있습니다 :

```
typeorm migration:create -n PostRefactoring
```

여기서 `PostRefactoring`은 마이그레이션의 이름입니다. 원하는 이름을 지정할 수 있습니다.
명령을 실행하면 `{TIMESTAMP}-PostRefactoring.ts` 라는 이름의 "마이그레이션" 디렉토리에서
생성된 새 파일을 볼 수 있습니다. 여기서 `{TIMESTAMP}` 는 마이그레이션이 생성되었을 때의 현재
타임스탬프입니다. 이제 파일을 열고 마이그레이션 SQL 쿼리를 추가할 수 있습니다.

마이그레이션 내에서 다음 내용이 표시되어야 합니다:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactoringTIMESTAMP implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {}

  async down(queryRunner: QueryRunner): Promise<void> {}
}
```

마이그레이션 코드에는 `up`과 `down`의 두 가지 메소드를 입력해야 합니다.
`up`에는 마이그레이션을 수행하는 데 필요한 코드가 포함되어 있어야 합니다.
`down`은 변경된 `up`을 되돌려야 합니다. `down` 메서드는 마지막 마이그레이션을 되돌리는 데 사용됩니다.

`up`과 `down` 둘 다 안에 `QueryRunner` 개체가 있습니다. 모든 데이터베이스 작업은 이 개체를 사용하여 실행됩니다.[query runner](https://typeorm.io/#/query-runner/)에 대해 자세히 알아봅니다.

`Post` 변경 내용을 통해 마이그레이션에 대해 알아보겠습니다:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactoringTIMESTAMP implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "title" TO "name"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "name" TO "title"`); // reverts things made in "up" method
  }
}
```

## 마이그레이션 실행 및 되돌리기

프로덕션에서 실행할 마이그레이션이 있으면 다음 CLI 명령을 사용하여 마이그레이션을 실행할 수 있습니다:

```
typeorm migration:run
```

**`typeorm migration:create` 및 `typeorm migration:generate`는 `.ts` 파일을 생성합니다. `migration:run`과 `migration:revert`는 `.js` 파일에서만 작동합니다. 따라서 명령을 실행하기 전에 타입 지정 파일을 컴파일 해야합니다.** 또는 `ts-node` 를 `typeorm` 과 함께 사용하여 `.ts` 마이그레이션 파일을 실행할 수 있습니다.

`ts-node` 예시 :

```
ts-node ./node_modules/typeorm/cli.js migration:run
```

이 명령은 보류 중인 모든 마이그레이션을 실행하고 타임스탬프에서 순서대로 실행합니다.
즉, 생성된 마이그레이션의 `up` 방법으로 작성된 모든 SQL 쿼리가 실행됩니다. 그게 다예요!
이제 데이터베이스 스키마를 최신 상태로 만들었습니다.

어떤 이유로든 변경 사항을 되돌리려는 경우 다음을 실행할 수 있습니다 :

```
typeorm migration:revert
```

이 명령은 최근에 실행된 마이그레이션에서 `down`을 실행합니다. 여러 마이그레이션을 되돌려야 하는 경우 이 명령을 여러 번 호출해야 합니다.

## 마이그레이션 생성

TypeORM은 스키마 변경으로 마이그레이션 파일을 자동으로 생성할 수 있습니다.

`title` 열이 있는 `post` 엔티티가 있으며, `title` 이름을 `name`으로 변경했다고 가정해 보겠습니다. 다음 명령을 실행할 수 있습니다 :

```
typeorm migration:generate -n PostRefactoring
```

그리고 다음과 같은 내용으로 `{TIMESTAMP}-PostRefactoring.ts` 라는 새 마이그레이션을 생성합니다.

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactoringTIMESTAMP implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" RENAME TO "name"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "name" RENAME TO "title"`);
  }
}
```

직접 쿼리를 작성할 필요는 없습니다. . 마이그레이션을 생성하는 방법은 모델을 "각각" 변경한 후 마이그레이션을 생성하는 것입니다.

## 연결 옵션

기본 연결이 아닌 다른 연결에 대해 마이그레이션을 실행/반복해야 하는 경우
`-c`(`--connection` 의 별칭)를 사용하고 구성 이름을 인수로 전달합니다.

```
typeorm -c <your-config-name> migration:{run|revert}
```

## 마이그레이션 API를 사용하여 마이그레이션 작성

API를 사용하여 데이터베이스 스키마를 변경하려면 `QueryRunner`를 사용할 수 있습니다.

예시 :

```ts
import { MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from 'typeorm';

export class QuestionRefactoringTIMESTAMP implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'question',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'question',
      new TableIndex({
        name: 'IDX_QUESTION_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'answer',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      'answer',
      new TableColumn({
        name: 'questionId',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'answer',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'question',
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('question');
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('questionId') !== -1);
    await queryRunner.dropForeignKey('question', foreignKey);
    await queryRunner.dropColumn('question', 'questionId');
    await queryRunner.dropTable('answer');
    await queryRunner.dropIndex('question', 'IDX_QUESTION_NAME');
    await queryRunner.dropTable('question');
  }
}
```

---

```ts
getDatabases(): Promise<string[]>
```

시스템 데이터베이스를 포함하여 사용 가능한 모든 데이터베이스 이름을 반환합니다.

---

```ts
getSchemas(database?: string): Promise<string[]>
```

- `database` - 데이터베이스 매개 변수가 지정된 경우 해당 데이터베이스의 스키마를 반환합니다.

시스템 스키마를 포함하여 사용 가능한 모든 스키마 이름을 반환합니다. SQLServer 및 Postgres에만 유용합니다.

---

```ts
getTable(tableName: string): Promise<Table|undefined>
```

- `tableName` - 로드할 테이블 이름.

데이터베이스에서 지정된 이름으로 테이블을 로드합니다.

---

```ts
getTables(tableNames: string[]): Promise<Table[]>
```

- `tableNames` - 로드할 테이블 이름.

데이터베이스에서 지정된 이름으로 테이블을 로드합니다.

---

```ts
hasDatabase(database: string): Promise<boolean>
```

- `database` - 확인할 데이터베이스의 이름입니다.

지정된 이름의 데이터베이스가 있는지 확인합니다.

---

```ts
hasSchema(schema: string): Promise<boolean>
```

- `schema` - 확인할 스키마의 이름입니다.

지정된 이름의 스키마가 있는지 확인합니다. SQLServer 및 Postgres에만 사용됩니다.

---

```ts
hasTable(table: Table|string): Promise<boolean>
```

- `table` - 테이블 객체 또는 이름입니다.

테이블이 있는지 확인합니다.

---

```ts
hasColumn(table: Table|string, columnName: string): Promise<boolean>
```

- `table` - 테이블 객체 또는 이름입니다.
- `columnName` - 확인할 열의 이름입니다.

테이블에 열이 있는지 확인합니다.

---

```ts
createDatabase(database: string, ifNotExist?: boolean): Promise<void>
```

- `database` - 데이터베이스 이름입니다.
- `ifNotExist` - `true` 일 경우 생성을 건너뛰고, 그렇지 않을 경우 데이터베이스가 이미 있는 경우 오류를 발생시킵니다.

새 데이터베이스를 만듭니다.

---

```ts
dropDatabase(database: string, ifExist?: boolean): Promise<void>
```

- `database` - 데이터베이스 이름입니다.
- `ifExist` - `true`일 경우 삭제를 건너뛰고, 그렇지 않을 경우 데이터베이스를 찾을 수 없는 경우 오류를 발생시킵니다.

데이터베이스를 드랍합니다.

---

```ts
createSchema(schemaPath: string, ifNotExist?: boolean): Promise<void>
```

- `schemaPath` - 스키마 이름입니다. SQLServer의 경우 스키마 경로(예: 'dbName.schemaName')를 매개 변수로 사용합니다. 스키마 경로가 전달되면 지정된 데이터베이스에 스키마가 생성됩니다.
- `ifNotExist` - `true` 일 경우 생성을 건너뛰고, 그렇지 않을 경우 데이터베이스가 이미 있는 경우 오류를 발생시킵니다.

새 테이블 스키마를 만듭니다.

---

```ts
dropSchema(schemaPath: string, ifExist?: boolean, isCascade?: boolean): Promise<void>
```

- `schemaPath` - 스키마 이름입니다. SQLServer의 경우 스키마 경로(예: 'dbName.schemaName')를 매개 변수로 사용합니다. 스키마 경로가 전달되면 지정된 데이터베이스에 스키마가 생성됩니다.
- `ifExist` - `true`일 경우 삭제를 건너뛰고, 그렇지 않을 경우 데이터베이스를 찾을 수 없는 경우 오류를 발생시킵니다.
- `isCascade` - `true`일 경우 스키마에 포함된 개체(테이블, 함수 등)를 자동으로 삭제합니다. Postgres에서만 사용됩니다.

테이블 스키마를 드랍합니다.

---

```ts
createTable(table: Table, ifNotExist?: boolean, createForeignKeys?: boolean, createIndices?: boolean): Promise<void>
```

- `table` - 테이블 객체.
- `ifNotExist` - `true` 일 경우 생성을 건너뛰고, 그렇지 않을 경우 데이터베이스가 이미 있는 경우 오류를 발생시킵니다. 기본값은 `false` 입니다.
- `createForeignKeys` - 테이블을 만들 때 외래 키를 만들 것인지 여부를 나타냅니다. 기본값은 `true` 입니다.
- `createIndices` - 테이블 작성 시 인덱스를 작성할지 여부를 나타냅니다. 기본값은 `true` 입니다.

새로운 테이블을 만듭니다.

---

```ts
dropTable(table: Table|string, ifExist?: boolean, dropForeignKeys?: boolean, dropIndices?: boolean): Promise<void>
```

- `table` - 드랍할 테이블 객체 또는 테이블 이름
- `ifExist` - `true` 일 경우 삭제를 건너 뛰고, 그렇지 않을 경우 테이블이 없으면 오류를 발생시킵니다.
- `dropForeignKeys` - 테이블 삭제 시 외부 키를 삭제할지 여부를 나타냅니다. 기본값은 `true` 입니다.
- `dropIndices` - 테이블 삭제 시 인덱스의 삭제 여부를 나타냅니다. 기본값은 `true` 입니다.

테이블을 드랍합니다.

---

```ts
renameTable(oldTableOrName: Table|string, newTableName: string): Promise<void>
```

- `oldTableOrName` - 이름을 바꿀 테이블 객체 혹은 이름을 바꿀 테이블의 이름
- `newTableName` - 테이블의 새 이름

테이블의 이름을 바꿉니다.

---

```ts
addColumn(table: Table|string, column: TableColumn): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `column` - 새로운 열

새로운 열을 추가합니다.

---

```ts
addColumns(table: Table|string, columns: TableColumn[]): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `columns` - 새로운 열들

새로운 열들을 추가합니다.

---

```ts
renameColumn(table: Table|string, oldColumnOrName: TableColumn|string, newColumnOrName: TableColumn|string): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `oldColumnOrName` - 바꿀 열. 테이블 열 객체 혹은 열 이름을 허용합니다.
- `newColumnOrName` - 새로운 열. 테이블 열 객체 혹은 열 이름을 허용합니다.

열의 이름을 바꿉니다.

---

```ts
changeColumn(table: Table|string, oldColumn: TableColumn|string, newColumn: TableColumn): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `oldColumn` - 바꿀 열. 테이블 열 객체 혹은 열 이름을 허용합니다.
- `newColumn` - 새로운 열. 테이블 열 객체를 허용합니다.

테이블의 열을 변경합니다.

---

```ts
changeColumns(table: Table|string, changedColumns: { oldColumn: TableColumn, newColumn: TableColumn }[]): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `changedColumns` - 바꿀 열들의 배열.
  - `oldColumn` - 바꿀 열. 테이블 열 객체를 허용합니다.
  - `newColumn` - 새로운 열. 테이블 열 객체를 허용합니다.

테이블의 열들을 변경합니다.

---

```ts
dropColumn(table: Table|string, column: TableColumn|string): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `column` - 테이블 열 객체 혹은 드랍할 열의 이름

테이블의 열을 드랍합니다.

---

```ts
dropColumns(table: Table|string, columns: TableColumn[]): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `columns` - 드랍할 테이블 열 객체의 배열

테이블의 열들을 드랍합니다.

---

```ts
createPrimaryKey(table: Table|string, columnNames: string[]): Promise<void>
```

- `table` - 테이블 객체 혹은 이름
- `columnNames` - 기본키를 생성할 열의 이름에 대한 배열

새로운 기본 키를 만듭니다.

---

```ts
updatePrimaryKeys(table: Table|string, columns: TableColumn[]): Promise<void>
```

- `table` - Table object or name
- `columns` - array of TableColumn objects which will be updated

Updates composite primary keys.

---

```ts
dropPrimaryKey(table: Table|string): Promise<void>
```

- `table` - Table object or name

Drops a primary key.

---

```ts
createUniqueConstraint(table: Table|string, uniqueConstraint: TableUnique): Promise<void>
```

- `table` - Table object or name
- `uniqueConstraint` - TableUnique object to be created

Creates new unique constraint.

> Note: does not work for MySQL, because MySQL stores unique constraints as unique indices. Use `createIndex()` method instead.

---

```ts
createUniqueConstraints(table: Table|string, uniqueConstraints: TableUnique[]): Promise<void>
```

- `table` - Table object or name
- `uniqueConstraints` - array of TableUnique objects to be created

Creates new unique constraints.

> Note: does not work for MySQL, because MySQL stores unique constraints as unique indices. Use `createIndices()` method instead.

---

```ts
dropUniqueConstraint(table: Table|string, uniqueOrName: TableUnique|string): Promise<void>
```

- `table` - Table object or name
- `uniqueOrName` - TableUnique object or unique constraint name to be dropped

Drops an unique constraint.

> Note: does not work for MySQL, because MySQL stores unique constraints as unique indices. Use `dropIndex()` method instead.

---

```ts
dropUniqueConstraints(table: Table|string, uniqueConstraints: TableUnique[]): Promise<void>
```

- `table` - Table object or name
- `uniqueConstraints` - array of TableUnique objects to be dropped

Drops an unique constraints.

> Note: does not work for MySQL, because MySQL stores unique constraints as unique indices. Use `dropIndices()` method instead.

---

```ts
createCheckConstraint(table: Table|string, checkConstraint: TableCheck): Promise<void>
```

- `table` - Table object or name
- `checkConstraint` - TableCheck object

Creates new check constraint.

> Note: MySQL does not support check constraints.

---

```ts
createCheckConstraints(table: Table|string, checkConstraints: TableCheck[]): Promise<void>
```

- `table` - Table object or name
- `checkConstraints` - array of TableCheck objects

Creates new check constraint.

> Note: MySQL does not support check constraints.

---

```ts
dropCheckConstraint(table: Table|string, checkOrName: TableCheck|string): Promise<void>
```

- `table` - Table object or name
- `checkOrName` - TableCheck object or check constraint name

Drops check constraint.

> Note: MySQL does not support check constraints.

---

```ts
dropCheckConstraints(table: Table|string, checkConstraints: TableCheck[]): Promise<void>
```

- `table` - Table object or name
- `checkConstraints` - array of TableCheck objects

Drops check constraints.

> Note: MySQL does not support check constraints.

---

```ts
createForeignKey(table: Table|string, foreignKey: TableForeignKey): Promise<void>
```

- `table` - Table object or name
- `foreignKey` - TableForeignKey object

Creates a new foreign key.

---

```ts
createForeignKeys(table: Table|string, foreignKeys: TableForeignKey[]): Promise<void>
```

- `table` - Table object or name
- `foreignKeys` - array of TableForeignKey objects

Creates a new foreign keys.

---

```ts
dropForeignKey(table: Table|string, foreignKeyOrName: TableForeignKey|string): Promise<void>
```

- `table` - Table object or name
- `foreignKeyOrName` - TableForeignKey object or foreign key name

Drops a foreign key.

---

```ts
dropForeignKeys(table: Table|string, foreignKeys: TableForeignKey[]): Promise<void>
```

- `table` - Table object or name
- `foreignKeys` - array of TableForeignKey objects

Drops a foreign keys.

---

```ts
createIndex(table: Table|string, index: TableIndex): Promise<void>
```

- `table` - Table object or name
- `index` - TableIndex object

Creates a new index.

---

```ts
createIndices(table: Table|string, indices: TableIndex[]): Promise<void>
```

- `table` - Table object or name
- `indices` - array of TableIndex objects

Creates a new indices.

---

```ts
dropIndex(table: Table|string, index: TableIndex|string): Promise<void>
```

- `table` - Table object or name
- `index` - TableIndex object or index name

Drops an index.

---

```ts
dropIndices(table: Table|string, indices: TableIndex[]): Promise<void>
```

- `table` - Table object or name
- `indices` - array of TableIndex objects

Drops an indices.

---

```ts
clearTable(tableName: string): Promise<void>
```

- `tableName` - table name

Clears all table contents.

> Note: this operation uses SQL's TRUNCATE query which cannot be reverted in transactions.

---

```ts
enableSqlMemory(): void
```

Enables special query runner mode in which sql queries won't be executed, instead they will be memorized into a special variable inside query runner.
You can get memorized sql using `getMemorySql()` method.

---

```ts
disableSqlMemory(): void
```

Disables special query runner mode in which sql queries won't be executed. Previously memorized sql will be flushed.

---

```ts
clearSqlMemory(): void
```

Flushes all memorized sql statements.

---

```ts
getMemorySql(): SqlInMemory
```

- returns `SqlInMemory` object with array of `upQueries` and `downQueries` sql statements

Gets sql stored in the memory. Parameters in the sql are already replaced.

---

```ts
executeMemoryUpSql(): Promise<void>
```

Executes memorized up sql queries.

---

```ts
executeMemoryDownSql(): Promise<void>
```

Executes memorized down sql queries.

---
