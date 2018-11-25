const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
  user_id: String,
  channel_id: String,
});

mongoose.model('Subscriptions', SubscriptionSchema);