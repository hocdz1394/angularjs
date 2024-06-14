angular
  .module("myapp", ["ngRoute", "ngCookies", "ngSanitize"])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "view/layout/home.html",
        controller: "homeCtrl",
      })
      .when("/products", {
        templateUrl: "view/layout/products.html",
        controller: "productCtrl",
      })
      .when("/product_details/:id", {
        templateUrl: "view/layout/product_details.html",
        controller: "pro_detailsCtrl",
      })
      .when("/cart", {
        templateUrl: "view/layout/cart.html",
      })
      .when("/checkout", {
        templateUrl: "view/layout/checkout.html",
        controller: "checkoutCtrl",
      })
      .when("/bill", {
        templateUrl: "view/layout/bill.html",
        controller: "billCtrl",
      })
      .when("/contact", {
        templateUrl: "view/layout/contact.html",
      })
      .when("/news", {
        templateUrl: "view/layout/news.html",
      })
      .when("/news_details/:id", {
        templateUrl: "view/layout/news_details.html",
        controller: "newsdetailsCtrl",
      })
      .when("/register", {
        templateUrl: "view/layout/register_login.html",
        controller: "registerCtrl",
      })
      .when("/login", {
        templateUrl: "view/layout/register_login.html",
        controller: "loginCtrl",
      })
      .when("/inforUser", {
        templateUrl: "view/layout/inforUser.html",
        controller: "inforUserCtrll",
      })
      .otherwise({
        templateUrl: "view/layout/404.html",
      });
  })
  .controller(
    "myCtrl",
    function ($scope, $http, $location, $cookies, $timeout, $window) {
      // Khởi tạo danh sách sản phẩm
      $scope.dspro = [];

      //show hình ảnh addsp
      $scope.isBase64 = function (imageData) {
        // Kiểm tra xem imageData có phải là một chuỗi base64 không
        return /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/.test(imageData);
      };

      //show toast
      $scope.showToast = false;
      $scope.toastCount = 0;

      $scope.showToasts = function () {
        $scope.toastCount++;
        $scope.showToast = true;
        $timeout(function () {
          $scope.showToast = false;
        }, 3000); // 3 giây
      };

      //Lưu giỏ hàng vào cookies
      $scope.cart = [];

      $scope.addToCart = function (product) {
        var found = false;
        for (var i = 0; i < $scope.cart.length; i++) {
          if ($scope.cart[i].id === product.id) {
            $scope.cart[i].quantity++;
            found = true;
            break;
          }
        }
        if (!found) {
          var item = {
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1,
          };
          $scope.cart.push(item);
        }
        $cookies.putObject("cart", $scope.cart);

        console.log($cookies.get("cart"));
      };
      //xoá sản phẩm
      $scope.removeCart = function (id) {
        // Tìm chỉ số của phần tử trong mảng có id tương ứng
        var index = -1;
        for (var i = 0; i < $scope.cart.length; i++) {
          if ($scope.cart[i].id === id) {
            index = i;
            break;
          }
        }

        // Nếu tìm thấy phần tử có id tương ứng, xoá nó khỏi mảng
        if (index !== -1) {
          var xn = confirm("Bạn có muốn xoá sản phẩm này");
          if (xn === true) {
            $scope.cart.splice(index, 1);
            $cookies.putObject("cart", $scope.cart);
          }
        }
      };

      //debug cookie
      $scope.getCart = $cookies.getObject("cart");
      // console.log($scope.getCart[0].quantity);

      //show sản phẩm
      if ($cookies.getObject("cart")) {
        $scope.cart = $cookies.getObject("cart");
      } else {
        $scope.cart = [];
      }

      // Duyệt mảng sp lấy tổng số lượng
      $scope.loopArr = function () {
        var totalQuantityshow = 0;
        var totalPrice = 0;
        for (var i = 0; i < $scope.cart.length; i++) {
          // Lấy số lượng của mỗi sản phẩm
          var quantity = $scope.cart[i].quantity;
          totalQuantityshow += quantity; // Tính tổng số lượng
          var arrTotal = quantity * $scope.cart[i].price;
          totalPrice += arrTotal;
        }
        $scope.totalQuantityshow = totalQuantityshow;
        $scope.totalPrice = totalPrice;
      };
      $scope.$watch("cart", function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $scope.loopArr();
        }
      });

      // Tăng số lượng sản phẩm

      $scope.increaseQuantity = function (id) {
        $scope.cart.forEach(function (product) {
          if (product.id === id) {
            product.quantity++;
            $cookies.putObject("cart", $scope.cart);
          }
        });
      };

      // giảm số lượng sản phẩm
      $scope.decreaseQuantity = function (id) {
        $scope.cart.forEach(function (product) {
          if (product.id === id) {
            if (product.quantity < 2) {
              alert("Bạn muốn xoá sản phẩm này");
              $scope.cart.splice(product, 1);
              $cookies.putObject("cart", $scope.cart);
            } else {
              product.quantity--;
            }
            $cookies.putObject("cart", $scope.cart);
          }
        });
      };
      //Lọc sản phẩm trên header
      $scope.filterByCategory = function (idDm) {
        $scope.getIddm = idDm;
        $scope.isInCategory = function (product) {
          return product.categories_id == idDm.toString();
        };
      };

      //Kiểm tra xem có hiện ở url nào thì active nó lên
      $scope.isActive = function (viewLocation) {
        var path = $location.path().split("/")[1];
        if (path === viewLocation) {
          return "active";
        } else {
          return "";
        }
      };
      $scope.dsSp = [];

      $http.get("db.json").then(
        function (res) {
          $scope.dsSp = res.data;
          $scope.dspro = res.data.products;
          $scope.dsUser = res.data.users;
          // $scope.dscata = res.data.categories;
          $scope.laymodel = function (id) {
            $scope.dsSP = res.data.products;
            $scope.idSp = $scope.dsSP.find((sp) => sp.id === id);
          };
        },
        function (res) {
          alert("Lỗi");
        }
      );
      $http.get("db.json").then(
        function (res) {
          $scope.dsSp = res.data;
          $scope.dspro = res.data.products.reverse();
          $scope.news = res.data.news.reverse();
          $scope.categories = res.data.categories.reverse();
          $scope.dsUser = res.data.users;
          // $scope.dscata = res.data.categories;
          $scope.laymodel = function (id) {
            $scope.dsSP = res.data.products;
            $scope.idSp = $scope.dsSP.find((sp) => sp.id === id);
          };
        },
        function (res) {
          alert("Lỗi");
        }
      );

      //show login-register
      var updateNamePage = function () {
        var path = $location.path();
        if (path === "/login") {
          $scope.namePage = "Đăng nhập";
        } else if (path === "/register") {
          $scope.namePage = "Đăng ký";
        }
      };
      updateNamePage();
      $scope.$on("$locationChangeSuccess", function () {
        // Cập nhật biến $scope.namePage khi URL thay đổi
        updateNamePage();
      });
      // exchange login-register
      $scope.switchToLogin = function () {
        $location.path("/login");
      };
      $scope.switchToRegister = function () {
        $location.path("/register");
      };
      //hiển thị thông tin user
      // Lấy thông tin người dùng từ Session Storage
      var currentUser = $window.sessionStorage.getItem("currentUser");
      // $scope.currentUser = currentUser;
      // console.log($scope.currentUser);

      // Nếu có thông tin người dùng
      if (currentUser) {
        $scope.currentUser = JSON.parse(currentUser);
      }
      $scope.logout = function () {
        // Xóa mục currentUser từ Session Storage
        $window.sessionStorage.removeItem("currentUser");
        $scope.currentUser = null; // xoá biến để cập nhật hiển thị
        // Chuyển hướng đến trang đăng nhập hoặc trang chính (tùy thuộc vào yêu cầu của bạn)
        $location.path("/login");
      };
    }
  )
  .controller("billCtrl", function ($scope, $http) {
    $http.get("http://localhost:3000/bills").then(
      function (res) {
        $scope.bill = res.data;
        $scope.bills = $scope.bill.reverse();
        $scope.billscart = [];

        // Lặp qua mỗi hóa đơn để lấy thông tin giỏ hàng
        angular.forEach($scope.bills, function (bill) {
          // Thêm giỏ hàng của mỗi hóa đơn vào mảng billscart
          $scope.billscart.push(bill.cart);
        });
        console.log($scope.bills);
        console.log($scope.billscart);
      },
      function (res) {
        alert("Lỗi");
      }
    );
  })
  .controller("checkoutCtrl", function ($scope, $http, $cookies, $location) {
    $http.get("tinh.json").then(
      function (res) {
        $scope.dsTinh = res.data;
      },
      function (res) {
        alert("Lỗi");
      }
    );
    $scope.bill = [];
    $http.get("http://localhost:3000/bills").then(function (response) {
      $scope.bills = response.data;
    });
    $http.get("http://localhost:3000/users").then(function (response) {
      var users = response.data;
      var filteredUsers = users.filter(function (user) {
        return (
          user.email === $scope.currentUser.email &&
          user.name === $scope.currentUser.name
        );
      });
      if (filteredUsers.length > 0) {
        $scope.matchedUsers = filteredUsers;
      } else {
        // Nếu không có người dùng trùng khớp, bạn có thể xử lý tùy ý ở đây
        console.log("Không tìm thấy người dùng trùng khớp.");
      }
      $scope.getUser = $scope.matchedUsers[0];
    });

    $scope.checkout = function () {
  if (!$scope.currentUser.pttt) {
    $scope.errorMessage = "Vui lòng chọn phương thức thanh toán.";
    return;
  } else {
    $scope.errorMessage = "";
  }
  if (
    !$scope.currentUser.phone ||
    $scope.currentUser.phone.length < 9 ||
    $scope.currentUser.phone.length > 11 ||
    $scope.currentUser.phone[0] !== "0"
  ) {
    alert(
      "Vui lòng nhập số điện thoại bắt đầu bằng số 0 và có độ dài từ 9 đến 11 số!"
    );
    return;
  }
  var data = {
    name: $scope.currentUser.name,
    phone: $scope.currentUser.phone,
    email: $scope.currentUser.email,
    address:
      $scope.currentUser.xa.Name +
      ", " +
      $scope.currentUser.huyen.Name +
      ", " +
      $scope.currentUser.tinh.Name,
    note: $scope.currentUser.note,
    paymentMethod: $scope.currentUser.pttt,
    status: "Chờ xử lý",
    cart: $scope.cart, // Thêm dữ liệu từ biến cart vào đây
  };

  // Gửi dữ liệu hóa đơn
  $http
    .post("http://localhost:3000/bills", data)
    .then(function (response) {
      alert("Đã gửi dữ liệu thành công");
      $cookies.remove("cart");
      $location.path("/bill");
    })
    .catch(function (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi gửi dữ liệu: ", error);
    });

  
};

  })
  //Register-login Controller
  .controller("registerCtrl", function ($scope, $location, $http) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    //adđ user rergister
    $scope.users = [];
    $http.get("http://localhost:3000/users").then(function (response) {
      $scope.users = response.data;
      console.log($scope.users);
    });
    $scope.addUser = function () {
      var existingUser = $scope.users.find(function (user) {
        return (
          user.name === $scope.newUser.name ||
          user.email === $scope.newUser.email
        );
      });
      if (
        !$scope.newUser.phone ||
        $scope.newUser.phone.length < 9 ||
        $scope.newUser.phone.length > 11 ||
        $scope.newUser.phone[0] !== "0"
      ) {
        alert(
          "Vui lòng nhập số điện thoại bắt đầu bằng số 0 và có độ dài từ 9 đến 11 số!"
        );
        return;
      }
      if (existingUser) {
        alert(
          "Tên người dùng hoặc email đã tồn tại. Vui lòng chọn tên người dùng hoặc email khác."
        );
        document.querySelector('input[type="text"]').focus();
        return;
      }
      if ($scope.newUser.password == null) {
        alert("Vui lòng nhập lại mật khẩu đúng yêu cầu !");
        return;
      }

      $scope.newUser.img_user = "user1.png";
      $scope.newUser.role = 0;
      $http
        .post("http://localhost:3000/users", $scope.newUser)
        .then(function (response) {
          $scope.users.push(response.data);
          $scope.newUser = {};
          alert("Chúc mừng bạn đã đăng ký thành công!");
          $location.path("/login");
        });
    };
  })
  .controller(
    "loginCtrl",
    function ($scope, $location, $http, $window, $rootScope, $route) {
      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

      // Khai báo biến $scope.currentUser để hiển thị thông tin người dùng đăng nhập
      $rootScope.currentUser =
        JSON.parse($window.sessionStorage.getItem("currentUser")) || null;

      $scope.checkcurrUser = function (foundUser) {
        $window.sessionStorage.setItem(
          "currentUser",
          JSON.stringify(foundUser)
        );
        $rootScope.currentUser = foundUser;
      };
      $scope.shouldShowDropdown = function() {
        return angular.isDefined($scope.checkcurrUser);
      };
      // Xử lý đăng nhập
      $scope.login = function () {
        var data = {
          email: $scope.users.loginEmail,
          password: $scope.users.loginPassword,
        };
        // Lấy dữ liệu người dùng từ server
        $http
          .get("http://localhost:3000/users")
          .then(function (response) {
            // Gán dữ liệu người dùng vào $scope.users
            $scope.users = response.data;

            // Tìm kiếm trong mảng users
            var foundUser = $scope.users.find(function (user) {
              return (
                user.email === data.email && user.password === data.password
              );
            });

            // Nếu tìm thấy người dùng
            if (foundUser) {
              alert("Đăng nhập thành công");
              $scope.checkcurrUser(foundUser)
              $route.reload();
              $location.path("/"); // Redirect hoặc thực hiện các hành động khác sau khi đăng nhập thành công
            } else {
              alert("Email hoặc mật khẩu không đúng");
            }
          })
          .catch(function (error) {
            console.error("Đã xảy ra lỗi: ", error);
          });
      };

      // Lấy dữ liệu người dùng từ server
      $http
        .get("http://localhost:3000/users")
        .then(function (response) {
          // Lưu trữ dữ liệu người dùng vào biến users
          $scope.users = response.data;
        })
        .catch(function (error) {
          console.error("Đã xảy ra lỗi: ", error);
        });
    }
  )
  //Home Controller
  .controller("homeCtrl", function ($scope) {})
  .controller("productCtrl", function ($scope) {
    //lấy tổng danh mục áo quần
    $scope.countAo = 0;
    $scope.countQuan = 0;
    angular.forEach($scope.dspro, function (product) {
      if (product.categories_id == 1) {
        $scope.countAo++;
      } else if (product.categories_id == 2) {
        $scope.countQuan++;
      }
    });

    $scope.customFilter = function (product) {
      // Kiểm tra nếu có mức giá được chọn
      if ($scope.selectedPrice) {
        // Lọc sản phẩm theo mức giá
        switch ($scope.selectedPrice) {
          case "Dưới 100.000đ":
            if (product.price >= 0 && product.price < 100) {
              return checkCategory(product);
            }
            break;
          case "Từ 100.000đ - 300.000đ":
            if (product.price >= 100 && product.price <= 300) {
              return checkCategory(product);
            }
            break;
          case "Từ 300.000đ - 500.000đ":
            if (product.price > 300 && product.price <= 500) {
              return checkCategory(product);
            }
            break;
          case "Từ 500.000đ - 1 triệu":
            if (product.price > 500 && product.price <= 1000) {
              return checkCategory(product);
            }
            break;
          case "Trên 1 triệu":
            if (product.price > 1000) {
              return checkCategory(product);
            }
            break;
          default:
            return checkCategory(product); // Hiển thị tất cả sản phẩm nếu không phù hợp với bất kỳ mức giá nào
        }
      } else if (!$scope.isCheckAo && !$scope.isCheckQuan) {
        // Nếu không có mức giá được chọn và không có loại sản phẩm nào được chọn, hiển thị tất cả sản phẩm
        return true;
      } else {
        // Nếu không có mức giá được chọn, chỉ kiểm tra loại sản phẩm
        return checkCategory(product);
      }
    };

    function checkCategory(product) {
      // Lọc sản phẩm theo loại sản phẩm (áo hoặc quần) nếu cả hai loại sản phẩm được chọn
      if (!$scope.isCheckAo && !$scope.isCheckQuan) {
        return true;
      }
      // Lọc sản phẩm theo loại sản phẩm (áo hoặc quần) nếu chỉ có một trong hai loại sản phẩm được chọn
      if (
        ($scope.isCheckAo && product.categories_id === 1) ||
        ($scope.isCheckQuan && product.categories_id === 2)
      ) {
        return true;
      }
      return false;
    }

    //lọc sản phẩm option
    $scope.prop = "name";
    $scope.nameSortby = "Mặc định";
    $scope.sortBy = function (prop, nameSortby) {
      $scope.prop = prop;
      $scope.nameSortby = nameSortby;
    };

    //phân trang
    $scope.limit = 8;
    $scope.page = 1;
    $scope.chuyentrang = function (trang) {
      $scope.page = trang;
      $scope.begin = ($scope.page - 1) * $scope.limit;
    };
    $scope.tongTrang = function () {
      // Thêm sản phẩm vào danh sách dspro
      // Tính lại số trang sau khi thêm sản phẩ
      return Math.ceil($scope.dspro.length / $scope.limit);
    };
    $scope.pageList = function () {
      let arr = [];
      // Tạo 1 mảng từ 1-> n là tổng số trang
      for (let i = 0; i <= $scope.tongTrang(); i++) {
        arr.push(i);
      }
      return arr;
    };
  })

  //Product details controler is
  .controller("pro_detailsCtrl", function ($scope, $routeParams, $http, $sce) {
    $scope.dsSp = [];
    $http.get("db.json").then(
      function (res) {
        $scope.dsSp = res.data.products;
        $scope.id = $routeParams.id;
        $scope.idSp = $scope.dsSp.filter((i) => i.id == $scope.id)[0];
        $scope.idspDetail = $scope.idSp.product_detail;
        $scope.renderedHTML = $sce.trustAsHtml(
          $scope.idspDetail[0].infor_detail
        );
        console.log($scope.cart);
        console.log($scope.renderedHTML);
      },
      function (res) {
        alert("Lỗi");
      }
    );
    // show số lượng trong chitietsp
    $scope.idQdetail = function (id) {
      for (var i = 0; i < $scope.cart.length; i++) {
        if ($scope.cart[i].id === id) {
          return i; // Trả về vị trí của object có id tương ứng trong mảng cart[]
        }
      }
      return -1; // Trả về -1 nếu không tìm thấy
    };
  })
  .controller("newsdetailsCtrl", function ($scope, $routeParams, $http, $sce) {
    $scope.dsSp = [];
    $http.get("db.json").then(
      function (res) {
        $scope.dsSp = res.data.news;
        $scope.id = $routeParams.id;
        $scope.idNews = $scope.dsSp.filter((i) => i.id == $scope.id)[0];
        $scope.renderedHTML = $sce.trustAsHtml($scope.idNews.contents);
        console.log($scope.renderedHTML);
      },
      function (res) {
        alert("Lỗi");
      }
    );
  })
  .controller("inforUserCtrll", function ($scope, $http, $window) {
    console.log($scope.currentUser);
    var userUrl = "http://localhost:3000/users";
    var billUrl = "http://localhost:3000/bills";
    $http.get(userUrl).then(
      function (response) {
        // Lưu danh sách người dùng vào biến
        var userList = response.data;
        // Lọc danh sách người dùng theo email và name của currentUser
        var filteredUsers = userList.filter(function (user) {
          return (
            user.email === $scope.currentUser.email &&
            user.name === $scope.currentUser.name
          );
        });
        if (filteredUsers.length > 0) {
          $scope.matchedUsers = filteredUsers;
        } else {
          // Nếu không có người dùng trùng khớp, bạn có thể xử lý tùy ý ở đây
          console.log("Không tìm thấy người dùng trùng khớp.");
        }
        $scope.handleFileSelect = function (element) {
          var file = element.files[0];
          var reader = new FileReader();
          reader.onload = function (e) {
            // Gán dữ liệu hình ảnh cho thuộc tính img_user của matchedUsers
            $scope.matchedUsers[0].img_user = e.target.result;
            $scope.$apply(); // Cập nhật ngữ cảnh AngularJS
          };
          reader.readAsDataURL(file);
        };

        $scope.editUsersss = function () {
          if (
            !$scope.matchedUsers[0].phone ||
            $scope.matchedUsers[0].phone.length < 9 ||
            $scope.matchedUsers[0].phone.length > 11 ||
            $scope.matchedUsers[0].phone[0] !== "0"
          ) {
            alert(
              "Vui lòng nhập số điện thoại bắt đầu bằng số 0 và có độ dài từ 9 đến 11 số!"
            );
            return;
          }
          if ($scope.matchedUsers[0].password == null) {
            alert("Vui lòng nhập lại mật khẩu đúng yêu cầu !");
            return;
          }
          $http;
          $http
            .put(
              userUrl + "/" + $scope.matchedUsers[0].id,
              $scope.matchedUsers[0]
            )
            .then(
              function (response) {
                // Xử lý phản hồi thành công
                // Cập nhật session với dữ liệu mới từ phản hồi của máy chủ
                $window.sessionStorage.setItem(
                  "currentUser",
                  JSON.stringify(response.data)
                );
                console.log("Sửa sản phẩm thành công:", response.data);
              },
              function (error) {
                // Xử lý lỗi
                console.error("Lỗi khi sửa sản phẩm:", error);
              }
            );
        };
      },
      function (error) {
        alert("Lỗi khi lấy dữ liệu từ API.");
      }
    );
    $http.get(billUrl).then(
      function (response) {
        // Lưu danh sách người dùng vào biến
        var billList = response.data;
        // Lọc danh sách người dùng theo email và name của currentUser
        var filteredBills = billList.filter(function (bill) {
          return (
            bill.email === $scope.currentUser.email &&
            bill.name === $scope.currentUser.name
          );
        });
        if (filteredBills.length > 0) {
          $scope.matchedbills = filteredBills;
        } else {
          // Nếu không có người dùng trùng khớp, bạn có thể xử lý tùy ý ở đây
          console.log("Không tìm thấy người dùng trùng khớp.");
        }
        $scope.getUserbill = $scope.matchedbills.reverse();
        console.log($scope.getUserbill);

        $scope.calculateTotal = function (cart) {
          var totalQuantity = 0;
          var totalPrice = 0;
          for (var i = 0; i < cart.length; i++) {
            totalQuantity += cart[i].quantity;
            totalPrice += cart[i].price * cart[i].quantity;
          }
          return { totalQuantity: totalQuantity, totalPrice: totalPrice };
        };
      },
      function (error) {
        alert("Lỗi khi lấy dữ liệu từ API.");
      }
    );
    //show model chi tiet
    $scope.detailBill = function (id) {
      var idNew = id.toString();
      $http.get(billUrl + "/" + idNew).then(function (res) {
        $scope.idBill = res.data;
        $scope.idBillCart = res.data.cart;
        console.log($scope.idBill);
        console.log($scope.idBillCart);
        var totalQuantity = 0;
        var totalPrice = 0;
        for (var i = 0; i < $scope.idBillCart.length; i++) {
          totalQuantity += $scope.idBillCart[i].quantity;
          totalPrice +=
            $scope.idBillCart[i].price * $scope.idBillCart[i].quantity;
        }
        $scope.totalQuantity = totalQuantity;
        $scope.totalPrice = totalPrice;

        console.log($scope.totalQuantity);
        console.log($scope.totalPrice);
      });
    };
    // Thay đổi trạng thái
    $scope.cancelBill = function (status, id) {
      console.log(status + id);
      var confirmed = confirm("Bạn muốn huỷ đơn hàng");
      if (confirmed) {
        if (status === "Đang giao hàng" || status === "Đơn hàng đã giao") {
          alert(
            "Đơn hàng không thể huỷ khi đang giao hoặc đã giao.\n Bạn có thể yêu cầu trả hàng khi shipper giao."
          );
          return;
        }

        $http.get(billUrl + "/" + id).then(
          function (res) {
            var bill = res.data; // Lấy dữ liệu hóa đơn từ response
            bill.status = "Huỷ đơn hàng"; // Cập nhật trạng thái mới
            $http.put(billUrl + "/" + id, bill).then(
              function (res) {
                alert("Cập nhật thành công");
              },
              function (error) {
                alert("Cập nhật lỗi: " + error.data);
              }
            );
          },
          function (error) {
            alert("Lấy dữ liệu thất bại: " + error.data);
          }
        );
      }
    };
  });
