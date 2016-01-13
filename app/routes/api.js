var Model      = require('../models/model');

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// test route to make sure everything is working 
	// accessed at GET http://localhost:3000/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	apiRouter.route('/votaciones')

		.post(function(req, res) {
			
			var votacion = new Model.votacion();
			votacion.poll_id = req.body.poll_id;
			votacion.q_id = req.body.q_id;
			votacion.oneStar = parseInt(req.body.oneStar);
			votacion.twoStar = parseInt(req.body.twoStar);
			votacion.threeStar = parseInt(req.body.threeStar);
			votacion.fourStar = parseInt(req.body.fourStar);
			votacion.fiveStar = parseInt(req.body.fiveStar);

			votacion.save(function(err) {
				if (err) {
 					if (err.code == 11000) {

              			return res.json({status: 409, success: false, message: 'You cannot push a poll with the same name' });
 					}
         
					return res.send(err);
				}

				res.json({ message: 'question poll created!' });
			});

		})

		.get(function(req, res) {

			Model.votacion.find({}, function(err, votaciones) {
				if (err) res.send(err);

				res.json(votaciones);
			});
		})

		.put(function(req, res) {
			Model.votacion.find({poll_id:req.body.poll_id, q_id:req.body.q_id}, function(err, votacion) {
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

					res.json({message: 'poll updated'});
				})
			});
		})

		.delete(function(req, res) {
			Model.votacion.remove({}, function(err) {
				if (err) {
                	res.send(err)
              	}
              	res.json({message: 'Successfully deleted'});
			})
		});

	apiRouter.route('/votaciones/:votacion')
		.get(function(req, res) {
			 Model.votacion
      .findOne({ q_id: req.params.votacion}, function (err, votos) {
        if (err) {
          res.send(err);
        }
        res.json(votos);
      });
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

				res.json({ message: 'total stats poll created!' });
			});
		})

		.put(function(req, res) {
			Model.totales.find({poll_id:req.body.poll_id}, function(err, totales) {
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

					res.json({message: 'poll totals updated'});
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
              	res.json({message: 'Successfully deleted'});
			})
		});

	return apiRouter;
};