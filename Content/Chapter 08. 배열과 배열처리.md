# Chapter 08. 배열과 배열처리
## 배열 요소 조작
배열 메서드 중 일부는 배열 자체를 수정하고, 다른 일부는 새 배열을 반환한다.   

```js
//처음이나 끝에 추가 제거(수정)
const arr = ["b","c","d"];
arr.push("e");      //["b","c","d","e"]
arr.pop();          //["b","c","d"]
arr.unshift("a");   //["a","b","c","d"]
arr.shift();        //["b","c","d"]
```
```js
//concat 배열 끝에 추가(사본 반환)
const arr = [1,2,3];
arr.concat(4,5,6);      //[1,2,3,4,5,6]
arr.concat([4,5,6]);    //[1,2,3,4,5,6]
arr.concat([4,5],6);    //[1,2,3,4,5,6]
arr.concat([4,[5,6]]);  //[1,2,3,4,[5,6]]
//제공받은 배열 한 번만 분해
```
```js
//slice 배열 일부 가져오기
const arr = [1,2,3,4,5];
arr.slice(3);       //[4,5]
arr.slice(2,4);     //[3,4]
arr.slice(-2);      //[4,5]
arr.slice(1,-2);    //[2,3]
arr.slice(-2,-1);   //[4]
```
```js
//splice 임의 위치에 추가 제거 (수정 시작 인덱스, 제거할 요소 숫자) 0=제거x
const arr = [1,5,7];
arr.splice(1,0,2,3,4);  //[] arr=[1,2,3,4,5,7]
arr.splice(5,0,6);      //[] arr=[1,2,3,4,5,6,7]
arr.splice(1,2);        //[2,3] arr=[1,4,5,6,7]
arr.splice(2,1,'a','b') //[5] arr=[1,4,'a','b',6,7]
```
```js
//copyWithin 배열 안에서 요소 교체(붙여 넣을 위치, 복사 시작 위치, 복사 끝 위치)
//배열 요소를 복사해 다른 위치에 붙여넣고, 기존 요소를 덮어씀
const arr = [1,2,3,4];
arr.copyWithin(1,2);     //arr=[1,3,4,4]
arr.copyWithin(2,0,2);   //arr=[1,3,1,3]
arr.copyWithin(0,-3,-1); //arr=[3,1,1,3]
```
```js
// fill 정해진 값으로 배열 채우기
const arr = new Array(5).fill(1); //arr=[1,1,1,1,1]
arr.fill("a");                    //arr=["a","a","a","a","a"]
arr.fill("b",1);                  //arr=["a","b","b","b","b"]
arr.fill("c",2,4);                //arr=["a","b","c","c","b"]
arr.fill(5.5,-4);                 //arr=["a",5.5,5.5,5.5,5.5]
arr.fill(0,-3,-1);                //arr=["a",5.5,0,0,5.5]
```
```js
//배열 정렬, 역순 정렬
const arr = [1,2,3,4,5]
arr.reverse();  //arr=[5,4,3,2,1]
arr.sort();     //arr=[1,2,3,4,5]

//객체 배열 정렬
const arr = [{name: "Suzanne"}, {name: "Jim"}, {name: "Trevor"}, {name: "Amanda"}];
arr.sort();     //arr 바뀌지 않음
arr.sort((a,b) => a.name > b.name);       //name 프로퍼티의 알파벳 순 정렬
arr.sort((a,b) => a.name[1] < b.name[1]); //name 프로퍼티의 두 번째 글자 역순
```

## 배열 검색
- `indexOf()`, `lastIndexOf()` : 찾는 것과 정확히 일치(===)하는 첫 번째 인덱스 반환
- `findIndex()` : 보조 함수를 써서 검색 조건을 지정   
    ```js
    arr.findIndex(o => o.id ===5)
    ```
- `find()` : 요소 자체 반환
- `some()` : 요소 존재 유무 반환(찾으면 검색 멈춤)
- `every()` : 모든 요소가 조건에 맞는지 여부 반환(조건에 맞지 않는 요소를 찾으면 검색 멈춤)

## map과 filter
- map : 배열의 각 요소를 변형
    ```js
    const cart = [{name: "Widget", price: 9.95},{name: "Gadget", price: 22.95}];
    const names = cart.map(x => x.name);           //["Widget", "Gadger"]
    const prices = cart.map(x => x.price);          //[9.95, 22.95]
    const discountPrices = cart.map(x => x * 0.8); //[7.96, 18.36]
    ```

- filter : 필요한 것들만 남김 (`cart.filter( c => c.name ==="Widget"`)

## reduce
배열 자체를 변형한다.   
첫 번째 매개변수는 배열이 줄어드는 대상, 두 번째 매개변수부터는 콜백 순서대로 현재 배열 요소, 현재 인덱스, 배열 자체   
```js
//배열의 숫자 더하기
const arr = [5,7,2,4];
const sum = arr.reduce((a,x) => a += x,0); //18
const sum = arr.reduce((a,x) => a += x); //첫 번째 요소를 초기값으로
```

```js
const words = ["Beachball", "Rodeo", "Angel", 
    "Aardvark", "Xylophone", "November", "Chocolate", 
    "Papaya", "Uniform", "Joker", "Clover", "Bali"];

//첫 번째 글자인 프로퍼티 확인 후 없으면 빈 배열 만들고 추가후 반환
const alphabetical = words.reduce((a,x) => {
    if(!a[x[0]]) 
        a[x[0]] = [];

    a[x[0]].push(x);
    return a;
}, {});.
// A: ['Angel', 'Aardvark']
// B: ['Beachball', 'Bali']
// C: ['Chocolate', 'Clover']
// J: ['Joker']
// N: ['November']
// P: ['Papaya']
// R: ['Rodeo']
// U: ['Uniform']
// X: ['Xylophone']
```

## 문자열 병합
`Array.prototype.join` : 매개변수로 구분자 하나를 받고 요소들을 하나로 합친 문자열 반환(생략시 쉼표)
```js
const arr = [1,null,"hello","world",true,undefined];
delete arr[3];
arr.join();     //"1,,hello,,true,"
``` 