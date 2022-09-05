# Chapter 06. 함수
## 호출과 참조
함수도 객체다. 따라서 넘기거나 할당이 가능하다.   
함수명 뒤에 괄호를 쓰면 함수를 호출하고 쓰지 않으면 함수를 참조하는 것이고 실행되지 않는다.
```js
//다른 이름으로 함수 호출
const f = getGreeting;
f();

//함수를 객체 프로퍼티에 할당
const o = {};
o.f = getGreeting;
o.f();

//배열 요소로 할당
const arr = [1,2,3];
arr[1] = getGreeting; //arr[1, function getGreeting(), 2]
arr[1]();
```

## 함수와 매개변수
함수의 시그니처에는 매개변수가 포함된다.   
자바스크립트는 함수 f가 있다면 호출할 때 매개변수를 한 개 전달하든 열 개 전달하든 같은 함수를 호출한다.   
정해진 매개변수에 값을 제공하지 않으면 암묵적으로 `undefined`가 할당된다.

### 매개변수 해체
```js
//객체를 변수로 해체
function getSentence({subject, verb, object}){
    return `${subject} ${verb} ${object}`;
}

const o={
    subject: "I",
    verb: "love",
    object: "JavaScript"
};

getSentence(o);
```
프로퍼티 이름은 반드시 유효한 식별자여야 함,   
들어오는 객체에 해당 프로퍼티가 없는 변수는 `undefined`

```js
//배열 해체
function getSentence({subject, verb, object}){
    return `${subject} ${verb} ${object}`;
}

const arr = ["I", "love", "JavaScript"];
getSentence(arr);
```

```js
//확산 연산자(...) 사용
function addPrefix(prefix, ...words){
    const prefixedWords = [];
    for(let i=0; i<words.length; i++){
        prefixedWords[i] = prefix + words[i];
    }
    return prefixedWords;
}

addPrefix("con", "verse", "vex"); //["converse", "convex"]
```
확산 연산자는 반드시 마지막 매개변수여야 한다.

### 매개변수 기본값
```js
function f(a, b="default", c=3){
    return `${a} - ${b} - ${c}`;
}
```

## 객체의 프로퍼티 함수
객체의 프로퍼티인 함수를 메서드라고 불러 일반적인 함수와 구별한다.

```js
const o = {
    name: 'Wallace',
    bark: function() {return 'Woof!';}
}

//es6
const o = {
    name: 'Wallace',
    bark() {return 'Woof!';}
}
```

## this 키워드
```js
const o ={
    name: 'Wallace',
    speak() {return `My name is ${this.name}!`;} 
}

o.speak(); //this는 o에 묶인다.
```
this는 함수를 어떻게 선언했느냐가 아니라 **어떻게 호출**했느냐에 따라 달라진다.   
this가 o에 묶인 이유는 o에서 `speak()`를 호출했기 때문이다.
```js
//같은 함수를 변수에 할당한다면
const speak = o.speak;
speak === o.speak;  //true; 두 변수는 같은 함수를 가리킴
speak();            //My name is undefined!
```
함수가 어디에 속하는지 알 수 없어 `this`는 `undefined`에 묶인다.

```js
const o = {
    name: 'Julie',
    greetBackwards: function(){
        function getReverseName(){
            let nameBackWards = '';
            for(let i=this.name.length-1; i>=0; i--){
                nameBackWards += this.name[i];
            }
            return nameBackwards;
        }
        return `${getReverseName()} si eman ym ,olleH`;
    }
};

o.greetBackwards(); //의도한 대로 호출되지 않는다.
```
`o.greetBackwards()`를 호출한 시점에서 `this`를 의도한 대로 o에 연결하지만, `greetBackwards` 안에서 `getReverseName`을 호출하면서 `this`는 o가 아닌 다른 것에 묶인다.   
**해결 방법은 다른 변수에 `this`를 할당**
```js
const o = {
    name: 'Julie',
    greetBackwards: function(){
        const self = this;
        function getReverseName(){
            let nameBackWards = '';
            for(let i=self.name.length-1; i>=0; i--){
                nameBackWards += self.name[i];
            }
            return nameBackwards;
        }
        return `${getReverseName()} si eman ym ,olleH`;
    }
};

o.greetBackwards();
```

## 함수 표현식과 익명 함수
```js
//함수 표현식을 쓰고 결과를 변수에 할당, 결과적으로 함수 선언과 동등
const f = function(){
    //...
};
```

```js
const g = function f(){
    //...
}
```
이런 식으로 이름을 정해 함수를 만들면 이름 g에 우선순위가 있다.   
g로 접근해야 하며, f로 접근하면 변수가 정의되지 않았다는 에러가 발생한다.   
```js
//재귀의 상황에서 필요할 수 있다.
const g = function f(stop){
    if(stop)
        console.log('f stopped');
    f(true); //자기 자신 호출
}
g(false);
```
호출할 생각으로 함수를 만든다면 **함수 선언**을 사용하면 되고,   
다른 곳에 할당하거나 다른 함수에 넘길 목적으로 함수를 만든다면 **함수 표현식**을 사용하면 된다.

