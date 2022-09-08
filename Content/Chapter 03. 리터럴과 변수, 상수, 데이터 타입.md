# Chapter 03. 리러럴과 변수, 상수, 데이터 타입

## 변수와 상수
**변수** : 이름이 붙은 값, 언제든 바뀔 수 있음
**상수** : 한 번 할당한 값을 바꿀 수 없음

될 수 있으면 변수보다 상수를 쓰는 것이 좋음 : 상수를 사용하면 바꾸지 말아야 할 데이터에서 실수로 값을 바꾸는 일이 줄어듬

변수를 써야하는 경우
- loop 제어
- 시간이 지나면서 값이 바뀌는 경우

## 식별자 이름
변수, 상수, 함수명을 식별자라 하고 규칙이 있다.
- 식별자는 반드시 글자, $, _ 로 시작해야 한다.
- 식별자는 대문자로 시작하면 안됨 (예외 : 클래스)
- 제이쿼리를 사용할 경우 $로 시작하는 식별자는 보통 제이쿼리 객체라는 의미
- 밑줄 한 개 또는 두 개로 시작하는 식별자는 특별한 상황이거나 내부 변수에만 사용

표기법 : 카멜(findByXXX), 스네이크(find_by_XXX)

## 리터럴
값을 프로그램 안에서 직접 지정한다는 의미. 값을 만드는 방법임   
22 -> 숫자형 리터럴, "AA" -> 문자형 리터럴

## 원시 타입과 객체
**원시타입**은 불변 : 숫자, 문자열(유니코드 타입임), boolean, null, undefined, 심볼   
**객체**는 여러 가지 형태와 값을 가질 수 있음 : Array, Date, RegExp, Map과 WeakMap, Set과 WeakSet, Number, String, Boolean

## 심볼
유일한 토큰을 나타내기 위한 데이터 타입. 다른 심볼과 일치하지 않음(객체와 유사)    
심볼은 생성자로 만든다.
```js
const RED = Symbol("The color of a sunset!");
const ORANGE = Symbol("The color of a sunset!");
RED === ORANGE //false
```

## null과 undefined
- **null** : 프로그래머에게 허용된 데이터 타입
- **undefined** : 자바스크립트 자체에서 사용   
변수에 명시적으로 값을 할당하지 않은 경우 할당됨

## 객체
```js
const obj = {} //빈 객체 생성
obj.color = "yellow"; //color 프로퍼티 추가
obj["not an identifier"] = 3;
obj["not an identifier"]; //3
obj["color"];             //"yellow"
```
프로퍼티 이름에 유효한 식별자를 써야 '.'를 사용 가능   
프로퍼티 이름에 유효한 식별자가 아닌 이름을 쓴다면 '[]'를 써야함 (유효한 식별자여도 접근 가능)
```js
//객체 리터럴 문법 - 객체 생성과 동시에 프로퍼티 만들기
const sam1 = {
    name: 'Sam',
    age: 4
};

const sam2 = {name: 'Sam',age: 4}; //한 줄로 선언

const sam3 = {
    name: 'Sam',
    classification: { //프로퍼티 값으로 객체
        kingdom: 'Anamalia',
        phylum: 'Chordata',
        family: 'Felidae'
        ...
    }
}

//객체 안의 객체 접근 방법
sam3.classification.family;
sam3["classification"].family;
sam3.classification["family"];
sam3["classification"]["family"];

//함수 추가
sam3.speak = function(){return "Meow!";};
sam3.speak(); //"Meow!"

//객체에서 프로퍼티 제거
delete sam3.classification;
delete sam3.speak;
```
## Number, String, Boolean 객체
```js 
const s = "hello";
s.toUpperCase(); //"HELLO"
```
s가 원시 문자열 타입이지만 toUpperCase함수가 들어있는 임시 String 객체를 만듬.   
자바스크립트는 함수를 호출하는 즉시 임시객체를 파괴

## 배열
일반 객체와 달리 배열 콘텐츠에는 항상 순서가 있고, 키는 순차적인 숫자

### 자바스크립트 배열의 특징
- 배열의 크기 고정되지않음. 언제든 요소 크기 추가, 제거 가능
- 요소의 데이터 타입을 가리지않음
- 배열 요소는 0으로 시작   

배열 요소에 값을 할당할 때 배열 길이나 그보다 큰 인덱스를 사용하면 배열 크기가 그에 맞게 늘어남

## 날짜
내장된 Date 객체에서 담당   
특정 날짜, 시간에 해당하는 객체 생성 : `const halloween = new Date(2016, 9, 31, 19, 0);`

## 정규표현식
RegExp 객체 사용

## 맵과 셋
ES6에서 Map, Set과 약한 짝인 WeakMap, WeakSet을 도입   
맵 : 키와 값을 매핑, 특정 상황에서 객체보다 유리   
셋 : 배열과 비슷하지만 중복 비허용   

## 데이터 타입 변환
### 숫자로 변환
- Number 객체 생성자 사용
- 내장 함수인 `parseInt()`, `parseFloat()` 사용 (숫자 이외의 문자열은 무시)
- Date -> 숫자 `valueOf()` 사용

### 문자로 변환
`toString()` 사용   
배열에서 쓰면 각 요소를 문자열로 바꾼 후 쉼표료 연결한 문자열 반환 (`[1, true, "hello].toString()`->"1,true,hello")
- 부정 연산자(!) 사용
- Boolean 생성자 사용

## 📝요약
- 객체의 심볼의 이름으로 갖는 프로퍼티를 만드려면 대괄호를 써야한다
- 자바스크립트에는 문자열, 숫자, 불리언, null, undefined, 심볼의 여섯가지 원시타입과 객체 타입이 있다
- 자바스크립트의 모든 숫자는 배정도 부동소수점 숫자(더블)이다
- 배열은 특수한 객체, 객체와 마찬가지로 매우 강력하고 유연한 데이터 타입이다