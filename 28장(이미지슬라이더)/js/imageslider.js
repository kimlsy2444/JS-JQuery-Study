// ImageSlider클래스 정의하기(설계)

function ImageSlider(selector){
    this.$imageSilder = null;
    this.$images = null;

    // 현재 인덱스 저장변수
    // -1로 시작하는 이유는 배열의 인덱스가 0부터 시작하기 떄문이다.
    this.currentIndex = -1;

    // 이미지의 너비는 이미지가 이전, 다음 버튼을 클릭 했을 때, 활성화/ 비활성화에 사용되는 프로퍼티 이다.
    this.imageWidth = 0;


    // a엘러먼트를 저장할 프로퍼티 초기화
    this.$indexItems = null;

    // 초기화 메서드 호출
    this.init(selector);
    // 이미지 초기화 메서드 호출
    this.initImages();
    // 이벤트 등록 메서드 호출
    this.initEvent();
    // 0번재 인덱스 이미지 활성화(출력하기) 메서드 호출
    this.showImageAt(0);
}

ImageSlider.prototype.init = function(selector){
    this.$imageSilder = $(selector);
    // 5개의 이미지가 배열 형태로 $images에 저장이 된다.
    this.$images = this.$imageSilder.find(".image-list img");
    
    // 이미지 슬라이더의 너비를 구하는 코드
    // 이미지 너비는 이미지를 활성화/비활성화에 사용이 될 것임.
    this.imageWidth = this.$imageSilder.find(".slider-body").width();    

    // 인덱스 메뉴 아이템 a엘러먼트를 5개를 찾아서 배열 형태로 저장하는 코드
    this.$indexItems = this.$imageSilder.find(".index-nav li a");
}

// 이미지 요소 초기화 initImages()를 선언 및 구현 
ImageSlider.prototype.initImages = function(){
    this.$images.each(function(){
        $(this).css({
            opacity : 0.0
        });
    });
}
//이벤트 처리 메서드 initEvent()를 선언 및 구현
ImageSlider.prototype.initEvent= function(){
    var objThis = this;
    // 이전 < 이미지 클릭 이벤트 들록 코드
    this.$imageSilder.find(".slider-btn-prev").on("click",function(){
        // 이전 이미지 출력하는 메서드 호출
        objThis.prevImage();
    });
    // 다음 > 이미지 클릭 이벤트 등록 코드
    this.$imageSilder.find(".slider-btn-next").on("click",function(){
        // 다음 이미지 출력하는 메서드 호출
        objThis.nextImage();
    });
      // 인덱스 메뉴 아이템의mouseenter이벤트를 등록하는 코드
    this.$indexItems.on("mouseenter",function(){
        // slider-body부분 중에 인덱스 메뉴 아이템에 마우스 엔터를 하게 되는 곳이 바로 this가 
        // 되어 해당하는 인덱스값을 구하는 코드
        var index = objThis.$indexItems.index(this);
        // console.log("currentIndex index 값 :" + objThis.currentIndex);
        // console.log("mouseenter Event 발생 index 값 :" + index);

        // 기존 선택 메뉴 아이템의 인덱스와 신규 선택 아이템 비교 방향 알아내는 코드
        
        if(objThis.currentIndex > index){
            objThis.showImageAt(index ,"prev");
        }
        else{
            objThis.showImageAt(index ,"next");
        }
    });
}

// 이전 이미지를 출력하는 prevImage()를 선언 및 구현
ImageSlider.prototype.prevImage = function(){

    // this.showImageAt(this.currentIndex - 1);
    // 이미지를 이전 출력 효과(애니메이션 기능)를 보이기 위해서 매개변수로 prev값을 넘기고있다.
    this.showImageAt(this.currentIndex - 1,"prev");
}

// 다음 이미지를 출력하는 nextImage()를 선언 및 구현
ImageSlider.prototype.nextImage = function(){
    // this.showImageAt(this.currentIndex + 1);
    // 이미지를 다음 출력 효과(애니메이션 기능)를 보이기 위해서 매개변수로 next값을 넘기고있다.
    this.showImageAt(this.currentIndex + 1,"next");
}


// 인데스를 매게변수로 받아서 해당 이미지를 출력하는 showImageAt(index)를 선언 및 구현
ImageSlider.prototype.showImageAt = function(index, direction){
    // 인덱스 값을 구하는 코드
    if(index < 0){ // 인덱스가 -음수 라면
        index = this.$images.length -1; // 인덱스가 4로 만드는 코드
    }
    if(index >= this.$images.length){ // 인덱스가 $images의 길이와 5와 같거나 크다면
        index = 0;
    }

    // 인덱스 테스트
    // console.log("현재 인덱스 : "+ this.currentIndex + "새로운 인덱스 : "+ index);

    // 인덱스 값에 해당하는 이미지 요소 구하는 코드
    var $currentImage = this.$images.eq(this.currentIndex);
    // 새로운 인덱스 값에 해당하는 이미지 요소 구하는 코드
    var $newImage =this.$images.eq(index);

    // 현재 이미지는 비활성화,
    // $currentImage.css({
    //     opacity : 0.0
    // });

    // 신규 이미지는 활성화
    // $newImage.css({
    //     left : 0,
    //     opacity : 1.0
    // });

    if(direction == "prev" || direction =="next"){
        // currentEndLeft값은 780으로 설정함
        var currentEndLeft = this.imageWidth;
        // currentStartLeft값은 -780으로 설정함
        var nextStartLeft = -this.imageWidth;
        // 다음 이미지를 눌렀을때
        if(direction == "next"){
            currentEndLeft = -this.imageWidth; // -780
            nextStartLeft = this.imageWidth;    //  780
        }
        // 현재 이미지를 비활성화 애니메이션 기능을 하는 코드
        $currentImage.stop().animate({
            left : currentEndLeft,
            opacity : 0
        }, 3000,"easeOutQuint");
        // 신규 이미지 활성화 전 애니메이션 위치 설정 코드
        $newImage.css({
            left : nextStartLeft,
            opacity : 0.0
        })

        // 신규 이미지 활성화 애니메이션 적용
        $newImage.stop().animate({
            left :0,
            opacity : 1.0
        },3000, "easeOutQuint");
    }
    else{ // direction값이 없거나 
        $currentImage.css({
            opacity : 0
        });

        $newImage.css({
            left : 0,
            opacity : 1.0
        });
    }
    // 현재 인덱스와 동일한 인덱스 아이템 선택
    this.selectIndexAt(index);
    // 현재 이미지 엔덱스 값을 새로운 이미지 값으로 저장하는 코드
    this.currentIndex = index;
}    
// 인덱스에 해당하는 메뉴 아이템을 선택 상태로 만드는 메서드를 정의 및 구현
ImageSlider.prototype.selectIndexAt = function(index){
    // 기존 선택 인덱스메뉴 아이템이 존재한다면 ...select선택자를 제거하는 코드
    if(this.currentIndex != -1){
        this.$indexItems.eq(this.currentIndex).removeClass("select");
    }
    // 신규 이미지의 인덱스 값에 select 선택자를 추가하는 코드
        this.$indexItems.eq(index).addClass("select");
    
}
