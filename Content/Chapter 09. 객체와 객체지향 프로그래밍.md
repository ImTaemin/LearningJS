# Chapter 09. 객체와 객체지향 프로그래밍
## 프로퍼티 나열
### for...in
### Object.keys
```js
const SYM = Symbol();
const o = {a:1, b:2, c:3, [SYM]:4};
Object.keys(o).forEach(prop => console.log(`${prop}:${o[prop]}`));
```

## 객체지향 프로그래밍
### 클래스와 인스턴스 생성
```js
class Car{
    constructor(make, model){
        this.make = make;
        this.model = model;
        this.userGears = ['P', 'N', 'R', 'D'];
        this.userGear = this.userGears[0];
    }
    shift(gear){
        if(this.userGears.indexOf(gear) < 0)
            throw new Error(`Invalid gear: ${gear}`);
        this.userGear = gear;
    }
}

const car1 = new Car("Tesla", "Model S");
car1.shift('D'); //호출 시 this는 car1에 묶임
```
```js
//프로퍼티 보호
const Car = (function(){

    const carProps = new WeakMap();

    class Car{
        constructor(make, model){
            this.make = make;
            this.model = model;
            this._userGears = ['P', 'N', 'R', 'D'];
            carProps.set(this,  {userGear: this._userGears[0]});
        }

        get userGear() {
            return carProps.get(this).userGear;
        }
        set userGear(value){
            if(this._userGears.indexOf(value) < 0)
                throw new Error(`Invalid gear: ${gear}`);
            carProps.get(this).userGear = value;
        }

        shift(gear){
            this.userGear = gear;
        }

    }

    return Car;
})();

const car1 = new Car("Tesla", "Model S");
car1.shift('D'); //호출 시 this는 car1에 묶임
```

### 클래스는 함수다.
```js
//ES5
function Car(make, model){
    this.make = make;
    this.model = model;
    this._userGears = ['P', 'N', 'R', 'D'];
    this._userGear = this.userGears[0];
}

//ES6
clss Es6Car{} //생성자는 의도적으로 생략
function Es5Car{}
```

### 프로토타입
클래스의 인스턴스에서 사용할 수 있는 메서드는 **프로토타입 메서드**를 말함.(위 코드에서 shift 메서드)   
프로토타입 메서드는 `Car.prototype.shift`처럼 표기할 때가 많다.   
최근에는 #으로도 표기 (`Car#shift`)   

모든 함수에는 `prototype`이라는 특별한 프로퍼티가 있음.   
일반 함수에선 사용할 일이 없지만, 객체 생성자로 동작하는 함수에는 중요.  

`prototype` 프로퍼티가 중요해지는 시점은 `new` 키워드로 새 인스턴스를 만들었을 때.   
`new` 키워드로 만는 새 객체는 생성자의 `prototype` 프로퍼티에 접근할 수 있다.   
객체 인스턴스는 생성자의 `prototype` 프로퍼티를 `__proto__` 프로퍼티에 저장

프로토타입에서 중요한 것은 **동적 디스패치**라는 매커니즘. 메서드 호출과 같은 의미   
**객체의 프로퍼티나 메서드에 접근하려 할 때 그런 프로퍼티나 메서드가 존재하지 않으면 객체의 프로토타입에서 프로퍼티나 메서드를 찾는다.**   
클래스의 인스턴스는 모두 같은 프로토타입을 공유하므로 프로토타입에 프로퍼티나 메서드가 있다면 해당 클래스의 인스턴스는 모두 그 프로퍼티나 메서드에 접근 가능

인스턴스에서 메서드나 프로퍼티를 정의하면 프로토타입에 있는 것을 가리는 효과   
먼저 인스턴스를 체크하고 없으면 프로토타입을 체크하기 때문
```js
const car1 = new Car();
const car2 = new Car();

car1.shift === Car.prototype.shift; //true
car1.shift('D');
car1.shift('d');                    //error
car1.userGear;                      //'D'
car1.shift === car2.shift           //true

car1.shift = function(gear){
    this.userGear = gear.toUpperCase();
}
car1.shift === Car.prototype.shift; //false
car1.shift === car2.shift;          //false
car1.shift('d');
car1.usergear;                      //'D'
```

### 정적 메서드
인스턴스 메서드 외에 정적 메서드(클래스 메서드)가 있다.   
정적 메서드는 특정 인스턴스에 적용되지 않는다.   
정적 메서드에서 this는 인스턴스가 아니라 클래스 자체에 묶임.   
일반적으로 정적 메서드에는 this 대신 클래스 이름을 사용하는 것이 좋은 습관.

정적 메서드는 클래스에 관련되지만 인스턴스와는 관련이 없는 범용적인 작업에 사용, 여러 인스턴스를 대상으로하는 작업에도 종종 쓰임
```js
//areSimilar() : 두 자동차의 제조사와 모델이 모두 같으면 true반환
//areSame() : 두 자동차의 VIN이 같으면 true 반환
class Car{
    static getNextVin(){
        //this.nextVin++이라고 써도 됨.
        //Car라고 쓰면 정적 메서드라는 점을 상기할 수 있음
        return Car.nextVin++; 
    }

    constructor(make, model){
        this.make = make;
        this.model = model;
        this.vin = Car.getNextVin();
    }

    static areSimilar(car1, car2){
        return car1.make === car2.make && car1.model === car2.model;
    }
    
    static areSame(car1, car2){
        return car1.vin === car2.vin;
    }
}

Car.nextVin = 0;

const car1 = new Car("Tesla", "S");
const car2 = new Car("Mazda", "3");
const car3 = new Car("Mazda", "3");

car1.vin; //0
car2.vin; //1
car3.vin; //2

Car.areSimilar(car1, car2); //false
Car.areSimilar(car2, car3); //true
Car.areSame(car2, car3);    //false
Car.areSame(car2, car2);    //true
```

