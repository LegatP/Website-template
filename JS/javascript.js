$(document).ready(function() {
    
    var numberOfSlides = 4;
    var currentSlide = 1;
    var previousSlide = 1;
    
    var slideTitle1 = "Scelerisque dolor";
    var slideTitle2 = "Ultricies";
    var slideTitle3 = "Adipiscing";
    var slideTitle4 = "Amet";
    
    var slideText1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Praesent faucibus metus turpis.";
    var slideText2 = "Nullam eu semper lacus. Nunc ut urna rutrum, tempus elit at, maximus eros.";
    var slideText3 = "Vulputate dictum dolor, id tempus magna elementum quis. Nam non arcu ac tortor commodo ultricies.";
    var slideText4 = "Sed ante velit, scelerisque at massa ac.";    
    
    
    $(".changeSlide").click(function(){
        changeSlide($(this).attr('tag'));
        restartTimer();
    });
  
    var slideTimeOut = setInterval(function(){
        changeSlide("next");
        },4100);
        
    function restartTimer(){
        clearInterval(slideTimeOut);
        slideTimeOut = setInterval(function(){
        changeSlide("next");
        },4100);
    }
  
    function changeSlide(tag){
        $('.changeSlide').attr('disabled', 'disabled');
        

        previousSlide = currentSlide;
        if(tag == "next"){
            currentSlide++;
            if(currentSlide > numberOfSlides){
            currentSlide = 1;
            }
        }else if(tag == "previous"){
            currentSlide--;
            if(currentSlide < 1){
            currentSlide = numberOfSlides;
            }        
        }else{
            currentSlide = parseInt(tag,10);
            
        }
        
        var slideTitle;
        var slideText;

        switch(currentSlide){
            case 1:
                slideTitle = slideTitle1;
                slideText = slideText1;
                break;
            case 2:
                slideTitle = slideTitle2;
                slideText = slideText2;
                break;
            case 3:
                slideTitle = slideTitle3;
                slideText = slideText3;
                break;
            case 4:
                slideTitle = slideTitle4;
                slideText = slideText4;
                break;
        }    
          
          
        $("#slide").html(
                '<img style="z-index:1" src="/slides/slide' + currentSlide + '.jpg" />' +
                '<img style="z-index:2" id="fade" src="/slides/slide' + previousSlide + '.jpg" />'        
            );
         $("#fade").animate({
            opacity:0,
            },1100,function(){
                $(".changeSlide").removeAttr("disabled");
        });
            
         $("#slideLeft").animate({
            opacity:0,
            },100,"linear",function(){
                $("#slideLeft").html(slideTitle);
                $("#slideLeft").animate({
                    opacity:1,
                    },1100
                );
            }
        );
        
         $("#slideRight").animate({
            opacity:0,
            },100,"linear",function(){
                $("#slideRight").html(slideText);
                $("#slideRight").animate({
                    opacity:1,
                    },1100
                );
            }
        );          
        
            
  }
  
});