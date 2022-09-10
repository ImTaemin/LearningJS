# Chapter 16. Math
Math 객체는 수학 함수를 담고 있음

## 숫자 형식
- 고정 소수점 : `toFixed()`
- 지수 표기법 : `toExponential()`
- 고정 전체 자리수 : `toPrecision()`, 소수점 상관 없이 몇개로 표현하느냐
- 다른 진수 : `toString()`
- 고급 숫자 형식 : 내장 메서드 한계, `Numeral.js` 라이브러리 사용

## 상수
```js
Math.E      //자연로그의 밑수, 2.718~
Math.PI     //원주율, 3.142~

Math.LN2    //2의 자연 로그, 0.693~
Math.LN10   //10의 자연 로그 2.303~
Math.LOG2E  //Math.E의 밑수가 2인 로그, 1.433~
Math.LOG10E //Math.E의 상용 로그, 0.434~

Math.SQRT1_2//1/2의 제곱근, 0.707~
Math.SQRT2  //2의 제곱근, 1.414~
```

## 대수 함수
- `Math.pow()` : 
- `Math.sqrt()` : 제곱근
- `Math.log()` : 로그 함수
- `Math.abs()` : 절대값
- `Math.sign()` : 부호 (음수 -1, 양수 1, 0이면 0)
- `Math.ceil()` : 올림
- `Math.floor()` : 내림
- `Math.trunc()` : x의 버림
- `Math.round()` : 반올림
- `Math.min()` : 최솟값
- `Math.max()` : 최댓값
- `Math.random()` : 난수 생성, 0이상 1미만의 숫자 반환   
    `m+Math.floor((n-m+1)*Math.random())` : m이상 n이하 정수
