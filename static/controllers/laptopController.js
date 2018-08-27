function laptopController($scope, $http, toastr, $routeParams, $location){
  console.log("ADD LAPTOP");
  $scope.submit = true;

  var config = {headers:  {
    'Authorization': 'Basic TmljayBDZXJtaW5hcmE6cGFzc3dvcmQ=',
    'Accept': 'application/json;odata=verbose',
    "JWT" : localStorage.getItem('user')
    }
 };

 get_params();

function get_params(){
  $scope.laptop_name = $routeParams.laptop_name;
  $scope.laptop_cijena = $routeParams.cijena;
}

 console.log(localStorage.getItem('user'))
 console.log(localStorage.getItem('type'))

 //Get Laptop
  var refresh_laptop = function () {
      $http.get('/users/laptopi', config).then(function (response) {
        $scope.laptopi = response.data
      })
    }
    var refresh_orders = function () {
      $http.get('/users/orders', config).then(function (response) {
        $scope.orders = response.data
      })
    }
    var refresh_contact = function () {
      $http.get('/users/contacts', config).then(function (response) {
        $scope.contacts = response.data
      })
    }
    refresh_contact()
    refresh_orders()
    refresh_laptop()

    $scope.make_order = function() {
      $http.post('/users/makeOrder/'+$scope.laptop_name+'/'+$scope.laptop_cijena, $scope.order, config).then(function(data) {
          $scope.order = null;
          toastr.success("Uspješna Narudžba!");
          $location.url('/');
          $scope.orders.push(data);
      });
    }
  $scope.add_contact = function() {
    $http.post('/users/addContact', $scope.contact, config).then(function(data) {
        $scope.contact = null;
        //toastr.success("You are successfully registered! Please Login!", "Registration Successfull!");
        //$location.url('/login');
        $scope.contact.push(data);
        toastr.success('Proizvod uspješno dodan!');
    });
}
  //Create Laptop
  $scope.add_laptop = function() {
    $http.post('/admin/addLaptop', $scope.laptop, config).then(function(data) {
        $scope.laptop = null;
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

  $scope.brendIncludes = [];

  $scope.includeBrend = function(brend) {
    var i = $.inArray(brend, $scope.brendIncludes);
    if (i > -1) {
        $scope.brendIncludes.splice(i, 1);
    } else {
        $scope.brendIncludes.push(brend);
    }
}

  $scope.brendFilter = function(laptopi) {
    if ($scope.brendIncludes.length > 0) {
        if ($.inArray(laptopi.brend, $scope.brendIncludes) < 0)
            return;
    }
    
    return laptopi;
}
$scope.ramIncludes = [];

$scope.includeRam = function(ram) {
  var i = $.inArray(ram, $scope.ramIncludes);
  if (i > -1) {
      $scope.ramIncludes.splice(i, 1);
  } else {
      $scope.ramIncludes.push(ram);
  }
}

$scope.ramFilter = function(laptopi) {
  if ($scope.ramIncludes.length > 0) {
      if ($.inArray(laptopi.ram, $scope.ramIncludes) < 0)
          return;
  }
  
  return laptopi;
}
$scope.velicinaIncludes = [];

$scope.includeVelicina = function(velicina) {
  var i = $.inArray(velicina, $scope.velicinaIncludes);
  if (i > -1) {
      $scope.velicinaIncludes.splice(i, 1);
  } else {
      $scope.velicinaIncludes.push(velicina);
  }
}

$scope.velicinaFilter = function(laptopi) {
  if ($scope.velicinaIncludes.length > 0) {
      if ($.inArray(laptopi.velicina, $scope.velicinaIncludes) < 0)
          return;
  }
  
  return laptopi;
}
}