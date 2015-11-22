var request = require('request');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;
var NodeCache = require( "node-cache" );
var async = require('async');
var config = require('../config');
var cache = new NodeCache( { stdTTL: config.cache_ttl, checkperiod: config.cache_ttl + 1 } );

var url = config.thread_url;
var wcapi_url = config.wcapi_url;

var links = [];
//var allkeys = cache.keys();
var resultList = [];
var novel_details = [];
var qui = config.thread_url;

exports.index = function (req, res) {

  //allkeys = cache.keys();
  //console.log('len ' + resultList.length);
  //console.log('keys: ' + cache.keys());
  if (resultList.length === 0 || cache.get(resultList[0].name) === undefined){

    resultList = [];
    //console.log("no stored data");
    // no keys stored yet so make a request
    request(url, function (err, resp, body) {
      if (err) {

      }
      $ = cheerio.load(body);

      // create a list of user links
      $('.user_link').each(function () {
        var uname = $(this).attr('href').substring(14);
        if (links.indexOf(uname) === -1) {
          links.push(uname);
        }
      });

      async.each(links, iterate, function(err){
        if (err)
          throw err;
        return res.render('index', {title: "Wrimos d'Italia", qui: qui, resultList: getStructuredResults() });
      });

    }); //end external request
  } else {
    //console.log("cached keys: ");
    //console.log(cache.keys());

    return res.render('index', {title: "Wrimos d'Italia", qui: qui, resultList: resultList });
  }
};

exports.faces = function (req, res) {

  if (novel_details.length === 0 || cache.get(novel_details[0].name + "_novel") === undefined){
    novel_details = [];
    request(url, function (err, resp, body) {
      if (err) {
        //console.log("Error in novel request");
        return res.render('faces', {title: "Wrimos", novel_details: [] });
      }
      $ = cheerio.load(body);

      // create a list of user links
      $('.user_link').each(function () {
        var uname = $(this).attr('href').substring(14);
        if (links.indexOf(uname) === -1) {
          links.push(uname);
        }
      });

      async.each(links, iterate_novels, function(err){
        if (err) {
          //console.log("Error in async each");
          novel_details = [];
        }
        return res.render('faces', {title: "Wrimos", qui: qui, novel_details: novel_details });
      });

    }); //end external request
  } else {
    // console.log("cached stuff: ");
    // console.dir(novel_details);
    res.render('faces',  {title: "Wrimos", qui: qui, novel_details: novel_details });
  }
};

function iterate_novels(it, callback) {
  var auth_url = wcapi_url + it + '/novels';
    //cache value if new or retrieve it if exists
    // console.log('current auth: ');
    // console.log(auth_url);
    request(auth_url, function(err, resp, body) {
        if (err) {
          //console.log("Error in iterate_novels request");
          return;
        }
        var $ = cheerio.load(body);
        //get all the information for the author
        var username = $('.panel-body .row .col-sm-5 h1').text();
        var member_for = $('.panel-body .row .col-sm-5 h3').text();
        var avatar_link = $('.img-responsive').attr('src');
        //extract information about the novels
        var novels = [];
        var novelsrawlist = $('.novel');
        //iterate through the novels found and extract data for them individually
        novelsrawlist.each(function(idx, el){
          // discard the missing novels for previous years
          if (/missing/.test($(this).attr('class'))) {
            return;
          }
          var novel = {};
          novel.year = $(this).find('.panel-heading > h1').text().substr(-4);
          novel.title = $(this).find('.media-heading > a').text();
          novel.genre = $(this).find('.genre').text();
          //text will be truncated if too long
          var txt = $(this).find('.ellipsis > p').text();
          if (txt.length > 147) {
            novel.synopsis = txt.substr(0, 147) + "[...]";
          } else {
            novel.synopsis = txt;
          }
          novels.push(novel);
        });
        // create a novelist object for the user and push it to the list of novel details
        var novelist = {name: username, member_for: member_for, avatar_link: avatar_link, novels: novels};
        cache.set(username + '_novel', novelist);
        novel_details.push(novelist);

      callback();
    });
}

function iterate(it, callback) {
  var auth_url = 'http://nanowrimo.org/wordcount_api/wc/' + it;
    //cache value if new or retrieve it if exists
    request(auth_url, function(err, resp, body) {
        if (err){
          //console.log("Error in iterate request");
            return;
        }
        parseString(body, function (err, result) {
          if (err)
              throw err;
          var usr = {name: result.wc.uname[0], totalWords: result.wc.user_wordcount[0], winner: true};
          //console.log(result.wc.uname + " wrote " + result.wc.user_wordcount + " words.");

          cache.set(result.wc.uname, usr);
          resultList.push(usr);
        });

      callback();
    });
}

function getStructuredResults() {
  resultList.sort(function (a, b) {
    return parseInt(b.totalWords) - parseInt(a.totalWords);
  });
  var max = resultList[0].totalWords;
  resultList.forEach(function (it) {
    it.color = assignColor(parseInt(it.totalWords), it.winner);
    it.percent = it.totalWords * 100 / max;
  });
  return resultList;
}

function assignColor(num, won) {
  switch (true) {
    case num > 50000:
      if (won) {
        return "validated";
      } else {
        return "success";
      }
      break;
    case num > 30000:
      return "info";
      break;
    case num > 15000:
      return "warning";
      break;
    default:
      return "danger";
  }
}
