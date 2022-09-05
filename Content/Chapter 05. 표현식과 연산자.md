# Chapter 05. 표현식과 연산자
## 비교 연산자
일치함(===), 동등함(==), 대소 관계 세 가지 타입으로 나뉨   

두 값이 같은 객체를 가리키거나, 같은 타입이고, 값도 같다면 **일치**   
두 값이 같은 객체를 가리키거나, 같은 값을 갖도록 변환할 수 있다면 **동등**   
문자열 "33"은 숫자 33으로 변환할 수 있어 동등하다. 그러나 타입이 다르므로 일치하지 않는다.
```js
const n = 5;
const s = "5";
n === s;         //false, 타입이 다름
n === Number(s); //true, "5"를 숫자로 변환
n == s;          //true, 권장하지 않음

const a = {name: "an object"};
const b = {name: "an object"};
a === b; //false, 객체는 항상 다르다.
a == b;  //false, 권장하지 않음
```

## 숫자 비교
숫자형 값 NaN은 자신을 포함해 무엇과도 같지 않다 (Nan === Nan은 false)   
숫자가 Nan인지 알려면 내장함수 `isNan(x)` 사용   

```js
let n=0;
while(true){
    n += 0.1;
    if(n === 0.3)
        break;
}
console.log('Stopped at ${n}');
//무한 루프다.
```
0.1은 이진 표현으로 나타낼 수 있는 숫자들 사이에 걸쳐있다.   
이 루프를 세 번째 반복할 때 n의 값은 0.300000000000004 이므로 테스트는 false가 되어 탈출할 수 없게된다.  

따라서 소수점이 있는 숫자를 비교할 때 관계 연산자를 써 테스트하는 숫자가 대상 숫자에 "충분히 가까운지" 확인하는 편이 좋다.   
`Number.EPSILON`이 있는데 매우 작은 값이며, 일반적으로 숫자 두 개를 구별하는 기준으로 사용한다.

```js
let n=0;
while(true){
    n += 0.1;
    if(Math.abs(n - 0.3) < Number.EPSILON)
        break;
}
console.log('Stopped at ${n}');
```
두 개의 더블 형식이 같다고 할 수 있을만큼 가까운 숫자인지 판단할 때 일반적으로 사용하는 방법이다.

## 논리 연산자
모든 데이터 타입을 **참 같은 값**과 **거짓 같은 값**으로 나눌 수 있다.   
### 거짓 같은 값
- undefined
- null
- false
- 0
- NaN
- ''(빈 문자열)   

이 외의 같은 모두 참 같은 값
### 참 같은 값
- 모든 객체, `valueOf()`를 호출했을 때 `false`를 반환하는 객체도 참 같은 값에 속함
- 배열, 빈 배열도 참 같은 값에 속함
- 공백만 있는 문자열 ("   ")
- 문자열 "false"   

빈 배열이 거짓 같은 값으로 평가되길 원하면 `arr.length` 사용   
빈 배열에서 호출 시 0을 반환하며 거짓 같은 값이다.

## AND, OR, NOT
### 단축 평가
x가 거짓 같은 값이면 `x && y`는 y를 평가할 필요도 없이 `false`   
`x || y`에서 x가 참 같은 값이면 y를 평가할 필요도 없이 `true`   
```js
const skipIt = true;
let x = 0;
const result = skipIt || x++; //단축 평가(x++ 실행 안함)

const doIt = false;
let x = 0;
const result = doIt && x++; //단축 평가(x++ 실행 안함)
//doIt을 true로 바꾸면 증가 연산이 일어나고 result는 0이 된다.(1&&0)
```

```js
const options = suppliedOptions || {name: "Default"}
```
객체는 항상(빈 객체라도) 참 같은 값으로 평가된다.   
`suppliedOptions`가 객체면 options는 `suppliedOptions`를 가리키게 된다.   
옵션이 제공되지 않으면 `suppliedOptions`가 `null`이나 `undefined`라면 options는 기본값을 갖게 된다.

### 쉼표 연산자
표현식을 결합하여 두 표현식을 평가 후 두 번째 표현식의 결과를 반환   
```js
let x = 0, y = 10, z;
z = (x++, y++); //10
```

## 연산자 그룹
### typeof 연산자
피연산자의 타입을 나타내는 문자열을 반환 : `typeof x`

### void 연산자
피연산자를 평가한 후 `undefined`를 반환한다.   
가끔 html `<a>` 태그의 URI에 사용한다.
```js
//다른 페이지로 이동하는 것을 막음
<a href="javascript:void 0">Do nothing</a>
```

### 할당 연산자
변수에 값을 할당.   
등호의 왼쪽에 있는 것(1-value라고도 함)은 반드시 변수나 프로퍼티, 배열 요소 중 하나여야 함   
표현식의 좌변에 있는 것은 반드시 값을 저장할 수 있는 것이여야 함
```js
let v, v0;
v = v0 = 9.8;   //v0가 9.8이 되고 v가 9.8이 됨
```

### 해체 할당
객체나 배열을 변수로 해체할 수 있다.
```js
const obj = {b: 2, c: 3, d: 4};

const {a ,b ,c} = obj;
a;  //undefined, obj에 "a"가 없음
b;  //2
c;  //3
d;  //ReferenceError, "d"가 정의되지 않음
```
변수 이름과 객체의 프로퍼티 이름이 일치해야 한다.

```js
const obj = {b: 2, c: 3, d: 4};

let a ,b, c;
{a,b,c} = obj; //에러
({a,b,c} = obj); //정상 동작
```
배열 요소에 대응할 변수 이름을 마음대로 쓸 수 있다.(배열순서대로 대응)

```js
const arr = [1,2,3];

//배열 해체 할당
let[x,y] = arr;
x;  //1
y;  //2
z;  //ReferenceError, "z"는 정의되지 않음
```
뒤의 배열 요소는 버려진다.
```js
const arr = [1,2,3,4,5];

let [x, y, ...rest] = arr;
x;      //1
y;      //2
rest;   //[3,4,5]
```
rest에 나머지가 저장된다.

배열 해체를 활용해 변수의 값을 서로 바꿀 수 있다.
```java
let a=5, b=10;
[a,b] = [b,a];
a;  //10
b;  //5
```

## 표현식과 흐름 제어 패턴
### if 문을 단축 평가하는 OR 표현식으로 변경
`if(!options) options = {}` --> `options = options || {}`