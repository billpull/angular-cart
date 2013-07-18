'use strict';

borderShopApp.controller('CartCtrl', function($scope, $http, cartItemsService) {
	$scope.items = cartItemsService.getCartItems();

	$scope.shippingMethdodTypes = {};

	$scope.shippingMethods = [];

	$scope.totals = {};

	$scope.totalPrice = function () {
		var items = cartItemsService.getCartItems(),
			itemLen = items.length,
			itemIdx = 0,
			totalPrice = 0;

		for (; itemIdx < itemLen; itemIdx++) {
			item = items[itemIdx];

			totalPrice += item.quantity * item.finalPrice;
		}

		return totalPrice
	};

	$scope.shippingMethod = function () {};

	$scope.removeItem = function (item) {
		var items = cartItemsService.getCartItems(),
		    itemIdx = items.indexOf(item);

		delete items[itemIdx];

		cartItemsService.setCartItems(items.splice(itemIdx, 1));
	};

	$scope.loadCart = function () {
		$http.get('scripts/data/cart.json')
			 .then(function (res) {
			 	if (res.status === 200) {
			 		var cart = res.data.cart,
			 			items = cart.items,
			 			shippingMethods = cart.shippingMethods,
			 			totals = cart.totals;

			 		cartItemsService.setCartItems(items);

			 		for (var sM in shippingMethods) {
			 			if (shippingMethods.hasOwnProperty(sM))
			 				$scope.shippingMethods.append(sM);
			 		}

			 		$scope.totals = totals;

			 	} else {
			 		alert(res);
			 	}
			 });
	};
});