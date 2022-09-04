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
바벨, 트레이서   
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