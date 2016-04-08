var Model = require('../models/model');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    // test route to make sure everything is working 
    // accessed at GET http://localhost:3000/api
    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'hooray! welcome to our api!'
        });
    });

    apiRouter.route('/votaciones')

    .post(function(req, res) {

        var votacion = new Model.votacion();

        // assign req.body values to the model object
        Object.keys(req.body).forEach(function(e, i) {
        		// we do not want to parseInt the two first values in req.body
            votacion[e] = i < 2 ? req.body[e] : parseInt(req.body[e]);


        });
        // save the current model object
        votacion.save(function(err) {
            if (err) {
                if (err.code == 11000) {

                    return res.json({
                        status: 409,
                        success: false,
                        message: 'You cannot push a poll with the same name'
                    });
                }

                return res.send(err);
            }

            res.json({message: 'question poll created!'});
        });
    })

    .get(function(req, res) {

        Model.votacion.find({}, function(err, votaciones) {
            err ? res.send(err) : res.json(votaciones);
        });
    })

    .put(function(req, res) {
        Model.votacion.find({
            poll_id: req.body.poll_id,
            q_id: req.body.q_id
        }, function(err, votacion) {

            // CONTROLAR SI VOTACION VIENE VACIO E INICIALIZAR || POST DATA INIT
            err ? res.send(err) : function() {

            	// votacion comes as an Array with a single object
                votacion = votacion[0];

                // Iterate through req.body and assign its values to votacion
                Object.keys(req.body).forEach(function(e, i) {

        					// we do not want to parseInt the two first values in req.body
                   votacion[e] =  i < 2 ? req.body[e] : parseInt(req.body[e]);
                });
                votacion.save(function(err) {

                    err ? res.send(err) : res.json({
                        message: 'poll updated'
                    });
                });
            }();
        });
    })

    .delete(function(req, res) {
        Model.votacion.remove({}, function(err) {
            err ? res.send(err) : res.json({message: 'Successfully deleted'});
        })
    });

    apiRouter.route('/votaciones/:votacion')
        .get(function(req, res) {
            Model.votacion
                .findOne({
                    q_id: req.params.votacion
                }, function(err, votos) {
                    err ? res.send(err) : res.json(votos);
                });
        });

    return apiRouter;
};