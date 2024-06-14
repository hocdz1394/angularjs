angular
  .module("admApp", ["ngRoute"])
  .config(function ($routeProvider, $httpProvider) {
    //interceptor vào $httpProvider để kiểm tra trạng thái đăng nhập trước mỗi request
    $httpProvider.interceptors.push(function ($q, $location, $window) {
      return {
        request: function (config) {
          var currentUser = JSON.parse(
            $window.sessionStorage.getItem("currentUser")
          );
          var restrictedPages = [
            "/qlsanpham",
            "/qldanhmuc",
            "/qldonhang",
            "/qlnews",
            "/qluser",
            "/totaql",
            "/addsanpham",
            "/adddonhang",
            "/addnews",
            "/adduser",
            "/",
          ];
          // Kiểm tra xem người dùng có truy cập vào trang cần đăng nhập không
          if (
            restrictedPages.indexOf($location.path()) !== -1 &&
            !currentUser
          ) {
            $location.path("/login");
          }
          return config;
        },
      };
    });

    $routeProvider
      .when("/", {
        templateUrl: "layouts/home.html",
      })
      .when("/qlsanpham", {
        templateUrl: "layouts/qlsanpham.html",
        controller: "qlsanphamCtrl",
      })
      .when("/addsanpham", {
        templateUrl: "layouts/addsanpham.html",
      })
      .when("/qldanhmuc", {
        templateUrl: "layouts/qldanhmuc.html",
      })
      .when("/qldonhang", {
        templateUrl: "layouts/qldonhang.html",
        controller: "qldonhangCtrl",
      })
      .when("/qlnews", {
        templateUrl: "layouts/qlnews.html",
        controller: "qlnewsCtrl",
      })
      .when("/addnews", {
        templateUrl: "layouts/addnews.html",
        controller: "qlnewsCtrl",
      })
      .when("/qluser", {
        templateUrl: "layouts/qluser.html",
        controller: "qluserCtrl",
      })
      .when("/adduser", {
        templateUrl: "layouts/adduser.html",
        controller: "qluserCtrl",
      })
      .when("/totaql", {
        templateUrl: "layouts/totalql.html",
      })
      .when("/login", {
        templateUrl: "layouts/login.html",
        controller: "loginCtrl",
      })
      .otherwise({
        redirectTo: "/",
      });
  })
  .controller(
    "loginCtrl",
    function ($scope, $rootScope, $http, $location, $window) {
      $scope.login = function () {
        var userUrl = "http://localhost:3000/users";
        var data = {
          email: $scope.User.email,
          password: $scope.User.password,
        };
        // Lấy dữ liệu người dùng từ server
        $http
          .get(userUrl)
          .then(function (response) {
            // Gán dữ liệu người dùng vào $scope.users
            $scope.users = response.data;
            console.log($scope.users);
            // Tìm kiếm trong mảng users
            var foundUser = $scope.users.find(function (user) {
              return (
                user.email === data.email && user.password === data.password
              );
            });

            // Nếu tìm thấy người dùng
            if (foundUser) {
              if (foundUser.role != 1) {
                alert("Đây không phải là tài khoản quản trị");
                return;
              }
              alert("Đăng nhập thành công");
              console.log("Đăng nhập thành công");
              // Cập nhật thông tin người dùng đăng nhập vào biến $rootScope.currentUser và sessionStorage
              $window.sessionStorage.setItem(
                "currentUser",
                JSON.stringify(foundUser)
              );

              $rootScope.currentUser = foundUser;
              $location.path("/"); // Redirect hoặc thực hiện các hành động khác sau khi đăng nhập thành công
            } else {
              alert("Email hoặc mật khẩu không đúng");
              console.log("Email hoặc mật khẩu không đúng");
            }
          })
          .catch(function (error) {
            console.error("Đã xảy ra lỗi: ", error);
          });
      };
    }
  )
  .controller("admCtrl", function ($scope, $http, $location, $window) {
  
    var userUrlall = "http://localhost:3000/users";
    var billUrlall = "http://localhost:3000/bills";
    var productUrlall = "http://localhost:3000/products";
    var newUrlall = "http://localhost:3000/news";
    $http.get(userUrlall).then(function (res) {
      $scope.arrUserall = res.data;
      console.log($scope.arrUserall);
    });
    $http.get(productUrlall).then(function (res) {
      $scope.arrProall = res.data;
      console.log($scope.arrProall);
    });
    $http.get(billUrlall).then(function (res) {
      $scope.arrBillall = res.data;
      console.log($scope.arrBillall);
    });
    $http.get(newUrlall).then(function (res) {
      $scope.arrNewall = res.data;
      console.log($scope.arrNewall);
    });

    //Kiểm tra xem có hiện ở url nào thì active nó lên
    $scope.isActive = function (viewLocation) {
      var path = $location.path().split("/")[1];
      if (path === viewLocation) {
        return "active";
      } else {
        return "";
      }
    };
    //hiển thị thông tin người dùng
    var currentUser = $window.sessionStorage.getItem("currentUser");

    // Nếu có thông tin người dùng
    if (currentUser) {
      $scope.currentUser = JSON.parse(currentUser);
    }
    $scope.logout = function () {
      console.log("đã check");
      // Xóa session của người dùng
      $window.sessionStorage.removeItem("currentUser");
      // Chuyển hướng người dùng đến trang đăng nhập hoặc trang chủ
      $location.path("/login"); // hoặc $location.path("/");
    };
    $scope.blockPage = function () {
      return $location.path() == "/login";
    };
    // Hàm để trả về class của body
    $scope.getBodyClass = function () {
      return $scope.blockPage() ? "" : "app sidebar-mini rtl";
    };
    console.log($scope.isLoginPage);
    var baseUrl = "http://localhost:3000/products";
    var baseUrl1 = "http://localhost:3000/categories";
    $http.get(baseUrl).then(
      function (response) {
        $scope.arrSp = response.data;
        // ép kiểm id thành number
        $scope.arrSpNumber = response.data.map(function (product) {
          product.id = parseInt(product.id); // Ép kiểu ID thành số
          return product;
        });
        console.log($scope.arrSp);
        // Thêm sản phẩm
        $scope.addProduct = { product_detail: [] }; //Tạo mảng rỗng
        // Hàm chuyển đổi ảnh thành base64

        $scope.uploadFile = function (input) {
          if (input.files && input.files.length > 0) {
            for (var i = 0; i < input.files.length; i++) {
              var reader = new FileReader();
              reader.onload = function (e) {
                $scope.$apply(function () {
                  // Lưu dữ liệu base64 vào một mảng trong $scope
                  if (!$scope.addProduct.thumbnai_img) {
                    $scope.addProduct.thumbnai_img = [];
                  }
                  $scope.addProduct.thumbnai_img.push(e.target.result);
                });
              };
              reader.readAsDataURL(input.files[i]);
            }
          }
        };
        $scope.addProducts = function () {
          //kiểm tra giá vốn lớn hơn giá bán
          if ($scope.addProduct.price >= $scope.addProduct.listed_price) {
            alert("Vui lòng nhập giá bán nhỏ hơn giá niêm yết. ");
            return;
          }
          //kiểm tra check radio
          if (!$scope.addProduct.gender) {
            // Hiển thị thông báo lỗi hoặc thực hiện các hành động khác
            alert("Bạn phải chọn một thể loại.");
            return; // Ngăn chặn việc gửi biểu mẫu nếu không có nút radio nào được chọn
          }
          //kiểm tra check checkbox
          if (
            !$scope.addProduct.isFlashsale &&
            !$scope.addProduct.isNewproducts &&
            !$scope.addProduct.isFeature
          ) {
            // Hiển thị thông báo lỗi hoặc thực hiện các hành động khác
            alert("Bạn phải chọn trạng thái của sản phẩm.");
            return; // Ngăn chặn việc gửi biểu mẫu nếu không có ô kiểm nào được chọn
          }

          // Tìm ID lớn nhất trong mảng hiện tại
          var maxId = 0;
          $scope.arrSp.forEach(function (product) {
            var currentId = parseInt(product.id);
            if (currentId > maxId) {
              maxId = currentId;
            }
          });
          // Tạo một đối tượng mới chứa thông tin infor_detail
          var productDetail = {
            infor_detail: $scope.addProduct.infor_detail,
          };
          // Đẩy đối tượng productDetail vào mảng product_detail
          $scope.addProduct.product_detail.push(productDetail);

          // Tăng ID lớn nhất lên một đơn vị để sử dụng cho sản phẩm mới

          maxId++;
          var data = {
            id: maxId.toString(),
            name: $scope.addProduct.name,
            categories_id: $scope.addProduct.categories_id,
            price: $scope.addProduct.price,
            listed_price: $scope.addProduct.listed_price,
            product_detail: $scope.addProduct.product_detail,
            gender: $scope.addProduct.gender,
            size: ["S", "M", "L", "XL"],
            date: new Date().toISOString().slice(0, 19).replace("T", " "),
            thumbnai_img: $scope.addProduct.thumbnai_img,

            isFlashsale: $scope.addProduct.isFlashsale,
            isNewproducts: $scope.addProduct.isNewproducts,
            isFeature: $scope.addProduct.isFeature,
          };
          $http.post(baseUrl, data).then(
            function (res) {
              console.log("Thêm sản phẩm thành công.");
              $location.path("/qlsanpham");
            },
            function (error) {
              console.log("Lỗi khi thêm sản phẩm.", error);
            }
          );
        };
      },
      function (response) {
        alert("kết nối không thành công");
      }
    );
    $http.get(baseUrl1).then(
      function (response) {
        $scope.arrCata = response.data;
        console.log($scope.arrCata);
      },
      function (response) {
        alert("kết nối không thành công");
      }
    );
    //show hình ảnh addsp
    $scope.isBase64 = function (imageData) {
      // Kiểm tra xem imageData có phải là một chuỗi base64 không
      return /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/.test(imageData);
    };

    //Xoá 1 sản phẩm
    $scope.removeOnepro = function (id) {
      var result = confirm("Bạn có muốn xoá sản phẩm này. ");
      if (result === true) {
        $http.delete(baseUrl + "/" + id).then(
          function (response) {
            // Xoá sản phẩm từ mảng arrSp nếu request DELETE thành công
            // $scope.arrSp = $scope.arrSp.filter((product) => product.id !== id);
            console.log("Sản phẩm đã được xoá thành công");
          },
          function (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
          }
        );
      }
    };
  })
  .controller("qlsanphamCtrl", function ($scope, $http) {
    console.log($scope.arrSp);
    $scope.editmodelSP = function (id) {
      // Chuyển đổi id sang chuỗi
      var stringId = id.toString();
      $http.get("http://localhost:3000/products/" + stringId).then(
        function (response) {
          // Gán thông tin của sản phẩm vào biến $scope.editProduct
          $scope.editProduct = response.data;
          console.log($scope.editProduct);
        },
        function (error) {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        }
      );
    };

    $scope.editFile = function (input) {
      if (input.files && input.files.length > 0) {
        for (var i = 0; i < input.files.length; i++) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.$apply(function () {
              // Tạo một đối tượng hình ảnh mới chứa dữ liệu base64
              var newImage = {
                data: e.target.result,
              };
              // Thêm hình ảnh mới vào mảng
              if (!$scope.editProduct.thumbnai_img) {
                $scope.editProduct.thumbnai_img = [];
              }
              $scope.editProduct.thumbnai_img.push(newImage);
            });
          };
          reader.readAsDataURL(input.files[i]);
        }
      }
    };

    $scope.editProducts = function () {
      //kiểm tra giá vốn lớn hơn giá bán
      if ($scope.editProduct.price >= $scope.editProduct.listed_price) {
        alert("Vui lòng nhập giá bán nhỏ hơn giá niêm yết. ");
        return;
      }
      //kiểm tra check radio
      if (!$scope.editProduct.gender) {
        // Hiển thị thông báo lỗi hoặc thực hiện các hành động khác
        alert("Bạn phải chọn một thể loại.");
        return; // Ngăn chặn việc gửi biểu mẫu nếu không có nút radio nào được chọn
      }
      //kiểm tra check checkbox
      if (
        !$scope.editProduct.isFlashsale &&
        !$scope.editProduct.isNewproducts &&
        !$scope.editProduct.isFeature
      ) {
        // Hiển thị thông báo lỗi hoặc thực hiện các hành động khác
        alert("Bạn phải chọn trạng thái của sản phẩm.");
        return; // Ngăn chặn việc gửi biểu mẫu nếu không có ô kiểm nào được chọn
      }
      // Gửi yêu cầu PUT để cập nhật thông tin sản phẩm
      $http
        .put(
          "http://localhost:3000/products/" + $scope.editProduct.id,
          $scope.editProduct
        )
        .then(
          function (response) {
            // Xử lý phản hồi thành công
            console.log("Sửa sản phẩm thành công:", response.data);
          },
          function (error) {
            // Xử lý lỗi
            console.error("Lỗi khi sửa sản phẩm:", error);
          }
        );
    };
  })
  .controller("qldonhangCtrl", function ($scope, $http) {
    var billUrl = "http://localhost:3000/bills";
    $http.get(billUrl).then(
      function (res) {
        $scope.arrBills = res.data.reverse();

        console.log($scope.arrBills);
        // console.table($scope.arrBills);
        $scope.calculateTotal = function (cart) {
          var totalQuantity = 0;
          var totalPrice = 0;
          for (var i = 0; i < cart.length; i++) {
            totalQuantity += cart[i].quantity;
            totalPrice += cart[i].price * cart[i].quantity;
          }
          return { totalQuantity: totalQuantity, totalPrice: totalPrice };
        };
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
        $scope.changeStatus = function (status, id) {
          var newStatus;
          if (status === "Chờ xử lý") {
            newStatus = "Đang giao hàng";
          } else if (status === "Đang giao hàng") {
            newStatus = "Đơn hàng đã giao";
          }
          if (status === "Huỷ đơn hàng") {
            newStatus = "Đơn hàng đã huỷ";
          }
          $http.get(billUrl + "/" + id).then(
            function (res) {
              var bill = res.data; // Lấy dữ liệu hóa đơn từ response
              bill.status = newStatus; // Cập nhật trạng thái mới
              $http.put(billUrl + "/" + id, bill).then(
                function (res) {
                  alert("Cập nhật thành công");
                },
                function (error) {
                  alert("Cập nhật lỗi", +error);
                }
              );
            },
            function (res) {
              alert("lấy dữ liệu thất bại");
            }
          );
        };
      },
      function (error) {
        alert("lỗi kết nối. " + error);
      }
    );
  })
  .controller("qlnewsCtrl", function ($scope, $http, $location) {
    var newsUrl = "http://localhost:3000/news";
    $http.get(newsUrl).then(
      function (response) {
        $scope.arrNew = response.data;
        console.log($scope.arrNew);
        // Thêm Bài viết
        // Hàm chuyển đổi ảnh thành base64
        $scope.uploadFileNew = function (input) {
          if (input.files && input.files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
              $scope.$apply(function () {
                // Lưu dữ liệu base64 vào $scope.addNew.img_detail
                $scope.addNew.img_news = e.target.result;
              });
            };
            // Đọc chỉ tệp đầu tiên trong mảng input.files
            reader.readAsDataURL(input.files[0]);
          }
        };
        $scope.addNews = function () {
          //kiểm tra check checkbox
          if (!$scope.addNew.trend && !$scope.addNew.style) {
            alert("Bạn phải chọn thể loại của bài viết.");
            return;
          }
          var maxId = 0;
          $scope.arrNew.forEach(function (user) {
            var currentId = parseInt(user.id);
            if (currentId > maxId) {
              maxId = currentId;
            }
          });
          maxId++;
          var data = {
            id: maxId.toString(),
            titles: $scope.addNew.titles,
            author: $scope.addNew.author,
            img_news: $scope.addNew.img_news,
            contents: $scope.addNew.contents,
            date: new Date().toISOString().slice(0, 19).replace("T", " "),

            trend: $scope.addNew.trend,
            style: $scope.addNew.style,
          };
          $http.post(newsUrl, data).then(
            function (res) {
              console.log("Thêm sản phẩm thành công.");
              $location.path("/qlnews");
            },
            function (error) {
              console.log("Lỗi khi thêm sản phẩm.", error);
            }
          );
        };
        // Sửa bài viêt
        $scope.editmodelNew = function (id) {
          $http.get(newsUrl + "/" + id).then(
            function (response) {
              // Gán thông tin của sản phẩm vào biến $scope.editProduct
              $scope.editNew = response.data;
              console.log($scope.editNew);
            },
            function (error) {
              console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            }
          );
        };
        $scope.editNews = function () {
          $scope.uploadFileEdit = function (input) {
            if (input.files && input.files.length > 0) {
              var reader = new FileReader();
              reader.onload = function (e) {
                $scope.$apply(function () {
                  // Lưu dữ liệu base64 vào $scope.addNew.img_detail
                  $scope.editNew.img_news = e.target.result;
                });
              };
              $scope.uploadFileEdit(document.getElementById("editNewImage"));
              // Đọc chỉ tệp đầu tiên trong mảng input.files
              reader.readAsDataURL(input.files[0]);
            }
          };
          //kiểm tra check checkbox
          if (!$scope.editNew.style && !$scope.editNew.trend) {
            alert("Bạn phải chọn thể loại của bài viết.");
            return;
          }
          $http.put(newsUrl + "/" + $scope.editNew.id, $scope.editNew).then(
            function (response) {
              // Xử lý phản hồi thành công
              console.log("Sửa sản phẩm thành công:", response.data);
            },
            function (error) {
              // Xử lý lỗi
              console.error("Lỗi khi sửa sản phẩm:", error);
            }
          );
        };
        //Xoá 1 bài viết
        $scope.removeOneNew = function (id) {
          var result = confirm("Bạn có muốn xoá bài viết này. ");
          if (result === true) {
            $http.delete(newsUrl + "/" + id).then(
              function (response) {
                console.log("Sản phẩm đã được xoá thành công");
              },
              function (error) {
                console.error("Lỗi khi xoá sản phẩm:", error);
              }
            );
          }
        };
      },
      function (response) {
        alert("kết nối không thành công");
      }
    );
  })
  .controller("qluserCtrl", function ($scope, $http, $location) {
    var userUrl = "http://localhost:3000/users";
    $http.get(userUrl).then(
      function (response) {
        $scope.arrUser = response.data.reverse();
        console.log($scope.arrUser);

        // ép kiểm id thành number
        $scope.arrUserNumber = response.data.map(function (user) {
          user.id = parseInt(user.id); // Ép kiểu ID thành số
          return user;
        });
        // Thêm người dùng
        // Hàm chuyển đổi ảnh thành base64
        $scope.uploadFileUser = function (input) {
          if (input.files && input.files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
              $scope.$apply(function () {
                // Lưu dữ liệu base64 vào $scope.addNew.img_detail
                $scope.addUser.img_user = e.target.result;
              });
            };
            // Đọc chỉ tệp đầu tiên trong mảng input.files
            reader.readAsDataURL(input.files[0]);
          }
        };
        $scope.editFileUser = function (input) {
          if (input.files && input.files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
              $scope.$apply(function () {
                // Lưu dữ liệu base64 vào $scope.addNew.img_detail
                $scope.editUser.img_user = e.target.result;
              });
            };
            // Đọc chỉ tệp đầu tiên trong mảng input.files
            reader.readAsDataURL(input.files[0]);
          }
        };
        $scope.addUsers = function () {
          var existingUser = $scope.arrUser.find(function (user) {
            return (
              user.name === $scope.addUser.name ||
              user.email === $scope.addUser.email
            );
          });
          if (existingUser) {
            alert(
              "Tên người dùng hoặc email đã tồn tại. Vui lòng chọn tên người dùng hoặc email khác."
            );
            document.querySelector('input[type="text"]').focus();
            return;
          }
          if (
            !$scope.addUser.phone ||
            $scope.addUser.phone.length < 9 ||
            $scope.addUser.phone.length > 11 ||
            $scope.addUser.phone[0] !== "0"
          ) {
            alert(
              "Vui lòng nhập số điện thoại bắt đầu bằng số 0 và có độ dài từ 9 đến 11 số!"
            );
            return;
          }
          if ($scope.addUser.password == null) {
            alert("Vui lòng nhập lại mật khẩu đúng yêu cầu !");
            return;
          }
          //kiểm tra check radio
          if (!$scope.addUser.role) {
            alert("Bạn phải chọn quyền truy cập.");
            return; // Ngăn chặn việc gửi biểu mẫu nếu không có nút radio nào được chọn
          }

          // Tìm ID lớn nhất trong mảng hiện tại
          var maxId = 0;
          $scope.arrUser.forEach(function (user) {
            var currentId = parseInt(user.id);
            if (currentId > maxId) {
              maxId = currentId;
            }
          });
          // Tăng ID lớn nhất lên một đơn vị để sử dụng cho sản phẩm mới

          maxId++;
          var data = {
            id: maxId.toString(),
            name: $scope.addUser.name,
            email: $scope.addUser.email,
            phone: $scope.addUser.phone,
            password: $scope.addUser.password,
            tinh: $scope.addUser.tinh,
            huyen: $scope.addUser.huyen,
            xa: $scope.addUser.xa,
            address:
              $scope.addUser.xa +
              ", " +
              $scope.addUser.huyen +
              ", " +
              $scope.addUser.tinh,
            img_user: $scope.addUser.img_user,
            role: $scope.addUser.role,
            note: $scope.addUser.note,
          };
          $http.post(userUrl, data).then(
            function (res) {
              console.log("Thêm sản phẩm thành công.");
              $location.path("/qluser");
            },
            function (error) {
              console.log("Lỗi khi thêm sản phẩm.", error);
            }
          );
        };
        // Sửa user
        $scope.editmodelUser = function (id) {
          $http.get(userUrl + "/" + id).then(
            function (response) {
              // Gán thông tin của sản phẩm vào biến $scope.editProduct
              $scope.editUser = response.data;
              console.log($scope.editUser);
            },
            function (error) {
              console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            }
          );
        };
        $scope.editUsers = function () {
          if (
            !$scope.editUser.phone ||
            $scope.editUser.phone.length < 9 ||
            $scope.editUser.phone.length > 11 ||
            $scope.editUser.phone[0] !== "0"
          ) {
            alert(
              "Vui lòng nhập số điện thoại bắt đầu bằng số 0 và có độ dài từ 9 đến 11 số!"
            );
            return;
          }
          if ($scope.editUser.password == null) {
            alert("Vui lòng nhập lại mật khẩu đúng yêu cầu !");
            return;
          }
          //kiểm tra check radio
          if (!$scope.editUser.role) {
            alert("Bạn phải chọn quyền truy cập.");
            return; // Ngăn chặn việc gửi biểu mẫu nếu không có nút radio nào được chọn
          }
          // Tạo chuỗi address từ các trường tinh, huyen, xa
          var address =
            $scope.editUser.xa +
            ", " +
            $scope.editUser.huyen +
            ", " +
            $scope.editUser.tinh;
          // Gán giá trị của address vào đối tượng editUser
          $scope.editUser.address = address;

          $http;
          $http.put(userUrl + "/" + $scope.editUser.id, $scope.editUser).then(
            function (response) {
              // Xử lý phản hồi thành công
              console.log("Sửa sản phẩm thành công:", response.data);
            },
            function (error) {
              // Xử lý lỗi
              console.error("Lỗi khi sửa sản phẩm:", error);
            }
          );
        };
        //Xoá 1 user
        $scope.removeOneUser = function (id) {
          var result = confirm("Bạn có muốn xoá người dùng này. ");
          if (result === true) {
            $http.delete(userUrl + "/" + id).then(
              function (response) {
                console.log("Người dùng đã được xoá thành công");
              },
              function (error) {
                console.error("Lỗi khi xoá người dùng:", error);
              }
            );
          }
        };
      },
      function (error) {
        alert("Lỗi" + error);
      }
    );
  })
  .directive("ckEditor", function () {
    return {
      require: "?ngModel",
      link: function (scope, element, attr, ngModel) {
        var editor = CKEDITOR.replace(element[0]);

        if (!ngModel) return;

        editor.on("change", function () {
          scope.$apply(function () {
            ngModel.$setViewValue(editor.getData());
          });
        });

        ngModel.$render = function (value) {
          editor.setData(ngModel.$viewValue);
        };
      },
    };
  })

// Hàm kiểm tra trạng thái đăng nhập
function isLoggedIn() {
  // Thực hiện kiểm tra xem người dùng đã đăng nhập hay chưa
  // Trả về true nếu đã đăng nhập, ngược lại trả về false
}
