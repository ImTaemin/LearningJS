# Chapter 14. 비동기적 프로그래밍
자바스크립트 애플리케이션은 단일 스레드에서 동작한다.   
비동기적 프로그래밍에는 세 가지 패러다임이 있다.   
- 콜백
- 프라미스 (콜백에 의존)
- 제너레이터 (프라미스|콜백 함께 사용, 자체로는 비동기 지원x)

비동기적 테크닉을 사용해야 하는 경우 크게 세 가지
- Ajax 호출을 비롯한 네트워크 요청
- 파일을 읽고 쓰는 등의 파일시스템 작업
- 의도적으로 시간 지연을 사용하는 기능(알람 같은)

## 콜백
자바스크립트에서 가장 오래된 비동기적 메커니즘   
간단히 말해 나중에 호출할 함수   
일반적으로 다른 함수에 넘기거나 객체의 프로퍼티로 사용, 드물게 배열에 사용   
보통 익명 함수로 사용
```js
console.log("Before timeout: " + new Date());
function f(){
    console.log("After timeout: " + new Date());
}
setTimeout(f, 60*1000); //보통 이렇게 안쓰고 익명함수로 씀
console.log("I happen after setTimeout");
console.log("Me too");

//결과
/*
Before timeout: ~~
I happen after setTimeout
Me too
After timeout: ~~
*/
```
### setInterval, clearInterval
- `setTimeout()` : 콜백 함수를 한 번만 실행하고 멈춤
- `setInterval()` : 콜백을 정해진 주기마다 호출, `clearInterval()` 사용하기 전까지 멈추지 않음.

```js
const intervalId = setInterval(()=>{...}, 5*1000);
clearInterval(intervalId);
```
`setInterval()`은 ID를 반환. `clearInterval()`이 ID를 받아 타임아웃을 멈춤

### 스코프와 비동기적 실행
스코프와 클로저가 비동기적 싱행에 영향을 미칠 때 혼란스럽고 에러 자주 발생   
함수를 호출하면 항상 클로저가 만들어짐
```js
function countdown(){
    let i;
    console.log("Countdown:");
    for(i=5; i>=0; i--){
        setTimeout(function(){
            console.log(i===0 ? "GO!" : i ); // ⑵
        }, (5-i)*1000); // ⑶
    }// ⑴
}

countdown();
```
⑴ 스코프를 벗어난 상태인데 ⑵에서 i를 접근해 -1이 반복적으로 실행된 것.   
⑶이 예상대로 동작하는 이유는 동기적으로 실행됐기 때문.   
`setTimeout()`호출도 동기적인데 **비동기적인 부분은 전달된 함수**   
```js
//정상 작동
for(let i=5; i>=0; i--) //i는 이제 루프안의 블록 스코프 변수
```
**콜백은 자신을 선언한 스코에 있는 것에 접근할 수 있다.**

### 오류 우선 콜백
콜백의 첫 번째 매개변수에 에러 객체를 쓰자, 에러가 `null`이나 `undefined`이면 에러가 없는 것.   
에러 매개변수를 체크하고 그에 맞게 반응
```js
//노드에서 파일 콘텐츠 읽기
const fs = require('fs');

const fname = 'file.txt';
fs.readFile(fname, function(err, data){
    if(err) {
        return console.error(`error reading ${fname}: ${err.message}`);
    }
    console.log(`${fname} contents: ${data}`);
});
```
콜백에서 가장 먼저 `err`의 참, 거짓 확인.   
`err`이 참이면 파일 읽기 시 문제가 발생해 오류 보고 후 탈출   
빠져 나와야 하는 것을 잊는 사람이 많다.(`return`) 빠져나가지 않으면 오류 예약이나 다름 없다.   
***콜백을 사용하는 인터페이스 개발 시 오류 우선 콜백 사용을 권장***

### 콜백 지옥
한 번에 여러 가지를 기다려야 한다면 콜백 관리가 어려워짐.
```js
//노드 앱. 세 가지 파일읽고 60초 후 결합해 네번째 파일에 기록
const fs = require('fs');

fs.readFile('a.txt.', function(err, dataA){
    if(err) console.err(err);
    fs.readFile('b.txt.', function(err, dataB){
        if(err) console.err(err);
        fs.readFile('c.txt.', function(err, dataC){
            if(err) console.err(err);
            setTimeout(function(){
                fs.writeFile('d.txt.', dataA + dataB + dataC, function(err){
                    if(err) console.err(err);
                }
            }, 60*1000);
        });
    });
});
```
이런 코드를 콜백 지옥이라 부른다.
```js
const fs = require('fs');
function readSketchFile(){
    try{
        fs.readFile('file.txt', function(err, data){
            //여기서 에러가 발생
            if(err) throw err;
        });
    } catch(err) {
        console.log("err");
    }
}
readSketchFile();
```
`try...catch` 블록은 같은 함수 안에서만 동작하기 때문에 예외 처리가 의도대로 동작하지 않음.   
`try...catch` 블록은 `readSketchFile()` 함수 안에 있지만, **예외는 `fs.read()`가 호출하는 익명 함수 안에서 일어남**

