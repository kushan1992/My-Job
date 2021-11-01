const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
//signup
function signUp(req, res) {
  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcryptjs.genSalt(10, function (err, salt) {
          bcryptjs.hash(req.body.password, salt, function (err, hash) {
            const user = {
              userName: req.body.username,
              password: hash,
              firstName: req.body.firstname,
              lastName: req.body.lastname,
              email: req.body.email,
              idUserRole: req.body.roleId,
            };

            models.User.create(user)
              .then((result) => {
                res.status(201).json({
                  message: "User create successfully",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Something went wrong!",
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!",
      });
    });
}

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    process.env.JWT_REFRESH_KEY
  );
};

function login(req, res) {
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        console.log("null");
        req.status(401).json({
          message: "Invalid credentials!",
        });
      } else {
        bcryptjs.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              const accessToken = generateAccessToken(user);
              const refreshToken = generateRefreshToken(user);
              refreshTokens.push(refreshToken);

              res.json({
                userName: user.userName,
                idUserRole: user.idUserRole,
                accessToken,
                refreshToken,
              });
            } else {
              res.status(401).json({
                message: "Invalid credentials!",
              });
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!",
      });
    });
}

function refresh(req, res) {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
}

function logout(req, res) {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
}

function show(req, res) {
  const show = "working";
  res.send(show);
}

module.exports = {
  signUp: signUp,
  login: login,
  refresh: refresh,
  logout: logout,
  show: show,
};
