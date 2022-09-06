# Chapter 07. 스코프
변수와 상수, 매개변수가 언제 어디서 정의되는지 결정   

## 정적 스코프와 동적 스코프
정적 스코프는 어떤 변수가 함수 스코프 안에 있는지 함수를 정의할 때 알 수 있다는 뜻(호출x)
```js
const x = 3;
function f(){
    console.log(x);
    console.log(y); //y는 다른 스코프에 존재
}

{
    const y = 5; 
    f();
}
```
함수 f는 정의될 때 접근할 수 있던 식별자는 접근할 수 있지만, 호출할 때 스코프에 있는 식별자에 접근할 수 없다.   

정적 스코프는 전역 스코프. 블록 스코프, 함수 스코프에 적용된다.

## 전역 스코프
프로그램을 시작할 때 암시적으로 주어지는 스코프   
자바스크립트 프로그램을 시작할 때, 어떤 함수도 호출하지 않았을 때 전역 스코프   
전역 스코프에서 선언한 것은 모든 스코프에서 접근할 수 있음

## 블록 스코프
해당 블록의 스코프에서만 보이는 식별자를 의미

## 변수 숨기기
```js
{
    let x = 'blue';
    console.log(x); //"blue"
    {
        let x = 3;
        console.log(x); //"3"
    }
    console.log(x); //"blue"
}
console.log(typof x); //"undefined"
```
```js
{
    let x = {color: "blue"};
    let y = x;                  //y와 x는 같은 객체를 가리킴
    let z = 3;
    {
        let x = 5;
        console.log(x);         //5
        console.log(y.color);   //"blue"
        y.color = "red";
        console.log(z);         //3
    }
    console.log(x.color);       //"red", 객체는 내부 스코프에서 수정됨
    console.log(y.color);       //"red", x와 y는 같은 객체름 가리킴
    console.log(z);             //3
}
```

스코프의 계층적인 성격으로 인해 어떤 변수가 스코프에 있는지 확인하는 **스코프 체인**이라는 개념이 생김.   

## 함수, 클로저, 정적 스코프
**클로저**란 함수가 특정 스코프에 접근할 수 있도록 의도적으로 그 스코프에서 정의하는 것(스코프를 함수 주변으로 좁히는 것)
```js
let globalFunc;
{
    let blockVar = 'a';
    globalFunc = function(){
        console.log(blockVar);
    }
}

globalFunc(); //a
```
스코프 안에서 함수를 정의하면 해당 스코프는 더 오래 유지된다.

```js
let f;
{
    let o = {note: 'Safe'};
    f = function(){
        return o;
    }
}
let oRef = f();
oRef.note = "Not Safe";
```
함수를 정의해 클로저를 만들면 접근할 방법이 생긴다.

## 즉시 호출하는 함수 표현식(IIFE)
```js
(function(){
    
})();
```
익명 함수를 만들고 즉시 호출한다.   
내부에 모두 자신만의 스코프를 가짐, 함수 밖으로 무언가를 내보낼 수 있다.
```js
const message = (function(){
    const secret = "I'm a secret!"; //외부에서 접근할 수 없다.
    return `The secret is ${secret.length} characters long.`;
})();
console.log(message);
```
```js
const f = (function(){
    let count = 0;
    return function(){
        return `${++count}번 호출`;
    }
})();
f();    //1번 호출
f();    //2번 호출
```
클로저를 만들고 클로저에서 무언가 반환받을 때 유용하게 쓰인다.

## 함수 스코프와 호이스팅
ES6에서 let 도입 전에는 var를 이용해 변수를 선언했고, 함수 스코프와 똑같이 동작했다.   

```js
let var1;
let var2 = undefined;
var1; //undefined
var2; //undefined
undefinedVar; //ReferenceRerror 정의되지 않음
```
```js
x;          
let x = 3; //에러가 일어나서 도달할 수 없음
```
var로 변수를 선언하면 선언전에 사용 가능
```js
x;  //undefined;
var x = 3;
x;  //3
```
함수나 전역 스코프 전체를 보고 var로 선언한 변수를 맨 위로 올리기 때문(호이스팅, 선언만 끌어올림, 할당x)
```js
//위 예제를 자바스크립트가 해석한 상태
var x;
x;  //undefined;
x = 3;
x;  //3
```
var를 이용하면 같은 변수를 여러 번 정의해도 무시한다.

## 함수 호이스팅
함수 선언도 스코프 맨 위로 끌어올려진다.   
**변수에 할당한 함수 표현식을 끌어올려지지 않는다.**

## 스트릭트 모드
var를 사용하면 암시적 전역 변수가 생기는 등 문제가 생겨 **스트릭트 모드**를 도입했다.
`"use strict"`를 전역이나 함수 내부에서 사용하면 스트릭트 모드로 실행됨.   
전역 스코프에 스트릭트 모드를 사용하면 불러온 스크립트 전체에 적용됨   
일반적으로는 전역 스코프에서 스트릭트 모드를 사용하지 않는 편이 좋다.