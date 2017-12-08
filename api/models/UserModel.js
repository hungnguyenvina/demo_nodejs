var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
    name: {
        type: String,
        required: 'Please input full name'
    },
    email: {
        type: String,
        required: 'Please input email'
    },
    password: {
        type: String,
        required: 'Please input password'
    }
});


UserSchema.pre('save', async function (next) {
    try {
      const salt = await bcrypt.genSalt(10)
      const passwordhash = await bcrypt.hash(this.password, salt)
      this.password = passwordhash
      next()
    } catch (error) {
      next(error)
    }
  })

UserSchema.methods.isValidPassword = function (newPassword) {
    try {
        return bcrypt.compareSync(newPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}

var User = mongoose.model('User',UserSchema);
module.exports = User;