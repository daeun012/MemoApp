# CodeLab-React-Fundamentals

## 프로젝트 준비

- React JS
- Node JS (Express)
- MongoDB / Mongoose
- Materialize CSS
- Axios for API requests

### 1. Global Dependency 설치

`npm install -g webpack webpack-dev-server babel-cli nodemon cross-env`

- babel-cli: 콘솔 환경에서 babel 을 사용 할 수 있게 해준다. (ES6 transpile)
- nodemon: development 환경에서 파일이 수정 될 때마다 서버를 재시작해준다.
- cross-env: 윈도우 / 리눅스 / OSX 에서 환경변수값을 설정한다.

## 실행하기

```
npm run dev-server
```

서버는 포트 8081 으로 실행됩니다. 변경은 webpack.config.js 에서 할 수 있습니다.
