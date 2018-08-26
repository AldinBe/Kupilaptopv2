function SingleLaptopController($scope, $http, $routeParams){
    console.log("Hello from Single Car Controller");
    var config = {headers:  {
        'Authorization': 'Basic TmljayBDZXJtaW5hcmE6cGFzc3dvcmQ=',
        'Accept': 'application/json;odata=verbose',
        "JWT" : localStorage.getItem('user')
        }
     };
    get_laptopById();

    //Single Laptop
    function get_laptopById() {
        var id = $routeParams.laptop;
        $http.get('/singleLaptop/' + id, config).then(function(data) {
        $scope.laptop_info = data.data;
        console.log($scope.laptop_info);
        });
    }
}