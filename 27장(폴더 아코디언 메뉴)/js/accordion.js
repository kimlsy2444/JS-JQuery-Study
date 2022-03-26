//folderAccordionMenu플러그인 만들기
(function($){
    //var i = 0;
    $.fn.folderAccordionMenu = function() {
        //내부에는 선택자의 개수만큼 FolderAccordionMenu클래스의 인스턴스를 생성한다.
        this.each(function(index){
            var $this = $(this);
            var menu = new FolderAccordionMenu($this);
            //i++;
            //console.log("i값 : " + i);
        });
        //jQuery체인을 형성하여 jQuery메서드를 호출하게끔 하기 위해서 return this;를 적어준다.
        //여기서 this는 FolderAccordionMenu클래스의 인스턴스를 나타내는 것이다.
        return this;
    }
})(jQuery);

//FolderAccordionMenu 클래스 정의(캡슐화 적용 완료된 클래스)
function FolderAccordionMenu(selector) {
    //console.log("생성자");
    //프로퍼티 선언과 동시에 초기화
    this.$accordionMenu = null;   //public성질을 가진다.
    this._$mainMenuItems = null;

    //서브 메뉴 아이템 선택시 저장할 제이쿼리 변수를 추가선언
    this._$selectSubItem = null;

    //초기화 메서드 호출
    this._init(selector);
    //서브 메뉴 패널 열고 닫히는 기능을 하는 메서드
    this._initSubMenuPanel();
    //이벤트 초기화 메서드 호출
    this._initEvent();
}

//init() 정의
FolderAccordionMenu.prototype._init = function(selector) {
    this.$accordionMenu = $(selector);
    //4개의 li엘러먼트를 $mainMenuItems에 배열 형태로 넘기고 있다.
    this._$mainMenuItems = this.$accordionMenu.children("li");
}
//initEvent() 정의
FolderAccordionMenu.prototype._initEvent = function() {
    //클릭한 부분의 엘러먼트를 저장하는 코드
    var objThis = this;
    //.main-title(메인 메뉴아이템)를 클릭시 이벤트 등록 코드
    this._$mainMenuItems.children(".main-title").click(function(e){
        //$item변수에는 div의 부모요소는 li태그이다.
        var $item = $(this).parent();
    
        //this값이 무엇인지 알아내고 $(this).parent()에 css적용하는 테스트 코드
        // alert(this);
        // $item.css({
        //     border : "5px solid #f00"
        // });
        //토글이란 it용어로 볼때 하나의 설정 값으로부터 다른 값으로 전환하는 것이다.
        //토글이라는 용어는 오직 2가지 상태밖에는 없는 상황에서, 스위치를 한번 누르면 
        //다른 값으로 변하는 것을 의미한다.토글 스위치 2가지 상태만들 가지고 있는 스위치다라고
        //보면 된다.예를 들면 전기 기기들의 전원스위치, 키보드 CapsLock도 토글 스위치의
        //일종이다.
        objThis.toggleSubMenuPanel($item);
    });

    //서브 메뉴아이템의 선택 이벤트 등록하는 코드
    this._$mainMenuItems.find(".sub li").click(function(e){
        objThis._selectSubMenuItem($(this));
    });
}

//서브 패널 초기화 - 초기 시작시에는 닫힌 상태로 만들기
FolderAccordionMenu.prototype._initSubMenuPanel = function() {
    var objThis = this;
    //var i = 0;
    this._$mainMenuItems.each(function(index){        
        var $item = $(this);
        var $subMenu = $item.find(".sub")
        
        //서브메뉴가 없는 경우
        if($subMenu.length == 0) {
            //attr()는 객체의 속성을 정의 메서드이고, 여기서는 사용자 정의 속성인 
            //"data-extension"추가하면서 그 값을 "empty"로 설정함.
            $item.attr("data-extension", "empty");
            objThis._setFolderState($item, "empty");
        }
        else {  //서브 메뉴가 존재하는 경우라면...
            if($item.attr("data-extension") == "open") {
                // objThis._setFolderState($item, "open");
                objThis.openSubMenu($item, false);
            }
            else {
                //$item.attr("data-extension","close") 
                objThis.closeSubMenu($item, false);                
            }
        }
        // i++;
        // console.log("i값 : " + i);
    });
}

