function RegistrationController($scope, $http, toastr, $location){
    console.log("Hello from Registration Controller");
    
    $scope.add_user = function(){
        $http.post('/register', $scope.user).then(function(data){
          if(data.status == 204){
            toastr.info("Email je zauzet");
            $scope.user.email = '';
          }else{
          $scope.user = null;
          toastr.success("Uspješno ste se registrovali! Molimo vas da se logujete!", "Uspješna Registracija!");
          $location.url('/');
          $scope.users_list.push(data);
          }
        });
      }
  }