# Chapter 12. 이터레이터와 제네레이터
```js
const it = book.values(); //배열에 값이 있다고 가정
it.next(); //value: 내용 done: 초과하면 true

let current = it.next();
while(!current.done){
    console.log(current.value);
    current = it.next();
}
```

### 이터레이션 프로토콜
모든 객체를 이터러블 객체로 바꿀 수 있다.   
클래스에 심볼 메서드(`Symbol.iterator`)가 있고 이터레이터처럼 동작하는 객체,   
value와 done 프로퍼티가 있는 객체를 반환하는 next 메서드를 가진 객체를 반환하면 그 클래스는 이터러블 객체라는 뜻
```js
class Log{
    constructor(){
        this.messages = [];
    }
    add(message){
        this.messages.push({message, timestamp: Data.now()});
    }
    [Symbol.iterator](){
        return this.messages.values();
    }
}

//Log 배열처럼 순회 가능
for(let entry of log){
    console.log(`${entry.message} @ ${entry.timestamp}`);
}
```

```js
//이터레이터 직접 구현
class Log{
    ...
    [Symbol.iterator](){
        let i = 0;
        const messages = this.messages;
        return {
            next() {
                if(i >= messages.length)
                    return {value: undefined, done: true};
                return {value: messages[i++], done: false};
            }
        }
    }
}
```

## 제너레이터
이터레이터를 사용해 자신의 실행을 제어하는 함수.   
제너레이터는 두 가지 새로운 개념을 도입함.   
- 함수의 실행을 개별적 단계로 나눠 함수의 실행을 제어
- 실행 중인 함수와 통신   

두 가지 예외를 제외하면 일반적인 함수와 같음
- 언제든 호출자에게 제어권을 넘길(yield) 수 있다.
- 호출한 즉시 실행되지는 않는다. 대신 이터레이터를 반환하고, 이터레이터의 `next()`를 호출함에 따라 실행됨.

제너레이터를 만들 때 `function` 뒤에 `*`를 붙임   
`return` 외에 `yield` 키워드를 쓸 수 있음
```js
//무지개 색깔을 반환하는 제너레이터
function* rainbow(){
    yield 'red';
    yield 'orange';
    ...
}

//제너레이터 호출, 호출 시 이터레이터를 얻는다.
const it = rainbow();
it.next();  //{value: 'red', done: false}
it.next();  //{value: 'orange', done: false}
...

//이터레이터 이므로 for ...of 루프 사용 가능
```

### yield 표현식과 양방향 통신
통신은 `yield` 표현식을 통해 이뤄짐. 표현식이므로 어떤 값으로 평가됨.   
`yield` 표현식의 값은 호출자가 제네레이터의 이터레이터에서 `next()`를 호출할 때 제공하는 매개변수.
![yeild 설명](https://online.fliphtml5.com/hkuy/pudb/files/large/101.jpg)
![yeild 설명](https://online.fliphtml5.com/hkuy/pudb/files/large/102.jpg)

### 제너레이터와 return 
yield 문은 마지막 문이더라도 제너레이터를 끝내지 않는다.   
`return`을 사용하면 위치와 관계 없이 `done`은 `true`가 되고, `value`는 `return`이 반환하는 값이 됨.
```js
function* abc(){
    yield 'a';
    yield 'b';
    return 'c';
}

const it = abc();
it.next();  //{value: 'a', done: false}
it.next();  //{value: 'b', done: false}
it.next();  //{value: 'c', done: true}
```
`for ...of`에서 사용 시 c는 출력되지 않음.   
중요한 값을 `return` 으로 반환하려 하지 말자. 중간에 종료하는 목적으로만 사용