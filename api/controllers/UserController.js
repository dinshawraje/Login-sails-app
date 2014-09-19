/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var simple_recaptcha = require('simple-recaptcha');
module.exports = {
	new:function  (req, res) {
		res.locals.flash = _.clone(req.session.flash);
		res.view();
		req.session.flash ={};
	},
	create:function (req, res, next) {
		User.create(req.params.all(), function userCreated (err, user){
			var privateKey = '6LcUhvoSAAAAAOpT5zwd7OqYy3Fpgxjbe71i0c9v'; // your private key here
		    var ip = req.ip;
		    var challenge = req.body.recaptcha_challenge_field;
		    var response = req.body.recaptcha_response_field;

		    simple_recaptcha(privateKey, ip, challenge, response, function(err) {
		        console.log("captch submitted");
		        if (err) {
		          console.log("captcha error");
		          console.log(err);
		          returnData.success = false;
		          returnData.message = "Unexpected Err Occured in DB, WHile adding contact us Details." + err;
		          res.json(200, returnData);
		          // return res.json(200, err.message);
		        }
		        else{
      				console.log("captcha success");
					// if (err) return next(err);
					if (err) {
						console.log(err);
						req.session.flash={
							err:err
						}
						return res.redirect('/user/new');
					};
					// res.locals.flash = _.clone{req.session.flash};
					// req.session.flash ={};
					// res.json(user);
					User.publishCreate(user);
					req.session.authenticated = true;
					req.session.User = user;
					res.redirect('/user/show/'+user.id);
				}
			});
		});

		// res.redirect('/user/show/' + user.id);
	},
	show:function(req, res, next){
		User.findOne(req.params['id'], function foundUser(err, user){
			if(err) return next(err);
			if (!user) return next(err);
			res.view({
				user:user
			});
		});
	},
	edit:function(req, res, next){
		User.findOne(req.params['id'], function foundUser(err, user){
			if(err) return next(err);
			if (!user) return next('user not exist');
			res.view({
				user:user
			});
		});
	},
	update:function(req, res, next){
		User.update(req.params['id'], req.params.all(), function userUpdated(err){
			if(err) {
				return res.redirect('/user/edit/'+req.params['id']);
			}
			
			res.redirect('/user/show/'+req.params['id']);
		});
	},
	index: function (req, res, next) {

        console.log(new Date());
        console.log(req.session.authenticated);

        
        User.find(function foundUser (err, users){
            if(err) return next(err);
           
            res.view({
                users: users
            });
        });
    },
   destroy: function(req, res, next) {

    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

        // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
        User.publishUpdate(user.id, {
          name: user.name,
          action: ' has been destroyed.'
        });

        // Let other sockets know that the user instance was destroyed.
        User.publishDestroy(user.id);

      });        

      res.redirect('/user');

    });
  },
	subscribe: function(req, res) {
		 User.find({}).exec(function(err,listOfUsers){
		 		if (err) return next(err);
        User.subscribe(req.socket,listOfUsers,['create','destroy']);
        res.send(200);
    });
		// Find all current users in the user model
		// User.find(function foundUsers(err, users) {
		// 	if (err) return next(err);
		
		// 	User.subscribe(req.socket);
			
		// 	User.subscribe(req.socket, users);
			
		// 	res.send(200);
		// });
	},

	
	
};

