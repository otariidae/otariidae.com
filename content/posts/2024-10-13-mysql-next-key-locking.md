---
title: "MySQL next-key locking"
lang: en
published: 2024-10-13
gist_url: "https://gist.github.com/otariidae/c7f1138d9a4191fb7ef5b0ad5fb0af13"
---

# Studying InnoDB Locks

## Prerequisites

MySQL 8.0

`@@GLOBAL.transaction_isolation` and `@@SESSION.transaction_isolation` are set to `REPEATABLE-READ`.

```sql
CREATE TABLE t (
    id INT PRIMARY KEY AUTO_INCREMENT,
    c1 VARCHAR(100),
    c2 INT,
    INDEX (c2)
);
```

```sql
INSERT INTO t (c1, c2) VALUES ('a', 10), ('b', 30), ('c', 50);
```

| id  | c1  | c2  |
| --- | --- | --- |
| 1   | a   | 10  |
| 2   | b   | 30  |
| 3   | c   | 50  |

## Pattern 1: select non-existing row for update

transaction 1:

```sql
BEGIN;
SELECT * FROM t WHERE c2 = 20 FOR UPDATE;
```

transaction 2:

```sql
BEGIN;
INSERT INTO t (c1, c2) VALUES ('d', 9); -- passed
INSERT INTO t (c1, c2) VALUES ('d', 10); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 20); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 29); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 30); -- passed
UPDATE t SET c1 = 'e' WHERE id = 1; -- passed
UPDATE t SET c1 = 'e' WHERE id = 2; -- passed
UPDATE t SET c2 = 9 WHERE id = 1; -- passed
UPDATE t SET c2 = 31 WHERE id = 2; -- passed
```

c2 between 10 and 29 are locked.
records with c2 = 10 and 30 are not locked.

## Pattern 2: select non-existing range for update

transaction 1:

```sql
BEGIN;
SELECT * FROM t WHERE c2 BETWEEN 15 AND 25 FOR UPDATE;
```

transaction 2:

```sql
BEGIN;
INSERT INTO t (c1, c2) VALUES ('d', 9); -- passed
INSERT INTO t (c1, c2) VALUES ('d', 10); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 20); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 29); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 30); -- passed
UPDATE t SET c1 = 'e' WHERE id = 1; -- passed
UPDATE t SET c1 = 'e' WHERE id = 2; -- blocked
UPDATE t SET c2 = 9 WHERE id = 1; -- passed
UPDATE t SET c2 = 31 WHERE id = 2; -- blocked
DELETE FROM t WHERE id = 1; -- passed
DELETE FROM t WHERE id = 2; -- blocked
```

c2 between 10 and 29 are locked.
record with c2 = 10 is not locked.
record with c2 = 30 is locked.

## Pattern 3: select existing row for update

transaction 1:

```sql
BEGIN;
SELECT * FROM t WHERE c2 = 30 FOR UPDATE;
```

transaction 2:

```sql
BEGIN;
INSERT INTO t (c1, c2) VALUES ('d', 9); -- passed
INSERT INTO t (c1, c2) VALUES ('d', 10); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 29); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 30); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 31); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 49); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 50); -- passed
UPDATE t SET c1 = 'e' WHERE id = 1; -- passed
UPDATE t SET c1 = 'e' WHERE id = 2; -- blocked
UPDATE t SET c1 = 'e' WHERE id = 3; -- passed
UPDATE t SET c2 = 9 WHERE id = 1; -- passed
UPDATE t SET c2 = 31 WHERE id = 2; -- blocked
UPDATE t SET c2 = 51 WHERE id = 3; -- passed
DELETE FROM t WHERE id = 1; -- passed
DELETE FROM t WHERE id = 2; -- blocked
DELETE FROM t WHERE id = 3; -- passed
```

c2 between 10 and 49 are locked.
record with c2 = 30 is locked.
records with c2 = 10 and 50 are not locked.

## Pattern 4: select range including existing row for update

transaction 1:

```sql
BEGIN;
SELECT * FROM t WHERE c2 BETWEEN 25 AND 35 FOR UPDATE;
```

transaction 2:

```sql
BEGIN;
INSERT INTO t (c1, c2) VALUES ('d', 9); -- passed
INSERT INTO t (c1, c2) VALUES ('d', 10); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 24); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 30); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 36); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 49); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 50); -- passed
UPDATE t SET c1 = 'e' WHERE id = 1; -- passed
UPDATE t SET c1 = 'e' WHERE id = 2; -- blocked
UPDATE t SET c1 = 'e' WHERE id = 3; -- passed
UPDATE t SET c2 = 9 WHERE id = 1; -- passed
UPDATE t SET c2 = 31 WHERE id = 2; -- blocked
UPDATE t SET c2 = 51 WHERE id = 3; -- blocked
DELETE FROM t WHERE id = 1; -- passed
DELETE FROM t WHERE id = 2; -- blocked
DELETE FROM t WHERE id = 3; -- blocked
```

c2 between 10 and 49 are locked.
record with c2 = 10 is not locked.
record with c2 = 30 is locked.
record with c2 = 50 is locked to update c2 and delete.

## Pattern 5: select range ending at existing row for update

transaction 1:

```sql
BEGIN;
SELECT * FROM t WHERE c2 BETWEEN 25 AND 30 FOR UPDATE;
```

transaction 2:

```sql
BEGIN;
INSERT INTO t (c1, c2) VALUES ('d', 9); -- passed
INSERT INTO t (c1, c2) VALUES ('d', 10); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 24); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 30); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 31); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 49); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 50); -- passed
UPDATE t SET c1 = 'e' WHERE id = 1; -- passed
UPDATE t SET c1 = 'e' WHERE id = 2; -- blocked
UPDATE t SET c1 = 'e' WHERE id = 3; -- passed
UPDATE t SET c2 = 9 WHERE id = 1; -- passed
UPDATE t SET c2 = 31 WHERE id = 2; -- blocked
UPDATE t SET c2 = 51 WHERE id = 3; -- blocked
DELETE FROM t WHERE id = 1; -- passed
DELETE FROM t WHERE id = 2; -- blocked
DELETE FROM t WHERE id = 3; -- blocked
```

c2 between 10 and 49 are locked.
record with c2 = 10 is not locked.
record with c2 = 30 is locked.
record with c2 = 50 is locked to update c2 and delete.

## Pattern 6: select range starting at existing row for update

transaction 1:

```sql
BEGIN;
SELECT * FROM t WHERE c2 BETWEEN 30 AND 35 FOR UPDATE;
```

transaction 2:

```sql
BEGIN;
INSERT INTO t (c1, c2) VALUES ('d', 9); -- passed
INSERT INTO t (c1, c2) VALUES ('d', 10); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 24); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 30); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 31); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 49); -- blocked
INSERT INTO t (c1, c2) VALUES ('d', 50); -- passed
UPDATE t SET c1 = 'e' WHERE id = 1; -- passed
UPDATE t SET c1 = 'e' WHERE id = 2; -- blocked
UPDATE t SET c1 = 'e' WHERE id = 3; -- passed
UPDATE t SET c2 = 9 WHERE id = 1; -- passed
UPDATE t SET c2 = 31 WHERE id = 2; -- blocked
UPDATE t SET c2 = 51 WHERE id = 3; -- blocked
DELETE FROM t WHERE id = 1; -- passed
DELETE FROM t WHERE id = 2; -- blocked
DELETE FROM t WHERE id = 3; -- blocked
```

c2 between 10 and 49 are locked.
record with c2 = 10 is not locked.
record with c2 = 30 is locked.
record with c2 = 50 is locked to update c2 and delete.
