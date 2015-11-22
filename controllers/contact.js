var config = require('../config');
var nodemailer = require('nodemailer');

var qui = config.thread_url;

var transporter = nodemailer.createTransport({
    service: config.mail.service,
    auth: {
        user: config.mail.auth.user,
        pass: config.mail.auth.pass
    }
});

exports.contact = function (req, res) {
  res.render('contact', {Title: "Contact the author"});
};

exports.mailme = function (req, res) {
  // setup e-mail data with unicode symbols
  if (req.body.email) {
    console.log(req.body.email);
    var mailOptions = {
        from: req.body.email, // sender address
        sender: req.body.email, // sender address
        to: config.mail.auth.user, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.message + "\n\nEmail: " + req.body.email, // plaintext body
    };
    //send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.render('contact', {title: "Errore", qui: qui, message:"Il messaggio non è stato inviato; riprova più tardi", status: "danger" });
        }
        //console.log('Message sent: ' + info.response);
        res.render('contact', {title: "Grazie per il messaggio", qui: qui, message:"Il messaggio è stato inviato. Ti risponderemo appena possibile.", status: "success" });
    });
  } else {
    res.render('contact', {title: "Errore", qui: qui, message:"Il messaggio non è stato inviato: il tuo indirizzo email è mancante", status: "danger" });
  }


};
