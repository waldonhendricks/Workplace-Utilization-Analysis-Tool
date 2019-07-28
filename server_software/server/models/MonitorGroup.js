const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MONITOR_TYPE = require('./../monitorTypes');

const QuotaScheme = new Schema({
  amount: {type: Number, required: true},//amount of monitors available to this team set
  sharedWith: [Schema.Types.ObjectId]//teams quota is shared with. If more than one team, means these teams share the quota

});
//A monitor group is a like all monitors of a specific model, holds their unique id and info on how many there are.
const MonitorGroupSchema = new Schema({
  _id: {type: Number, required: true},
  name: {
    type: String,//the specific model name the monitor has
    required: true
  },
  type: {type: String, required: true, default: MONITOR_TYPE.LAPTOP},
  friendlyName: {//name given by the user
    type: String,
  },
  creationDate: {type: Date, required: true, default: Date.now},
  quota: [QuotaScheme]//quota is like the amount of these monitors in the building

});
module.exports = MonitorGroup = mongoose.model("monitors", MonitorGroupSchema);
