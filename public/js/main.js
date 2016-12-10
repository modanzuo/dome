$(function () {
    var app = {
        $loading: $('.loading'),
        winHeight: 1000,
        currPage: -1,
        friendView: 0,
        isSmall: false,
        countPage: 0,
        nextPage: false,
        prevPage: false,
        $root: null,
        playAction: [],
        jump: function (page) {
            app.targetY = (-(page) * this.winHeight);
            app.$root.find(".main").css({
                "transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transition-duration": "0ms",
                "transition-duration": "0ms"
            });
        },
        scroll: function (page) {
            app.targetY = (-(page) * this.winHeight);
            app.$root.find(".main").css({
                "transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transition-duration": "500ms",
                "transition-duration": "500ms"
            });
        },
        scrollTo: function (y) {
            app.targetY = y;
            app.$root.find(".main").css({
                "transform": "translateY(" + y + "px) translateZ(0px);",
                "-webkit-transform": "translateY(" + y + "px) translateZ(0px);",
                "transition-duration": "500ms",
                "-webkit-transition-duration": "500ms"
            });
        },
        getPage: function (i) {
            return $page = app.$root.find('[data-pageid="' + i + '"]');
        },
        dialog: {
            /**
             * 警告
             * @param msg 提示内容
             * @param callback 回调函数
             */
            alert: function (msg, callback) {
                var $modal = app.$root.find(".alert-modal");
                if ($modal.length == 0) {
                    $modal = $('<div class="alert-modal"><div class="alert"><div class="text">帐号不能为空</div><div class="btn">确定</div> </div></div>');
                    app.$root.append($modal);
                }
                $modal.show().find(".text").html(msg);
                $modal.find(".btn").off("tap").on("tap", function () {
                    $modal.hide();
                    typeof callback == 'function' && callback();
                });
            },
            /**
             * 确认
             * @param msg 提示内容
             * @param callbacks [确认回调,取消回调]
             */
            confirm: function (msg, callbacks) {
                var $modal = app.$root.find(".confirm-modal");
                if ($modal.length == 0) {
                    $modal = $('<div class="confirm-modal"><div class="confirm"> <div class="text">确定操作吗?</div> <div class="operation"><div class="btn-cancel">取消</div> <div class="btn-ok">确定</div> </div> </div></div>');
                    app.$root.append($modal);
                }
                $modal.show().find(".text").html(msg);
                $modal.find(".btn-ok").off("tap").on("tap", function () {
                    $modal.hide();
                    typeof callbacks[0] == 'function' && callbacks[0]();
                });
                $modal.find(".btn-cancel").off("tap").on("tap", function () {
                    $modal.hide();
                    typeof callbacks[1] == 'function' && callbacks[1]();
                });
            }
        },
        loading: {
            $modal: $(".loading-modal"),
            show: function () {
                if (this.$modal.length == 0) {
                    this.$modal = $('<div class="loading-modal modal"><div class="loading"><div class="spinner"><div class="cube1"></div><div class="cube2"></div></div> </div></div>');
                    app.$root.append(this.$modal);
                }
                this.$modal.show();
            },
            hide: function () {
                this.$modal.hide();
            }
        },
        audio: {
            inited: false,
            handler: null,//播放器
            init: function (src, autoplay, loop, preload) {
                var audioPlayer = {
                    inited: false,
                    init: function (src, autoplay, loop, preload) {
                        if (src == undefined)return;
                        this.handler = new Audio();
                        this.handler.autoplay = !!autoplay;
                        this.handler.loop = !!loop;
                        this.handler.preload = !!preload;
                        this.handler.src = src;
                        this.inited = true;
                        var _this = this;
                        if (this.handler.autoplay && this.handler.loop) {
                            var playListener = function () {
                                _this.handler.play();
                                document.body.removeEventListener('touchstart', playListener, false);
                            };
                            document.body.addEventListener('touchstart', playListener, false);
                            _this.handler.addEventListener('canplay', function () {
                                if (!_this.handler.paused) {
                                    document.body.removeEventListener('touchstart', playListener, false);
                                }
                            }, false);
                            //给audio类添加样式
                            this.handler.addEventListener('play', function () {
                                app.$root.find(".audio").addClass("active");


                            }, false);
                            this.handler.addEventListener('pause', function () {
                                app.$root.find(".audio").removeClass("active");

                            }, false);
                        }
                    },
                    toggle: function () {
                        if (!this.inited)return;
                        this.handler.paused ? this.handler.play() : this.handler.pause();
                    },
                    pause: function () {
                        if (!this.inited)return;
                        try {
                            this.handler.pause();
                        } catch (e) {

                        }
                    },
                    play: function () {
                        if (!this.inited)return;
                        try {
                            this.handler.play();

                        } catch (e) {

                        }
                    },
                    stop: function () {
                        if (!this.inited)return;
                        this.handler.pause();
                        try {
                            this.handler.currentTime = 0;
                        } catch (e) {

                        }
                    }
                };
                audioPlayer.init(src, autoplay, loop, preload);
                return audioPlayer;
            }
        },
        play: function (pageId, jump) {
            if (!jump) jump = false;
            //$('.modal').hide();
            var $page = app.getPage(pageId);
            var pageI = $page.index();
            //console.log(pageId);
            if (pageId == this.currPage) {
                app.scroll(pageI);
                return;
            }
            if (!this.playAction[pageId]) {
                return;
            }

            this.cleanAction();
            this.currPage = pageId;
            //window.location.hash = pageId;
            this.playAction[pageId]();
            window.localStorage.setItem('c', pageId);
            if (jump) {
                app.jump(pageI);
            } else {
                app.scroll(pageI);
            }

        }
    };

    app.hideWxMenu = function(){
        app.wxMenu = false;
        app.setWxMenu();
    };
    app.showWxMenu = function(){
        app.wxMenu = true;
        app.setWxMenu();
    };
    app.wxMenu = false;
    app.setWxMenu = function(){
        if(!window.wxReadyed){
            setTimeout(app.setWxMenu, 200);
            return;
        }
        try{
            if(app.wxMenu){
                wx.showOptionMenu();
            }else{
                wx.hideOptionMenu();
            }
        }catch (e){
        }
    };


    app.mouseEvent = function () {
        var swipeRate = 200;
        //鼠标动作
        var lastTouchY = 0;
        var startTouchY = 0;
        app.targetY = 0;
        var touchStartTime = 0;
        app.$root.find('.main').on('touchstart', function (e) {
            if (!app.scrollAble) return;
            e.preventDefault();

            var touch = e.touches[0] || e.changedTouches[0];
            startTouchY = touch.pageY;
            lastTouchY = startTouchY;
            touchStartTime = new Date().getTime();
        }).on('touchmove', function (e) {
            if (!app.scrollAble) return;
            e.preventDefault();
            var _this = $(this);
            var touch = e.touches[0] || e.changedTouches[0];
            var moveY = lastTouchY - touch.pageY;
            if (!lastTouchY) return;
            lastTouchY = touch.pageY;

            //移动阻尼
            var k = 1;
            app.targetY = app.targetY - moveY * k;
            var $page = app.getPage(app.currPage);
            var pageI = $page.index();

            //可自由滚动
            var minH = 0;
            var maxH = -app.winHeight * app.countPage;

            //没有上一页 固定顶部坐标
            if (!app.prevPage) {
                minH = -app.winHeight * (pageI);
            }

            //没有下一页 固定顶部坐标
            if (!app.nextPage) {
                maxH = -(app.winHeight * pageI + (app.winHeight - $(window).height()));
            }

            if (app.targetY > minH) app.targetY = minH;
            if (app.targetY < maxH) app.targetY = maxH;

            _this.css({
                "transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-webkit-transform": "translateY(" + app.targetY + "px) translateZ(0px);",
                "-ms-transition-duration": "0s",
                "-webkit-transition-duration": "0s"
            });
        }).on('touchend', function (e) {
            if (!app.scrollAble) return;
            e.preventDefault();
            var touch = e.touches[0] || e.changedTouches[0];
            if (!lastTouchY) return;

            var _this = $(this);
            var moveY = lastTouchY - touch.pageY;
            app.targetY = app.targetY - moveY;
            if (app.targetY > 0) {
                app.scrollTo(0);
                return;
            }

            var $page = app.getPage(app.currPage);
            var pageI = $page.index();
            var minH = -app.winHeight * (pageI);
            var maxH = -(app.winHeight * pageI + (app.winHeight - $(window).height()));

            //计算拖动高度
            var hideHeight = Math.abs(app.winHeight - $(window).height());

            var touchDistance = startTouchY - touch.pageY;
            var touchDirection = (touchDistance >= 0) ? 'D' : 'U';

            var nowTime = new Date().getTime();
            var fastSwipe = false;
            if (nowTime - touchStartTime < 500) {
                fastSwipe = true;
            }
            if (Math.abs(touchDistance) > $(window).height() / 2 ||
                fastSwipe && Math.abs(touchDistance) > 10
            ) {
                if (touchDirection == 'D' && app.nextPage) app.play(app.nextPage);
                else if (touchDirection == 'U' && app.prevPage) app.play(app.prevPage);
            }
            else if (touchDirection == 'D') {
                if (maxH - app.targetY > swipeRate && app.nextPage) {
                    app.play(app.nextPage);
                } else if (app.targetY < maxH) {
                    app.scrollTo(maxH);
                } else {
                    app.scrollTo(app.targetY);
                }
            } else if (touchDirection == 'U') {
                if (minH - app.targetY < swipeRate && app.prevPage) {
                    app.play(app.prevPage);
                } else if (app.targetY > minH) {
                    app.scrollTo(minH);
                } else {
                    app.scrollTo(app.targetY);
                }
            }
        });

        $('input, textarea').on('touchstart touchmove touchend', function (e) {
            e.stopPropagation();
        });

        //公共事件
        $('.modals [data-action="colse"]').on('tap', function () {
            $('.modals').hide();
        });

    };

    app.resize = function () {
        var winHeight = $(window).height();
        if (winHeight < 700) return;
        app.countPage = app.$root.find('section').length;
        if (winHeight < 1000) {
            app.isSmall = true;
            app.winHeight = 1000;
        } else {
            app.isSmall = false;
            app.winHeight = $(window).height();
        }
        app.$root.find('section').height(app.winHeight);
        app.$root.find('.page-box').height($(window).height());
        app.$root.find('.scroll').height($(window).height());
        app.$root.find('.main').height(app.winHeight * app.countPage);

    };
    app.loadSuccess = function () {
        var p = 'home';
        //if (window.loadedImg && window.loadedUser) {
            $('.unload').removeClass('unload');
            this.$loading.hide();
            var p = 'home';
            if (false && window.debug) {//不是调试模式，加false &&
                p = window.localStorage.getItem('c');
                if (!p || !app.playAction[p]) p = 'home';
            }

            //默认隐藏
            //app.hideWxMenu();
            app.play(p, true);
        //}
    };
    app.loadProgress = function (num, total) {
        this.$loading.find('.text').html(parseInt(num / total * 99) + "%");
    };
    app.cleanAction = function () {
        var $page = app.getPage(this.currPage);
        $page.find('.screen > div').each(function () {
            if ($(this).css('display') != 'none' && $(this).hasClass('animated'))
                $(this).addAni('fadeOut');
        });
        $page.find('.full > div').each(function () {
            if ($(this).css('display') != 'none' && $(this).hasClass('animated'))
                $(this).addAni('fadeOut');
        });
        $page.find('.scroll .animated').each(function () {
            if ($(this).css('display') != 'none' && $(this).hasClass('animated'))
                $(this).addAni('fadeOut');
        });
        for (var i in app.pageTimeout) {
            clearTimeout(app.pageTimeout[i]);
        }
    };

    app.bgShow = function (id) {
        app.$root.find('.page-bg').css('opacity', 1);
        app.$root.find('.page-bg ' + id).css('opacity', 1).siblings().css('opacity', 0);
    };
    app.bgHide = function () {
        app.$root.find('.page-bg').css('opacity', 0);
        app.$root.find('.page-bg > div').css('opacity', 0);
    };

    app.pageTimeout = [];
    app.scrollAble = true;

    app.init = function () {
        app.$root = $('.site-home');
        app.resize();

        var images = [
            "./public/img/up.png",
            "./public/img/share.jpg"
        ];
        loadImg(images, function () {
            if (app.currPage == -1) {
                window.loadedImg = true;
                app.resize();
                app.loadSuccess();
            }
        }, function (num, total) {
            app.loadProgress(num, total);
        });
        //app.loadUser();
        app.mouseEvent();

    };
    window.loadedImg = false;
    window.loadedUser = false;

    app.loadUser = function () {
        $.get(window.apiUrl + "/api/getuser", {}, function (res) {
            if (res.errcode == 0) {
                window.loadedUser = true;
                window.qiniu = res.qiniu;
                window.user = res.user;
                app.codeUrl = res.codeUrl;
                app.codeCount = res.count;
                app.loadSuccess();
                return;
            }
            if (res.errcode == -1) {
                window.location.href = res.url;
            }

        }, 'json');
    };

    app.init();
    window.app = app;

    /**---------您的代码--------**/
    app.playAction['home'] = function () {
        app.scrollAble = true;
        app.nextPage = false;
        app.prevPage = false;
        var $page = $('.page-1');
        $(".up-btn").hide();
        $page.find('*').show();

    };


    //模式1，画布myCanvas和myCanvas3
    app.setCanvasImg = function () {
        app.loading.show();
        if(window.canvas_img){
            app.showDownloadLayout();
            return;
        }
        //canvas合成图片
        var bg = document.getElementById("man_img0817");
        var photoW = 300;
        var photoH = 217;
        var photoX = 220 - 13;//207
        var photoY = 327 + 5;//332
        var zoom = 1.18;

        if (app.myImg.type == 2) {
            bg = document.getElementById("man_img20817");
            photoW = 230;
            photoH = 168;
            photoX = 347 - 15 + 1;//333
            photoY = 286 + 10;//296
            zoom = 1;
        }
        var myCanvas = document.getElementById("myCanvas");
        var uploadimg = myCanvas.getContext('2d');
        uploadimg.drawImage(bg, 0, 0);

        var img = new Image();
        img.crossOrigin = "Anonymous";
        //uploadimg.drawImage(document.getElementsByTagName("img")[5],0,0);

        img.onload = function () {

            //图片居中
            var width = img.width;//360
            var height = img.height;//640
            var scale = 1;
            var marginLeftArr = app.myImg.style.match(/margin\-left\:\s*([0-9\-\.]+)px/);//记录拖动位置，不拖动为空。左右坐标
            var marginTopArr = app.myImg.style.match(/margin\-top\:\s*([0-9\-\.]+)px/);//记录拖动位置，不拖动为空。上下坐标
            var offsetX = 0;
            var offsetY = 0;

            if (marginTopArr && marginTopArr[1]) {
                offsetY = marginTopArr[1];
            }
            if (marginLeftArr && marginLeftArr[1]) {
                offsetX = marginLeftArr[1];
            }
            if (width / height > photoW / photoH) {
                //左右
                scale = photoH / height;
                uploadimg.rotate(-1.7 * Math.PI / 180);
                uploadimg.drawImage(img, (width - photoW / scale) / 2 - offsetX / scale, 0, photoW / scale, height,
                    photoX, photoY, photoW * zoom, photoH * zoom);
                uploadimg.restore();
            } else {
                //上下
                scale = photoW / width;//0.63
                //console.log(scale);
                uploadimg.rotate(-1.7 * Math.PI / 180);
                                    //186.7 (640  - 168 /  0.63) / 2 -  100 / 0.63
                uploadimg.drawImage(img, 0, (height - photoH / scale) / 2 - offsetY / scale, width, photoH / scale,
                    photoX, photoY, photoW * zoom, photoH * zoom);
                uploadimg.restore();
            }

            //判断是否上传七牛
            //$("#myCanvas").show();
            var image_url = myCanvas.toDataURL("image/jpeg", 70);
            app.loading.show();
            $.post(window.apiUrl + "/api/goodimgup", {img:image_url}, function(res){
                app.loading.hide();
                if(res.url){
                    //console.info(res.url);
                    $(".download_modals").find('.canvas_img').find('img').attr("src", res.url);
                    window.canvas_img = res.url;
                    $(".download_modals").find('.canvas_img').find('img').one('load', function(){
                        app.showDownloadLayout();
                    });
                }
            }, 'json');
        };
        img.src = app.myImg.url;
    };

    app.showDownloadLayout = function(){
        $('.download_modals').show();
        app.loading.hide();
    };


    /**---------您的代码--------**/
});

