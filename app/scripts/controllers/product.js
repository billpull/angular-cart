'use strict';

borderShopApp.controller('ProductCtrl', function($scope, $http, cartItemsService) {
	$scope.products = [];

	$scope.loadProducts = function () {
		$http.get('scripts/data/products.json')
			 .then(function (res) {
			 	if (res.status === 200) {
			 		$scope.products = res.data.products;
			 	} else {
			 		alert(res);
			 	}
			 });
	};

	$scope.addToCart = function(product) {
		var cartItems = cartItemsService.getCartItems(),
			cartLen = cartItems.length,
			cartIdx = 0,
			isInCart = false;

		for (; cartIdx < cartLen; cartIdx++) {
			var item = cartItems[cartIdx];

			console.log(item);

			if (item.name === product.name) {
				console.log(cartItems);
				isInCart = true;
				item.quantity += 1;

				cartItems[cartIdx] = item;
			}
		}

		if (!isInCart) {
			product.quantity = 1;

			if (product.sale) {
				product.finalPrice = product.salePrice;
			} else {
				product.finalPrice = product.listPrice;
			}

			cartItems.push(product);
		}

		cartItemsService.setCartItems(cartItems);
	};

	//Init Products
	$scope.loadProducts();
});