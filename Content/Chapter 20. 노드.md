# Chapter 20. 노드

## 모듈
모듈은 패키지를 만들고 코드를 네임스페이스로 구분하는 메커니즘.   
```js
//aaa.js
function calc(a,x,n){
    if(x === 1) return a*n;
    return a*(1 - Math.pow(x,n))/(1-x);
}
module.exports = calc;

//bbb.js
function calc(r){
    return 4/3 * Math.PI * Math.pow(r,3);
}
module.exports = calc;
```
사용
```js
//app.js
const aaaCalc = require('./aaa.js');
const bbbCalc = require('./bbb.js');

console.log(aaaCalc(1,2,5));
console.log(bbbCalc(2));
```
각 변수에 할당되는 값은 노드가 `require` 함수를 호출한 결과

문자열이나 숫자 같은 원시 값을 내보낼 수도 있다.   
보통은 모듈 하나에 여러 함수를 저장하고, 그 함수를 메서드로 포함하는 객체를 내보내는 것이 일반적.
```js
//m.js
module.exports = {
    funcA(){}
    funcB(){}
}

//사용
const m = require('./m.js');
m.funcA();
```

`exports`를 사용하는 단축 문법
```js
exports.funcA = function(...){return ...};
exports.funcB = function(...){return ...};
```
단축 문법은 객체를 내보낼 때만 쓸 수 있다.   
함수나 기타 다른 값을 내보낼 때는 꼭 `module.exports` 사용   
모듈 하나에 한 가지 문법만 써야함

## 코어 모듈, 파일 모듈, npm 모듈
**코어 모듈**은 `fs`나 `os`처럼 노드 자체에서 제공하는 모듈, 모두 예약어다.   
**파일 모듈**은 `module.exports`에 할당하는 파일들 만들고 불러옴   
**npm 모듈**은 특별한 디렉터리 `node_modules`에 저장되는 모듈 파일   

require 함수를 사용하면 노드는 함수의 매개변수를 보고 어떤 타입인지 확인
|타입|매개변수|예제|
|--|--|--|
|코어|/ ./ ../ 등으로 시작하지 않음|require('fs')|
|파일|/ ./ ../ 등으로 시작|require('./a.js')|
|npm|코어 모듈이 아니고 / ./ ../로 시작하지 않음|require('debug')|

`process`와 `buffer` 같은 일부 코어 모듈은 전역이고 명시적인 `require`문 없이 사용할 수 있다.
```js
/* 코어 모듈 */
require('assert')         // 테스트 목적
require('child_process')  // 외부 프로그램을 실행할 때 필요
require('cluster')        // 다중 프로세스를 이용해 성능을 올릴 수 있게 한다.
require('crypto')         // 내장된 암호화 라이브러리
require('dns')            // 네트워크 이름 해석에 쓰이는 DNS 함수
require('domain')         // 에러를 고립시키기 위해 IO 비동기 작업을 묶는다.
require('events')         // 비동기 이벤트 지원
require('fs')             // 파일 시스템 작업
require('http')           // http 서버 및 관련 유틸
require('https')          // https 서버 및 관련 유틸
require('net')            // 비동기 소켓 기반 네트워크 API
require('os')             // 운영체제 유틸리티
require('path')           // 파일 시스템 경로 유틸
require('punycode')       // 유니코드 인코딩
require('querystring')    // URL 쿼리스트링 해석 및 생성
require('readline')       // 대화형 IO 유틸. CLI 프로그램에 사용
require('smalloc')        // 버퍼에 메모리를 명시적으로 할당
require('string_decoder') // 버퍼를 문자열로 변환
require('tls')            // 보안 전송 계층 통신 유틸
require('tty')            // 저수준 TTY 함수
require('dgram')          // 사용자 데이터그램 프로토콜(UDP) 네트워크 유틸
require('url')            // URL 파싱 유틸
require('util')           // 내부 노드 유틸
require('vm')             // 가상머신. 컨텍스트 생성에 사용.
require('zlib')           // 압축 유틸
```

npm 모듈은 특수한 이름 표기법을 사용하는 파일 모듈이다.   
모듈 x를 가져올 때 x가 코어 모듈 이름이 아니라면 먼저 현재 디렉터리에 `node_modules` 서브 디렉터리가 있는지 확인한다. 있으면 그 안에서 x를 찾는다.   
찾지 못하면 부모 디렉터리로 올라가서 `node_modules` 서브 디렉터리가 있는지, 있다면 모듈 x가 있는지 확인한다.   
모듈을 찾거나 루트 디렉터리에 도달할 때까지 이 과정을 반복   

