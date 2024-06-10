const routingCliente=require('./routing/routingCliente');
const routingPortal=require('./routing/routingPortal');
const routingAdmin = require('./routing/routingAdmin');

module.exports=function(servExpress){
    //servExpress.use('/api/Portal', routingPortal);
    servExpress.use('/api/Cliente', routingCliente);
    servExpress.use('/api/Portal', routingPortal);
    servExpress.use('/api/Admin', routingAdmin);
}
