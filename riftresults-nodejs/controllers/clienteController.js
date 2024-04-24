const bcrypt = require('bcrypt'); //<----- paquete para cifrar y comprobar hashes de passswords
const jsonwebtoken = require('jsonwebtoken'); // <---- paquete para generar JWT o tokens de sesion para cada cliente....

var Cliente = require('../modelos/cliente');
const MailjetService = require('../servicios/mailjetservice');
const mailjetService = new MailjetService();

async function comprobarCliente(email, login) {
    try {
        let camposExistentes = [];
        
        // Buscar si hay un cliente con el email proporcionado
        const clienteByEmail = await Cliente.findOne({ 'cuenta.email': email });
        if (clienteByEmail) {
            camposExistentes.push('email');
        }

        // Buscar si hay un cliente con el login proporcionado
        const clienteByLogin = await Cliente.findOne({ 'cuenta.login': login });
        if (clienteByLogin) {
            camposExistentes.push('login');
        }

        // Si no se encontraron clientes con ninguno de los campos proporcionados, devolver un arreglo vacío
        if (camposExistentes.length === 0) {
            return [];
        } else {
            return camposExistentes;
        }
    } catch (error) {
        console.log('Error al comprobar cliente:', error);
        throw new Error('Error al comprobar cliente');
    }
}


module.exports = {
    registro: async(req,res,next) => {
       try{
        const cliente = req.body;
        console.log('datos recibidos por el cliente Angular en componente registro por ajax...', cliente);
        //desestructura req.body para obtener los datos del cliente


        //comprobar si ya existe un cliente con el email o login q me mandan...
        const camposExistentes = await comprobarCliente(cliente.email, cliente.login);
        if (camposExistentes.length > 0) {
            console.log('NO SE HA REGISTRADO. Campos existentes:', camposExistentes.join(', '));
            res.status(200).send({
                codigo: 1,
                mensaje: `${camposExistentes.length > 1 ? 'Los campos' : 'El'} ${camposExistentes.join(' y ')} ya ${camposExistentes.length > 1 ? 'están' : 'está'} registrado${camposExistentes.length > 1 ? 's' : ''}`
            });
            return;
        }

        var _resultInsertCliente = await new Cliente(
            {
                nombre: cliente.nombre,
                apellidos: cliente.apellidos,
                cuenta: {
                    email: cliente.email,
                    password: bcrypt.hashSync(cliente.password,10),
                    cuentaActiva: false,
                    login: cliente.login,
                    imagenAvatarBASE64: '',
                    premium: false
                },
                telefono: cliente.telefono,
                pais: cliente.pais,
                datosLol: {
                    rol: cliente.rol,
                    equipos: [],
                    campeones: []
                }
            }
        ).save();
            console.log('Resultado de insertar cliente en mongo...', _resultInsertCliente);

            //enviar email para confirmar cuenta...
            await mailjetService.enviarConfirmacion(cliente.email, cliente.nombre, _resultInsertCliente._id);

            //mandar resp
            console.log('Datos del cliente insertados correctamente...');
            res.status(200)
                .send(
                    {
                        codigo: 0,
                        mensaje: 'datos del cliente insertados ok'
                    }
                )

        }catch(error){
            console.log('error al hacer el insert en coleccion clientes...', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: `error a la hora de insertar datos del cliente: ${JSON.stringify(error)}`
                }

            )
        }
    },
    activarCuenta: async(req,res,next) => {
        const token = req.params.token;
        console.log('Token...', token);
        //buscar cliente con ._id igual que token y poner campo cuenta.cuentaActiva a true
        try {
            const _cliente = await Cliente.findById(token);
            if (!_cliente) {
                res.status(200).send({
                    codigo: 1,
                    mensaje: 'No se ha encontrado el cliente con el token proporcionado'
                });
                return;
            }else{
                _cliente.cuenta.cuentaActiva = true;
                await _cliente.save();
                res.status(200).send({
                    codigo: 0,
                    mensaje: 'Cuenta activada correctamente'
                });
            }

        } catch (error) {
            console.log('Error al activar cuenta:', error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Error al activar cuenta'
            });
        }
    },
    login: async (req, res, next) => {
        try {
            //en req.body esta el objeto q me manda el componente Login.js de REACT... { email:'...', password: '....' }
            let { email, password } = req.body;

            //1º comprobar q existe un cliente con el email q me mandan en coleccion clientes de Mongodb
            let _cliente = await Cliente.findOne({ 'cuenta.email': email });
            if (!_cliente) throw new Error('no existe una cuenta con ese email....');

            //2º comprobar q el hash de la password concuerda con la password q me mandan y su hash
            if (bcrypt.compareSync(password, _cliente.cuenta.password)) {
                //3º comprobar q la cuenta esta ACTIVADA...
                if (!_cliente.cuenta.cuentaActiva) {
                    res.status(200).send({
                        codigo: 2,
                        mensaje: 'Debes activar tu cuenta. Comprueba el email.',
                        error: '',
                        datoscliente: null,
                        tokensesion: null,
                        otrosdatos: null
                    });
                    return;
                }

                //4º si todo ok... devolver datos del cliente con pedidos y direcciones expandidos (no los _id)
                //                 devolver token de sesion JWT    
                let _jwt = jsonwebtoken.sign(
                    { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
                    process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
                    { expiresIn: '1h', issuer: 'http://localhost:3000' } //opciones o lista de cliams predefinidos
                );

                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'login OKS...',
                        error: '',
                        datoscliente: _cliente,
                        tokensesion: _jwt,
                        otrosdatos: null
                    }
                );


            } else {
                //throw new Error('password incorrecta....');
                res.status(200).send({
                    codigo: 3,
                    mensaje: 'Correo o contraseña incorrectos.',
                    error: '',
                    datoscliente: null,
                    tokensesion: null,
                    otrosdatos: null
                });
                return;
            }
        } catch (error) {
            console.log('error en el login....', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: 'login fallido',
                    error: error.message,
                    datoscliente: null,
                    tokensesion: null,
                    otrosdatos: null
                }
            );
        }
    },
}

