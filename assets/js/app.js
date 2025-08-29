/**
 * Theme: Crovex - Responsive Bootstrap 4 Admin Dashboard
 * Author: Mannatthemes
 * Module/App: Main Js (Cleaned)
 */

(function ($) {
    'use strict';

    function initLeftMenuCollapse() {
        $('.button-menu-mobile').on('click', function (event) {
            event.preventDefault();
            $("body").toggleClass("enlarge-menu");
        });
    }

    function initEnlarge() {
        if ($(window).width() < 1025) {
            $('body').addClass('enlarge-menu enlarge-menu-all');
        } else {
            $('body').removeClass('enlarge-menu enlarge-menu-all');
        }
    }

    function initTooltipPlugin(){
        if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    }

    function initMainIconTabMenu() {
        $('.main-icon-menu .nav-link').on('click', function(e){
            $("body").removeClass("enlarge-menu");
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            $('.main-menu-inner').addClass('active');
            var targ = $(this).attr('href');
            $(targ).addClass('active').siblings().removeClass('active');
        });
    }

    function initActiveMenu() {
        $(".leftbar-tab-menu a, .left-sidenav a").each(function () {
            var pageUrl = window.location.href.split(/[?#]/)[0];
            if (this.href === pageUrl) { 
                $(this).addClass("active");
                $(this).parents('li').addClass("active");
            }
        });
    }

    function initFeatherIcon() {
        if (typeof feather !== "undefined") {
            feather.replace();
        }
    }

    function initAutoComplate() {
        var Countries = ['Forms','Tables','Charts','Icons','Maps'];
        if ($.fn.autocomplete) {
            $('#AllCompo').autocomplete({
                source: Countries,
                minLength: 0,
                scroll: true
            }).focus(function() {
                $(this).autocomplete("search", "");
            });
        }
    }

    function initMainIconMenu() {
        $(".navigation-menu a").each(function () {
            var pageUrl = window.location.href.split(/[?#]/)[0];
            if (this.href === pageUrl) {
                $(this).parents('li').addClass("active");
            }
        });
    }

    function initTopbarMenu() {
        $('.navbar-toggle').on('click', function (event) {
            $(this).toggleClass('open');
            $('#navigation').slideToggle(400);
        });

        $('.navigation-menu>li').slice(-2).addClass('last-elements');

        $('.navigation-menu li.has-submenu a[href="#"]').on('click', function (e) {
            if ($(window).width() < 992) {
                e.preventDefault();
                $(this).parent('li').toggleClass('open')
                       .find('.submenu:first').toggleClass('open');
            }
        });
    }

    function init() {
        initLeftMenuCollapse();
        initEnlarge();
        initTooltipPlugin();
        initMainIconTabMenu();
        initActiveMenu();
        initFeatherIcon();
        initAutoComplate();
        initMainIconMenu();
        initTopbarMenu();
        if (typeof Waves !== "undefined") {
            Waves.init();
        }
    }

    // Initialize on load
    $(document).ready(function(){
        init();
    });

})(jQuery);
