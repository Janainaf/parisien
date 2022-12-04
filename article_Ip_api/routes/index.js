const express = require("express");
const router = express.Router();
const models = require("../models");
const { User, Article } = models;
const bcrypt = require("bcryptjs");
const { authenticateUser } = require("../middleware/auth-user.js");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// Returns  all properties and values for the currently authenticated User

router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: { id: req.currentUser.id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [{ model: Article }],
    });
    res.json({ user });
    res.status(200).end();
  })
);

// Creates a new user, set the Location header to "/", and return a 201 HTTP status code and no content.

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const errors = [];

    try {
      const user = await User.build(req.body);

      if (!user.firstName) {
        errors.push("Please provide your First Name");
      }
      if (!user.lastName) {
        errors.push("Please provide you Last Name");
      }
      if (!user.emailAddress) {
        errors.push("Please provide your e-mail address");
      }
      if (!user.password) {
        errors.push("Please provide a password");
      }
      if (errors.length > 0) {
        res.status(400).json({ errors });
      } else {
        if (user.password) {
          user.password = bcrypt.hashSync(user.password, 10);
        }
        await user.save();
        res.status(201).location("/").end();
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);

// Returns all articles including  User associated
router.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        },
      ],
    });
    res.json(articles.map((article) => article.get({ plain: true })));
    res.status(200).end();
  })
);

//  Returns corresponding article including  User associated
router.get(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
        ],
      });
      if (article) {
        res.json({
          article,
        });
        res.status(200).end();
      } else {
        res.status(404).json({
          message: "Route Not Found",
        });
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);
//  Creates a new article
router.post(
  "/articles",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let article;
    const errors = [];
    try {
      article = await Article.build(req.body);
      article.userId = req.currentUser.id;

      if (!article.title) {
        errors.push('Please provide a value for "title"');
      }
      if (!article.description) {
        errors.push('Please provide a value for "description"');
      }

      if (errors.length > 0) {
        res.status(400).json({ errors });
      } else {
        if (article) {
          await article.save();
          res.status(201).location(`/articles/${article.id}`).end();
        }
      }
    } catch (error) {
      console.log("There was an error", error);
    }
  })
);
// Updates the corresponding article and return a 204 HTTP status code and no content.

router.put(
  "/articles/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let article;
    const errors = [];
    const user = req.currentUser;

    try {
      article = await Article.findByPk(req.params.id);
      if (article) {
        if (article.userId === user.id) {
          await article.update(req.body);
          res.status(204).end();
        } else {
          res.status(403).json({ error: "Not authorised" });
        }
      } else {
        res.status(404).json(`Article Not Found`);
      }
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//  Deletes the corresponding article and return a 204 HTTP status code and no content.
router.delete(
  "/articles/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      const user = req.currentUser;
      if (user.id === article.userId) {
        if (article) {
          await article.destroy();
          res.status(204).location("/articles/").end();
        } else {
          res.status(404).json("Article Not Found");
        }
      } else {
        res.status(401).json({
          message: "Not Authorized.",
        });
      }
    } catch (error) {
      console.log("there was an error", error);
    }
  })
);
module.exports = router;
