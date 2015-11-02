// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngMaterial', 'ngResource', 'ngSanitize']);

var registration_link = 'http://sona.com.sg/index.php?route=information/api/registration';
var login_link = 'http://sona.com.sg/index.php?route=information/api/login';
var category_link = 'http://sona.com.sg/index.php?route=information/api/getProductsApi';
var product_link = 'http://sona.com.sg/index.php?route=information/api/getProduct';

app.run(function($ionicPlatform, $localstorage, $window) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

     $localstorage.setObject('cartlist', {
        product_id: []
      });

     $window.count_cart= 0;

  });
});

app.config(function($stateProvider, $urlRouterProvider) {
    

  $stateProvider.state('splash', {
      url: '/splash',
      templateUrl: 'templates/splash.html',
  })

  $stateProvider.state('/login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'UserCtrl'
  })

  $stateProvider.state('/register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'newUserCtrl'
  })

  /*$stateProvider.state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
  })*/

  $stateProvider.state('menu', {
    url: '/menu',
   /*abstract: true,*/
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('menu.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('menu.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })

  .state('menu.category', {
    url: '/category/:item',
    views: {
      'menuContent': {
          templateUrl: 'templates/products.html',
          controller: 'categoryCtrl',
        }
      }
  })

  .state('menu.product', {
    url: '/product/:item',
    views: {
      'menuContent': {
          templateUrl: 'templates/product.html',
          controller: 'productCtrl',
        }
      }
  })


  $urlRouterProvider.otherwise('/splash');
  


});

app.factory('Post', function($resource) {
  return $resource(registration_link);
});

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/&nbsp;/gi,'');
    };
  }
);

app.controller('newUserCtrl', ['$scope' , '$http', '$mdToast',  function($scope, $http, $mdToast){

    var self = this;

    this.save = function(newUser){

    postData = {
                  firstname: newUser.firstname, 
                  lastname: newUser.lastname,
                  email: newUser.email,
                  telephone: newUser.telephone,
                  address_1: newUser.address,
                  postcode: newUser.postalcode,
                  country_id:188,
                  nirc: newUser.nirc,
                  password: newUser.password,
                  confirm: newUser.confirm_password,
                };
 
        $http.post(registration_link, postData).then(function (res){
           // console.log(res);

            if(res.data.status == '1')
            {
              $mdToast.show($mdToast.simple().content('Successfully saved...'));
              self.user = {};

            }
            else
            {
              $mdToast.show($mdToast.simple().content('Something went wrong...'));
            }
        });

    }

  }

]);


app.controller('UserCtrl' , [ '$scope', '$http', '$mdToast', '$state' , function($scope, $http, $mdToast, $state){

    var self = this;

    this.login = function(user){

     //console.log(user);

        
        postData = {
                  email: user.username,
                  password: user.password
                };
 
        $http.post(login_link, postData).then(function (res){
           //console.log(res);

            if(res.data.status == '1')
            {
                $mdToast.show($mdToast.simple().content('Login success...'));
                self.user = {};
                $state.go('menu');
            }
            else
            {
                $mdToast.show($mdToast.simple().content('Invalid login...'));
            }
        });


    }

  }

]);




app.controller('menuCtrl', ['$scope', '$state', '$window', '$ionicSideMenuDelegate', function($scope, $state, $window, $ionicSideMenuDelegate){

      $scope.count_cart = $window.count_cart;

       /*$scope.$watch('$window.count_cart', function () {

          $scope= $window.count_cart

        }, function(n,o){
            console.log("changed ",n);
        });*/

/*$scope.$watch('$window.count_cart', function(newVal, oldVal){
    console.log('changed');
}, true);*/
        
        /* $scope.$watch(function() { 
          return $ionicSideMenuDelegate.toggleLeft();
        });*/

      var fim = function() {
        console.log('op');
      } 
         $scope.toggleLeft = function() {
            console.log('side');
            $ionicSideMenuDelegate.toggleLeft();
          };

       $state.go('menu.home');


       


  }

]);

app.controller('categoryCtrl', ['$scope', '$state', '$stateParams', '$http', '$sce','$ionicLoading', function($scope, $state, $stateParams, $http, $sce, $ionicLoading){

    //console.log($stateParams.item);

       $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        postData = {
                  path: $stateParams.item,
                  limit : 10,
                  page : 1,
                };
 
        $http.post(category_link, postData).then(function (res){
          console.log(res);
           //console.log(res.data.products[0].product_id);
           $scope.products = res.data.products;
            $ionicLoading.hide();
            
        });

      $scope.sanitize = function(html) {
               return $sce.trustAsHtml(html);
      };

      $scope.doRefresh =function() {
        
        postData.page = 2;
       var products = $scope.products ;
         $http.post(category_link, postData).then(function (res){
            //console.log(res);
             //console.log(res.data.products[0].product_id);
             var new_products = res.data.products;
             angular.forEach(new_products, function(i, el){

                var chk= false;

                for (i = 0; i < products.length; i++ ) {

                   // console.log(products[i].product_id );
                    if ( products[i].product_id === new_products[el].product_id) {
                        chk= false;
                        break;
                    }
                    else
                    {
                      chk= true;                 
                    }
                }

                if(chk === true)
                {
                  $scope.products.unshift(new_products[el]);
                }
                
                
            });

            //$scope.products = res.data.products.concat($scope.products);
            $scope.$broadcast('scroll.refreshComplete');
        });

      }

}

]);


app.controller('productCtrl', ['$scope', '$state', '$stateParams', '$http', '$sce', '$localstorage', '$window','$ionicLoading', function($scope, $state, $stateParams, $http, $sce, $localstorage, $window, $ionicLoading){

    //console.log($stateParams.item);
         $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    
        postData = {
                  product_id: $stateParams.item
                };
 
        $http.post(product_link, postData).then(function (res){
          console.log(res);
           //console.log(res.data.products[0].product_id);
           $scope.product = res.data;
           $ionicLoading.hide();
            
        });


      this.addToCart = function(product_name){
         var product_id = $stateParams.item;
         //var product_name = product_name;
         //console.log(product_name);

         var addtocartlist = $localstorage.getObject('cartlist');
         console.log(addtocartlist);
         console.log(addtocartlist.product_id);

         var products_list = addtocartlist.product_id;

         if( angular.isArray(products_list) )
         {
            products_list.push(product_id);
            $window.count_cart = products_list.length;
         }
         else
         {
           products_list[0]  = product_id;
         }
         $localstorage.setObject('cartlist', {
            product_id: products_list
          });


      }


}

]);


app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

app.directive('productPanels', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/product-panels.html'
  };
});