## 프라미스
***프라미스는 성공 또는 실패를 나타낼 뿐.***   
프라미스가 콜백을 대체하는 것은 아님. 프라미스에서도 콜백을 사용   
콜백을 사용하면 예측 가능한 패턴으로 사용   
콜백만 사용했을 때 나타날 수 있는 엉뚱한 현상이나 찾기 힘든 버그를 상당수 해결

프라미스의 기본 개념은, 프라미스 기반 비동기적 함수를 호출하면 그 함수를 `Promise` 인스턴스를 반환.   
성공(fulfilled)하거나 실패(rejected)하거나 단 두가지 뿐, 둘 중 하나만 일어난다고 확신할 수 있다.   
프라미스가 성공하거나 실패하면 그 프라미스를 결정(settled)됐다고 함.   

프라미스는 객체이므로 어디든 전달할 수 있다는 점도 콜백에 비해 간편.   
비동기 처리를 다른 함수에서 처리하게 하고 싶다면 프라미스를 넘기면 됨.

### 프라미스 만들기
`resolve`(성공)와 `reject`(실패) 콜백이 있는 함수로 새 `Promise` 인스턴스를 만들기만 하면 됨.
```js
//카운트 다운이 끝나면 프라미스 반환
function countdown(seconds){
    return new Promise(function(resolve, reject){
        for(let i=seconds; i>=0; i--){
            setTimeout(function(){
                if(i>0) console.log(i + "...");
                else resolve(console.log("GO!"));
            }, (seconds-i)*1000);
        }
    });
}
```
별로 좋은 함수는 아니다. 장황하고 콘솔을 아예 안쓰고 싶을 수 있음.   
`resolve`와 `reject`는 함수다.   
`resolve`나 `reject`를 여러 번 호출하든 섞어서 호출하든 결과는 같음. 첫 번째로 호출한 것만 의미가 있다.

### 프라미스 사용
```js
//반환된 프라미스 사용
countdown(5).then(
    function(){ //이게 실행되거나
        console.log("success");
    },
    function(err){ //이게 실행됨
        console.log("err");
    }
);
```
```js
//catch 핸들러도 지원
const p = countdown(5);
p.then(function(){
    console.log("success");
});
p.catch(function(err){
    console.log("err" + err.message);
});
```
```js
//에러 반환
return new Promise(function(resolve, reject){
    ...
    if(i==13) return reject(enw Error("err"));
    ...
});
```
13에서 에러가 일어나고 12부터 다시 카운트함.

### 이벤트
이벤트가 일어나면 이벤트 발생을 담당하는 개체에서 이벤트가 일어났음을 알림.   
필요한 이벤트는 모두 콜백을 통해 주시 가능   
노드에는 이벤트를 지원하는 모듈 `EventEmitter`가 내장됨
```js
const EventEmitter = require('events').EventEmitter;

class Countdown extends EventEmitter{
    constructor(seconds, superstitious){
        super();
        this.seconds = seconds;
        this.superstitious = !!superstitious;
    }

    go(){
        const countdown = this;
        return new Promise(function(resolve, reject){
            for(let i=countdown.seconds; i>=0; i--){
                setTimeout(function(){
                    if(countdown.superstitious && i == 13)
                        return reject(new Error("ERR"));

                    countdown.emit('tick', i);
                    if(i == 0) resolve();
                }, (countdown.seconds-i) * 1000);
            }
        });
    }
}
```
`countdown.emit('tick', i)` 이 부분에서 `tick` 이벤트를 발생시키고, 필요하다면 다른 부분에서 이 이벤트를 주시 할 수 있음.
```js
//개선한 카운트다운
const c = new Countdown(5);

c.on('tick', function(i){ //체인으로 연결해도 됨.
    if(i>0) console.log(i + "...");
});
c.go().then(function(){
    console.log("GO!");
}).catch(function(err){
    console.error(err.message);
});
```
`EventEmitter.on()` 메서드가 이벤트를 주시.   
`'tick'` 이벤트 전체에 콜백을 등록, tick이 0이 아니면 출력 후 카운트 다운을 시작하는 `go()`를 호출. 카운트 다운이 끝나면 `GO!` 출력   

