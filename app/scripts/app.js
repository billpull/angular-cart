'use strict';

var borderShopApp = angular.module('borderShopApp', []);

borderShopApp.service('cartItemsService', function () {
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