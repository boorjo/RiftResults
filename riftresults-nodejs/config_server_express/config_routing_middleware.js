const routingCliente=require('./routing/routingCliente');
const routingPortal=require('./routing/routingPortal');

module.exports=function(servExpress){
    //servExpress.use('/api/Portal', routingPortal);
    servExpress.use('/api/Cliente', routingCliente); //<---- en modulo routingCliente estan endpoints zona cliente
    servExpress.use('/api/Portal', routingPortal); //<---- en modulo routingPortal estan endpoints zona portal);
}