$.fn.addAni = function (className, delay, duration, callback) {
    if ($(this).length > 1) {
        $(this).each(function () {
            $(this).addAni(className, delay, duration, callback);
        });
        return;
    }

    delay = delay || 0;
    duration = duration ? duration : 0;
    var _this = $(this);
    var currAni = _this.data('curr-ani');
    if (currAni) _this.removeClass(currAni);
    _this.attr('style', '');
    if (delay) {
        _this.css({
            'animation-delay': delay + 's!important',
            '-webkit-animation-delay': delay + 's!important'
        });
    }

    if (duration) {
        className += " ani-duration-" + duration + "s";
    }
    _this.addClass('animated ' + className).show();
    _this.data('curr-ani', 'animated ' + className);
    setTimeout(function () {
        callback && callback();
    }, 1000 * (duration + delay));
};


var Weixin = {};
Weixin.config = {
    template: function (src) {
        return '<img style="width: 95%;padding-top: 5px;vertical-align: bottom;" src="' + this.popupImg + '" />';
    },
    popupImg: './public/img/share-modal1.png'
};
Weixin.share = function (callback, keep) {
    if (!document.getElementById('weixinShare')) {
        //分享浮层
        var markelem = document.createElement('div');
        markelem.id = 'weixinShare';
        var styles = {
            position: 'fixed',
            zIndex: 999999,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
        };
        for (var name in styles) {
            if (styles.hasOwnProperty(name)) {
                markelem.style[name] = styles[name];
            }
        }
        markelem.innerHTML = Weixin.config.template();
        document.body.appendChild(markelem);

        $('#weixinShare').on('tap', function (e) {
            $(this).remove();
        });

    }
};
if (typeof define == 'function') {
    define('weixin', Weixin);
}
else if (typeof module != 'undefined' && module.exports) {
    module.exports = Weixin;
}
else {
    window.Weixin = Weixin;
}


