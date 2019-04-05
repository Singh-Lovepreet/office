//sending verification mail after signup
var request = require("request");
module.exports={

verifyEmail:function(clientName,clientEmail,link){

	var options = { method: 'POST',
  	url: 'https://api.sendinblue.com/v3/smtp/email',
  	body: 
  	{ tags: [ 'yawnmeter'],
  	sender: { email: 'hello@yawnmeter.com', name: 'Yawnmeter' },
  	textContent: 'Thankyou for registering with Yawnmeter,\n\n' + 'Please verify your account by clicking the link: \n' + link + '.\n',
  	subject: 'verification email from yawnmeter',
  	replyTo: { email: 'hello@yawnmeter.com', name: 'Yawnmeter' },
  	to: [ { email:clientEmail, name:clientName } ] },
  	headers:{'api-key': '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'},
  	json: true 
  	};
  	request(options, function (error, response, body) {
  	if (error) throw new Error(error);
  	db.collection('emailResponse').insertOne({messageId:body.messageId,Email:clientEmail,Name:clientName,Date:new Date});
  	});

}


}