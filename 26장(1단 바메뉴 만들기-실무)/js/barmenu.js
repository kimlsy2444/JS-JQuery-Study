//barMenu 플러그인 만들기
(function($){
    $.fn.barMenu = function() {
        var i = 0;
        this.each(function(index){
           
            //선택자에 해당하는 요소 개수만큼 BarMenu인스턴스를 생성
            var barMenu = new BarMenu(this);   
            //멀티바를 생성하기 위해서 data()를 이용하여 barMenu의 값을 가져온다.        
            $(this).data("barMenu", barMenu);
            i++;
            console.log("i값 : " + i);
        });
        //jQuery 체인이 형성될 수 있게 선택자에 해당하는 자바스크립트 DOM요소를 감싸고 있는
        //jQuery 인스턴스를 나타내고 있는 this를 리턴해준다.
        return this;  
    }    
})(jQuery);



//BarMenu클래스 만들기
function BarMenu(selector) {
    //프로퍼티 생성하기
    this.$barMenu = null;   //외부에서 접근 가능하게끔 public성질을 가지게 한다.
    this._$menuBody = null;
    this._$menuItems = null;
    this._$overItem = null;     //오버 메뉴아이템 저장 변수
    this._$bar = null;
    this._$selectItem = null;   //선택 메뉴아이템 저장 변수
    //요소 초기화 메서드 호출
    //매개변수 값으로 BarMenu클래스의 인스턴스를 여러 개 있다면 id선택자를 주게 되면
    //독립적인 저장공간을 가지는 인스턴스가 생성이 되도록 한다.
    this._init(selector);
    //이벤트 초기화 및 등록
    this._initEvent();
}

//요소 초기화 메서드 정의
//각각의 태그 요소들을 다 찾아와서 프로퍼티에 담는 코드
BarMenu.prototype._init = function(selector) {
    //console.log("init()호출됨");
    //매개변수로 넘어오는 "#barMenu1"의 DOM요소를 찾아서 $barMenu변수에게 저장한다.
    // this.$barMenu = $(selector);
    // this._$menuBody = this.$barMenu.find(".menu-body");
    // this._$menuItems = this._$menuBody.find("li");
    // this._$bar = this.$barMenu.find(".bar");
    this.$barMenu = $(selector);
    
    console.log(this.$barMenu);
    this._$menuBody = this.$barMenu.find(".menu-body");
    this._$menuItems = this._$menuBody.find("li");
    this._$bar = this.$barMenu.find(".bar");
}
//이벤트 초기화 및 등록 메서드 정의
BarMenu.prototype._initEvent = function() {
    //console.log("initEvent()호출됨");

    var objThis = this;

    //오버 메뉴효과 이벤트 처리하는 코드
    this._$menuItems.mouseenter(function(e){
        //아웃상태 -> 오버상태로 변경함.
        objThis._setOverMenuItem($(this));
    });
    //메뉴 영역에서 마우스가 나간 경우를 처리하는 코드
    this.$barMenu.mouseleave(function(e){
        //기존 오버 메뉴아이템이 있는 경우 회색 색상을 제거하는 코드
        //오버상태 -> 아웃상태로 변경함.
        objThis._removeOverItem();

        //기존 선택 메뉴가 있다면, 바도 같이 존재해야 하므로 
        //reSelectMenuItem()메서드를 호출한다.
        objThis._reSelectMenuItem();
    });
    
    //선택 메뉴아이템 처리코드
    this._$menuItems.click(function(e){
        //기본 오버 메뉴아이템이 있는 경우 제거
        objThis._removeOverItem();
        //선택 메뉴아이템을 처리(오버상태 -> 선택상태)
        objThis.setSelectMenuItem($(this));  //setter의 성질을 지니고 있기에 public으로 설정
    });

}

//오버 메뉴아이템 처리하는 메서드 정의
BarMenu.prototype._setOverMenuItem = function($item){
    //기존 오버 메뉴아이템에서 over스타일 제거하는 코드
    if(this._$overItem) {
        this._$overItem.removeClass("over");
    }

    //신규 오버 메뉴아이템 처리 부분
    //this.$overItem = $item;
    //this.$overItem.addClass("over");

    //신규 오버 메뉴아이템이 선택 메뉴아이템과 같지 않은 경우에만 오버 메뉴아이템
    //의 스타일을 적용을 해야 한다.
    var selectIndex = -1;
    //선택 메뉴아이템이 존재한다면....
    if(this._$selectItem != null) {  
        //선택 메뉴 아이템의 인덱스를 구하는 코드
        selectIndex = this._$selectItem.index();
        //console.log("selectItem인덱스 : " + selectIndex + ", over된 메뉴아이템 인덱스 : " + $item.index());
    }
    //신규 오버메뉴 아이템의 인덱스 값과 선택 메뉴아이템의 인덱스 값을 비교 코드
    //인덱스의 값이 틀리다면....오버효과를 처리해야한다.
    if($item.index() != selectIndex) {
        this._$overItem = $item;
        this._$overItem.addClass("over");
    }
    //인덱스의 값이 같다면.....오버효과를 제거한다.
    else {
        this._$overItem = null;
    }
    //바 이동 메서드 호출
    this._moveBar($item);
}