//上传图片函数
function upload(e, type) {
    var obj = e[0];
    if (obj.files.length == 0) {
        return;
    }
    var me = this;
    var file = obj.files[0];
//        console.info(file);
//        console.info(file['name']);
    window.imgname = file['name'];
    var _data = new FormData();
    _data.append('token', window.qiniu['token']);
    _data.append('file', file);
    app.loading.show();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://up.qiniu.com');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resp = JSON.parse(xhr.responseText);
            if (resp.key) {

                var url = window.qiniu['url'] + resp.key + '!w480';//w320缩略图
                window.bg_imgs_url = {};
                var img = new Image();
                img.onload = function (e) {
//                        console.info(e);
                    app.loading.hide();
                    var width = img.width;
                    var height = img.height;
//                        console.info(width);
                    var css1 = {
                        width: '100%',
                        height: 'auto',
                        transform: 'translate(-50%, -50%)',
                        '-webkit-transform': 'translate(-50%, -50%)',
                        position: 'relative',
                        top: '50%',
                        left: '50%'
                    };
                    var css2 = {
                        width: 'auto',
                        height: '100%',
                        transform: 'translate(-50%, -50%)',
                        '-webkit-transform': 'translate(-50%, -50%)',
                        position: 'relative',
                        top: '50%',
                        left: '50%'
                    };
                    window.imgDir = (width / height) < (227 / 163) ? 1 : 2;
                    var obj = (window.imgDir == 1) ? css1 : css2;
//                        console.log(11);console.info(obj);
                    $('.page-2 [class^="bg_replace"]').find("img").attr('src', img.src).css(obj).show();
                    $('.page-2 [class^="bg_fixed"]').show();
                    app.myImg['url'] = img.src;
                    app.myImg['style'] = $('.page-2 [class^="bg_replace"]').find("img").attr("style");
//                        console.info(app.myImg);
                    if (app.upDataCss) app.upDataCss();
                };
                img.src = url;
                window.shareData.imgUrl = url + "?imageView2/1/w/200/h/200";
            }
        }
    };
    xhr.onerror = function (error) {
        app.alert(error);
    };
    xhr.upload && (xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            //$(".file_result").text('上传中(' + parseInt(e.loaded / e.total) * 100 + '%)');
        }
    });
    xhr.send(_data);
}