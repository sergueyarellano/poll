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
            votacion.poll_id = 'demopi4';
            votacion.q_id = req.body.q_id;
            votacion.oneStar = parseInt(req.body.oneStar) || 0;
            votacion.twoStar = parseInt(req.body.twoStar) || 0;
            votacion.threeStar = parseInt(req.body.threeStar) || 0;
            votacion.fourStar = parseInt(req.body.fourStar) || 0;
            votacion.fiveStar = parseInt(req.body.fiveStar) || 0;

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

                res.json({
                    message: 'question poll created!'
                });
            });

        })
        .get(function(req, res) {

            Model.votacion.find({}, function(err, votaciones) {
                if (err) res.send(err);

                res.json(votaciones);
            });
        })
        .put(function(req, res) {
            Model.votacion.find({
                poll_id: req.body.poll_id,
                q_id: req.body.q_id
            }, function(err, votacion) {
                if (err) {
                    res.send(err);
                }
                votacion = votacion[0];
                if (req.body.poll_id) votacion.poll_id = req.body.poll_id;
                if (req.body.q_id) votacion.q_id = req.body.q_id;
                if (req.body.oneStar) votacion.oneStar = parseInt(req.body.oneStar);
                if (req.body.twoStar) votacion.twoStar = parseInt(req.body.twoStar);
                if (req.body.threeStar) votacion.threeStar = parseInt(req.body.threeStar);
                if (req.body.fourStar) votacion.fourStar = parseInt(req.body.fourStar);
                if (req.body.fiveStar) votacion.fiveStar = parseInt(req.body.fiveStar);

                votacion.save(function(err) {
                    if (err) res.send(err);

                    res.json({
                        message: 'poll updated'
                    });
                })
            });
        })
        .delete(function(req, res) {
            Model.votacion.remove({poll_id: req.query.demo}, function(err) {
                if (err) {
                    res.send(err)
                }
                res.json({
                    message: 'Successfully deleted'
                });
            })
        });

    apiRouter.route('/totales')
        .post(function(req, res) {

            var totales = new Model.totales();
            totales.poll_id = req.body.poll_id;
            totales.total_votes = parseInt(req.body.total_votes);
            totales.total_connected = parseInt(req.body.total_connected);
            totales.percentage_share = parseInt(req.body.percentage_share);

            totales.save(function(err) {
                if (err) {

                    return res.send(err);
                }

                res.json({
                    message: 'total stats poll created!'
                });
            });
        })
        .put(function(req, res) {
            Model.totales.find({
                poll_id: req.body.poll_id
            }, function(err, totales) {
                if (err) {
                    res.send(err);
                }
                totales = totales[0];
                if (req.body.poll_id) totales.poll_id = req.body.poll_id;
                if (req.body.total_votes) totales.total_votes = parseInt(req.body.total_votes);
                if (req.body.total_connected) totales.total_connected = parseInt(req.body.total_connected);
                if (req.body.percentage_share) totales.percentage_share = parseInt(req.body.percentage_share);

                totales.save(function(err) {
                    if (err) res.send(err);

                    res.json({
                        message: 'poll totals updated'
                    });
                })
            });
        })
        .get(function(req, res) {
            Model.totales.find({}, function(err, totales) {
                if (err) res.send(err);

                res.json(totales);
            });
        })
        .delete(function(req, res) {
            Model.totales.remove({}, function(err) {
                if (err) {
                    res.send(err)
                }
                res.json({
                    message: 'Successfully deleted'
                });
            })
        });

    apiRouter.route('/registro')
        .post(function(req, res) {
            var registro = new Model.registro();
            registro.ip = req.body.ip || '1';
            if (req.body.r0) registro.votes.r0 = parseInt(req.body.r0) || 0;
            if (req.body.r1) registro.votes.r1 = parseInt(req.body.r1) || 0;
            if (req.body.r2) registro.votes.r2 = parseInt(req.body.r2) || 0;
            if (req.body.r3) registro.votes.r3 = parseInt(req.body.r3) || 0;
            if (req.body.r4) registro.votes.r4 = parseInt(req.body.r4) || 0;
            if (req.body.r5) registro.votes.r5 = parseInt(req.body.r5) || 0;
            if (req.body.r6) registro.votes.r6 = parseInt(req.body.r6) || 0;
            if (req.body.r7) registro.votes.r7 = parseInt(req.body.r7) || 0;

            registro.save(function(err) {
                if (err) {
                    return res.send(err);
                }
                res.json({
                    message: 'Registry created!'
                });
            });
        })
        .get(function(req, res) {
            if (req.query.ip === 'all') {
                Model.registro.find({}, function(err, registro) {
                    if (err) res.send(err);
                    res.json(registro);
                });
            } else {
	            Model.registro.find({
	                ip: req.query.ip
	            }, function(err, registro) {
	                if (err) res.send(err);
	                res.json(registro);
	            });
            }
        })
        .put(function(req, res) {
            Model.registro.find({
                ip: req.body.ip
            }, function(err, registro) {
                if (err) {
                    res.send(err);
                }
                
                registro = registro[0];
                
                if (req.body.r0) registro.votes.r0 = parseInt(req.body.r0);
                if (req.body.r1) registro.votes.r1 = parseInt(req.body.r1);
                if (req.body.r2) registro.votes.r2 = parseInt(req.body.r2);
                if (req.body.r3) registro.votes.r3 = parseInt(req.body.r3);
                if (req.body.r4) registro.votes.r4 = parseInt(req.body.r4);
                if (req.body.r5) registro.votes.r5 = parseInt(req.body.r5);
                if (req.body.r6) registro.votes.r6 = parseInt(req.body.r6);
                if (req.body.r7) registro.votes.r7 = parseInt(req.body.r7);

                if (req.body.comment) registro.comments[req.body.r][req.body.type] = req.body.comment;

                registro.save(function(err) {
                    if (err) res.send(err);

                    res.json({
                        message: 'registry updated'
                    });
                })
            });
        })
        .delete(function(req, res) {
            Model.registro.remove({}, function(err) {
                if (err) {
                    res.send(err)
                }
                res.json({
                    message: 'Successfully deleted'
                });
            })
        });
    return apiRouter;
};