여전히 `Countdown` 인스턴스는 13에 도달했을 때 프라미스를 파기했는데도 카운트다운이 계속됨 - 타임아웃이 이미 만들어졌기 때문   
해결하려면 더 진행할 수 없다는 사실을 아는 즉시 대기중인 타임아웃을 모두 취소
```js
const EventEmitter = require('events').EventEmitter;

class Countdown extends EventEmitter{
    constructor(seconds, superstitious){
        super();
        this.seconds = seconds;
        this.superstitious = !!superstitious;
    }

    go(){
        const countdown = this;
        const timeoutIds = [];
        return new Promise(function(resolve, reject){
            for(let i=countdown.seconds; i>=0; i--){
                timeoutIds.push(setTimeout(function(){
                    if(countdown.superstitious && i == 13){
                        timeoutIds.forEach(clearTimeout);
                        return reject(new Error("ERR"));
                    }
                    countdown.emit('tick', i);
                    if(i == 0) resolve();
                }, (countdown.seconds-i) * 1000));
            }
        });
    }
}
```

### 프라미스 체인
프라미스가 완료되면 다른 프라미스를 반환하는 함수를 즉시 호출 가능
```js
function launch(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve("resolve");
        }, 2*1000);
    })
}

const c = new Countdown(5).on('tick', i => console.log(i+"..."));

c.go().then(launch)
      .then(function(msg){
        console.log(msg);
      })
      .catch(function(err){
        console.log(err.message);
      });
```
프라미스 체인을 사용하면 모든 단계에서 에러를 캐치할 필요가 없다.

### 결정되지 않는 프라미스 방지
프라미스는 비동기적 코드를 단순화하고 콜백이 두 번 이상 실행되는 문제를 방지함.   
그러나 프라미스가 결정되지 않는 문제까지 자동으로 해결하진 못함.

결정되지 않은 프라미스를 방지하는 한 가지 방법은 **프라미스에 타임아웃**을 거는 것
```js
function launch(){
    return new Promise(function(resolve, reject){
        if(Math.random() < 0.5) return; //문제 발생
        setTimeout(function(){
            resolve("resolve");
        }, 2*1000);
    });
}
```
`reject`를 호출하지 않으며 콘솔에 기록하지도 않음
```js
//프라미스에 타임아웃
function addTimeout(fn, timeout){
    if(timeout === undefined) timeout = 1000; //타임아웃 기본값
    return function(...args){
        return new Promise(function(resolve, reject){
            const tid = setTimeout(reject, timeout, new Error("promise timed out"));
            fn(...args)
                .then(function(...args){
                    clearTimeout(tid);
                    resolve(...args);
                })
                .catch(function(...args){
                    clearTimeout(tid);
                    reject(...args);
                });
        });
    }
}
```
함수를 반환하는 함수가 필요.   
프라미스를 반환하는 어떤 함수든 타임아웃을 걸 수 있다.
```js
c.go()
    .then(addTimeout(launch, 11*1000))
    .then(function(msg){
        console.log(msg);
    })
    .catch(function(err){
        console.err("ERR");
    });
```
`launch()`에 문제가 있더라도 프라미스 체인은 항상 결정된다.

## 제너레이터
제너레이터는 함수와 호출자 사이의 양방향 통신을 가능하게 함.   
동기적 성격을 가졌지만, **프라미스와 결합하면 비동기 코드를 효율적으로 관리**

