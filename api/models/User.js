/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
module.exports = {
	schema: true,
  attributes: {
  	name: {
  		type:'string',
      required: true
  	},
  	email:{
  		type:'string',
  		email:true,
      unique: true,
      required: true
  		
  	},
  	encryptedPassword:{
  		type:'string'

  	},
    // admin: {
    // type: 'boolean',
    // defaultsTo: false
    // }
  	// toJSON: function () {
   //    The toObject() method will return the currently set model values only, without any of the instance methods attached. Useful if you want to change or remove values before sending to the client.
   //    var obj = this.toObject();
   //    delete obj.password;
   //    delete obj.confirmacion;
   //    delete obj.encryptedPassword;
   //    delete obj._csrf;
   //    return obj;
   //  }

  },
    // beforeValidation:  function(values, next){
    //     console.log('beforeValidation');
    //     console.log(values);
    //     console.log('beforeValidation');
    //     if (typeof values.admin !== 'undefined') {
    //         if(values.admin === 'unchecked'){
    //             values.admin = false;
    //         }else if (values.admin[1] === 'on') {
    //             values.admin = true;
    //         }
    //     }
    //     next();
    // },
    beforeCreate: function (values, next) {
        // esto chekea que el password y la confirmacion sean iguales antes de crear el registro
        if(!values.password || values.password != values.confirmation){
            console.log('values');
            console.log(values);
            console.log('values');
            return next({error: ["The password confirmation does not match."]});
        }
        require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
          
            if(err){
                console.log("Failed to encrypt password");
                return res.serverError(err);
            }
            values.encryptedPassword = encryptedPassword;
            values.online=true;
            next();
        });
    }

};

