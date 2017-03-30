'use strict';

// definición de módulo menu
angular.module('sccnlp.comiteParitario')

.controller('comiteParitarioConsultarCtrl', ['$scope', '$filter', '$state', 'comiteParitarioConsultarMessages', 'sessionService', 'RestClient', 'RestClientComiteParitarioConsultar', function($scope, $filter, $state, comiteParitarioConsultarMessages, sessionService, RestClient, RestClientComiteParitarioConsultar) {

    $scope.messages = comiteParitarioConsultarMessages;
    var dateFormat = 'dd/MM/yyyy';

    $scope.consultar = {
        rutRepresentanteEmpresa: null,
        rutRepresentanteTrabajadores: null,
    }

    console.log($state.params)

    

    //-----tabs
    $scope.tabsActive = 0;
    $scope.tabs = [{
            disable: false
        }, {
            disable: true
        }, ]
        //------

    var format = 'yyyy/MM/dd';

    $scope.init = function() {

        $scope.session_data = sessionService.getUserData();
        RestClient.getDatosEmpresa($scope.session_data.rutEmpresa, function(data) {
            $scope.rutEmpresa = data.rutEmpresa + "-" + data.dvEmpresa;
            $scope.nombreRazon = data.razonSocial;
            $scope.rutRepresentante = data.representante.rut + "-" + data.representante.dv;
            $scope.nombreRepresentanteLegal = data.representante.glosa;
        })

    };
    $scope.init();

    $scope.seleccionarComuna = function(id_region) {

        $scope.comunas = RestClient.getComunasByIdRegion(id_region);
    }

    $scope.buscarComite = function() {

        if ($scope.consultar.rutRepresentanteTrabajadores != null) {
            var trabRutRepre = $scope.consultar.rutRepresentanteTrabajadores.split("-")[0];
            var trabDvtRepre = $scope.consultar.rutRepresentanteTrabajadores.split("-")[1];
        }
        if ($scope.consultar.rutRepresentanteEmpresa != null) {
            var emprRutRepre = $scope.consultar.rutRepresentanteEmpresa.split("-")[0];
            var emprDvRepre = $scope.consultar.rutRepresentanteEmpresa.split("-")[1];
        }

        var idEmpresa = $scope.session_data.idEmpresa;

        RestClientComiteParitarioConsultar.ConsultarComite(idEmpresa, trabRutRepre, trabDvtRepre, emprRutRepre, emprDvRepre, function(data) {
            $scope.comite = [];
            $scope.datosComite = data;
            if (data.length == 0) {
                $scope.mostrarError = true;
                $scope.messageError = "No existen resultados con los criterios de búsqueda ingresados";
            } else {
                $scope.mostrarError = false;
                angular.forEach(data, function(item, index) {
                    $scope.comite.push({
                        rutEmpresa: $scope.rutEmpresa,
                        nombreRazon: $scope.nombreRazon,
                        rutRepresentante: $scope.rutRepresentante,
                        nombreRepresentanteLegal: $scope.nombreRepresentanteLegal,
                        comuna: $scope.consultar.comuna
                    })
                    $scope.viewTableEmpresa = true;
                })
            }
        }, function(error) {
            console.log(error)
        })

    }

    $scope.modificarComite = function(i) {
        $state.go('main.composite.comiteParitario_modificar', {
            data: $scope.datosComite[i]
        });
    }

    $scope.detalleComite = function(tab, index) {

        if (!tab || tab < 1 || tab > 2)
            return;

        $scope.tabs[tab].disable = false;
        $scope.tabs[0].disable = true;
        $scope.tabsActive = tab;

        $scope.detalleComiteRut = $scope.datosComite[index];

        $scope.rutEmpresa = $scope.rutEmpresa;
        $scope.nombreRazon = $scope.nombreRazon;
        $scope.rutRepresentante = $scope.rutRepresentante;
        $scope.nombreRepresentanteLegal = $scope.nombreRepresentanteLegal;

        $scope.direccionFaena = $scope.detalleComiteRut.idDireccion;
        $scope.comuna = $scope.detalleComiteRut.comuna;
        $scope.fechaActoEleccionario = $filter('date')($scope.detalleComiteRut.fechaActoEleccion, dateFormat);
        $scope.tipoComite = $scope.detalleComiteRut.tipoComite;
        $scope.cantidadTrabajadores = $scope.detalleComiteRut.cantidadTrabajador;

        $scope.asumeFunciones = $scope.detalleComiteRut.funcionesFaena;

        $scope.detallesEmpresa = $scope.detalleComiteRut.empresaPari;
        $scope.detallesTrabajador = $scope.detalleComiteRut.empleadoPari;

    }
    $scope.volverConsultar = function(tab) {
        $scope.tabs[tab].disable = false;
        $scope.tabs[1].disable = true;
        $scope.tabsActive = tab;
    }

    $scope.eliminarRegistro = function(i, idComite) {
        RestClientComiteParitarioConsultar.EliminarRegistro(idComite, function(data){
            
        }, function(error){
            
        })
    }

    //-------- Cuando retorna de modificar ejecuta lo siguiente
    if ($state.params.emprRutRepre != null || $state.params.trabRutRepre != null) {

        $scope.consultar = {
            rutRepresentanteEmpresa: $state.params.emprRutRepre + "-" + $state.params.emprDvRepre,
            rutRepresentanteTrabajadores: $state.params.trabRutRepre + "-" + $state.params.trabDvtRepre,
        }

        $scope.buscarComite();
    }

    if ($state.params.idEmpresa != null) {
        $scope.buscarComite();
    }
    //--------
}])