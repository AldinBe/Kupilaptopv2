function SingleCarController($scope, $http){
    console.log("Hello from Single Car Controller");

    $scope.getSingle = function(id){
        $http.get('/getSingle/' + id).then(function(res) {
            $scope.laptop_info = res.data[0];
            console.log($scope.laptop_info);
        })
    };
}