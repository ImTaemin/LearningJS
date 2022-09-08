# Chapter 13. 함수와 추상적 사고
## 서브루틴으로서의 함수
프로시저, 루틴, 서브프로그램, 매크로 등으로 불림   
서브루틴은 어떤 알고리즘을 나타내는 형태.   
반복되는 작업의 일부를 떼어내 이름을 붙이고, 언제든 이름을 불러 실행한다.   
```js
const year = new Date().getFullYear();
if(year % 4 !== 0) 
    console.log(`${year} is NOT a leap year.`);
else if(year % 100 !== 0) 
    console.log(`${year} IS a leap year.`);
else if(year % 400 !== 0) 
    console.log(`${year} is NOT a leap year.`);    
else
    console.log(`${year} IS a leap year.`);

//서브루틴으로 만들기 위해 함수로 묶는다.
```

## 값을 반환하는 서브루틴으로서의 함수
한 단계 더 추상화해서 함수의 **값을 반환**하는 서브루틴으로 만든다.
```js
function isCurrentYearLeapYear(){
    const year = new Date().getFullYear();
    if(year % 4 !== 0) return false;
    else if(year % 100 !== 0) return true;
    else if(year % 400 !== 0) return false;
    else return true;
}

//사용
const daysInMonth = [31, isCurrentYearLeapYear() ? 29 : 28, 31, 0, ...];

if(isCurrentYearLeapYear())
    console.log("It is a leap year.");
```

## 함수로서의 함수
입력이 들어가면 결과가 나오는 함수를 **순수한 함수**라 함   
순수 함수는 입력이 같으면 결과도 반드시 같음   
호출 시기에 따라 `true`나 `false`가 나오면 순수 함수라 할 수 없음   
순수 함수는 부수 효과가 없어야 함, 함수를 호출한다고 해서 상태가 바뀌면 안 된다.
```js
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
let colorIndex = -1;
function getNextRainbowColor(){
    if(++colorIndex > colors.length)
        colorIndex = 0;
    return colors[colorIndex];
}
```
순수한 함수 두 가지 정의를 모두 어김,   
입력이 같아도(매개변수가 없다는 점이 같음) 결과가 항상 다르고, 변수 `colorIndex`를 바꾸는 부수 효과가 있다.(함수에 속하지도 않는데도 함수를 호출하면 변수가 바뀜)

```js
//윤년 문제를 순수 함수로
function isCurrentYearLeapYear(year){
    if(year % 4 !== 0) return false;
    else if(year % 100 !== 0) return true;
    else if(year % 400 !== 0) return false;
    else return true;
}
```
입력이 같으면 결과도 항상 같고, 다른 효과도 없어 **순수한 함수**다.

```js
//getNextRainbowColor()를 순수 함수로 - 외부 변수 클로저로 감싸기
const getNextRainbowColor = (function(){
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    let colorIndex = -1;
    return function(){
        if(++colorIndex >= colors.length)
            colorIndex = 0;
        return colors[colorIndex];
    };
})();
```
부수 효과는 없어졌지만, 아직 입력이 같아도 결과가 다를 수 있다.   
이 함수를 어떻게 사용할지 생각해본다. 아마 반복적으로 호출할 것이다.
```js
//색깔을 0.5초마다 바꾸고 싶다면
setInterval(function(){
    document.querySelector('.rainbow')
            .style['background-color'] = getNextRainbowColor();
}, 500);
```
다른 부분에서 `getNextRainbowColor()`를 호출한다면 이 코드도 영향을 받는다.   
이터레이터를 사용하는 것이 더 나은 방법이다.
```js
//이제 순수한 함수다.   
function getRainbowIterator(){
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    let colorIndex = -1;
    return {
        next(){
            if(++colorIndex >= colors.length)
                colorIndex = 0;
            return {value: colors[colorIndex], done: false};
        }
    }
}

const rainbowIterator = getRainbowIterator();
setInterval(function(){
    document.querySelector('.rainbow')
            .style['background-color'] = rainbowIterator.next().value();
}, 500);
```
`next()`는 함수가 아니라 메서드라는 점을 주목   
메서드는 자신이 속한 객체라는 컨텍스트 안에서 동작하므로 동작은 객체에 의해 좌우됨.   
다른 부분에서 `getRainbowIterator()`를 호출하더라도 독립적인 이터레이터가 생성되므로 다른 이터레이터를 간섭하지 않음.

