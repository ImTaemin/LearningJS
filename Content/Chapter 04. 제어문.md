# Chapter 04. 제어문

### for...in 루프
**객체의 프로퍼티**에 루프를 실행
```js
//문법
for(변수 in 객체)
    내용

const player = {name: 'Thomas', rank: 'Midshipman', age: 25};
for(let prop in player){
    if(!player.hasOwnProperty(prop))
        continue;
    
    console.log(prop + ": " + player[prop]);
}
//name: Thomas
//rank: Midshipman
//age: 25
```

### for...of 루프
**컬렉션의 요소**에 루프를 실행
```js
//문법
for(변수 of 객체)
    내용

//배열에 루프를 실행함
const hand = [randFace(), randFace(), randFace()];
for(let face of hand)
    console.log(`You rolled...${face}`);

//인덱스를 알아야 하면 for 루프 사용
const hand = [randFace(), randFace(), randFace()];
for(let i=0; i<hand.length; i++)
    console.log(`Rool ${i+1}: ${hand[i]}`);
```

## 유용한 제어문 패턴
- continue문을 사용하여 조건 중첩 줄이기
- break나 return문을 써서 불필요한 연산 줄이기
- 루프를 완료한 뒤 인덱스 값 아용하기
    ```js
    let i=0;
    for(; i<bigArrayOfNumbers.length; i++){
        if(isPrime(bigArrayOfNumbers[i])) 
        break;
    }
    if(i === bigArrayOfNumbers.length) 
        console.log('No Prime numbers!');
    else 
        console.log(`First prime number found at position ${i}`);
    ```
- 배열을 수정할 때 감소하는 인덱스 사용하기
    ```js
    //예상대로 동작하지 않음
    for(let i=0; i<bigArrayOfNumbers.length; i++){
        if(isPrime(bigArrayOfNumbers[i])) 
            bigArrayOfNumbers.splice(i,1);
    }

    // 정상 작동
    for(let i=bigArrayOfNumbers/length-1; i>=0; i--){
        if(isPrime(bigArrayOfNumbers[i])) 
            bigArrayOfNumbers.splice(i,1);
    }
    ```

## 📝 정리
- for ...in은 객체의 프로퍼티를 전체 순회하는것
- for ...of는 객체가 배열과 같은 iterable한 객체여야함
- 배열에 for ...in을 쓰면 배열 자체가 요소 하나로 인식될 수도 있는 문제가 생김.
- for ...in에서 자주 일어나는 에러를 방지하는 함수 : `hasOwnProperty`