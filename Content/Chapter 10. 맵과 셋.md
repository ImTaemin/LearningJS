# Chapter 10. 맵과 셋
## 맵
자바와 거의 비슷
```js
const map = new Map();
map.set(key, value); //메서드 체이닝 가능
map.set([[key1,value],[key2,value]]); //배열 넘기기 가능

map.get(key); //value
map.has(key); //true, 존재여부
```
`keys()`, `values()`, `entries()`는 모드 이터러블 객체이기 때문에 `for ...of`루프 사용 가능   

```js
[...map.values()]; //배열로 반환 [v1,v2,v3...]
```
- `delete()` : 요소 한개 삭제
- `clear()` : 요소 모두 지우기

## 위크맵
- 키는 반드시 객체
- 키는 가비지 콜렉션에 포함될 수 있음
- 이터러블이 아니고 `clear()`도 없음

Map의 키인 객체 o가 있다면 o를 메모리에 계속 유지한다.   
WeakMap은 그렇지 않다. 때문에 이터러블이 될 수 없다. 가비지 콜렉션 중인 객체를 노출할 위험이 크기 때문.  

WeakMap의 이런 특징으로 인해 객체 인스턴스의 전용키를 저장하기에 알맞다.
```js
const SecretHolder = (function(){
    const secrets = new WeakMap();
    return class{
        setSecret(secret){
            secrets.set(this, secret);
        }
        getSecret(){
            return secrets.get(this);
        }
    }
})();
```
IIFE 외부에서는 인스턴스에 비밀스러운 내용을 저장할 수 있는 `SecrectHolder` 클래스를 얻게 된다.   
```js
const a = new SecrectHolder();
a.setSecret('secret A');
a.getSecret(); //"secret A"
```
일반적인 Map을 써도 되지만 `SecretHolder` 인스턴스에 저장한 내용이 가비지 컬렉션에 포함되지 않는다.

## 셋
중복 허용 x
```js
const roles = new Set();
roles.add("User");    //추가
roles.deletE("User"); //삭제
```

## 위크셋
객체만 포함할 수 있음. 가비지 콜렉션의 대상이 된다.
`WeakMap`과 마찬가지로 `WeakSet`도 이터러블이 아님   
실제 용도는 셋 안에 존재하는지 알아보는 것뿐