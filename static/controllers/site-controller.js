function SiteController($scope, $http, toastr, $location){
    console.log("Hello from Site Controller");
    //Check user login
    $scope.check_login = function(){
        if(localStorage.getItem('user')){
            return true;
        }
        return false;
    }
    //Chech admin login
    $scope.check_admin = function(){
        if(localStorage.getItem('type') == "admin"){
            return true;
        }
        return false;
    }
    //Login func
    $scope.login = function(credentials){
        $http.post('/login', credentials).then(function(response){
            if(typeof response.data.token != 'undefined'){
                localStorage.setItem('user',response.data.token)
                localStorage.setItem('type', response.data.type)
                toastr.success('Uspješna Prijava');
                if(localStorage.getItem('type') == "user" ){
                    $location.url('/');
                } else if(localStorage.getItem('type') == "admin"){
                    $location.url('/adminPanel');
                }
            }
            else if(response.data.user == false){
                toastr.error('Login Error');
            }
        }),function(response){
            console.log(error);
        }
    }
    //Logout func
    $scope.logout = function(){
        localStorage.clear();
        toastr.info("Uspješno ste se odjavili");
    }
    //Modal func
    $scope.openModal = function () {
        $scope.visible = false;
        $scope.visible = $scope.visible = true;
      }
      $scope.closeModal = function () {
        $scope.visible = true;
        $scope.visible = $scope.visible = false;
      }
          $scope.getSingle = function(id){
        $http.get('/getSingle/' + id).then(function(res) {
            $scope.laptop_info = res.data[0];
            console.log($scope.laptop_info);
        })
    };
}