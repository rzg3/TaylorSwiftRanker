const bcrypt = require('bcrypt');

class Router {
  constructor(app, db) {
    this.register(app, db);
    this.login(app, db);
    this.logout(app, db);
    this.isLoggedIn(app, db);

  }

  register(app, db) {
    app.post('/register', (req, res) => {
      let username = req.body.username;
      let password = req.body.password;
      username = username.toLowerCase();

      if (username.length > 15 || password.length > 15) {
        res.json({
          success: false,
          msg: 'An error occurred, please try again',
        });
        return;
      }

      let cols = [username];
      db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
        if (err) {
          res.json({
            success: false,
            msg: 'An error occurred, please try again',
          });
          return;
        }

        // Found 1 user with this username
        if (data && data.length === 1) {
          res.json({
            success: false,
            msg: 'User already exists, choose different username',
          });
        } else {
          let pswrd = bcrypt.hashSync(password, 9);
          let cols = [username, pswrd]
          db.query('INSERT INTO user (username, password) VALUES (?, ?)', cols, (err, data, fields) => {
            if (err) {
              res.json({
                success: false,
                msg: 'An error occurred, please try again',
              });
              return;
            }
            else {
              db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
                if (err) {
                  res.json({
                    success: false,
                    msg: 'An error occurred, please try again',
                  });
                  return;
                }
  
                req.session.userID = data[0].id;
                res.json({
                  success: true,
                  username: username,
                  msg: 'User inserted successfully',
                });
              });
            }
          });
 
        }
      });
    });
  }

  login(app, db) {
    app.post('/login', (req, res) => {
      let username = req.body.username;
      let password = req.body.password;

      username = username.toLowerCase();

      if (username.length > 15 || password.length > 15) {
        res.json({
          success: false,
          msg: 'An error occurred, please try again',
        });
        return;
      }

      let cols = [username];
      db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
        if (err) {
          res.json({
            success: false,
            msg: 'An error occurred, please try again',
          });
          return;
        }

        // Found 1 user with this username
        if (data && data.length === 1) {
          bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
            if (verified) {
              req.session.userID = data[0].id;
              console.log(req.session.userID)

              res.json({
                success: true,
                username: data[0].username,
              });
            } else {
              res.json({
                success: false,
                msg: 'Invalid password',
              });
            }
          });
        } else {
          res.json({
            success: false,
            msg: 'User not found, please try again',
          });
        }
      });
    });
  }

  logout(app, db) {
    app.post('/logout', (req, res) => {
      if (req.session.userID) {
        req.session.destroy();
        res.json({
          success: true,
        });
        return true;
      } else {
        res.json({
          success: false,
        });
        return false;
      }
    });
  }

  isLoggedIn(app, db) {
    app.post('/isLoggedIn', (req, res) => {
      if (req.session.userID) {
        let cols = [req.session.userID];
        db.query('SELECT * FROM user WHERE id = ? LIMIT 1', cols, (err, data, fields) => {
          if (data && data.length === 1) {
            res.json({
              success: true,
              username: data[0].username,
            });
            return true;
          } else {
            res.json({
              success: false,
            });
          }
        });
      } else {
        res.json({
          success: false,
        });
      }
    });
  }


  
}

module.exports = Router;