### 상속
상속은 한 단계로 끝나지 않는다. 객체의 프로토타입에서 메서드를 찾지 못하면  조건에 맞는 프로토타입을 찾을 때 까지 프로토타입 체인을 거슬러 올라간다.

클래스의 계층 구조를 만들 때 프로토타입 체인을 염두하면 효율적인 구조를 만들 수 있다.
```js
class Vehicle{
    constructor(){
        this.passengers = [];
        console.log("Vehicle created");
    }
    addPassenger(p){
        this.passengers.push(p);
    }
}

class Car extends Vehicle{ //자바랑 똑같다
    constructor(){
        super();
        console.log("Car created");
    }
    deployAirbags(){
        console.log("BWOOSH!");
    }
}
```

### 다형성
다형성이란 여러 슈퍼클래스의 멤버인 인스턴스를 가리키는 말이다.
```js
class Motorcycle extends Vehicle{}
const c = new Car();
const m = new Motorcycle();
c instanceof Car;        //true
c instanceof Vehicle;    //true
m instanceof Car;        //false
m instanceof Motorcycle; //true
m instanceof Vehicle;    //true
```

### 객체 프로퍼티 나열
객체 obj와 프로퍼티 x에서 `obj.hasOwnProperty(x)`는 obj에 프로퍼티 x가 있다면 `true`를 반환, 프로퍼티 x가 obj에 정의되지 않거나 프로토타입 체인에만 정의되면 `false`를 반환

ES6 클래스를 설계 의도대로 사용한다면 데이터 프로퍼티는 항상 프로토타입 체인이 아니라 인스턴스에 정의해야 한다. 확실히 확인하기 위해 `hasOwnProperty`사용
```js
class Super{
    constructor(){
        this.name = 'Super';
        this.isSuper = true;
    }
}

//유효하지만 권장하지 않음
Super.prototype.sneaky = 'not recommended!';

class Sub extends Super{
    constructor(){
        super();
        this.name = 'Sub';
        this.isSub = true;
    }
}

const obj = new Sub();

for(let p in obj){
    console.log(`${p}:${obj[p]}` +
        (obj.hasOwnProperty(p) ? '' : ' (inherited)'));
}

/* 
name: Sub
isSuper: true
isSub: true
sneaky: not recommended! (inherited)
*/
```

### 문자열 표현
모든 객체는 `Object`를 상속하므로 `Object`의 메서드는 모든 객체에서 사용 가능(`toString()`)

## 다중 상속, 믹스인, 인터페이스
자바스크립트는 프로토타입 체인에서 여러 부모를 검색하지는 않아 **단일 상속 언어**라고 해야함   

**믹스인**이라는 개념으로 다중 상속을 해결했다.   
믹스인이란 기능을 필요한 만큼 석어 놓은 것이다.   
자바스크립트는 느슨한 타입을 사용하고 관대한 언어기 때문에 언제든, 어떤 객체에든 추가할 수 있다.

예시 : 보험 가입 믹스인   

```js
class InsurePolicy{}

function makeInsurable(o){
    o.addInsurePolicy = function(p){
        this.insurePolicy = p;
    }
    o.getInsurePolicy = function(){
        return this.insurePolicy;
    }
    o.isInsured = function(){
        return !!this.insurePolicy;
    }
}
```
```js
makeInsurable(Car); //x

const car1 = new Car();
car1.addInsurePolicy(new InsurePolicy()); //error
```
자동차를 추상화한 개념을 보험에 가입할 수 없다.   
보험에 가입하는 것은 개별 자동차이다.
```js
const car1 = new Car();
makeInsurable(car1);
car1.addInsurePolicy(new InsurePolicy()); //works
```
동작하지만, 모든 자동차에서 `makeInsurable`를 호출해야 한다.   
```js
makeInsurable(Car.prototype);
const car1 = new Car();
car1.addInsurePolicy(new InsurePolicy()); //works
```
이제 보험 관련 메서드들은 모두 `Car` 클래스에 정의된 것처럼 동작함

보험 회사에서 범용적인 메서드 이름을 사용해, 우연히 `Car` 클래스의 메서드와 충돌이 일어난다는 가정   
보험 회사에 키를 모두 **심볼**로 사용해 달라고 요청할 수 있다.
```js
class InsurePolicy{}

const ADD_POLICY = Symbol();
const GET_POLICY = Symbol();
const IS_INSURED = Symbol();
const _POLICY = Symbol();

function makeInsurable(o){
    o[ADD_POLICY] = function(p){
        this[_POLICY] = p;
    }
    o[GET_POLICY] = function(){
        return this[_POLICY];
    }
    o[IS_INSURED] = function(){
        return !!this[_POLICY];
    }
}
```
심볼은 항상 고유해 믹스인이 Car 클래스의 기능과 충돌할 가능성은 없다.