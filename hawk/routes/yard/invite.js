let express = require('express');
let router = express.Router();
let project = require('../../models/project');
let modelProject = require('../../models/project');

/**
 * GET /project/invite handler
 *
 * Confirm user participation in project
 *
 * @param req
 * @param res
 */
let confirmInvite = function (req, res) {
  let get = req.query;
  let cookies = req.cookies;

  let memberId = cookies.member || get.member;
  let projectId = cookies.project || get.project;
  let hash = cookies.hash || get.hash;

  res.clearCookie('inviteMember');
  res.clearCookie('inviteProject');
  res.clearCookie('inviteHash');

  let generatedHash = project.generateInviteHash(memberId, projectId);

  if (generatedHash !== hash) {
    res.render('yard/errors/error.twig', {
      title: 'Invalid link',
      message: 'Sorry, this link doesn\'t work. Request new from team leader'
    });
    return;
  }

  let user = res.locals.user;

  if (!user) {
    let params = {
      message: {
        type: 'notify',
        text: 'You must be logged in to accept an invitation'
      }
    };

    res.cookie('inviteMember', memberId);
    res.cookie('inviteProject', projectId);
    res.cookie('inviteHash', hash);
    res.cookie('redirect', req.originalUrl);

    res.render('yard/auth/login', params);
    return;
  }

  let foundProject;

  project.confirmInvitation(get.project, get.member, user._id)
    .then(project => {
      foundProject = project;
    })
    .then(() => {
      res.locals.userProjects.forEach(project => {
        console.log(project.id, get.project);
          if (project.id == get.project) {;
            res.redirect('/garage');
          }
        }
      );

      modelProject.addProjectToUserProjects(user._id, get.project);
    })
    .then(() => {
      res.render('yard/invite', {
        user: user,
        project: foundProject
      });
    })
    .catch((e) => {
      logger.error('Error while confirm project invitation ', e);
      res.sendStatus(500);
    });
};

router.get('/', confirmInvite);

module.exports = router;
