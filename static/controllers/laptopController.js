function laptopController($scope, $http, toastr){
  console.log("ADD LAPTOP");
  $scope.submit = true;

  var config = {headers:  {
    'Authorization': 'Basic TmljayBDZXJtaW5hcmE6cGFzc3dvcmQ=',
    'Accept': 'application/json;odata=verbose',
    "JWT" : localStorage.getItem('user')
    }
 };

 console.log(localStorage.getItem('user'))
 console.log(localStorage.getItem('type'))
 //Get Laptop
  var refresh_laptop = function () {
      $http.get('/users/laptopi', config).then(function (response) {
        $scope.laptopi = response.data
      })
    }
    refresh_laptop()
  
  //Create Laptop
  $scope.add_laptop = function() {
    $http.post('/admin/addLaptop', $scope.laptop, config).then(function(data) {
        $scope.laptop = null;
        //toastr.success("You are successfully registered! Please Login!", "Registration Successfull!");
        //$location.url('/login');
        $scope.laptopi.push(data);
        toastr.success('Proizvod uspješno dodan!');
        refresh_laptop();
    });
}
  //Delete Laptop
  $scope.deleteLaptop = function (id) {
    console.log('delete laptop')
    console.log(id)
    $http.delete('/admin/laptopi/' + id, config).then(function (response) {
      console.log('removed')
      toastr.error("Laptop izbrisan")
    })
    refresh_laptop()
  }
 //edit / update laptop
  $scope.editLaptop = function (id) {
    console.log('Selected Laptop')
    console.log(id)
    $http.get('/admin/laptopi/' + id, config).then(function (response) {
      console.log('selected')
      $scope.laptop = response.data
    })
  }
  $scope.updateLaptop = function () {
    console.log('Update Laptop')
    console.log($scope.laptopi._id)
    $http.put('/admin/laptopi/' + $scope.laptop._id, $scope.laptop, config).then(function (response) {
      console.log('update')
      $scope.laptop.ime = ''
      $scope.laptop.brend = ''
      $scope.laptop.vrsta = ''
      $scope.laptop.procesor = ''
      $scope.laptop.procesorGeneracija = ''
      $scope.laptop.brzinaProcesora = ''
      $scope.laptop.ram = ''
      $scope.laptop.graficka = ''
      $scope.laptop.vrstaGraficke = ''
      $scope.laptop.kapacitetGraficke = ''
      $scope.laptop.vrstaMemorije = ''
      $scope.laptop.kapacitetMemorije = ''
      $scope.laptop.velicina = ''
      $scope.laptop.cijena = ''

      toastr.success("Laptop updated successfully")
      refresh_laptop()
    })
  }
  //Moda func
  $scope.openModal = function () {
    $scope.visible = false;
    $scope.visible = $scope.visible = true;
  }
  $scope.closeModal = function () {
    $scope.visible = true;
    $scope.visible = $scope.visible = false;
  }
  //Filteri
  $scope.rowLimit = 3;
  $scope.sortColumn = "cijena";
}