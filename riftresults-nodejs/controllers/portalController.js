const axios = require('axios');

module.exports = {
    recuperarEquipos: async (req, res, next) => {
        try {
            const url = `https://api.sportsdata.io/v3/lol/scores/json/Teams?key=${process.env.SPORTSDATA_APIKEY}`;
            const response = await axios.get(url);
            const teams = response.data;
            res.status(200).send({
                codigo: 0,
                mensaje: 'Equipos recuperados correctamente',
                otrosdatos: teams
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al recuperar los equipos',
                otrosdatos: null
            });
        }
    }
}
