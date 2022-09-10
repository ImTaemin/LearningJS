# Chapter 18. 브라우저의 자바스크립트
## 문서 객체 모델
DOM은 트리 구조로 표현. DOM 트리는 노드로 구성.   
DOM 트리의 모든 노드는 `Node` 클래스의 인스턴스.   
`Node` 객체에는 트리 구조를 나타내는 `parentNode`와 `childNodes` 프로퍼티, 자신에 대한 프로퍼티, `nodeName`과 `nodeType`이 있음.

![DOM 트리](https://velog.velcdn.com/images%2Fcyongchoi%2Fpost%2F30526daa-0f0d-46f7-be94-a12a8fef33e9%2F2nqegt2.png)

모든 노드에는 `nodeType`, `nodeName` 프로퍼티가 있다.   
`nodeType`은 어떤 타입인지 나타내는 정수

### 이벤트 버블링과 캡처링
이벤트를 꼭 한 곳에서만 처리해야 하는 건 아니다.   
자체에서 처리할 수 있지만, 부모에서 처리해도 되고 부모의 부모에서 처리해도 됨.

- 캡처링 : 가장 먼 조상부터 시작하는 방법   
- 버블링 : 이벤트가 일어난 요소에서 시작해 거슬러 올라가는 방법   

이벤트 핸들러에는 다른 핸들러가 어떻게 호출될지 영향을 주는 세 가지 방법이 있다.
- `preventDefault` : 이벤트를 취소, 
- `stopPropagation` : 이벤트를 현재 요소에서 끝내고 더는 전달되지 않게 막음
- `stopImmediatePropagation` : 다른 이벤트 핸들러와 현재 요소에 연결된 이벤트 핸들러도 동작하지 않게 막음

### 이벤트 카테고리
- 드래그 이벤트 : dragStart, drag, dragend, drop 등
- 포커스 이벤트 : focus, blur, change
- 폼 이벤트 : submit
- 입력 장치 이벤트 : 마우스(mousedown, move, mouseup, mouseenter, mouseleave, mouseover, mousewheel), 키보드(keydown, keypress, keyup)
- 미디어 이벤트 : pause, play
- 진행 이벤트 : load, error
- 터치 이벤트 : touches

## Ajax
HTTP 요청을 만들어 서버에 보내고 데이터를 받는다. 받는 데이터는 보통 JSON 형식, XML도 가능
```js
function refreshServerInfo(){
    const req = new XMLHttpRequest();
    req.addEventListener('load', function(){
        const data = JSON.parse(this.responseText);
        const serverInfo = document.querySelector('.serverInfo');
        Object.keys(data).forEach(p => {
            const replacements = serverInfo.querySelectorAll(`[data-replace="${p}"]`);
            for(let r of replacements){
                r.textContent = data[p];
            }
        });
    });
    req.open('GET', 'http://loaclhost:7070', true);
    req.send();
}
refreshServerInfo();
```