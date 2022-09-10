# Chapter 17. 정규표현식
정규표현식은 문자열 매칭 기능   
`RegExp` 클래스

## 정규식 만들기
```js
const re1 = /going/;    //리터럴 문법
const re2 = new RegExp("going")
```

## 정규식 검색
```js
const input = "As I was going to Saint Ives";
const re = /\w{3,}/ig;

input.match(re);    //["was", "going", "Saint", "Ives"]
input.search(re);   //5 (세 글자 이상으로 이뤄진 첫 단어의 인덱스)

re.exec(input); //["was"] 처음 일치, exec는 마지막 위치를 기억함
re.exec(input); //["goin"] 
...
re.test(input); //true (input에 세 글자 이상 단어 한 개 이상)
```

## 정규식으로 문자열 교체
```js
const input = "As I was going to Saint Ives";
const output = input.replace(/\w{4,}/ig, '****');
// As I was **** to **** ****
```

### 정규식이 문자열을 소비할 때 사용하는 알고리즘
- 문자열 왼쪽에서 오른쪽으로 진행
- 일단 소비한 글자에 다시 돌아오는 일은 없음
- 한 번에 한 글자씩 움직이며 일치하는 것이 있는지 확인
- 일치하는 것을 찾으면 해당하는 글자를 한꺼번에 소비 후 다음 글자로 진행(정규식에 /g 플래그를 써서 전역으로 검색할 때 해당)

## 대체
```js
const html = 'HTML with <a href="/one">one link</a>, and some JavaScript. <script src="stuff.js>';
//i 대소문자를 가리지 않고, g는 전체를 검색
const matches = html.match(/area|a|link|script|source/ig);
//['a', 'link', 'a', 'a', 'a', 'a', 'Script', 'script']
```
텍스트에서 `area, a, link, script, source`를 대소문자를 가리지 않고 모두 찾으라는 뜻   
a를 area보다 먼저 썼다면 area는 어느 것에도 일치하지 않음

## HTML 찾기
정규식으로는 HTML을 분석할 수 없음.   
무언가를 분석하려면 각 부분을 구성 요소로 완전히 분해할 수 있어야함
HTML에 유용하게 쓸 수 있지만 완벽하게 분석하는 것은 불가능   
정규식을 어떻게 만들든 분석할 수 없는 HTML이 항상 존재한다.   
100% 동작하는 것이 필요하다면 전용 파서를 찾아야함
```js
const html = '<br> [!CDATA[[<br>]]';
const matches = html.match(/<br>/ig);
```
정규식이 두 번 일치하지만 진짜 `<br>` 태그는 하나뿐.   
다른 하나는 HTML이 아닌 글자데이터(`CDATA`)

## 문자셋
문자셋은 글자 하나를 다른 것으로 대체하는 방법을 간단하게 줄인 것
```js
//문자열에 있는 숫자를 모두 찾기
const beer99 = "99 bottles of beer on the wall take 1 down and pass it around -- 98 bottles of beer on the wall.";
const m1 = beer9.match(/[0123456789]/g);
const m2 = beer9.match(/[0-9]/g);

//문자열에서 글자와 숫자, 기타 구두점 찾기
const match = beer99.match(/[\-0-9a-z.]/ig);

//제외하려면 캐럿(^)을 맨 앞에 쓰면 됨
//문자열에서 공백만 찾음
const match = beer99.match(/[^\-0-9a-z.]/);
```
하이픈은 이스케이프 하지 않으면 범위를 표시하는 메타 문자로 간주함   

## 자주 쓰는 문자셋
자주 쓰이는 일부 문자셋은 단축 표기가 있음. 클래스라고도 부름
|문자셋|동등 표현|노트|
|--|--|--|
|\d|`[0-9]`||
|\D|`[^0-9]`||
|\s|`[ \t\v\n\r]`|탭, 스페이스, 세로 탭, 줄바꿈이 포함|
|\S|`[^ \t\v\n\r]`||
|\w|`[a-zA-Z_]`|하이픈과 마침표는 포함되지 않으므로 도메인 이름이나 CSS 클래스 등을 찾을 수 없음|
|\W|`[^a-zA-Z_]`||   

