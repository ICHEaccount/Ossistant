# OSSISTANT
Team ICHE

## How to run(Dev)

1. server

```shell
pip install flask
cd server
python server.py
```

backend server will run on http://127.0.0.1:5005


2. client

```shell
cd client
npm i
npm start
```

frontend server will run on http://127.0.0.1:3000

## How to run(Test)

1. Run
```bash
docker-compose up
docker-compose up -d # background 
```

2. Shutdown
```bash
docker-compose down 
```

## stack 
- react
- neo4j
- mongoDB
- flask 

## network infomation 
- 172.25.0.5 client 
- 172.25.0.4 neo4j
- 172.25.0.3 server
- 172.25.0.2 mongodb 

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