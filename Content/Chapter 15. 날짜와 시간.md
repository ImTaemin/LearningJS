# Chapter 15. 날짜와 시간
### 서버에서 날짜 생성
서버에서 날짜를 생성할 때는 UTC를 사용하거나 타임존을 명시하는 편이 좋음.   
```js
//Month는 0부터 시작
const d = new Date(Date.UTC(2016, 4, 27)); //May 27, 2016 UTC
```
특정 타임존에 있는 서버에서 날짜를 생성할 때는 `moment.tz`사용
```js
//toDate()는 Moments.js -> 자바스크립트 Date로 변환
const d = moment.tz([2016, 3, 27, 9, 19], 'America/LosAngeles').toDate();
const d = moment.tz([2016, 3, 27, 9, 19], 'Asia/Seoul').toDate();
```

### 브라우저에서 날짜 생성하기
앱에서 다른 타임존의 날짜를 처리해야 한다면 `moment.js`를 이용해 타임존 변환

## 날짜 데이터 전송
자바스크립트의 Date 인스턴스는 날짜를 저장할 때 UTC를 기준으로 유닉스 타임스탬프를 저장, **Date 객체를 그냥 전송해도 안전**

가장 확실한 방법은 JSON을 사용
```js
const before = {d: new Date()};
before.d instanceof Date    //true
const json = JSON.stringify(before);
const after = JSON.parse(json);
after.d instanceof Date     //false
typeof after.d              //"string"

after.d = new Date(after.d);
after.id instanceof Date    //true
```
JSON으로 바로 날짜를 다룰 순 없지만, 전송된 문자열에서 날짜를 복구하는 것은 가능

## 날짜 형식
```js
const d = new Date(Date.UTC(1930, 4, 10));
//Sat May 10 1930 09:00:00 GMT+0900 (한국 표준시)
//다음 결과는 한국에 사는 사람 기준이다.

d.toLocaleDateString() //"1930. 5. 10."
d.toLocaleTimeString() //"오전 9:00:00"
d.toTimeString() //"09:00:00 GMT+0900 (한국 표준시)"
d.toUTCString() //"Fri, 27 May 2016 00:00:00 GMT"

moment(d).format("YYYY-MM-DD"); //1930-05-10
moment(d).format("YYYY-MM-DD HH:mm"); //1930-05-10 09:00
moment(d).format("YYYY-MM-DD HH:mm Z"); //1930-05-10 09:00 +09:00
moment(d).format("YYYY-MM-DD HH:mm [UTC]Z"); //1930-05-10 09:00 UTC+09:00
moment(d).format("YYYY년 M월 D일 HH:mm"); //1930년 5월 10일 09:00

moment(d).format("dddd, MMMM [the] Do, YYYY"); //Saturday, May the 10th, 1930
moment(d).format("h:mm a"); //"9:00 am" 
```

날짜 비교 : `d1 > d2`
날짜 연산 : `d2 - d1` - 4177404000ms, `(d2-d1)/1000/60/60/24` - 4834.96 days
날짜 정렬 : `Array.prototye.sort`

Moments.js로 날짜 더하기 or 빼기 유용
```js
let m = moment();           //현재
m.add(3, 'days');           //3일 뒤
m.subtract(2, 'years');     //2년 전으로부터 3일 지난 날짜

m.startOf('year');          //올해의 1월 1일
m.endOf('month');           //올해의 1월 31일

//메서드 체인, 3일 전 10시간 뒤인 달의 마지막 날짜
let m = moment().add(10, 'hours').subtract(3, 'days').endOf('month');
```

## 📝 요약
- 자바스크립트의 날짜는 1970년 1월 1일 UTC로부터 몇 밀리초가 지났는지 나타내는 숫자
- 날짜를 생성할 때는 타임존에 유의
- 날짜 형식을 자유롭게 바꿀 수 있어야 한다면 `Moment.js`를 사용