예를 들어 프로젝트가 `home/tmkim/test_prj`에 있고 애플리케이션 파일에서 `require('x')`를 호출한다면
1. home/tmkim/test_prj/node_modules/x
2. home/tmkim/node_modules/x
3. home/node_modules/x
4. /node_modules/x

대부분의 프로젝트에서는 애플리케이션 루트에 `node_modules` 디렉터리가 하나 있다.   
`node_modules` 디렉터리에 직접 추가, 제거를 하면 안된다.

## 함수 모듈을 통한 모듈 커스터마이징
모듈은 대부분 객체를 내보내지만, 함수 하나만 내보낼 때도 있다.(즉시 호출하려는 의도가 대부분)   
이런 경우 사용하려는 것은 함수가 아니라 함수의 반환값   
이런 패턴은 모듈을 일부 커스터마이즈 하거나, 주변 컨텍스트에서 정보를 얻어야 할 때 주로 사용
```js
const debug = require('debug')('main'); //모듈이 반환하는 함수 즉시 호출
debug("starting");
```
`"main"`이란 문자열을 사용하도록 `debug` 모듈을 커스터마이즈 한 것이다.

노드는 노드 앱을 실행할 때 어떤 모듈이든 단 한 번만 임포트한다.

## 파일시스템 접근
```js
//파일 생성
const fs = require('fs');
//__dirname + '/hello.txt'
fs.writeFile('hello.txt', 'hello from Node!', function(err){
    if(err) return console.log('Error');
});
```
노드는 자신이 실행된 현재 작업 디렉터리를 `__dirname` 변수로 보관한다. 절대 경로로 파일을 만들게 된다.

path 모듈의 운영체제 독립적인 경로 이름 유틸리티를 사용하면 모든 운영체제에서 사용할 수 있다.
```js
const fs = require('fs');
const path = require('path');
fs.writeFile(path.join(__dirname,'hello.txt'), 'hello from Node!', function(err){
    if(err) return console.log('Error');
});
```

```js
//파일 읽기
const fs = require('fs');
const path = require('path');

//인코딩 정보를 제공하지 않으면 16진수로 나온다
fs.readFile(path.join(__dirname,'hello.txt'), {encoding:'utf-8'}, function(err, data){
    if(err) return console.log('Error');
    console.log("Read file ");
    console.log(data);
});
```

파일 관련 함수에는 동기적으로 작업하는 짝이 있다. 이름은 `Sync`로 끝난다.
```js
fs.writeFileSync(path.join(__dirname,'hello.txt'), 'hello from Node!');
fs.readFileSync(path.join(__dirname,'hello.txt'), {encoding:'utf-8'});
//동기적인 함수에는 try/catch 블록으로 예외 처리
```
```js
//디렉터리의 파일목록 확인
const fs = require('fs');
fs.readdir(__dirname, function(err, files){
    if(err) return console.log("ERR");
    console.log(files.map(f => '\t' + f).join("\n"));
})
```

## Process
실행 중인 노드 프로그램은 모두 `process` 변수에 접근할 수 있다.   
해당 프로그램에 관한 정보를 담고 있으며 실행 자체를 컨트롤 할 수도 있다.   
예를 들어 치명적인 에러가 발생해 실행하지 않는 편이 좋거나 실행해도 의미가 없으면 `process.exit`를 호출해 실행을 멈출 수 있다.

숫자형 종료 코드를 쓰면 프로그램이 성공적으로 종료됐는지 에러가 있었는지 외부 스크립트에서도 알 수 있다. 보통 에러 없이 프로그램을 끝내면 종료 코드 0을 사용
```js
//data 서브 디렉터리에 들어있는 .txt 파일을 모두 처리
const fs = require('fs');

fs.readdir('data', function(err, files){
    //data 서브 디렉터리 자체가 존재하지 않으면 에러다.
    if(err){
        console.error("ERR");
        process.exit(1);
    }
    //.txt 파일이 없다면 즉시 멈춰야 하지만 에러는 아니다.
    const txtFiles = files.filter(f => /\.txt$/i.test(f));
    if(txtFiles.length === 0){
        console.log("txt file process");
        process.exit(0);
    }
});
```
`process` 객체를 통해 프로그램에 전달된 명령줄 매개변수 배열에 접근할 수도 있다.   
노드 애플리케이션을 실행할 때 명령줄에서 매개변수를 지정
```
$node linecount.js file1.txt file2.txt file3.txt
```
명령줄 매개변수는 `process.argv` 배열에 저장된다.
```js
console.log(process.argv);
/*
['node',                        //파일을 해석한 프로그램
'/home/tmkim/linecount.js',     //실행 중인 프로그램의 전체 경로
'file1.txt',                    //나머지는 전달된 매개변수
'file2.txt',
'file3.txt']
*/
```