```js
const stuff = 
'hight:     9\n' +
'medium:    5\n' +
'low:       2\n';
const levels = stuff.match(/:\s*[0-9]/g);
```
`\s` 뒤의 `*`는 숫자는 상관 없으며 없어도 된다는 의미   

```js
//전화번호를 검색하거나 저장하는 목적이라면 10자리 숫자로 통일
const messyPhone = '(505) 555-1515';
const neatPhone = messPhone.replace(/\D/g, '');
```

required 필드(공백이 아닌 글자가 최소한 하나는 있어야 하는 필드)에 데이터가 있는지 검사
```js
const field = '   something   ';
const valid = /\S/.test(field);
```

## 반복
```js
const match = beer99.match(/[0-9]+/);
```
|반복 메타 문자|설명|
|--|--|
|{n}|정확히 n개|
|{n,}|최소 n개|
|{n,m}|n개 이상, m개 이하|
|?|0또는 1개|
|*|숫자는 상관없으며 없어도 됨|
|+|하나 이상|

## 마침표와 이스케이프
정규식에서 마침표는 줄바꿈 문자를 제외한 모든 문자에 일치하는 특수 문자.   
입력이 어떤 문자이든 상관 없이 소비하려 할 때 주로 사용
```js
const match = (/\d \+ \d \*/);
```

## 그룹
그룹을 사용하면 하위 표현식을 만들고 단위 하나로 취급할 수 있다.   
그룹에 일치하는 결과를 나중에 쓸 수 있도록 캡처할 수도 있다.

캡처하지 않는 그룹은 `(?:[subexpression])` 형태, `[subexpression]`이 일치시키려는 패턴   
```js
const text = "Visit oreilly.com today!";
const match = text.match(/[a-z]+(?:\.com|\.org|\.edu)/i);
```
그룹에도 반복 적용 가능

## 소극적 일치, 적극적 일치
정규식은 기본적으로 적극적.   
검색을 멈추기 전에 일치하는 것을 최대한 많이 찾으려고 한다는 뜻

`<i>`를 `<strong>`으로 바꿔야 한다면
```js
const input = "<i>greedy</i>and <i>lazy</i>";
input.replace(/<i>(.*)<\/i>/ig, '<strong>$1</strong>')
//`$1`은 `.*` 그룹에 일치하는 문자열로 바뀜

/*
결과
<strong>greedy</i> and <i>lazy</strong>
*/
```
일치할 가능성이 있는 동안은 문자를 소비하지 않고 넘어감. 이 과정은 적극적으로 진행한다.   
`<i>`를 만나면 `</i>`를 더 찾을 수 없을 때까지 소비하지 않고 진행.   
`</i>`가 두 개 있어, 첫 번째는 무시하고 두 번째에서 일치한다고 판단한다.

`*`뒤에 `?`를 붙이면 소극적으로 검색
```js
input.replace(/<i>(.*?)<\/i>/ig, '<strong>$1</strong>')
```

## 역참조
그룹을 사용하면 역참조라는 테크닉도 쓸 수 있다.   
XYYX 형태의 이름을 찾는다면(ABBA, GOOG)   
서브그룹을 포함해, 정규식의 각 그룹은 숫자를 할당받는다.   
맨 왼쪽이 1번에서 시작 오른쪽으로 갈 수록 1씩 늘어남   
역슬래시 뒤에 숫자를 써 그룹을 참조할 수 있다.
```js
const promo = "Opening for XAAX is the dynamic GOOG! At the box office now!";
const bands = promo.match(/([A-Z])([A-Z)\2\1/g);
```
왼쪽에서 오른쪽으로 읽으면 그룹이 두 개 있고 `\2\2`이 있다.   
첫 번째 그룹이 X에 일치하고 두 번째 그룹이 A에 일치한다면 \2는 A고 \1은 X   

실무에서 역참조 사용은 따옴표의 짝을 맞출 때뿐