let express = require('express');
let router = express.Router();
let mongo = require('../modules/database');
let events = require('../models/events');
let websites = require('../models/websites');
let user = require('../models/user');

let feed = function (req, res) {
  //
  // 'use strict';
  //
  //
  //   events.current(domain, query).then(function (result) {
  //
  //       res.render('garage/layout', {title: domain + '/' + tab, domains: domains});
  //
  //   });
  // });

};

/**
 * Main page dashboard
 */
let main = function (req, res) {

  'use strict';
  user.current(req).then(function (foundUser) {

    if (!foundUser) {
      res.sendStatus(403);
      return;
    }

    let params = req.params,
        currentDomain = params.domain,
        currentTag = params.tag,
        allowedTags = ['fatal', 'warnings', 'notice', 'javascript'];

    if (currentTag && !allowedTags.includes(currentTag)) {
      res.sendStatus(400);
      return;
    }

    websites.getByUser(foundUser).then(function (domains) {

      let queries = [];
      domains.forEach(function (domain) {

        if (currentDomain == domain.name) {
          currentDomain = domain;
        }

        let query = events.countTags(domain.name)
          .then(function (tags) {
            tags.forEach(function (tag) {
              domain[tag._id] = tag.count;
            });
          });

        queries.push(query);

      });

      Promise.all(queries)
        .then(function() {

          let findParams = {};
          if (currentTag) {
            findParams.tag = currentTag;
          }

          if (currentDomain) {

            return events.get(currentDomain.name, findParams);

          } else {

            return events.getAll(foundUser, findParams);

          }

        })
        .then(function (events) {

          res.render('garage/layout', {
            user: foundUser,
            domains: domains,
            currentDomain: currentDomain,
            currentTag: currentTag,
            events: events
          });

        });
    });

  });
};

//router.get('/:domain*', feed);
router.get('/:domain?/:tag?', main);

module.exports = router;