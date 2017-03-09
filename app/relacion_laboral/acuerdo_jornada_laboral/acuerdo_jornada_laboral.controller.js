'use strict';

angular.module('sccnlp.relacionLaboral.ingresoIndividual')

.controller('AcuerdoJornadaLaboralController', ['$scope', function ($scope) {
	
        //Labels correspondientes al acuerdo jornada laboral
        $scope.acuerdoJornadaLaboral = 'Acuerdo Jornada Laboral';
        $scope.diaDeLaSemana = 'Día de la Semana';
        $scope.horaInicio = 'Hora Inicio';
        $scope.horaTermino = 'Hora Término';
        $scope.scheduleDataIndex = '';

        $scope.AcuerdoJornadaLaboralModel = [{selected: false, dayOfWeek: 'Lunes', initialSchedule: "", endSchedule: ""}
            , {selected: false, dayOfWeek: 'Martes', initialSchedule: "", endSchedule: ""},
            {selected: false, dayOfWeek: 'Miercoles', initialSchedule: "", endSchedule: ""},
            {selected: false, dayOfWeek: 'Jueves', initialSchedule: "", endSchedule: ""},
            {selected: false, dayOfWeek: 'Viernes', initialSchedule: "", endSchedule: ""},
            {selected: false, dayOfWeek: 'Sabado', initialSchedule: "", endSchedule: ""},
            {selected: false, dayOfWeek: 'Domingo', initialSchedule: "", endSchedule: ""}];

        /**
         * Save Acuerdo Jornada Laboral
         * @param {type} p_index
         * @returns {undefined}
         */
        $scope.saveAcuerdoJornadaLaboral = function (p_index) {
            var aux = 0;

            if ($scope.acuerdoJornadaLaboralValues.length > 0 && typeof $scope.acuerdoJornadaLaboralValues[p_index].seleccion !== 'undefined') {

                for (j in $scope.acuerdoJornadaLaboralValues[p_index].seleccion) {

                    var timeMinInit = ($scope.acuerdoJornadaLaboralValues[p_index].seleccion[j].horaInicio).getMinutes();
                    var timeMinEnd = ($scope.acuerdoJornadaLaboralValues[p_index].seleccion[j].horaFin).getMinutes();
                    var timeMinDiff = timeMinEnd - timeMinInit;

                    aux = aux + timeMinDiff;
                }

                var hours = Math.trunc(aux / 60);
                //var minutes = aux % 60;

                $scope.tableDatosLaboresAsociadasContratoModel[p_index].scheduleData = hours;
                $scope.cleanAcuerdoJornadaLaboral();
            }
        };


        /**
         * Clear Acuerdo Jornada Laboral view
         * @returns {undefined}
         */
        $scope.cleanAcuerdoJornadaLaboral = function () {
            $('#AcuerdoJornadaLaboral').on('hidden.bs.modal', function () {
                $(this).find('#che').val('');
            });

            $('#AcuerdoJornadaLaboral').on('hide', function () {
                $('#AcuerdoJornadaLaboral').removeData();
            });
        };
        /**
         * removeAcuerdoJornadaLaboral to delete an acuerdo jornada laboral value
         * @param {type} p_index row in datos laboral contrato table
         * @param {type} p_dia day to be deleted
         * @returns {undefined}
         */
        $scope.removeAcuerdoJornadaLaboral = function (p_index, p_dia) {
            var index = -1;
            for (i in $scope.acuerdoJornadaLaboralValues[p_index].seleccion) {
                if ($scope.acuerdoJornadaLaboralValues[p_index].seleccion[i].diaSeleccionado === p_dia)
                    index = i;
            }

            if (index > -1) {
                $scope.acuerdoJornadaLaboralValues[p_index].seleccion.splice(index, 1);
            }
        };

        /**
         * addRemoveAcuerdoJornadaLaboral: add to the acuerdoJornadaLaboralValues
         * the row edited in the Datos Laboral Contrato table, and an array of 
         * days selected
         * @param {type} p_index row in datos laboral contrato table
         * @param {type} p_selected to discriminate if the checkbox is clicked or not
         * @param {type} p_dia which day is clicked
         * @param {type} p_start start time
         * @param {type} p_end end time
         * @returns {undefined}
         */
        $scope.addRemoveAcuerdoJornadaLaboral = function (p_index, p_selected, p_dia, p_start, p_end) {

            if (p_selected === true) {

                //validate if the element IN THE ROW is already created
                var alreadyCreated = false;

                for (i in $scope.acuerdoJornadaLaboralValues) {
                    if ($scope.acuerdoJornadaLaboralValues[i].idDatoLaboralContrato === p_index) {
                        alreadyCreated = true;
                    }
                }
                //create the days to be updated
                var seleccionDia = [];
                seleccionDia.push({diaSeleccionado: p_dia, horaInicio: p_start, horaFin: p_end});

                //  if is not created
                if (alreadyCreated === false) {

                    $scope.acuerdoJornadaLaboralValues.push({idDatoLaboralContrato: p_index, seleccion: seleccionDia});

                } else {
                    // find the created element and update the list of days selected
                    $scope.acuerdoJornadaLaboralValues[p_index].seleccion.push({diaSeleccionado: p_dia, horaInicio: p_start, horaFin: p_end});
                }
            } else {
                $scope.removeAcuerdoJornadaLaboral(p_index, p_dia);
            }
        };
    }

]);