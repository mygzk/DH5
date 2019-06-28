$(function () {
    var datas;
    var templ = "";
    var result = 0;
    $.ajax({
        url: "json/data.json",//json文件位置
        type: "GET",//请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (res) {
            var realData = getRealData(res);
            //请求成功完成后要执行的方法
            datas = realData;
            //each循环 使用$.each方法遍历返回的数据date
            $.each(realData, function (i, item) {
                var template2 = '';
                $.each(item.content, function (index, val) {
                    template2 += `<li><label><input type="radio" name="${'name' + i}" value='${index}'> ${val}</label></li>`;
                });
                var arKey = "";
                if (i == realData.length - 1) {
                    arKey = "lastone";
                } else {
                    arKey = "";
                }
                templ += `<article class="swiper-slide slide2" accesskey="${arKey}">`+
                    `<img src="img/bg_main02.jpg">`+
                    `<img src="img/tiananmen.png">`+
                   ` <img src="img/huabiao.png" class="ani" swiper-animate-effect="fadeIn" swiper-animate-duration="1s"swiper-animate-delay="0.5s">`+
                   `<img src="img/baige02.png" class="ani" swiper-animate-effect="fadeInRight" swiper-animate-duration="1s"swiper-animate-delay="0.1s">`+
                    `<div class="ani" swiper-animate-effect="fadeInLeft" swiper-animate-duration="1s" swiper-animate-delay="0.1s">`+
                       ` <h3 >${(i + 1) + '. ' + item.title}</h3>`+
                       ` <ul> ${template2}</ul>`+
                   `</div>`+
                   `</article>`;
            });

            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                direction: 'vertical',
                onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
                    swiperAnimateCache(swiper); //隐藏动画元素
                    swiperAnimate(swiper); //初始化完成开始动画
                },
                onSlideChangeEnd: function (swiper) {
                    var aArticle = $('article');

                    var ar = aArticle[aArticle.length - 1];
                    var key = ar.accessKey;

                    if (key == "result") {
                        $('#submitBtn').hide();
                        $('#btn2').hide();
                    }

                    if (swiper.activeIndex === aArticle.length - 1) {
                        if (key === "result") {
                            $('#submitBtn').hide();
                            $('#btn2').hide();
                        } else if (key === "lastone") {
                            $('#submitBtn').show();
                            $('#btn2').hide();
                        }
                    } else {
                        if (swiper.activeIndex !== aArticle.length - 1) {
                            $('#submitBtn').hide();
                            $('#btn2').show();
                        }

                    } //切换结束时，告诉我现在是第几个slide
                    swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
                }
            });
            swiper.appendSlide(templ);

            $('#btn2').on('click', function (e) {
                nextSlidle(e, swiper);
            })

            $('#startBtn').on('click', function (e) {
                nextSlidle(e, swiper);
            })

            $('.slide2 ul').on('click', 'input', function (e) {
                nextSlidle(e, swiper);
            })

            //下一页
            function nextSlidle(e, swiper) {
                swiper.slideNext();
                e.stopPropagation();
            }


            $('#submitBtn').on('click', function (e) {


                /* if (true) {
                     return;
                 }*/
                if (datas != null) {
                    $.each(datas, function (index, val) {
                        var answer = val.answer;
                        var name = "name" + index;
                        var value = $('input[name=' + name + ']:checked').val();
                        if (answer == value) {
                            result++;
                        }

                    });
                    addResultpPage(result);
                    $('#btn2').hide();
                    $('#submitBtn').hide();

                    nextSlidle(e, swiper);
                    swiper.lockSwipes();

                } else {
                    alert("请做完答题");
                }
            })


            function addResultpPage(result) {
                var resulttemp = '<article class="swiper-slide slide3" accesskey="result">' +
                    '<img src="img/bg_main02.jpg">' +

                    '<div>' +
                    /* '<H3>测试结果</H3>'+*/
                    '<img src="img/huabiao.png" class="ani" swiper-animate-effect="fadeInUpS" swiper-animate-duration="2s" swiper-animate-delay="0.1s">';

                var scoreText = '你本次测评结果:' + result;
                var contetnText = '';
                if (result === 0) {
                    contetnText = '需要加油额';
                } else if (result=== 1) {
                    contetnText = '运气不做 蒙对了一道 哈哈';
                } else if (result === 2) {
                    contetnText = '哈哈 还答对了两题,还可以提高额';

                } else if (result === 3) {
                    contetnText = '很厉害了 答对了这么多';
                } else if (result === 4) {
                    contetnText = '你很优秀 马上就满分了';
                } else {
                    contetnText = '你是最棒额 小伙子！！';
                }

                resulttemp = resulttemp + `<div><h3 class="ani" swiper-animate-effect="bounceInLeft" swiper-animate-duration="2s" swiper-animate-delay="0.1s"> ${scoreText}</h3>` +
                    `<h3 class="ani" swiper-animate-effect="bounceInRight" swiper-animate-duration="2s" swiper-animate-delay="0.1s">${contetnText}</h3></div>`;
                resulttemp = resulttemp + '</div>' +
                    ' <span id="tryAgainBtn" class="ani" swiper-animate-effect="bounceIn" swiper-animate-duration="1s"\n' +
                    '                  swiper-animate-delay="0.1s">再来一次</span>' +
                    '</article>';

                swiper.appendSlide(resulttemp);
                $('#tryAgainBtn').on('click', function (e) {
                    location.reload();
                })
            }

            /**
             * 从结果中随机取出5条数据
             * @param data
             * @returns {Array}
             */
            function getRealData(data) {
                var realData = [];
                var arr = [];
                var max = data.length;
                for (var i = 0; i < max; i++) {
                    var arrNum = parseInt(Math.random() * max) + 1;
                    var flag = true;
                    for (var j = 0; j <= arr.length; j++) {
                        if (arrNum == arr[j]) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        arr.push(arrNum);
                    } else {
                        i--;
                    }
                    if (arr.length == 1) {
                        break;
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    realData.push(data[arr[i]]);
                }
                return realData;

            }


        }
    })
})