먼저 노드의 [오류 우선 콜백](#오류-우선-콜백) -> 프라미스
```js
function nfcall(f, ...args){
    return new Promise(function(resolve, reject){
        f.call(null, ...args, function(err, ...args){
            if(err) return reject(err);
            resolve(args.length<2 ? args[0] : args);
        });
    });
}
```
이제 콜백을 받는 노드 스타일 메서드를 모두 프라미스로 바꿀 수 있음   
`setTiemout`을 써야 하는데 노드보다 먼저 나왔고 오류 우선 콜백의 패턴을 따르지 않아 같은 기능을 가진 함수를 새로 만들음
```js
function ptimeout(delay){
    return new Promise(function(resolve, reject){
        setTimeout(resolve, delay);
    });
}
```
다음 필요한 것은 제너레이터 실행기.   
제너레이터는 원래 동기적인데, 호출자와 통신할 수 있어 제너레이터와의 통신을 관리하고 비동기적 호출을 처리하는 함수를 만들 수 있음
```js
//기초적인 제너레이터 재귀 실행기
function grun(g){
    const it = g();
    (function iterate(val){
        const x = it.next(val);
        if(!x.done){
            if(x.value instanceof Promise){
                x.value.then(iterate).catch(err => it.thorw(err));
            } else {
                setTimeout(iterate, 0, x.value);
            }
        }
    })();
}
```
`grun`에 제너레이터 함수를 넘기면 해당 함수가 실행됨   
`yield`로 넘긴 제너레이터는 이터레이터에서 `next`를 호출할 때까지 기다림   
`grun`은 이 과정을 재귀적으로 반복   

`grun`에서 `iterate`를 바로 호출하지 않고 `setTimeout`을 거친 이유는 효율성 때문.   
자바스크립트 엔진이 재귀 호출을 비동기적으로 실행할 때 메모리를 좀 더 빨리 회수.

```js
function* theFutureIsNow(){
    const dataA = yield nfcall(fs.readFile, 'a.txt');
    const dataB = yield nfcall(fs.readFile, 'b.txt');
    const dataC = yield nfcall(fs.readFile, 'c.txt');
    yield ptimeout(60*1000);
    yield nfcall(fs.writeFile, 'd.txt', dataA + dataB + dataC);
}
```
콜백 지옥보다 낫고, 프라미스 하나만 쓸 때보다 더 단순하며 사람이 생각하는 것과 거의 같은 방법으로 동작.
```js
grun(theFutureIsNow); //호출
```

`Promise`에는 `all` 메서드가 있다. 배열로 받은 프라미스가 완료될 때 완료, 가능하다면 비동기 코드를 동시에 실행.   
```js
function* theFutureIsNow(){
    const data = yield Promise.all([
        nfcall(fs.readFile, 'a.txt');
        nfcall(fs.readFile, 'b.txt');
        nfcall(fs.readFile, 'c.txt');
    ]);
    yield ptimeout(60*1000);
    yield nfcall(fs.writeFile, 'd.txt', data[0]+data[1]+data[2]);
}
```
`c.txt`를 먼저 읽더라도 `data[0]`에는 `a.txt`의 내용이 들어있고 `data[2]`에는 `c.txt`의 내용이 들어있음.

중요한 것은 프로그램에서 어떤 부분을 동시에 실행할 수 있고 어떤 부분은 동시에 실행할 수 없는지를 판단하는 것.

### 제너레이터 실행기를 직접 만들지 말자
Koa는 co와 함께 사용하도록 설계된 미들웨어   
웹사이트를 만들고 있다면 [Koa](http://koajs.com) 미들웨어 살표보기

### 제너레이터 실행기와 예외 처리
제너레이터 실행기는 비동기적으로 실행하면서 동기적인 동작 방식을 유지하여 `try/catch` 예외 처리를 할 수 있다.   
콜백이나 프라미스를 사용하면 예외 처리가 쉽지 않음.  
콜백에서 일으킨 예외는 그 콜백 밖에서 캐치할 수 없다.   

```js
function* theFutureIsNow(){
    let data;
    try{
        data = yield Promise.all([
            nfcall(fs.readFile, 'a.txt');
            nfcall(fs.readFile, 'b.txt');
            nfcall(fs.readFile, 'c.txt');
        ]);
    } catch(err) {
        console.error("ERR: " + err.message);
    }
    yield ptimeout(60*1000);
    
    try{
        yield nfcall(fs.writeFile, 'd.txt', data[0]+data[1]+data[2]);
    } catch(err) {
        console.error("ERR: " + err.message);
        throw err;
    }
}
```

## 📝 요약
- 자바스크립트의 비동기 실행은 콜백을 통해 이뤄짐
- 프라미스를 콜백 대신 사용할 수 있는 건 아님. 프라미스도 콜백 사용
- 프라미스는 콜백이 여러 번 호출되는 문제를 해결
- 콜백을 여러 번 호출해야 한다면 이벤트와 결합하는 방법을 생각 (프라미스도 함께 사용 가능)
- 프라미스는 반드시 결정된다는 보장은 없음. 프라미스에 타임아웃을 걸어 문제 해결
- 프라미스는 체인으로 연결 가능
- 프라미스와 제너레이터 실행기를 결합해 비동기 실행의 장점을 유지하면서 동기적 사고방식으로 문제를 해결 가능
- 제너레이터로 동기적인 사고방식으로 문제를 해결할 때는 어느 부분을 동시에 실행할 수 있는지 잘 살펴야함.   
동시에 실행할 수 있는 부분은 `Promise.all`을 사용
- 제너레이터 실행기를 직접 만들지 말고 `co`나 `Koa` 사용
- 노드 스타일 콜백을 프라미스로 바꾸려면 `Q` 사용
- 제너레이터 실행기를 쓰면 예외 처리도 익숙한 방식으로 사용 가능