angular.module('sccnlp.ingresoRL')

.controller('RelacionLaboralController', ['$scope', function ($scope) {
	
    //        Labels correspondientes al acuerdo jornada laboral
    $scope.acuerdoJornadaLaboral = 'Acuerdo Jornada Laboral';
    $scope.diaDeLaSemana = 'Día de la Semana';
    $scope.horaInicio = 'Hora Inicio';
    $scope.horaTermino = 'Hora Término';

//static variable

    $scope.scheduleDataIndex = '';

    $scope.defaultSchedule = ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30',
        '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30',
        '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
        '22:00', '22:30', '23:00', '23:30'];

    $scope.getSchedule = function () {
        return $scope.defaultSchedule;
    };

    $scope.AcuerdoJornadaLaboralModel = [{selected: false, dayOfWeek: 'Lunes', initialSchedule: $scope.defaultSchedule, endSchedule: $scope.defaultSchedule}
        , {selected: false, dayOfWeek: 'Martes', initialSchedule: $scope.defaultSchedule, endSchedule: $scope.defaultSchedule},
        {selected: false, dayOfWeek: 'Miercoles', initialSchedule: $scope.defaultSchedule, endSchedule: $scope.defaultSchedule},
        {selected: false, dayOfWeek: 'Jueves', initialSchedule: $scope.defaultSchedule, endSchedule: $scope.defaultSchedule},
        {selected: false, dayOfWeek: 'Viernes', initialSchedule: $scope.defaultSchedule, endSchedule: $scope.defaultSchedule},
        {selected: false, dayOfWeek: 'Sabado', initialSchedule: $scope.defaultSchedule, endSchedule: $scope.defaultSchedule},
        {selected: false, dayOfWeek: 'Domingo', initialSchedule: $scope.defaultSchedule, endSchedule: $scope.defaultSchedule}];


    /**
     * Save Acuerdo Jornada Laboral
     * @param {type} p_index
     * @returns {undefined}
     */
    $scope.saveAcuerdoJornadaLaboral = function (p_index) {
        var text = '';

        for (j in $scope.acuerdoJornadaLaboralValues[p_index].seleccion) {
            text = text + $scope.acuerdoJornadaLaboralValues[p_index].seleccion[j].diaSeleccionado + ": "
                    + $scope.acuerdoJornadaLaboralValues[p_index].seleccion[j].horaInicio + " - " + $scope.acuerdoJornadaLaboralValues[p_index].seleccion[j].horaFin + "; ";
        }

        $scope.tableDatosLaboresAsociadasContratoModel[p_index].scheduleData = text;
        $scope.cleanAcuerdoJornadaLaboral();
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

    /**
     * Set the current index for the modified element
     * @param {type} p_index
     * @returns {undefined}
     */
    $scope.loadAcuerdoJornadaLaboral = function (p_index) {
        /*            se utiliza esta variable, para pasarle a la ventana 
         modal el indice de la fila que se esta editando 
         Muy Importante ya que sin esta variable, no se puede guardar
         */
        $scope.scheduleDataIndex = p_index;
        $scope.horaInicioSelect = $scope.getSchedule()[16];

    };

	
}])