## So?
서브루틴을 쓰면 자주 사용하는 동작을 하나로 묶을 수 있는 장점   
순수한 함수를 쓰면 테스트, 이해, 재사용이 쉬워진다.

**따라서 순수한 함수를 권장한다.**

### 함수도 객체
함수는 `function` 객체의 인스턴스다.

## IIFE와 비동기적 코드
IIFE를 사용하는 사례 중 하나는 비동기적 코드가 정확히 동작할 수 있도록 새 변수를 새 스코프에 만드는 것.
```js
var i;
for(i=5; i>=0; i--){
    setTimeout(function(){
        console.log(i==0 ? "go!" : i);
    }, (5-i)*1000);
}
```
-1이 여섯 번 출력된다.(5 ~ -1)   
`setTimeout()`에 전달된 함수가 루프가 종료된 뒤 실행됐기 때문.   
-1이 되기 전에 콜백 함수는 호출되지 않음.   
let을 사용해 블록 수준 스코프를 만들면 해결된다.

```js
//블록 스코프 도입 전
function loopBody(i){
    setTimeout(function(){
        console.log(i==0 ? "go!" : i);
    }, (5-i)*1000);
}
var i;
for(i=5; i>=0; i--){
    loopBody(i);
}
```
스코프가 7개 만들어졌다.(1개 외부, 6개 `loopBody()` 호출 마다)
```js
//IIFE를 사용하는 게 더 낫다
var i;
for(i=5; i>=0; i--){
    (function(i){
        setTiemout(function(){
            console.log(i===0 ? "go!" : i);
        }, (5-i)*1000);
    })(i);
}
```

### 결론
블록 스코프를 사용하면 단순화 할 수 있다.
```js
for(let i=5; i>=0; i--){
    setTimeout(function(){
        console.log(i==0 ? "go!" : i);
    }, (5-i)*1000);
}
```

## 변수로서의 함수
변수가 있을 수 있는 곳에는 함수도 있을 수 있다.
- 함수를 가리키는 변수를 만들어 별명을 정할 수 있다.
- 배열에 함수를 넣을 수 있다. (다른 타입의 데이터와 섞일 수 있음)
- 함수를 객체의 프로퍼티로 사용
- 함수가 함수를 반환
- 함수를 매개변수로 받는 함수를 반환

```js
const f = addThreeSquareAddFiveTakeSquareRoot;
f(5); //이런 식으로 사용 가능
```
**괄호를 붙이면 함수를 호출하고, f에 함수 자체가 아니라 호출 결과가 저장됨.**

### 배열 안의 함수

### 함수에 함수 전달
함수에 함수를 전달하는 다른 용도는 비동기적 프로그래밍이다.(콜백)   
콜백 함수는 자신을 감싼 함수가 실행을 마쳤을 때 호출된다. (14장)

### 함수를 반환하는 함수
```js
function newSummer(f){
    return arr => sum(arr,f);
}
const sumOfSquares = newSummer(x => x*x);
```
매개변수 여러 개를 받는 함수를 매개변수 하나만 받는 함수로 바꾸는 것을 **커링**이라 함

## 재귀
자기 자신을 호출하는 함수   
재귀 함수는 탈출이 꼭 있어야 한다.
```js
//4! = 4*3*2*1
function fact(n){
    if(n===1) return 1;   //탈출 조건
    return n * fact(n-1); //자기 자신 호출
}
```