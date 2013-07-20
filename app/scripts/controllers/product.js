'use strict';

angularShopApp.controller('ProductCtrl', function($scope, $http, cartItemsService) {
	/**
	 * @controller
	 * Product listing controller.
	 *
	 */
	$scope.products = [];


	$scope.addToCart = function(product) {
		/**
		 * Add product item to cart
		 *
		 *  @param product: {object} the product to add.
		 *
		 */
		var cartItems = cartItemsService.getCartItems(),
			cartLen = cartItems.length,
			cartIdx = 0,
			isInCart = false;

		for (; cartIdx < cartLen; cartIdx++) {
			var item = cartItems[cartIdx];

			if (item.name === product.name) {
				isInCart = true;
				item.quantity += 1;

				cartItems[cartIdx] = item;
			}
		}

		if (!isInCart) {
			product.quantity = 1;

			cartItems.push(product);
		}

		cartItemsService.setCartItems(cartItems);
	};

	$scope.loadProducts = function () {
		/**
		 *  Load Products 
		 *
		 */
		$http.get('scripts/data/products.json')
			 .then(function (res) {
			 	if (res.status === 200) {
			 		$scope.products = res.data.products;
			 	} else {
			 		alert(res);
			 	}
			 });
	};

	//Init Products
	$scope.loadProducts();
});