## 화살표 표기법 (Arrow Function)
화살표 함수는 항상 익명이다. 변수에 할당할 수는 있지만 이름 붙은 함수는 만들 수 없다.

### 화살표 표기법의 세 가지 단축 문법
- `function`을 생략해도 된다.
- 함수에 매개변수가 단 하나뿐이라면 괄호도 생략할 수 있다.
- 함수 바디가 표현식 하나라면 중괄호와 `return`문도 생략할 수 있다.

```js
const f1 = function() {return "hello";}
const f1 = () => "hello";

const f2 = function(name) {return `Hello, ${name}`;}
const f2 = name => `Hello ${name}`;

const f3 = function(a,b) {return a+b;}
const f3 = (a,b) => a + b;
```
익명 함수를 만들어 다른 곳에 전달하려 할 때 가장 유용하다.

화살표 함수는 일반 함수와 다르게 this가 다른 변수처럼 정적으로 묶인다.
```js
const o ={
    name: 'Julie',
    greetBackwards: function(){
        const getReverseName = () => {
            let nameBackwards = '';
            for(let i = this.name.length-1; i>=0; i--){
                nameBackwards += this.name[i];
            }
            return nameBackwards;
        };

        return `${getReverseName()} si eman ym ,olleH`;
    }
};

o.greetBackwards();
```
다른 점이 두 가지 더 있다.   
화살표 함수는 객체 생성자로 사용할 수 없고, arguments 변수도 사용할 수 없다.

## call과 apply, bind
함수를 어디서, 어떻게 호출했느냐와 관계없이 `this`가 무엇인지 지정할 수 있다.

### call
`call` 메서드는 모든 함수에서 사용할 수 있으며, `this`를 특정 값으로 지정할 수 있다.
```js
const bruce = {name: "Bruce"};
const madeline = {name: "Madeline"};

//어떤 객체에도 연결되지 않았지만 this를 사용한다.
function greet(){
    return `Hello, I'm ${this.name}!`;
}

greet();                //"Hello, I'm undefined"
greet.call(bruce);      //"Hello, I'm Bruce!"
greet.call(madeline);   //"Hello, I'm Madeline!"
```
함수를 호출하면서 `call`을 사용하고 `this`로 사용할 객체를 넘기면 해당 함수가 주어진 객체의 메서드인 것처럼 사용할 수 있다.   
첫 번째 매개변수는 this로 사용할 값, 더 있으면 그 매개변수는 호출하는 함수로 전달
```js
function update(birthYear, occupation){
    this.birthYear = birthYear;
    this.occupation = occupation;
}

//{name: "Bruce", birthYear: 1949, occupation: "singer"}
update.call(bruce, 1949, 'singer');
//{name: "Madeline", birthYear: 1942, occupation: "actress"}
update.call(madeline, 1942, 'actress');
```

### apply
`apply`는 매개변수 처리 방법을 제외하면 `call`과 완전히 같다.   
`call`은 일반적인 함수처럼 매개변수를 직접 받지만, `apply`는 배열로 받는다.
```js
//{name: "Bruce", birthYear: 1955, occupation: "actor"}
update.apply(bruce, [1955,"actor"]);
//{name: "Madeline", birthYear: 1918, occupation: "writer"}
update.apply(madeline, [1918, "writer"]);
```
`apply`는 배열 요소를 함수 매개변수로 사용해야 할 때 유용하다.   
```js
//기본 배열을 바로 넘긴다.
const arr = [2,3,-5,15,7];
Math.min.apply(null, arr); //-5
Math.max.apply(null, arr); //15
```
`this`에 `null`을 쓴 이유는 `Math.min`과 `Math.max`는 `this`와 관계없이 동작하기 때문이다.
```js
//ES6의 확산 연산자(...)를 사용
cont newBruce = [1940, "martial artist"];
update.call(bruce, ...newBruce); //==apply(bruce, newBruce)
Math.min(...arr); //-5
Math.max(...arr); //15
```

### bind
`bind`를 사용해 `this` 값을 영구히 바꿀 수 있다.   
`update` 메서드를 이리저리 옮기면서 호출할 때 `this` 값을 항상 bruce가 되게끔, call이나 apply, 다른 bind와 함께 호출하더라도 `this` 값이 bruce가 되도록 bind를 사용
```js
const updateBruce = update.bind(bruce);

//{name: "Bruce", birthYear: 1904, occupation: "actor"}
updateBruce(1904, "actor");
//{name: "Bruce", birthYear: 1274, occupation: "king"}
updateBruce.call(madeline, 1274, "king");
```
`bind`는 함수의 동작을 영구적으로 바꿔 찾기 어려운 버그의 원인이 될 수 있다.   
함수의 `this`가 어디에 묶이는지 정확히 파악하고 사용해야 한다.

`bind`에 매개변수를 넘기면 항상 그 매개변수를 받으면서 호출되는 새 함수를 만드는 효과가 있다.
```js
//생년은 1949로 고정하지만 직업은 자유롭게 바꾸는 업데이트 함수
const updateBruce1949 = update.bind(bruce, 1949);

//{name: "Bruce", birthYear: 1949, occupation: "singer, songwriter"}
updateBruce1949("singer, songwriter");
```