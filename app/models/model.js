'use strict';
(function() {
var mongoose  = require('mongoose'), // if problems with mongo 2.6 remove, and install mongoose 3.8.35
    Schema    = mongoose.Schema,
// reference http://mongoosejs.com/docs/schematypes.html
  VotacionSchema = new Schema({
    poll_id: { type: String, required: true, lowercase: true },
  	q_id: { type: String, required: true, lowercase: true },
  	oneStar: { type: Number, default: 0 },
  	twoStar: { type: Number, default: 0 },
  	threeStar: { type: Number, default: 0 },
  	fourStar: { type: Number, default: 0 },
  	fiveStar: { type: Number, default: 0 }
  }),

  TotalesSchema = new Schema({
    poll_id: { type: String, required: true, lowercase: true },
  	total_votes: { type: Number, default: 0 },
    total_connected: { type: Number, default: 0 },
    percentage_share: { type: Number, default: 0 }
  })

	module.exports.votacion = mongoose.model('Votacion', VotacionSchema);
	module.exports.totales = mongoose.model('Totales', TotalesSchema);
})();