//폴더 상태 설정 메서드 정의 
FolderAccordionMenu.prototype._setFolderState = function($item, state) {
    var $folder = $item.find(".main-title .folder");
    $folder.removeClass();
    $folder.addClass("folder " + state);
}

//서브 메뉴 패널 열기 메서드 정의(public)
FolderAccordionMenu.prototype.openSubMenu = function($item, animation) {
    if($item != null) {
        //서브 메뉴 패널을 열기 상태로 만들기 위해서 먼저 메인 메뉴아이템($item)의
        //data-extension값을 open으로 설정하는 코드
        $item.attr("data-extension", "open");

        //호출시 넘어오는 animation값을 알아보기 위한 테스트 코드
        //console.log("open aniamation : " + animation);
        var $subMenu = $item.find(".sub");

        //animation값이 false라면 css()를 활용해 애니메이션 없이 서브 메뉴패널이 열릴 수 있게
        //위치를 설정하는 코드이다.
        if(animation == false) {
            $subMenu.css({
                marginTop : 0
            });
        }
        else { //animation값이 false가 아니라면 true, 혹은 값이 없다(undefined)면 animate()활용해서 
               //서브 패널메뉴가 부드럽게 열리도록 애니메이션 구문을 추가함.
            $subMenu.stop().animate({
                marginTop : 0                
            }, 500, "easeInCubic");
        }
        //폴더를 open상태로 만드는 메서드 호출
        this._setFolderState($item, "open");

        //open이벤트 발생
        this._dispatchOpenCloseEvent($item, "open");
    }
}

//서브 메뉴 패널 닫기 메서드 정의(public)
FolderAccordionMenu.prototype.closeSubMenu = function($item, animation) {
    if($item != null){
        //data-extension속성에 close값을 적용하는 코드
        $item.attr("data-extension", "close");
       
        //호출시 넘어오는 animation값을 알아보기 위한 테스트 코드       
        //console.log("close aniamation : " + animation);
        var $subMenu = $item.find(".sub");
        //outerHeight()는 border를 포함한 높이 구하는 함수.
        //console.log("-$subMenu.outerHeight(true) : " + -$subMenu.outerHeight(true));
        
        var subMenuPanelHeight = -$subMenu.outerHeight(true);
        
        if(animation == false) {
            $subMenu.css({
                marginTop : subMenuPanelHeight
            });
        }
        else {
            //animation값이 false가 아니라면 true, 혹은 값이 없다(undefined)면 animate()활용해서 
            //서브 패널메뉴가 부드럽게 열리도록 애니메이션 구문을 추가함.
            $subMenu.stop().animate({
                marginTop : subMenuPanelHeight
            }, 500, "easeInCubic");
        }
        //폴더를 close상태로 만드는 메서드 호출
        this._setFolderState($item, "close");

        //close 이벤트 발생
        this._dispatchOpenCloseEvent($item, "close");
    }
}
//public 성질을 가지는 메서드
FolderAccordionMenu.prototype.toggleSubMenuPanel = function($item) {
    var extension = $item.attr("data-extension");

    //console.log("data-extension : " + extension);
    //서브 메뉴패널이 없는 경우에....
    if(extension == "empty"){
        return;  //return문을 만나면 메서드 바로 종료가 된다.
    }
    //서브 메뉴 패널이 있는 경우에....
    if(extension == "open"){
        //위의 조건문이 참이라면 반대로 서브 메뉴를 close해야 한다.
        this.closeSubMenu($item);
    }
    else { //extension 값이 close라면...
        this.openSubMenu($item);
    }
}

