'use strict';

// definición de módulo menu
angular.module('sccnlp.comiteParitario')

.controller('comiteParitarioConsultarCtrl', ['$scope', '$filter', '$timeout', '$state', 'comiteParitarioConsultarMessages', 'sessionService', 'RestClient', 'RestClientComiteParitarioConsultar', function($scope, $filter, $timeout, $state, comiteParitarioConsultarMessages, sessionService, RestClient, RestClientComiteParitarioConsultar) {

    $scope.messages = comiteParitarioConsultarMessages;
    var dateFormat = 'dd/MM/yyyy';
    $scope.comiteLoading = true;
    $scope.mostrarBuscar = false;
    $scope.activarBuscar = true;

    $scope.consultar = {
            rutRepresentanteEmpresa: null,
            rutRepresentanteTrabajadores: null,
        }
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
        RestClient.getDatosEmpresa($scope.session_data.rutEmpresa, $scope.session_data.dvEmpresa, function(data) {
            $scope.mostrarBuscar = true;
            $scope.rutEmpresa = data.rutEmpresa + "-" + data.dvEmpresa;
            $scope.nombreRazon = data.razonSocial;
            $scope.rutRepresentante = data.representante.rut + "-" + data.representante.dv;
            $scope.nombreRepresentanteLegal = data.representante.glosa;
            $scope.comiteLoading = false;
            $scope.activarBuscar = false;

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

        })

    };
    $scope.init();

    $scope.seleccionarComuna = function(id_region) {

        $scope.comunas = RestClient.getComunasByIdRegion(id_region);
    }

    $scope.buscarComite = function() {

        $scope.activarBuscar = true;
        $scope.mostrarEliminar = false;

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
            $scope.activarBuscar = false;
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
                            comuna: item.comuna,
                            idComite: item.idComite,
                            fechaActoEleccionario: $filter('date')(item.fechaActoEleccion, format),
                            tipoComite: item.tipoComite

                        })
                        $scope.viewTableEmpresa = true;
                    })
                    //---- paginacion
                $scope.totalItems = $scope.comite.length;
                $scope.currentPage = 4;
            }

            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };
            // --- fin paginacion
        }, function(error) {
            $scope.activarBuscar = false;
            console.log(error)
        })

    }

    $scope.modificarComite = function(i) {
        $scope.mostrarEliminar = false;
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

    $scope.eliminarRegistro = function(id, idComite) {

        $scope.activarEliminar = true;

        RestClientComiteParitarioConsultar.EliminarComite(idComite, function(data) {
            var itemEliminar = id;
            var itemMover = id++;

            $scope.comite.splice(itemEliminar, 1);
            $scope.activarEliminar = false;
            $scope.mostrarEliminar = true;

            $timeout(function() {
                 $scope.mostrarEliminar = false;
            }, 1000);

        }, function(error) {

        })

        $scope.totalItems = $scope.comite.length;

    }

    $scope.getExcel = function() {

        var mystyle = {
            sheetid: 'Comité Paritario',
            headers: true,
            style: 'font-size:12px;font-weight:bold;background:white',

            caption: {
                title: 'Comité Paritario'
            },

            columns: [{
                    columnid: 'rutEmpresa',
                    title: 'Rut Empresa',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold'
                }, {
                    columnid: 'nombreRazon',
                    title: 'Nombre Razon Social',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 200
                }, {
                    columnid: 'tipoComite',
                    title: 'Tipo del Comité',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold;',
                    width: 200
                }, {
                    columnid: 'fechaActoEleccionario',
                    title: 'Fecha Acto Eleccionario',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 200
                }, {
                    columnid: 'comuna',
                    title: 'Comuna',
                    style: 'font-size:14px;background:#0064ae ;color:white;font-weight:bold',
                    width: 100
                }

            ],

            row: {
                style: function(sheet, row, rowidx) {
                    return 'background:' + (rowidx % 2 ? '#F1F1F1' : 'white') + ';text-align:center;border-style:groove;vertical-align:middle';
                }
            }

        };

        alasql('SELECT * INTO XLS("Comité Paritario - ' + new Date() + '.xls",?) FROM ?', [mystyle, $scope.comite]);

    }


}])