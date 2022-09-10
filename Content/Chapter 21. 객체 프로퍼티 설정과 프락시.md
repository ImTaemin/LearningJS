# Chapter 21. 객체 프로퍼티 설정과 프락시
## 접근자 프로퍼티 getter, setter
접근자 프로퍼티는 메서드와 비슷.   
`getter`와 `setter` 두 가지 함수로 구성, 접근했을때 함수라기보다는 데이터 프로퍼티와 비슷하게 동작   
접근자 프로퍼티를 **동적 프로퍼티**라고도 부른다.
```js
//@가 들어있는 문자열은 모두 유효한 이메일 주소라고 간주
const USER_EMAIL = Symbol();
class User{
    set email(value){
        if(!/@/.test(value)) throw new Error(`invalid email: ${value}`);
        this[USER_EMAIL] = value;
    }
    get email(){
        return this[USER_EMAIL];
    }
} 
```

```js
//getter만 생성
class Rectangle{
    costruct(width, height){
        this.width = width;
        this.height = height;
    }
    get perimeter(){
        return this.width*2 + this.height*2;
    }
}
```

## 객체 프로퍼티 설정
프로퍼티에는 자신이 속한 객체 안에서 어떻게 동작할지 결정하는 속성이 있다.
```js
const obj = {foo: "bar"};
Object.getOwnPropertyDescriptor(obj, 'foo');

//결과: 쓰기 가능한지, 나열 가능한지, 설정 가능한지
{value: "bar", writeable: true, enumerable: true, configurable: true}
```
`Object.defineProperty`로 프로퍼티 속성을 컨트롤하거나(설정 가능한 경우) 새 프로퍼티를 만들 수 있다.
```js
//obj의 foo 프로퍼티를 읽기 전용으로 만들기
Object.defineProperty(obj, 'foo', {writeable: false});

//새 프로퍼티 추가
Object.defineProperty(obj, 'color', {
    get: function(){return this._color;},
    set: function(value){return this._color = value;}
});

//데이터 프로퍼티 추가 (value 프로퍼티 사용)
Object.defineProperty(obj, 'name', {
    value: 'Cynthia'
});
Object.defineProperty(obj, 'greet', {
    value: function(){return `name : ${this.name}`}
});
```
`Object.defineProperty`는 배열 프로퍼티를 나열할 수 없게 만들 때 주로 사용   

`Object.defineProperties`도 있다.(복수형). 객체 프로퍼티 이름과 프로퍼티 정의를 서로 연결

## 객체 보호: 동결, 봉인, 확장 금지
객체를 보호해서 의도하지 않은 수정을 막고, 의도적은 공격은 더 어렵게 만드는 세 가지 매커니즘(동결, 봉인, 확장 금지)이 있다.   

**동결**된 객체는 수정할 방법이 없다.(데이터만 들어있는 객체에서 유용)   
`Object.freeze`를 사용해 객체를 동결. 확인할 때는 `Object.isFrozen`을 사용.

객체를 **봉인**하면 새 프로퍼티를 추가하거나 기존 프로퍼티를 변경, 삭제할 수 없다.   
클래스의 인스턴스를 사용하면서, 인스턴스의 프로퍼티를 수정하는 메서드는 동작하도록 할 때 사용   
`Object.seal`을 사용해 객체를 봉인. 확인할 때는 `Object.isSealed`

**확장 금지**를 사용하면 객체에 새 프로퍼티를 추가하는 것만 금지된다.   
프로퍼티에 값을 할당하거나, 삭제하거나, 속성을 변경하는 작업은 모두 허용.   
`Object.preventExtensions`를 사용해 확장 금지. 확인할 때는 `Object.isExtensible`을 사용


## 프락시
ES6에서 새로 추가된 메타프로그래밍 기능.(프로그램이 자기 자신을 수정하는 것)   
객체 프락시는 객체에 대한 작업을 가로채고, 필요하다면 작업 자체를 수정하는 기능
```js
const proxy = new Proxy({a:1, c:3}, {
    get(target,key){ //타겟, 프로퍼티 키, 수신자를 받음
        return target[key] || 0;
    }
});

proxy.a; //1
proxy.b; //0 - 없어서 0 반환
```
첫 번째 매개변수는 프락시할 객체, 두 번째 매개변수는 가로챌 동작을 가리키는 핸들러

프로퍼티에 값을 할당하려 할 때 `set` 핸들러로 가로챌 수 있다.   
```js
const cook={
    name: "Walt",
    redPhosphorus: 100, //위험
    water: 500          //안전
};

const protectedCook = new Proxy(cook, {
    set(target, key, value){
        if( key === 'redPhosphorus'){
            if(tagrget.allowDangerousOperations)
                return target.redPhosphorus = value;
            else
                return console.log("Too dangerous");
        }
        // 다른 프로퍼티는 모두 안전
        target[key] = value;
    }
});
protectedCook.water = 550;          //550
protectedCook.redPhosphorus = 150;  //Too dangeroues
```