//오버 메뉴아이템을 제거하는 메서드 정의
BarMenu.prototype._removeOverItem = function() {
    //기존 오버 메뉴아이템이 있다면 over를 제거하는 코드
    if(this._$overItem) {
        this._$overItem.removeClass("over");
    }
    //또 다른 오버 메뉴아이템을 담기 위해서 $overItem을 null로 바꾸어 주도록 한다.
    this._$overItem = null;

    //바 이동 메서드를 호출하는데 이 메서드는 바를 사라지게 만드는 메서드이다.
    this._moveBar(null);
}

//마우스 커서가 다른 메뉴아이템으로 이동했을 때, 바가 같이 따라 움직이는 메서드 정의
BarMenu.prototype._moveBar = function($item, animaition) {
    //지역변수 선언(위치를 저장할 변수)
    var left = -100;
    var width = 0;

    //매개변수로 넘어온 값이 null아니라면....(다른 메뉴아이템으로 마우스가 옮겨간 상태)
    if($item != null) {
        //바가 이동할 위치의 값을 구하는 코드
        left = $item.position(true).left + parseInt($item.css("margin-left"));  //x좌표값
        //엘러먼트(요소)의 마진을 제외한 넓이를 구하는 메서드가 outWidth()이다.
        width = $item.outerWidth();
        //console.log("x좌표 : " + left + ", y좌표 : " + $item.position().top + ", 너비(width)값 : " + width );
    }

    //애니메이션 처리로 바 이동하는 코드(이징 함수 사용)
    // this.$bar.stop().animate({
    //     "left" : left,
    //     "width" : width
    // },500, "easeOutQuint");

    if(animaition == false) {
        //애니메이션 없이 바로 바를 메뉴아이템 아래로 이동
        this._$bar.css({
            "left" : left,
            "width" : width
        });
    }
    else {
        //애니메이션을 이용해서 바를 메뉴아이템 아래로 이동
        this._$bar.stop().animate({
            "left" : left,
            "width" : width
        }, 500, "easeOutQuint");
    }
}

//선택 메뉴아이템 처리하는 코드 
BarMenu.prototype.setSelectMenuItem = function($item, animaition) {
    //$oldItem변수에 현재 선택되어진 메뉴아이템을 저장하는 코드
    var $oldItem = this._$selectItem;

    //선택 메뉴아이템 스타일 처리하는 코드
    if(this._$selectItem) {
        this._$selectItem.removeClass("select");
    }
    //신규 선택아이템을 처리하는 코드
    this._$selectItem = $item;
    this._$selectItem.addClass("select");

    //바 이동
    this._moveBar($item, animaition);

    //이벤트 발생 코드
    this._dispatchSelectEvent($oldItem, $item);

}

//마우스 포인터가 메뉴영역 밖으로 나갔을 때, 바도 선택아이템 아래에 같이 
//존재하는 메서드 정의
BarMenu.prototype._reSelectMenuItem = function(){
    //선택된 메뉴아이템이 있다면....바도 같이 존재하게 만드는 코드
    if(this._$selectItem) {
        this._moveBar(this._$selectItem);
    }
}

//시작시 인덱스를 정하여 선택된 메뉴아이템을 보여주는 메서드
BarMenu.prototype.setSelectMenuItemAt = function(index, animation) {
    this.setSelectMenuItem(this._$menuItems.eq(index), animation);
}

BarMenu.prototype._dispatchSelectEvent = function($oldItem, $newItem) {
    //jQuery의 Event()유틸리티를 이용해 select라는 사용자 정의 이벤트를 생성하는 코드
    var event = jQuery.Event("select");
    //매개변수값으로 들어온 $oldItem, $newItem의 정보를 event객체에 저장하는 코드
    event.$oldItem = $oldItem;  //이전 인덱스
    event.$newItem = $newItem;  //신규 인덱스

    //trigger(event)를 이용하여 이벤트를 발생시켜 외부로 알리고 있다.
    //아래 코드에서 주의깊게 이해해야 하는 내용은 이벤트 발생 시 1단 바메뉴 영역(#barMenu1)이
    //담긴 jQuery객체를 이용했다. 즉, 다시말해서 #barMenu1에서 이벤트를 발생하기 때문에
    //이벤트를 받는 곳도 #barMenu1이 된다.하여 html파일에 #barMenu1에 이벤트 리스너를 등록을
    //한 것이다.
    this.$barMenu.trigger(event);
}