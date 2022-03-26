//플러그인 기능 추가
(function($){
    $.fn.tabPanel = function(options) {
        this.each(function(index){
            var tabPanel = new TabPanel(this, options);
        });
        return this;
    }
})(jQuery)

function TabPanel(selector, options){
    //프로퍼티 선언 및 초기화
    this._$tabPanel = null;
    this._$tabMenu = null;
    this._$tabMenuItems = null;
    // 탭메뉴가 선택이 되었을 때 저장하는 변수
    this._$selectTabMenuItem = null;   
    //탭내용의 목록을 배열로 저장할 변수
    this._$tabContents = null;
    //선택된 탭내용 하나만 저장할 변수
    this._$selectTabContent = null;

    //호출하는 효과 객체를 저장할 변수
    this._effect = null;

    //탭영역의 크기를 저장할 변수 
    this._tabContentWidth = -1;
    //외부에서 옵션내용을 지정을 해서 넘기면 그것을 저장하는 변수
    this._options = null;

    //요소 초기화 메서드 호출
    this._init(selector);
    //이벤트 초기화 메서드 호출
    this._initEvent();  
    //옵션의 값을 초기화 하는 메서드 호출
    this._initOptions(options);

    //외부에서 effect값이 매개변수로 넘어오고 있는 것을 가지고 효과 초기화 메서드를 호출    
    //this.initEffect(_effect);

    //모든 탭내용을 화면에 보이지 않게 초기화 하는 메서드를 호출
    this._initTabContents();
    //인덱스 값을 외부에서 받는 options의 값으로 해당 이미지를 출력하는 메서드를 호출
    //매개변수 false가 들어가줌으로써 애니메이션을 실행 유무에 관련된 불린값을 넘기고 있다.
    this.setSelectTabMenuItemAt(this._options.startIndex, false);
}
//요소 초기화 메서드 선언 및 구현
TabPanel.prototype._init = function(selector) {
    this._$tabPanel = $(selector); //전역에서 사용할 탭패널을 jQuery변수에 저장
    this._$tabMenu = this._$tabPanel.children(".tab-menu"); //탭메뉴 영역 부분을 jQuery변수에 저장
    //li엘러먼트들을 $tabMenuItems변수에 배열 형태로 저장하고 있다.
    this._$tabMenuItems = this._$tabMenu.children("li");
    //탭내용 목록을 찾아서 배열로 저장하고 있다.(5개)
    this._$tabContents = this._$tabPanel.find(".tab-contents .content");
    //탭패널이 포함하고 있는 탭내용을 출력하는 영역의 너비값을 구하는 코드
    this._tabContentWidth = this._$tabPanel.find(".tab-contents").width();
}
//옵션 초기화 메서드 선언 및 구현
TabPanel.prototype._initOptions = function(options) {
    //extend()는 다수의 객체를 하나의 객체로 합치는 merge기능을 수행을 하는 메서드이다.
    //만약에 한개 이상의 객체를 하나로 합치려는 경우에 extend()를 사용해서 새로운 객체를 만들 수도
    //있다.만약에 merge대상인 객체가 동일한 프로퍼티를 가지게 되는 경우, 즉 중복되는 프로퍼티의 경우
    //는 외부에서 인스턴스를 만들 때 넘어오는 옵션값으로 덮어쓰게 된다.
    this._options = jQuery.extend({}, TabPanel.defaultOptions, options);
    //효과 클래스를 지정하는 부분
    this._effect = this._options.effect;
    console.log(this._options);
}
//이벤트 초기화 메서드 선언 및 구현
TabPanel.prototype._initEvent = function() {
    //this는 TabPanel을 의미한다.(인스턴스)
    var objThis = this;
    //console.log(objThis);

    this._$tabMenuItems.on("click", function(e){
        //<a>태그의 클릭시 기본 행동 취소시키는 코드
        e.preventDefault();
        //클릭한 탭 메뉴 아이템 활성화
        objThis.setSelectTabMenuItem($(this));
    });
}
//탭 컨텐츠 보이지 않게끔 하는 메서드 선언 및 구현
TabPanel.prototype._initTabContents = function() {
    this._$tabContents.css({
        opacity : 0.0
    });
}
//탭 메뉴 아이템 클릭시 선택처리 메서드 선언 및 구현(pulbic)
TabPanel.prototype.setSelectTabMenuItem = function($item, animation) {
    //기존 선택 탭 메뉴 아이템이 존재한다면...select선택자를 제거하는 코드
    if(this._$selectTabMenuItem != null) {
        this._$selectTabMenuItem.removeClass("select");
    }
    //넘어온 매개변수 $item(클릭된 아이템)을 선택상태로 처리하는 코드
    this._$selectTabMenuItem = $item;
    this._$selectTabMenuItem.addClass("select");
    //console.log("선택 아이템 인덱스 : " + this._$selectTabMenuItem.index());

    //탭메뉴 선택시 탭메뉴에 해당하는 탭내용을 활성화 하기 위해서 선택된 탭메뉴의 인덱스 값을
    //구하는 코드
    var newIndex = this._$tabMenuItems.index(this._$selectTabMenuItem)
    //console.log("newIndex : " + newIndex);
    this._showContentAt(newIndex, animation);
} 
//인덱스에 해당하는 탭메뉴 아이템을 선택을 하여 출력하는 메서드 선언 및 구현(public)
TabPanel.prototype.setSelectTabMenuItemAt = function(index, animation) {    
    this.setSelectTabMenuItem(this._$tabMenuItems.eq(index), animation);
}

