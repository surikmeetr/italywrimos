'use strict';

module.exports = {

    // Server IP
    thread_url: process.env.THREAD_URL,

    wcapi_url: process.env.WCAPI_URL,

    mail: {
      service: 'gmail',
      auth: {
          user: process.env.MAIL_USR,
          pass: process.env.MAIL_PASS
      }
    },
    cache_ttl: 3600
};
