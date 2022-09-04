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