//인덱스를 이용하여 서브 메뉴 패널을 닫는 메서드 정의
//closeSubMenuAt()는 인스턴스를 생성 후 외부에서 호출하기 때문에 public성질을 띠게끔 구현해야 한다.
FolderAccordionMenu.prototype.closeSubMenuAt = function(index, animation) {
    //index에 해당하는 li엘러먼트를 찾아서 $item변수에 저장하는 코드
    var $item = this.$mainMenuItems.eq(index);
    this.closeSubMenu($item, animation);
}

//인덱스를 이용하여 서브 메뉴 패널을 여는 메서드 정의
//openSubMenuAt()는 인스턴스를 생성 후 외부에서 호출하기 때문에 public성질을 띠게끔 구현해야 한다.
FolderAccordionMenu.prototype.openSubMenuAt = function(index, animation) {
    var $item = this.$mainMenuItems.eq(index);
    this.openSubMenu($item, animation);
}

//서브 메뉴 아이템의 선택 처리 메서드 정의
FolderAccordionMenu.prototype._selectSubMenuItem = function($item) {

    //기존 선택된 서브메뉴 아이템이 있다면 $oldItem에 저장
    var $oldItem = this._$selectSubItem;

    //기존에 선택된 메뉴가 있다면....select선택자를 제거하는 코드
    if(this._$selectSubItem != null) {
        this._$selectSubItem.removeClass("select");
    }
    //서브 메뉴아이템을 선택하면 그 서브 메뉴아이템을 $selectSubItem에 저장하는 코드
    this._$selectSubItem = $item;
    //서브 메뉴아이템을 선택처리하는 코드(배경색이 노란색으로 변경이 일어난다.)
    this._$selectSubItem.addClass("select");

    //select이벤트 발생
    this._dispatchSelectEvent($oldItem, this._$selectSubItem);
}

//외부에서 선택(메인 메뉴아이템, 서브 메뉴아이템, 애니메이션 처리 여부)처리 기능 메서드 정의
//외부에서 접근을 해야하는 메서드이므로 public이라는 성질을 띄게끔 구현해야 된다.
FolderAccordionMenu.prototype.selectMenu = function(mainIndex, subIndex, animation) {
    //호출시에 주어진 메인 인덱스 값의 메인 메뉴아이템을 저장하는 코드
    var $item = this._$mainMenuItems.eq(mainIndex);
    //호출시에 주어진 서브 인덱스 값의 서브 메뉴아이템을 저장하는 코드
    var $subMenuItem = $item.find(".sub li").eq(subIndex);
    //$subMenuItem객체가 존재한다면....
    if($subMenuItem) {
        //서브 메뉴 패널 열기
        this.openSubMenu($item, animation);
        //서브 메뉴 아이템 선택 처리
        this._selectSubMenuItem($subMenuItem);
    }
}

//서브 메뉴 패널이 열리고(open) 닫히는(close) 이벤트를 사용자 정의 이벤트로 만드는 
//메서드를 정의
FolderAccordionMenu.prototype._dispatchOpenCloseEvent = function($item, eventName) {
    //jQuery.Event()를 사용하여 이벤트 발생 기능이 담긴 사용자 정의 이벤트 객체 생성하는 코드
    var event = jQuery.Event(eventName);
    //이벤트가 발생하면 이벤트에 정보를 담는 코드(포장)
    event.$target = $item;
    //화면 메뉴를 전역을 대상을 하여 event를 강제로 발생시키는 코드
    this.$accordionMenu.trigger(event);
}
//서브 메뉴아이템이 선택처리가 될 때, 이벤트가 발생하므로 이것을 사용자 정의 이벤트로 만드는 
//메서드를 정의
FolderAccordionMenu.prototype._dispatchSelectEvent = function($oldItem, $newItem) {
    //jQuery.Event()를 사용하여 이벤트 발생 기능이 담긴 사용자 정의 이벤트 객체 생성하는 코드
    var event = jQuery.Event("select");
    //이벤트가 발생하면 이벤트에 정보를 담는 코드(포장)
    event.$oldItem = $oldItem;
    event.$newItem = $newItem;
    //화면 메뉴를 전역을 대상을 하여 event를 강제로 발생시키는 코드
    this.$accordionMenu.trigger(event);
}