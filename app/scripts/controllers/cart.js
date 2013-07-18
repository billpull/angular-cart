'use strict';

borderShopApp.controller('CartCtrl', function($scope, $http, cartItemsService) {
	/**
	 * @controller
	 * Shopping Cart Controller
	 *
	 */

	// cart items
	$scope.items = cartItemsService.getCartItems();

	/* Shipping Method Properties */
	$scope.shippingMethods = [];

	$scope.shippingMethod = { index: 0 };

	$scope.groundShippingMethodName = "Ground";
	$scope.defaultGroundShippingPrice = 0;

	$scope.shippingCost = 0;

	/* Price Methods */
	$scope.totals = {};

	$scope.totalListPrice = function () {
		/**
		 * Return the total list price of all items in
		 * the cart.
		 *
		 *  @return {number} The total price.
		 *
		 */
		var items = $scope.items,
			itemLen = items.length,
			itemIdx = 0,
			totalListPrice = 0;

		for (; itemIdx < itemLen; itemIdx++) {
			var item = items[itemIdx];

			totalListPrice += item.quantity * item.listPrice;
		}

		return totalListPrice;
	};

	$scope.totalSavings = function () {
		/**
		 * Return the total discount of items in the cart.
		 *
		 *  @return {number} Total discount price.
		 *
		 */
		var items = $scope.items,
			itemLen = items.length,
			itemIdx = 0,
			totalSavings = 0;

		for (; itemIdx < itemLen; itemIdx++) {
			var item = items[itemIdx],
			    totalListPrice = 0,
			    totalSalePrice = 0,
			    priceDiff = 0;

			if (item.sale) {
				totalListPrice = item.quantity * item.listPrice;
				totalSalePrice = item.quantity * item.salePrice;

				priceDiff = totalListPrice - totalSalePrice;
			}

			totalSavings += priceDiff;
		}

		return totalSavings
	};

	$scope.updateShippingPrice = function (name) {
		/**
		 * Update the shipping method that matches the given name.
		 *
		 *  @param {string} shipping method name
		 *
		 *  @return {object} function that updates price.
		 *
		 */
		var shippingMethods = $scope.shippingMethods,
			methodsLen = shippingMethods.length,
			smIdx = 0,
			methodToUpdate = null,
			methodIdx = 0;

		for (; smIdx < methodsLen; smIdx++) {
			var method = shippingMethods[smIdx];

			if (method.name === name) {
				methodToUpdate = method;
				methodIdx = smIdx;
			}
		}

		return function (price) {
			/**
			 * Update the shipping method price
			 *
			 *  @param price: {number} the new price value
			 *
			 */
			if (methodToUpdate) {
				methodToUpdate.price = price;

				$scope.shippingMethods[methodIdx] = methodToUpdate;
			}
		};
	};

	$scope.totalPrice = function () {
		/**
		 *  Adds the total price of the shopping cart including
		 *  shipping & handline.
		 *
		 */
		var totalItemPrice = $scope.totalListPrice() - $scope.totalSavings(),
			shippingMethod = $scope.shippingMethods[$scope.shippingMethod.index],
			totalPrice = 0,
			updateGroundShippingPrice = $scope.updateShippingPrice($scope.groundShippingMethodName);


		// update the shipping price based on cart price.
		if (totalItemPrice > 500) {
			updateGroundShippingPrice(0);
		} else {
			updateGroundShippingPrice($scope.defaultGroundShippingPrice);
		}

		if (shippingMethod) {
			$scope.shippingCost = shippingMethod.price;

			totalPrice = totalItemPrice + shippingMethod.price;
		} else {
			totalPrice = totalItemPrice;
		}

		return totalPrice;
	};

	$scope.removeItem = function (item) {
		/**
		 * Remove product item from the cart.
		 *
		 *  @param item: {object} product item.
		 *
		 */
		var itemIdx = $scope.items.indexOf(item);

		if (itemIdx > -1) {
			$scope.items.splice(itemIdx, 1);

			cartItemsService.setCartItems($scope.items);
		}
	};

	$scope.updateCart = function () {
		/**
		 * Remove product items if the quantity is 0
		 *
		 */
		var items = $scope.items,
			itemLen = items.length,
			itemIdx = 0;

		for (; itemIdx < itemLen; itemIdx++) {
			var item = items[itemIdx];

			if (parseInt(item.quantity, 10) === 0) {
				$scope.removeItem(item);
			}
		}
	};

	$scope.checkoutCart = function () {
		var totals = $scope.totals,
		    qty = totals.qty,
		    items = $scope.items;		    
		
		totals.price = $scope.totalListPrice() - $scope.totalSavings();

		totals.shipping = $scope.shippingCost;

		totals.tax = 0.6;

		totals.subtotal = totals.price + $scope.shippingCost;
		totals.total = totals.price + (totals.price * totals.tax);
			

		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			qty += item.quantity
		}

		totals.qty = qty;

		$scope.totals = totals;

		window.alert(JSON.stringify(totals));
	};

	$scope.loadCart = function () {
		/**
		 * Load Cart JSON config.
		 *
		 */
		$http.get('scripts/data/cart.json')
			 .then(function (res) {
			 	if (res.status === 200) {
			 		var cart = res.data.cart,
			 			items = cart.items,
			 			shippingMethods = cart.shippingmethods,
			 			totals = cart.totals;

			 		$scope.items = items;
			 		cartItemsService.setCartItems($scope.items);

			 		$scope.totals = totals;

			 		// flatten shipping methods and set defaults.
			 		for (var sM in shippingMethods) {
			 			if (shippingMethods.hasOwnProperty(sM)) {
			 				var method = shippingMethods[sM];

			 				$scope.shippingMethods.push(method);

			 				if (method.name === $scope.groundShippingMethodName) {
			 					$scope.defaultGroundShippingPrice = method.price;
			 				}
			 			}
			 				
			 		}

			 		$scope.totals = totals;

			 	} else {
			 		alert(res);
			 	}
			 });
	};

	// initialize shopping cart.
	$scope.loadCart();
});