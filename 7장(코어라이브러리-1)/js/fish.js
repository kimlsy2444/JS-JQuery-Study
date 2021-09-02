   // 전역변수 선언과 동시에 초기화
   var $score = null;
   var $fish =null;
   var play = false; // 플래그 변수
   var cnt = 0;
   var timerID = 0;

   $(document).ready(function(){
       // 요소 초기화
       init();
       // 이벤트
       initEvent();
   });
   // 전역에서 사용할 요소를 찾아오기
   function init(){
       $score = $("#score");
       $fish = $("#fish");
   }
   // 이벤트 등록하기
   function initEvent(){
       // 버튼을 누루면 게임시작
       $("#start").click(function(){
           startGame();
       });
       // 물고기 클릭을 하면 점수가 증가
       $("#fish").click(function(){
            addScore();
       });
   }
   //startGame()구현
   function startGame(){
       // 플래그 변수로 false일 때, 게임을 시작할 수 있게끔 만든다.
       if(play == false){
           //게임이 종료가 되었는지 체크하는 함수 호출
           checkEndgame();
           play= true;
           timerID = setInterval(function(){
               moveFish();
           },1000);
       }
   }
   // 점수를 증가시키는 addScore()구현
   function addScore(){
       if(play == true){
           cnt++;
           $score.html(cnt);
       }
   }
   // 물고기 움직임 moveFish()구현 함수 
   function moveFish(){
       // 물고기 크기 120*70
       // 패널 크기 600*400
       // 물고기의 X이동 영역 0~480 600 - 120
       // 물고기의 Y이동 영역 0~330 400 - 70
       var x  = parseInt(Math.random()*480);
       var y  = parseInt(Math.random()*330);

       $fish.css({
           left : x,
           top : y
        });
   }
   function checkEndgame(){
       // 게임이 5초뒤에 종료가 되게끔 한다.
       setTimeout(function(){
           play = false;
           // 물고기 움직이는 타이머 제거 한번만 실행되야 되니
           clearInterval(timerID);
           alert("게임 종료")
       },8000);
   }