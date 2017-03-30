'use strict';

angular.module('sccnlp.comiteParitario')

.controller('comiteParitarioModificarCtrl', ['$scope', '$state', '$filter', '$timeout', 'comiteParitarioModificarMessages', 'sessionService', 'RestClient', 'RestClientComiteParitarioModificar', function($scope, $state, $filter, $timeout, comiteParitarioModificarMessages, sessionService, RestClient, RestClientComiteParitarioModificar) {

    $scope.messages = comiteParitarioModificarMessages;
    $scope.dateFormat = 'dd/MM/yyyy';
    var format = 'yyyy/MM/dd';
    $scope.mostrarFormulario = true;
    $scope.representantesEmpresa = [];
    $scope.representantesTrabajadores = [];
    $scope.trabajadorLoading = false;
    $scope.empresaLoading = false;

    $scope.comite = {

        direccion: null,
        region: null,
        comuna: null,
        fechaActoEleccionario: null,
        tipoComite: null,
        cantidadTrabajadores: null,
        asumeFuncion: null
    };
    $scope.empresa = {
        rut: null,
        apellidoMaterno: null,
        apellidoPaterno: null,
        nombres: null,
        tipo: null,
        cargo: null,
    }

    $scope.trabajador = {
        rut: null,
        apellidoMaterno: null,
        apellidoPaterno: null,
        nombres: null,
        tipo: null,
        cargo: null,
        posicion: null,
        aforado: false
    }


    $scope.cargo = [{
        id: 1,
        value: "Presidente"
    }, {
        id: 2,
        value: "Secretario"
    }, {
        id: 3,
        value: "Miembro del comité"
    }];

    $scope.tipo = [{
        id: 1,
        value: "Titular"
    }, {
        id: 2,
        value: "Suplente"
    }];


    //------- DATEPICKER ---------------
    $scope.today = function() {
        $scope.comite.fechaActoEleccionario = new Date();
    };
    $scope.today();

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(day, month, year) {
        $scope.comite.fechaActoEleccionario = new Date(day, month, year);
    }

    $scope.popup2 = {
        opened: false
    };
    //------- FIN DATEPICKER ---------------


    //--- variable que contiene el detalle del comite a modificar----
    $scope.detalleComite = $state.params.data;
    console.log($scope.detalleComite)
        //---

    $scope.init = function() {

        $scope.session_data = sessionService.getUserData();
        $scope.regiones = RestClient.getRegion();


        $scope.comunas = RestClient.getComunasByIdRegion($scope.detalleComite.idRegion);

        $scope.comite = {

            direccion: $scope.detalleComite.calle,
            region: $scope.detalleComite.idRegion,
            comuna: $scope.detalleComite.idComuna,
            fechaActoEleccionario: new Date($scope.detalleComite.fechaActoEleccion),
            tipoComite: $scope.detalleComite.idTipoComite.toString(),
            cantidadTrabajadores: $scope.detalleComite.cantidadTrabajador,
            asumeFuncion: $scope.detalleComite.funcionesFaena.toString(),
            idComite: $scope.detalleComite.idComite
        };

        if ($scope.detalleComite.empresaPari.length > 1) {
            $scope.viewTableEmpresa = true;
            $scope.representantesEmpresa = $scope.detalleComite.empresaPari;
        }

        if ($scope.detalleComite.empleadoPari.length > 1) {
            $scope.viewTableTrabajador = true;
            $scope.representantesTrabajadores = $scope.detalleComite.empleadoPari;
        }



        $scope.empresa = {
            rut: null,
            apellidoMaterno: null,
            apellidoPaterno: null,
            nombres: null,
            tipo: null,
            cargo: null,
        }

        $scope.trabajador = {
            rut: null,
            apellidoMaterno: null,
            apellidoPaterno: null,
            nombres: null,
            tipo: null,
            cargo: null,
            posicion: null,
            aforado: false
        }


    };

    $scope.ingresoContinue = function(tab, form) {

        if (form && form.$invalid) {
            return;
        }

        if (!tab || tab < 1 || tab > 2)
            return;

        $scope.tabs[tab].disable = false;
        $scope.tabsActive = tab;

    };

    $scope.seleccionarComuna = function(id_region) {

        $scope.comunas = RestClient.getComunasByIdRegion(id_region);
    }
    $timeout(function() {
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-33.8902, 151.1759),
            new google.maps.LatLng(-33.8474, 151.2631));


        var options = {
            // bounds: defaultBounds,
            types: ['address']
        };

        var input = document.getElementById('direccionGoogleMaps');

        var autocomplete = new google.maps.places.Autocomplete(input, options);
    }, 500);

    // se llaman las funciones de inicialización dinámicas
    $scope.init();

    //-----tabs
    $scope.tabsActive = 0;
    $scope.tabs = [{
                disable: false
            }, //datos de comité
            {
                disable: false //true 
            }, // representante de la empresa
            {
                disable: false //true
            } // representate de los trabajadores
        ]
        //------

    $scope.buscarEmpleado = function(tipo, form) {

        if (form && form.$invalid) {
            return;
        }

        if (tipo == 'empresa') {
            var rut = $scope.empresa.rut
        }
        if (tipo == 'trabajador') {
            var rut = $scope.trabajador.rut
        }

        $scope.personas = RestClient.getDatosPersona(rut.split("-")[0], null, function(data) {

            if (tipo == 'empresa') {
                $scope.idEmpleado = data.id;
                $scope.empresa.nombres = data.nombres;
                $scope.empresa.apellidoMaterno = data.apellidoMaterno;
                $scope.empresa.apellidoPaterno = data.apellidoPaterno;
                $scope.empresaLoading = false;

            }
            if (tipo == 'trabajador') {
                $scope.idEmpleado = data.id;
                $scope.trabajador.nombres = data.nombres;
                $scope.trabajador.apellidoMaterno = data.apellidoMaterno;
                $scope.trabajador.apellidoPaterno = data.apellidoPaterno;
                $scope.trabajadorLoading = false;
            }
        }, function(error) {
            alert(error.data)
        })
    }

    $scope.anadirRepresentanteEmpresa = function() {

        if ($scope.tipo != null && $scope.cargo != null && $scope.empresa.nombres != null && $scope.empresa.apellidoPaterno != null && $scope.empresa.apellidoMaterno != null) {

            if ($scope.representantesEmpresa.length < 7) {

                $scope.representantesEmpresa.push({
                    idEmpleado: $scope.idEmpleado,
                    rut: $scope.empresa.rut,
                    apellidoMaterno: $scope.empresa.apellidoMaterno,
                    apellidoPaterno: $scope.empresa.apellidoPaterno,
                    nombres: $scope.empresa.nombres,
                    idTipo: $scope.empresa.tipo.id,
                    tipo: $scope.empresa.tipo.value,
                    idCargo: $scope.empresa.cargo.id,
                    cargo: $scope.empresa.cargo.value
                })
            } else {
                alert("No se pueden agregar mas registros")
            }
            $scope.viewTableEmpresa = true;
            $scope.limpiarEmpresa();
        } else {
            alert("Debe completar los campos obligarotios")
        }

    }

    $scope.anadirRepresentanteTrabajadores = function() {

        if ($scope.trabajador.tipo != null && $scope.trabajador.cargo != null && $scope.trabajador.nombres != null && $scope.trabajador.apellidoPaterno != null && $scope.trabajador.apellidoMaterno != null && $scope.trabajador.posicion != null && $scope.trabajador.aforado) {

            if ($scope.representantesTrabajadores.length < 7) {

                $scope.representantesTrabajadores.push({
                    idEmpleado: $scope.idEmpleado,
                    rut: $scope.trabajador.rut,
                    posicion: $scope.trabajador.posicion,
                    aforado: $scope.trabajador.aforado,
                    apellidoMaterno: $scope.trabajador.apellidoMaterno,
                    apellidoPaterno: $scope.trabajador.apellidoPaterno,
                    nombres: $scope.trabajador.nombres,
                    idTipo: $scope.trabajador.tipo.id,
                    tipo: $scope.trabajador.tipo.value,
                    idCargo: $scope.trabajador.cargo.id,
                    cargo: $scope.trabajador.cargo.value
                })
            } else {
                alert("No se pueden agregar mas registros")
            }
            $scope.viewTableTrabajador = true;
            $scope.limpiarTrabajador();
        } else {
            alert("Debe completar los campos obligarotios")
        }
    }

    $scope.eliminarRegistro = function(id, tipo) {
        var itemEliminar = id - 1;
        var itemMover = id++;
        if (tipo == 'empresa') {
            $scope.representantesEmpresa.splice(itemEliminar, 1);
        } else {
            $scope.representantesTrabajadores.splice(itemEliminar, 1);
        }

    };

    $scope.limpiarEmpresa = function() {
        $scope.empresa.rut = "";
        $scope.empresa.apellidoMaterno = "";
        $scope.empresa.apellidoPaterno = "";
        $scope.empresa.nombres = "";
        $scope.empresa.tipo = null;
        $scope.empresa.cargo = null;
    }
    $scope.limpiarTrabajador = function() {
        $scope.trabajador.rut = "";
        $scope.trabajador.apellidoMaterno = "";
        $scope.trabajador.apellidoPaterno = "";
        $scope.trabajador.nombres = "";
        $scope.trabajador.tipo = null;
        $scope.trabajador.cargo = null;
        $scope.trabajador.posicion = null;
        $scope.trabajador.aforado = false;
    }

    $scope.registrarComite = function() {

        console.log($scope.comite);

        $scope.data = {

            idEmpresa: parseInt($scope.session_data.id),
            idDireccion: 1,
            idRegion: $scope.comite.region,
            idComuna: $scope.comite.comuna,
            fechaActoEleccion: $filter('date')($scope.comite.fechaActoEleccionario, format),
            idTipoComite: parseInt($scope.comite.tipoComite),
            cantidadTrabajador: $scope.comite.cantidadTrabajadores,
            funcionesFaena: $scope.comite.asumeFuncion,
            empresaPari: $scope.representantesEmpresa,
            empleadoPari: $scope.representantesTrabajadores,
            idComite: $scope.comite.idComite
        }
        console.log($scope.data);

        RestClientComiteParitarioModificar.ModificarComite($scope.data, function(data) {
            $scope.urlCompleta = "";
            angular.forEach(data, function(url, i) {
                $scope.urlCompleta = $scope.urlCompleta + url
            })
            $scope.url = $scope.urlCompleta.split("[")[0];

            $scope.descargaArchivo = $scope.url;
            $scope.mostrarFormulario = false;

        }, function(error) {
            console.log(error)
        })

    }

    $scope.descargaComite = function() {
        window.open($scope.descargaArchivo, '_blank');
    }

    $scope.btnSalir = function() {
        
        console.log("pase")
        var emprRutRepre = $scope.detalleComite.emprRutRepre;
        var emprDvRepre = $scope.detalleComite.emprDvRepre;
        var idEmpresa = $scope.detalleComite.idEmpresa;
        var trabRutRepre = $scope.detalleComite.trabRutRepre;
        var trabDvRepre = $scope.detalleComite.trabDvRepre;
        $state.go('main.composite.comiteParitario_consultar', {
            emprRutRepre: emprRutRepre,
            emprDvRepre: emprDvRepre,
            idEmpresa: idEmpresa,
            trabRutRepre: trabRutRepre,
            trabDvRepre: trabDvRepre,
        });
    }


}])