const bcrypt = require('bcrypt');

class Router {
  constructor(app, db) {
    this.register(app, db);
    this.login(app, db);
    this.logout(app, db);
    this.isLoggedIn(app, db);
    this.saveRankings(app,db);
    this.getRankings(app,db);
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

  saveRankings(app, db) {
    app.post('/saveRankings', (req, res) => {
      const rankings = req.body.rankings;
  
      // Update the rankings in the database
      const userId = req.session.userID;
      rankings.forEach(async (album, index) => {
        // Retrieve the album ID based on the album name
        const albumQuery = 'SELECT album_id FROM albums WHERE album_name = ?';
        const [rows] = await db.promise().query(albumQuery, [album]);
  
        if (rows.length > 0) {
          const albumId = rows[0].album_id;
  
          // Check if an entry already exists for the album ranking
          const checkQuery = 'SELECT COUNT(*) as count FROM album_ranking WHERE album_id = ? AND user_id = ?';
          const [checkRows] = await db.promise().query(checkQuery, [albumId, userId]);
  
          if (checkRows[0].count > 0) {
            // Update the existing album ranking
            const updateQuery = 'UPDATE album_ranking SET `rank` = ? WHERE album_id = ? AND user_id = ?';
            db.query(updateQuery, [index + 1, albumId, userId], (error, result) => {
              if (error) {
                console.error('Error updating album ranking:', error);
                res.status(500).send('Internal Server Error');
              }
            });
          } else {
            // Insert a new album ranking for the user
            const insertQuery = 'INSERT INTO album_ranking (user_id, album_id, `rank`) VALUES (?, ?, ?)';
            db.query(insertQuery, [userId, albumId, index + 1], (error, result) => {
              if (error) {
                console.error('Error inserting album ranking:', error);
                return res.status(500).send('Internal Server Error');
              }
            });
          }
        } else {
          console.error(`Album not found: ${album}`);
        }
      });
  
      // Send a success response
      return res.sendStatus(200);
    });
  }
  
  getRankings(app, db) {
    app.get('/getRankings', (req, res) => {
      const userId = req.session.userID;
  
      const query = 'SELECT a.album_name ' +
        'FROM albums AS a ' +
        'LEFT JOIN album_ranking AS ar ON a.album_id = ar.album_id AND ar.user_id = ? ' +
        'ORDER BY COALESCE(ar.rank, a.album_id)';
  
      db.query(query, [userId], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {
          const rankings = results.map(row => row.album_name);
          res.json(rankings);
        }
      });
    });
  }
  
  
  


  
}

module.exports = Router;