- `process.env` : 환경 변수 접근
- `process.cwd` : 현재 디렉터리 저장
- `process.chdir` : 현재 작업 디렉터리 변경

## 운영체제
```js
const os = require('os');
```

## 자식 프로세스
`child_process` 모듈은 애플리케이션에서 다른 프로그램을 실행할 때 사용   
- `exec` : 운영체제의 명령줄이나 다름 없는 셸 호출
- `execFile` : 셸을 통하지 않고 실행 파일을 직접 실행(효율적이지만 주의해야 함)
- `fork` : 다른 노드 스크립트를 실행할 때 사용(exec로도 실행할 수 있다.)
```js
const exec = require('child_process').exec;

exec('dir', function(err, stdout, stderr){
    ...
})
```
호출되는 콜백은 `Buffer` 객체 두 개를 받음   
- `stdout` : 일반적인 프로그램 출력 결과
- `stderr` : 에러 출력 결과(에러가 있다면)

## 스트림
스트림 형태의 데이터를 다루는 객체   
읽기, 쓰기, 이중 스트림이 있다.   
사용자의 타이핑, 클라이언트와 통신하는 웹서비스 등
```js
//쓰기 스트림
const fs = require('fs');
const ws = fs.createWriteStream('stream.txt', {encoding: 'utf-8'});
ws.write('line 1 \n');
ws.write('line 2 \n');
ws.end(); //호출 전까지 쓸 수 있다.
```
```js
//읽기 스트림
const rs = fs.createReadStream('stream.txt', {encoding: 'utf-8'});
rs.on('data', function(data){
    console.log(">> data" + data.replace('\n', '\\n'));
});
rs.on('end', function(data){
    console.log(">> end");
});
```
파이프 : 읽기 스트림에서 데이터를 읽는 즉시 쓰기 스트림에 쓰는 것
```js
const rs = fs.createReadStream('stream.txt');
const ws = fs.createWriteStream('stream_copy.txt');
rs.pipe(ws);
```

## 웹 서버
`http` 모듈에 기본적인 웹 서버를 만드는 `createServer` 메서드가 있다.   
들어오는 요청을 처리할 콜백 함수만 만들면 된다.   
서버를 시작할 때는 `listen` 메서드를 호출하면서 포트를 지정한다.
```js
const http = require('http');

const server = http.createServer(function(req,res){
    console.log(`${req.method} ${req.url}`);
    res.end('hello world');
});

const port = 8080;
server.listen(port, function(){
    //서버가 시작됐을 때 호출될 콜백을 넘길 수 있다.
    console.log(`server started on port ${port}`);
});
//http://localhost:8080
//GET /
//GET /favicon.ico
```
대부분의 브라우저는 요청을 보낼 때 URL 막대나 탭에 표시한 아이콘(파비콘)을 요청한다.

**노드 웹 서버의 핵심은 들어오는 요청에 모두 응답하는 콜백 함수다.**   
매개변수로 `IncomingMessage` 객체(req)와 `ServerRequest` 객체(res)를 받는다.
- `IncomingMessage` : 요청받은 URL, 보낸 헤더, 바디에 들어있던 데이터 등 HTTP 요청에 관한 모든 정보가 들어 있다.
- `ServerRequest` : 클라이언트에 보낼 응답을 컨트롤하는 프로퍼티와 메서드가 들어 있다.   

`ServerRequest`는 쓰기 스트림 인터페이스다. 이를 통해 데이터를 클라이언트에 보낸다. 파일 읽기 스트림을 만들어 HTTP 응답에 파이프로 연결하기만 하면 된다.
```js
fs.createReadStream('favicon.ico');
fs.pipe(res); //end 대신 사용 가능
```