//AccordionMenu 클래스 정의
function FolderAccordionMenu(selector) {
    console.log("생성자");
    //프로퍼티 선언과 동시에 초기화
    this.$accodionMenu = null;
    this.$mainMenuItems = null;

    //초기화 메서드 호출
    this.init(selector);
    //서브 메뉴 패널 열고 닫히는 기능을 하는 메서드
    this.initSubMenuPanel();
}

//init() 정의
FolderAccordionMenu.prototype.init = function(selector) {
    this.$accodionMenu = $(selector);
    this.$mainMenuItems = this.$accodionMenu.children("li");
}
//서브 패널 초기화 - 초기 시작시에는 닫힌 상태로 만들기
FolderAccordionMenu.prototype.initSubMenuPanel = function() {
    var objThis = this;
    var i = 0;
    this.$mainMenuItems.each(function(index){        
        var $item = $(this);
        var $subMenu = $item.find(".sub")
        
        //서브메뉴가 없는 경우
        if($subMenu.length == 0) {
            //attr()는 객체의 속성을 정의 메서드이고, 여기서는 사용자 정의 속성인 
            //"data-extension"추가하면서 그 값을 "empty"로 설정함.
            //data-extension의 값이 empty가 된다.
            $item.attr("data-extension", "empty");
            objThis.setFolderState($item, "empty");
        }
        else {  //서브 메뉴가 존재하는 경우라면...
            if($item.attr("data-extension") == "open") {
                objThis.setFolderState($item, "open");
            }
            else {
                $item.attr("data-extension","close") 
                objThis.setFolderState($item, "close");                
            }
        }
        i++;
        console.log("i값 : " + i);
    });
}

//폴더 상태 설정 메서드 정의 
FolderAccordionMenu.prototype.setFolderState = function($item, state) {
    var $folder = $item.find(".main-title .folder");
    $folder.removeClass();
    $folder.addClass("folder " + state);
}