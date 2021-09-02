var mRect = document.querySelector("#rect");

//mouseover 이벤트를 처리하는 부분
mRect.addEventListener("mouseover", function(){
    mRect.style.background = "red"; //mRect요소의 배경색
    mRect.style.borderRadius = "50%";  //mRect요소의 테두리 둥글게 처리
});

//mouseout 이벤트를 처리하는 부분
mRect.addEventListener("mouseout", function(){
    mRect.style.background = ""; //mRect요소의 배경색 지우기
    mRect.style.borderRadius = "";  //mRect요소의 테두리 둥글게 처리 안함
});