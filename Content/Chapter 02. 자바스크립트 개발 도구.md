# Chapter 02. 자바스크립트 개발 도구
- **노드(Node)** : 브라우저 밖에서 자바스크립트를 실행할 수 있게 하는 도구.   
노드와 함께 설치되는 npm은 이 리스트의 다른 도구를 설치할 때 필요
- **걸프(Gulp)** : 반복적인 개발 작업을 자동화하는 빌드 도구. (그런트(Grunt)도 널리 쓰임)
- **바벨(Babel)** : ES6코드를 ES5코드로 변환하는 트랜스 컴파일러
- **ES린트(ESLint)** : 자주 하는 실수를 피하고 더 나은 프로그래머가 되도록 돕는 린트 프로그램

### 프로젝트 구조
```md
# Git
.git
.gitignore

# npm
package.json
node_modules

# node source
es6
dist

# browser source
public/
    es6/
    dist/
```

## 트랜스컴파일러
바벨과 트레이서가 있다.
```js
//.barbelrc 파일 생성 (바벨 사용 시 ES6 사용 인식)
{"presets" : ["es2015"]}
```

### 바벨을 걸프와 사용
`es6, public/es6`의 코드를 ES5 코드로 변환해 `dist, public/dist`에 저장   
```js
//gulpfile.js 수정
const gulp = require('gulp');
const babel = require("gulp-babel");

gulp.task('default', function() {
    //노드 소스
    gulp.src("es6/**/*.js")         //변환할 파일 저장
        .pipe(babel())              //ES6 -> ES5
        .pipe(gulp.dest("dist"));   //ES5 코드 dist에 저장
    
    //브라우저 소스
    gulp.src("public/es6/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});
```
걸프는 파이프라인 개념으로 작업을 처리한다.   
걸프는 소스 파일 이름과 디렉터리 구조를 그대로 유지한다. (`es6/a.js` -> `dist/a.js`)
```js
//es6/test.js
'use strict';

//es6 기능: 블록 스코프 변수 선언
const sentens = [
    {subject: 'Javascript', vert: 'is', object:'great'},
    {subject: 'Elephants', vert: 'are', object:'large'},
]

//es6 기능: 객체 분해
function say({subject, vert, object}){
    //es6 기능: 템플릿 문자열(백틱)
    console.log(`${subject} ${vert} ${object}`);
}

for(let s of sentens){
    say(s);
}
```
작성 후 gulp 명령을 내리면 dist와 public/dist에 es5로 변환된 파일이 생성된다.

## 린트
ESLinttkdyd   
자주 일어나는 실수를 알려준다.   
실행 방법은 `eslint es6/test.js`로 직접 실행, 에디터에 통합, Gulpfile에 추가할 수 있다.
```js
//gulpfile.js 수정
...
const eslint = require('gulp-eslint');

gulp.task('default', function() {
    //추가 ESLint 실행
    gulp.src(["es6/**/*.js", "public/es6/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format());
    ...
}
```
이후 걸프를 실행하면 코드를 지적해준다.

## 요약
- 걸프, 그런트 역할 : css최적화, 자바스크립트 난독화, 웹팩의 하위호환(웹팩은 하나의 파일로 번들링 시켜줌 - module bundler)
- 에버그린 : 자동 업데이트 브라우저
- `—save`, `—save-dev` 플래그 사용의 이유 : package.json 파일에 등록됨. -> yarn을 쓰자

### 개발 컴퓨터 준비
- 깃 설치
- Gulp 설치 (`npm install -g gulp`)
- ESLint 설치 (`npm install -g eslint`)

### 새로운 프로젝트 시작시 준비
- 프로젝트에 사용할 전용 디렉터리를 프로젝트 루트라고 부름
- 깃 저장소
- package.json 파일(`npm init`)
- Gulpfile
- 걸프와 바벨의 로컬 패키지.   
`npm install --save-dev gulp gulp-babel babel-preset-es2015`
- .babelrc 파일. (`{"presets": ["es2015"]}`)
- .eslintrc 파일. (`eslinit --init`으로 만들고 수정)
- 노드 소스용 서브 디렉터리 (es6)
- 브라우저 소스용 서브 디렉터리 (public/es6)

### 작업순서   
1. 코드를 수정할 때는 논리적으로 일관되게 수정한다
2. gulp를 실행해서 코드에 존재하는 실수와 잠재적 오류를 찾는다
3. 수정한 내용이 잘 동작하고 린트 프로그램에서 지적하는 것이 없을 때까지 반복
4. git status 명령을 써서 원하지 않는 파일이 커밋되지 않는지 확인.   
git에서 추적하지 말아야 할 파일이 있다면 .gitignore 파일에 추가
5. git add -A 명령으로 바꾼 내용을 저장소에 추가. 한꺼번에 추가하지 않으려면 git add 명령을 파일마다 내리기
6. git commit -m "[desciription of your changes]" 명령으로 커밋

노드에서 실행할 파일(example.js)은 es6폴더에 저장한 후
```
$ gulp
$ node dist/example.js
```
실행   
걸프 명령을 생략하고 babel-node로 실행해도 된다. babel-node도 트랜스컴파일 과정을 거침
```
$ babel-node es6/example.js
```