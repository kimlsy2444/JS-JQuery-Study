// 함수 calc()선언과 구현을 하고있다.
function calc(){
    var currentYear = 2021; // 올해 년도를 저장을 변수 currentYear에 저장함.
    // 사용자로부터 입력을 받은 값으로 변수 birthYear에 할당함
    var birthYear = prompt("태어난 년도 입력 : ","YYYY");
    // 변수 age를 초기화
    var age = 0;
    // 실제나이를 구하기위한 코드
    age = (currentYear - birthYear) + 1
    // document : 현재 웹브라우저의 페이지를 의미
    // querySelector : id가 result인 웹 요소 (div)를 의미한다
    // innerHTML : 대입한 값을 html문서에 대체한다.
    document.querySelector("#result").innerHTML = 
    "당신의 나이는"+age+"세입니다.";
}