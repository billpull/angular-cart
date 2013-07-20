'use strict';

var angularShopApp = angular.module('angularShopApp', []);

angularShopApp.service('cartItemsService', function () {
  /**
   *  Cart Item Service for communicating between product 
   *  listing controller and cart controller.
   *
   */
  var cartItems= [];
    return{
        getCartItems: function(){
            return cartItems;
        },
        setCartItems: function(value){
            cartItems=value;
        }
    };
});

$(function () {
	$('#cart').on('click', function(e) {
		$('.cart-wrap').slideToggle();
	});
});