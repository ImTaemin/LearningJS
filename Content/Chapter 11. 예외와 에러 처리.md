# Chapter 11. 예외와 에러 처리
## Error 객체
내장되어 있음
```js
function validateEmail(email){
    return email.match(/@/) 
        ? email 
        : new Error(`invalid : ${email}`);
}
```

## try/catch 예외 처리
```js
try{
    //내용
} catch(err) {
    console.log(`Error : ${err.message}`);
}
```

## 에러 일으키기
```js
throw new Error("ERROR!");
```

## 에러 처리와 호출 스택
함수 a -> b -> c를 호출한다면 c가 실행 중일 때 a,b는 완료될 수 없음, 완료되지 않은 함수가 쌓이는 것을 **호출 스택**이라 함   

c에서 에러가 일어나면 a,b는 에러가 일어남(캐치될 때까지 호출 스택을 따라 올라감)

Error 인스턴스에는 스택을 문자열료 표현한 `stack` 프로퍼티가 있음
```js
try{
    a();
} catch(err) {
    console.log(err.stack);
}
```

## try...catch...finally
에러가 일어나든 일어나지 않든 반드시 호출