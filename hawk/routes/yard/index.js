'use strict';

const express = require('express');
const router = express.Router();
const Archiver = require('../../modules/archiver');

/**
 * Route for the Archiver
 * Archiver removes staled events that exeeded Events Limit (10k)
 * Fired by Cron every 2 hours
 */
if (process.env.ARCHIVER_ROUTE) {
  router.get(`${process.env.ARCHIVER_ROUTE}`, async (req, res, next) => {
    try {
      let archiver = new Archiver();

      /**
       * @type {{projectId: string, projectName: string, archived: number}[]} removed
       */
      let archivedEvents = await archiver.archive(),
        total = 0;

      let answer = 'Hawk Archiver 🍇 \n';

      archivedEvents.forEach(project => {
        if (project.archived > 0) {
          answer += `\n${project.archived} events | <b>${project.projectName}</b> | <code>${project.projectId}</code>`;
          total += project.archived;
        }
      });

      answer += `\n\n${total} total events archived`;

      res.send(answer);
    } catch (e) {
      next(e)
    }
  });
}

/*
 * Home page
 */
router.get('/', function (req, res, next) {
  try {
    res.render('yard/index', {
      user : res.locals.user
    });
  } catch (e) {
    next(e)
  }
});


/**
 * Docs page
 */
router.get('/docs', function (req, res, next) {
  try {
    res.render('yard/docs/index', {

      meta : {

        title : 'Platform documentation',
        description : 'Guide for integration and usage.'

      },
      eventsLimit: Archiver.eventsLimit

    });
  } catch (e) {
    next(e)
  }
});

module.exports = router;
