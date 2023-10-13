# OSSISTANT
Team ICHE

## How to run(Test)
### Full 
1. Run
```bash
docker-compose up
docker-compose up -d 
```

2. Shutdown
```bash
docker-compose down 

```

### Client Version 
Only Client, Service, Mongodb
```bash
docker-compose -f client.docker-compose.yml up
docker-compose -f client.docker-compose.yml down
```

## stack 
- react
- neo4j
- mongoDB
- flask 

## network infomation
|**Service**|**IP**|**Port**|
|------|---|---|
|mongodb|172.25.0.2|27017|
|osint|172.25.0.3|5005|
|neo4j|172.25.0.4|7474(Dashboard), 7687|
|client|172.25.0.5|3000|
|data|172.25.0.6|5000| 

## Commit Convention
```
[type] subject (issue-id)
```
ex) [feat] add login page (OSINT-00)

### Types
- build: Changes related to building the code (dependency, library)
- chore: Changes that do not affect the external user (.gitignore)
- feat: New feature
- fix: Bug fix
- docs: Documentation a related changes
- refactor: Code change, neither fix bug nor add a feature
- test: Add test, Change test