/* -----------------------------------------------------------------------------

Player -  Creative Multipurpose HTML5 Template

File:           JS Core
Version:        1.0
Last change:    21/09/15 
Author:         Suelo

-------------------------------------------------------------------------------- */

'use strict';

var Player = {
    init: function() {

        this.Basic.init();
        this.Components.init();  

    },
    Basic: {
        init: function() {

            var self = this;

            Pace.on('done', function(){
                var bgMusic = $('#bg-music')[0];
                $('#page-loader').fadeOut(300);
                if(bgMusic && $('#bg-music').data('autoplay')==true) { 
                    bgMusic.play();
                    $('a[data-target="bg-music-toggle"]').addClass('playing');
                }
                self.animations();
            });

            self.mobileDetector();
            self.backgrounds();
            self.scroller();
            self.masonry();
            self.ajaxLoader();
            self.mobileNav();
            self.map();
            self.forms();
            self.bgMusic();

        },
        mobileDetector: function () {

            var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
                }
            };

            window.trueMobile = isMobile.any();

            if (trueMobile) {
                $('audio').remove();
            }

        },
        backgrounds: function() {

            // Images 
            $('.bg-image').each(function(){
                var src = $(this).children('img').attr('src');
                $(this).css('background-image','url('+src+')').children('img').hide();
            });

        },
        animations: function() {
            // Animation - hover 
            $('.animated-hover')
                .on('mouseenter', function(){
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().css({
                        '-webkit-animation-duration': duration+'ms',
                        'animation-duration': duration+'ms'
                    }).addClass(animation);
                })
                .on('mouseleave', function(){
                    var $self = $(this);
                    var animation = $(this).data('hover-animation');
                    var duration = $(this).data('hover-animation-duration');
                    $(this).stop().removeAttr('style').removeClass(animation); 
                });

            // Animation - appear 
            $('.animated').appear(function() {
                $(this).each(function(){ 
                    var $target =  $(this);
                    var delay = $(this).data('animation-delay');
                    setTimeout(function() {
                        $target.addClass($target.data('animation')).addClass('visible')
                    }, delay);
                });
            });
        },
        scroller: function() {

            var $header = $('#header');
            var $mobileNav = $('#mobile-nav');
            var $section = $('.section','#content');
            var $body = $('body');
            var $sectionTarget, sectionTargetId, $sectionBefore;
            var headerHeight = $('#header').height();

            var $scrollers = $('#header, #mobile-nav, [data-target="local-scroll"]');
            $scrollers.find('a').on('click', function(){
                sectionTargetId = $(this).attr('href');
            });
            $scrollers.localScroll({
                offset: -headerHeight,
                duration: 800,
                easing: $('#content').data('scroll-easing'),
                onBefore:function(){
                    $sectionBefore = $section
                    if($(sectionTargetId).hasClass('padding-t-bent')) {
                        this.offset = -headerHeight + 240;
                        console.log('scroll to padding-top-bent');
                    } else if ($(sectionTargetId).children('.section-top').length>0) {
                        this.offset = -headerHeight - 90;
                        console.log('scroll to bent top');
                    } else {
                        this.offset = -headerHeight;
                        console.log('scroll to normal');
                    }
                }
            });

            var $menuItem = $('#main-menu li > a, #side-nav li > a');
            var checkMenuItem = function(id) {
                $menuItem.each(function(){
                    var link = $(this).attr('href');
                    if(id==link) $(this).addClass('active');
                    else $(this).removeClass('active');
                });
            }
            $body.waypoint({
                handler: function(direction) {
                    $header.toggleClass('sticky');
                },
                offset: function() {
                    return -$(window).height()/2;
                }
            });
            $body.waypoint({
                handler: function(direction) {
                    $header.toggleClass('visible');
                },
                offset: function() {
                    return -$(window).height()+62;
                }
            });
            $body.waypoint({
                handler: function(direction) {
                    $header.toggleClass('unvisible');
                },
                offset: function() {
                    return -$header.height();
                }
            });
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='up') {
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    return -this.element.clientHeight+62;
                }
            });
            $section.waypoint({
                handler: function(direction) {
                    if(direction=='down') {
                        var id = '#'+this.element.id;
                        checkMenuItem(id);
                    }
                },
                offset: function() {
                    return 62;
                }
            });
            $(window).resize(function(){
                setTimeout(function(){
                    Waypoint.refreshAll()
                },600);
            });
        },
        masonry: function() {

            var $grid = $('.masonry');

            $grid.masonry({
                columnWidth: '.masonry-sizer',
                itemSelector: '.masonry-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });

            $grid.on('layoutComplete', Waypoint.refreshAll());

        },
        ajaxLoader: function() {

            var toLoad;
            var offsetTop;

            var $ajaxLoader = $('#ajax-loader');
            var $ajaxModal = $('#ajax-modal');
            var isAjaxModal = false;

            function showNewContent() {
                $ajaxModal.fadeIn(200, function(){
                    $('html').addClass('locked-scrolling');
                });
            }
            
            function loadContent() {　
               $ajaxModal.load(toLoad);
        　  }
            
            $('a[data-target="ajax-modal"]').on('click', function() {
                isAjaxModal = true;
                offsetTop = $(document).scrollTop();
                toLoad = $(this).attr('href');　
                loadContent();
                return false; 
            });

            $(document).ajaxStart(function() {
                if(isAjaxModal) $ajaxLoader.fadeIn(200);
            });
            $(document).ajaxStop(function() {
                if(isAjaxModal) { 
                    $ajaxLoader.fadeOut(200);
                    showNewContent();
                }
            });

            function closeDetails() {
                isAjaxModal = false;
                $('html').removeClass('locked-scrolling');
                $(document).scrollTop(offsetTop)
                $ajaxModal.fadeOut(200);
            }

            $ajaxModal.delegate('*[data-dismiss="close"]','click', function(){
                closeDetails();
                return false;
            });

        },
        mobileNav: function() {
            $('[data-target="mobile-nav"]').on('click', function(){
                $('body').toggleClass('mobile-nav-open');
                return false;
            });
        },
        map: function() {

            function mapInitialize() {

                var $googleMap = $('#google-map');

                var yourLatitude = $googleMap.data('latitude');   
                var yourLongitude = $googleMap.data('longitude');  
                var pickedStyle = $googleMap.data('style');     
                var dark = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
                var light = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];

                var pickedStyle = $googleMap.data('style');   
                var myOptions = {
                    zoom: 14,
                    center: new google.maps.LatLng(yourLatitude,yourLongitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    panControl: false,
                    zoomControl: true,
                    scaleControl: false,
                    streetViewControl: false,
                    scrollwheel: false,
                    styles: eval(pickedStyle)
                };

                window.map = new google.maps.Map(document.getElementById('google-map'), myOptions);

                var image = 'assets/img/my-location.png';
                var myLatLng = new google.maps.LatLng(yourLatitude,yourLongitude);
                var myLocation = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: image
                });
            
            }
            
            google.maps.event.addDomListener(window, 'load', mapInitialize);

        },
        bgMusic: function() {

            var bgMusic = $('#bg-music')[0];

            if(bgMusic) {

                bgMusic.volume = 0.15;
                $('a[data-target="bg-music-toggle"]').on('click', function(){
                    if(bgMusic.paused) {
                        bgMusic.play();
                        $(this).addClass('playing');
                    }
                    else { 
                        bgMusic.pause();
                        $(this).removeClass('playing');
                    }
                    return false;
                });

            }

            if (trueMobile) $('audio').remove();

        },
        forms: function() {

            var $formAlert, $formError;

            // Basic Form 

            var $basicForm  = $('.basic-form');
            $basicForm.validate({
                errorPlacement: function(error, element) { }
            });
            $basicForm.submit(function() {
                $formAlert = $(this).find('.form-alert');
                $formError = $(this).find('.form-error');
                if(!$basicForm.valid()) $formError.show();
            });

            // Contact Form

            var $contactForm  = $('#contact-form');
    
            $contactForm.validate({
                errorElement: 'span',
                errorContainer: $contactForm.find('.form-error'),
                errorLabelContainer: $contactForm.find('.form-error ul'),
                wrapper: "li",
                rules: {
                    name: {
                        required    : true,
                        minlength   : 2
                    },
                    email: {
                        required    : true,
                        email       : true
                    },
                    message: {
                        required    : true,
                        minlength   : 10
                    }
                },
                messages: {
                    name: {
                        required    : "Please enter your name.",
                        minlength   : "Your name needs to be at least 2 characters"
                    },
                    email: {
                        required    : "Please enter your email address.",
                        minlength   : "You entered an invalid email address."
                    },
                    message: {
                        required    : "Please enter a message.",
                        minlength   : "Your message needs to be at least 10 characters"
                    }
                }
            });
        
            $contactForm.submit(function() {
                var response;
                $formAlert.hide().text();
                if ($contactForm.valid()){
                    $.ajax({
                        type: "POST",
                        url: "assets/php/contact-form.php",
                        data: $(this).serialize(),
                        success: function(msg) {
                            $formAlert = $(this).siblings('.form-alert');
                            $formError = $(this).siblings('.form-error');
                            if (msg === 'SEND') {
                                response = '<div class="alert alert-success">Done! Thank for your message - You will get you an answer as fast as possible!';
                            }
                            else {
                                response = '<div class="alert alert-danger">Ooops... It seems that we have a problem.';
                            }
                            $formAlert.prepend(response);
                            $formAlert.show();
                        }
                     });
                    return false;
                }
                return false;
            });

        }
    },
    Components: {
        init: function() {  

            this.carousel();   
            this.modal(); 
            this.chart();
            this.tooltip(); 
            this.popover();
            this.videoPlayer();

        },
        modal: function() {

            $('.modal').on('show.bs.modal', function () {
                $('body').addClass('modal-opened');
            });

            $('.modal').on('hide.bs.modal', function () {
                $('body').removeClass('modal-opened');
            });

            $('#mapModal').on('shown.bs.modal', function () {
                google.maps.event.trigger(map, 'resize');
            }); 

        },
        chart: function() {

            $('.chart').each(function(){ 

                var size = $(this).data('size');

                $(this)
                    .easyPieChart({
                        barColor: $(this).data('bar-color'),
                        trackColor: $(this).data('track-color'),
                        scaleColor: $(this).data('scale-color'),
                        size: size,
                        lineWidth: $(this).data('line-width'),
                        animate: 1000,
                        onStep: function(from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    })
                    .css({
                        'width': size+'px',
                        'height': size+'px'
                    })
                    .children('.percent').css('line-height',size+'px');

            });

            $('.chart').appear(function() {
                $(this).each(function(){
                    var $chart = $(this);
                    if (!$chart.hasClass('visible')) $chart.addClass('visible');
                    var value = $(this).data('value');
                    setTimeout(function(){
                        $chart.data('easyPieChart').update(value);
                    },200);
                });
            });
        },
        carousel: function() {
            $('.text-slider').slick({
                arrows: false,
                autoplay: true,
                autoplaySpeed: 2000,
                infinite: true,
                speed: 300,
                touchMove: false,
                mouseMove: false
            });
            $('.carousel').owlCarousel({
                items : $(this).data('items'),
                itemsDesktop : $(this).data('items-desktop'),
                itemsDesktopSmall : false,
                itemsTablet : $(this).data('items-tablet'),
                itemsMobile : $(this).data('items-mobile'),
                singleItem : $(this).data('single-item'),
                autoPlay : $(this).data('auto-play'),
                pagination : $(this).data('pagination'),
                stopOnHover: true
            });
        },
        tooltip: function() {
            $("[data-toggle='tooltip']").tooltip();
        },
        popover: function() {
            $("[rel='popover']").popover();
        },
        videoPlayer: function() {
            var $videoPlayer = $('.video-player');
            if($videoPlayer) {
                $videoPlayer.YTPlayer();
            }
            if(trueMobile && $videoPlayer.hasClass('bg-video')) {
                $videoPlayer.prev('.bg-video-placeholder').show();
                $videoPlayer.remove()
            } 
        }
    }
};

$(document).ready(function (){

    Player.init();

});
