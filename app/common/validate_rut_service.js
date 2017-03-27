angular.module('sccnlp.common')

        .factory('validateRut', [

            function (param) {
                var wrapper = {};

                wrapper.validate = function (p_rut) {

                    var Fn = {
                        // Valida el rut con su cadena completa "XXXXXXXX-X"
                        rut: function (p_rut) {
                            var valor = String(p_rut).replace('.', '');

                            if (!/^[0-9]+-[0-9kK]{1}$/.test(valor))
                                return false;

                            valor = valor.replace('-', '');
                            var rut = valor.slice(0, -1);

                            var digv = valor.slice(-1).toUpperCase();

                            if (rut.length < 7)
                                return false;

                            digv = (digv === 'K') ? 10 : digv;
                            digv = (digv === 0) ? 11 : digv;

                            return (Fn.dv(rut) === parseInt(digv));
                        },
                        dv: function (T) {

                            var suma = 0;
                            var multiplo = 2;
                            var length = T.length;
                            for (var i = 1; i <= T.length; i++) {
                                var index = multiplo * T.charAt(length - i);

                                suma = suma + index;

                                if (multiplo < 7) {
                                    multiplo = multiplo + 1;
                                } else {
                                    multiplo = 2;
                                }

                            }

                            var dvEsperado = 11 - (suma % 11);


                            return dvEsperado;
                        }
                    };
                    return Fn.rut(p_rut);
                };


                return  wrapper;
            }]);