//매개변수로 넘어오는 index값에 맞는 탭 내용을 활성화하는 메서드 선언 및 구현
TabPanel.prototype._showContentAt = function(index, animation) {
    //활성화/비활성화 된 탭 내용을 찾는 코드
    var $hideContent = this._$selectTabContent;
    var $showContent = this._$tabContents.eq(index);     

    if(animation == false) {
        TabPanel.normalEffect.effect({
            $hideContent : $hideContent,
            $showContent : $showContent 
        });
    }
    else {
        //this.effect는 매개변수로 넘어오는 객체를 지칭한다.
        //effect는 noramlEffect, slideEffect, fadeEffect가 될 수가 있다.(합성의 개념)
        this._effect.effect({
            $hideContent : $hideContent,
            $showContent : $showContent,
            showIndex : index,
            tabContentWidth : this._tabContentWidth,
            //생성자 호출시 매개변수로 넘어온 options의 값으로 effect()의 duration과 easing
            //함수 부분을 추가적으로 params로 매개변수의 값으로 넘기고 있다.
            duration : this._options.duration,
            easing : this._options.easing
        });
    }
    //선택 탭내용 업데이트하는 코드
    this._$selectTabContent = $showContent;     
}
//효과없음(normalEffect)을 출력효과를 구현한 리터럴 오브젝트 클래스를 추가
TabPanel.normalEffect = {
    //effect(params)를 오버라이딩 함-효과없음
    effect : function(params) {  //params의 매개변수는 객체이다.
        if(params.$hideContent) {
            params.$hideContent.css({
                left : 0,
                opacity : 0.0
            });
        }
        params.$showContent.css({
            left : 0,
            opacity : 1.0
        });
        console.log("TabPanel.normalEffect 리터럴 오브젝트의 오버라이딩 된 effect()호출됨");
    }
}
//슬라이더 효과(slideEffect) 출력효과를 구현한 리터럴 오브젝트 클래스를 추가
TabPanel.slideEffect = {
    //effect(params)를 오버라이딩 함-슬라이더 효과
    effect : function(params){        
        var hideIndex = -1;
        //기존에 선택된 탭내용이 있다면 해당 탭내용의 인덱스를 구하는 코드
        if(params.$hideContent){
            hideIndex= params.$hideContent.index();
        }
        //이동하는 방향 구하는 코드
        var direction = "";
        //현재 선택되어진 인덱스보다 신규 인덱스가 더 클 경우에...
        if(hideIndex < params.showIndex) {
            direction = "next";
        }
        else { //현재 선택되어진 인덱스보다 신규 인덱스가 작은 경우에...
            direction = "prev";
        }
        //이동 위치 구하기(prev가 기본)
        var hideEndLeft = 0;
        var showStartLeft = 0;

        if(direction == "next") {
            //기존 선택된 탭내용이기 때문에 사라져야 하기 때문에 hideEndLeft값을 -760으로 설정
            hideEndLeft = -params.tabContentWidth;  
            //신규 선택된 탭내용이기 때문에 나타나야 하기 때문에 showStartLeft을 +760으로 설정
            showStartLeft = params.tabContentWidth;
        }
        else { //prev의 이동위치는 next의 값의 반대가 되어야 한다.
            hideEndLeft = params.tabContentWidth;  
            showStartLeft = -params.tabContentWidth;
        }
        //기존 탭내용 비활성화
        if(params.$hideContent) {
            params.$hideContent.stop().animate({
                left : hideEndLeft,
                opacity : 0.0
            }, params.duration, params.easing);
        }
        //신규 탭내용의 위치 초기화
        params.$showContent.css({
            left : showStartLeft,
            opacity : 0.0
        });
        //신규 탭 내용에 애니메이션 적용
        params.$showContent.stop().animate({
            left : 0,
            opacity : 1.0
        }, params.duration, params.easing);  
        console.log("TabPanel.slideEffect 리터럴 오브젝트의 오버라이딩 된 effect()호출됨");
    }
}
//페이드 효과(facdeEffect) 출력효과를 구현한 리터럴 오브젝트 클래스를 추가
TabPanel.fadeEffect = {
    //effect(params)를 오버라이딩 함-페이드 효과
    effect : function(params) {
        //기존 선택 탭내용 비활성화 코드
        if(params.$hideContent) {
            params.$hideContent.stop().animate({
                left : 0,
                opacity : 0.0
            }, params.duration, params.easing);
        }
        //신규 탭 내용 활성화 코드
        params.$showContent.stop().animate({
            left : 0,
            opacity : 1.0
        }, params.duration, params.easing);  
        console.log("TabPanel.fadeEffect 리터럴 오브젝트의 오버라이딩 된 effect()호출됨");
    }
}
//기본 옵션 값 설정
TabPanel.defaultOptions = {
    startIndex : 0,    //시작시 보여주는 이미지의 인덱스 값
    easing : "easeInCubic",   //효과처리시 사용할 이징함수 값
    duration : 500,           //효과처리시 걸리는 시간
    effect : TabPanel.slideEffect   //효과처리 클래스 값 지정
}