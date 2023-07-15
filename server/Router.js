const bcrypt = require('bcrypt');
const e = require('express');

class Router {
  constructor(app, db) {
    this.register(app, db);
    this.login(app, db);
    this.logout(app, db);
    this.isLoggedIn(app, db);
    this.saveRankings(app,db);
    this.getRankings(app,db);
    this.getGlobalRankings(app,db);
    this.getUsers(app,db);
    this.getUserRankings(app,db);
    this.checkUser(app,db);
    this.getFollowing(app,db);
    this.insertFollow(app,db);
    this.checkFollowing(app,db);
    this.removeFollow(app,db);
    this.getAlbumSongRankings(app,db);
    this.saveAlbumSongRankings(app, db);
    this.getSongRankings(app,db);
    this.saveSongRankings(app,db);
    this.getFavorites(app,db);
    this.getPreSorted(app,db);
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
  
      const query = 'SELECT a.album_name, a.youtube_link ' +
        'FROM albums AS a ' +
        'LEFT JOIN album_ranking AS ar ON a.album_id = ar.album_id AND ar.user_id = ? ' +
        'ORDER BY COALESCE(ar.rank, a.album_id)';
  
      db.query(query, [userId], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {
          const rankings = results.map(row => ({
            album_name: row.album_name,
            youtube_link: row.youtube_link
          }));
          res.json(rankings);
        }
      });
    });
  }

  saveSongRankings(app, db) {
    app.post('/saveSongRankings', (req, res) => {
      const rankings = req.body.rankings;
  
      // Update the rankings in the database
      const userId = req.session.userID;
      rankings.forEach(async (song, index) => {
 
        const songQuery = 'SELECT song_id FROM songs WHERE song_name = ?';
        const [rows] = await db.promise().query(songQuery, [song]);
  
        if (rows.length > 0) {
          const songId = rows[0].song_id;

          const checkQuery = 'SELECT COUNT(*) as count FROM song_ranking WHERE song_id = ? AND user_id = ? AND (`rank` IS NOT NULL OR album_song_rank IS NOT NULL)';
          const [checkRows] = await db.promise().query(checkQuery, [songId, userId]);
  
          if (checkRows[0].count > 0) {
 
            const updateQuery = 'UPDATE song_ranking SET `rank` = ? WHERE song_id = ? AND user_id = ?';
            db.query(updateQuery, [index + 1, songId, userId], (error, result) => {
              if (error) {
                console.error('Error updating album song ranking:', error);
                res.status(500).send('Internal Server Error');
              }
            });
          } else {

            const insertQuery = 'INSERT INTO song_ranking (user_id, song_id, `rank`) VALUES (?, ?, ?)';
            db.query(insertQuery, [userId, songId, index + 1], (error, result) => {
              if (error) {
                console.error('Error inserting album song ranking:', error);
                return res.status(500).send('Internal Server Error');
              }
            });
          }
        } else {
          console.error(`Song not found: ${song}`);
        }
      });
  
      // Send a success response
      return res.sendStatus(200);
    });
  }
  
  getSongRankings(app, db) {
    app.get('/getSongRankings', (req, res) => {
      const userId = req.session.userID;
  
      const query = 'SELECT s.song_name, s.youtube_link, s.cover_art ' +
        'FROM songs as s ' +
        'LEFT JOIN song_ranking AS sr ON s.song_id = sr.song_id AND sr.user_id = ? ' +
        'ORDER BY COALESCE(sr.`rank`, s.song_id)';
  
      db.query(query, [userId], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {
          const rankings = results.map(row => ({
            song_name: row.song_name,
            youtube_link: row.youtube_link,
            cover_art: row.cover_art
          }));
          res.json(rankings);
        }
      });
    });
  }
  saveAlbumSongRankings(app, db) {
    app.post('/saveAlbumSongRankings', (req, res) => {
      const rankings = req.body.rankings;
  
      // Update the rankings in the database
      const userId = req.session.userID;
      rankings.forEach(async (song, index) => {
 
        const songQuery = 'SELECT song_id FROM songs WHERE song_name = ?';
        const [rows] = await db.promise().query(songQuery, [song]);
  
        if (rows.length > 0) {
          const songId = rows[0].song_id;

          const checkQuery = 'SELECT COUNT(*) as count FROM song_ranking WHERE song_id = ? AND user_id = ? AND (`rank` IS NOT NULL OR album_song_rank IS NOT NULL)';
          const [checkRows] = await db.promise().query(checkQuery, [songId, userId]);
  
          if (checkRows[0].count > 0) {
 
            const updateQuery = 'UPDATE song_ranking SET album_song_rank = ? WHERE song_id = ? AND user_id = ?';
            db.query(updateQuery, [index + 1, songId, userId], (error, result) => {
              if (error) {
                console.error('Error updating album song ranking:', error);
                res.status(500).send('Internal Server Error');
              }
            });
          } else {

            const insertQuery = 'INSERT INTO song_ranking (user_id, song_id, album_song_rank) VALUES (?, ?, ?)';
            db.query(insertQuery, [userId, songId, index + 1], (error, result) => {
              if (error) {
                console.error('Error inserting album song ranking:', error);
                return res.status(500).send('Internal Server Error');
              }
            });
          }
        } else {
          console.error(`Song not found: ${song}`);
        }
      });
  
      // Send a success response
      return res.sendStatus(200);
    });
  }

  getAlbumSongRankings(app, db) {
    app.get('/getAlbumSongRankings', (req, res) => {
      const userId = req.session.userID;
      
      const albumId = req.query.album_id;

      const query = 'SELECT s.song_name, s.youtube_link, s.cover_art ' +
        'FROM songs AS s ' +
        'LEFT JOIN song_ranking AS sr ON s.song_id = sr.song_id AND sr.user_id = ? ' +
        'WHERE s.album_id = ? ' +
        'ORDER BY COALESCE(sr.album_song_rank, s.song_id)';
  
      db.query(query, [userId, albumId], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {
          const rankings = results.map(row => ({
            song_name: row.song_name,
            youtube_link: row.youtube_link,
            cover_art: row.cover_art
          }));
          res.json(rankings);
        }
      });
    });
  }

  getGlobalRankings(app, db) {
    app.get('/getGlobalRankings', (req, res) => {
  
      const query = 'SELECT a.album_name, a.youtube_link, ar.album_id, SUM(ar.`rank`)' +
        'FROM album_ranking AS ar ' +
        'LEFT JOIN albums AS a ON ar.album_id = a.album_id ' +
        'GROUP BY ar.album_id ' +
        'HAVING SUM(ar.`rank`) != 0 '
        'ORDER BY SUM(ar.`rank`)';
      
      const query2 = 'SELECT s.song_name, s.youtube_link, s.cover_art, sr.song_id, SUM(sr.album_song_rank)' +
        'FROM song_ranking AS sr ' +
        'LEFT JOIN songs AS s ON sr.song_id = s.song_id ' +
        'WHERE s.album_id = ? ' +
        'GROUP BY sr.song_id ' +
        'HAVING SUM(sr.album_song_rank) != 0 ' +
        'ORDER BY SUM(sr.album_song_rank)';
      
      const query3 = 'SELECT s.song_name, s.youtube_link, s.cover_art, sr.song_id, SUM(sr.`rank`)' +
        'FROM song_ranking AS sr ' +
        'LEFT JOIN songs AS s ON sr.song_id = s.song_id ' +
        'GROUP BY sr.song_id ' +
        'HAVING SUM(sr.`rank`) != 0 ' +
        'ORDER BY SUM(sr.`rank`)';
  
        db.query(query, (error, albumResults) => {
          if (error) {
            console.error('Error fetching album rankings:', error);
            res.status(500).send('Internal Server Error');
          } else {
  
            const AlbumSongRankings = [];
  
            db.query(query3, (error, songResults) => {
              if (error) {
                console.error('Error fetching song rankings:', error);
                res.status(500).send('Internal Server Error');
              } else {
                const getSongRankings = (index) => {
                  if (index > 10) {
                    // Finished querying all song rankings
                    res.json({ albums: albumResults, albumSongs: AlbumSongRankings, songs: songResults });
                    return;
                  }
        
                  const albumId = index;
                  db.query(query2, [albumId], (error, AlbumSongResults) => {
                    if (error) {
                      console.error(`Error fetching song rankings for album ID ${albumId}:`, error);
                      res.status(500).send('Internal Server Error');
                    } else {
                      // Add song rankings to the songRankings list
                      AlbumSongRankings.push(AlbumSongResults);
        
                      // Move to the next album ID
                      getSongRankings(index + 1);
                  
                }
              });
            };
              getSongRankings(1);
              }
            });
    
            
          }
        });
      });
    }

  getUsers(app, db) {
    app.get('/getUsers', (req, res) => {
        const username = req.query.username;
        if (username.length === 0) {
          res.json([])
          return
        }

        const query = 'SELECT user.username ' +
            'FROM user ' +
            'WHERE user.username LIKE ? ' +
            'ORDER BY LENGTH(user.username) ' +
            'LIMIT 10';

        db.query(query, [`%${username}%`], (error, results) => {
            if (error) {
                console.error('Error fetching rankings:', error);
                res.status(500).send('Internal Server Error');
            } else {
                const users = results;
                res.json(users);
            }
        });
    });
  }
  
  getUserRankings(app, db) {
    app.get('/getUserRankings', (req, res) => {
      const username = req.query.username;
  
      const query = 'SELECT a.album_name, a.youtube_link ' +
        'FROM album_ranking AS ar ' +
        'LEFT JOIN albums AS a ON ar.album_id = a.album_id ' +
        'LEFT JOIN user as u ON ar.user_id = u.id ' +
        'WHERE u.username = ? ' +
        'ORDER BY ar.`rank`';
  
      const query2 = 'SELECT s.song_name, s.youtube_link, s.cover_art ' +
        'FROM song_ranking as sr ' +
        'LEFT JOIN songs AS s ON sr.song_id = s.song_id ' +
        'LEFT JOIN user as u ON sr.user_id = u.id ' +
        'WHERE u.username = ? AND s.album_id = ? AND sr.album_song_rank IS NOT NULL ' +
        'ORDER BY sr.album_song_rank';
      
      const query3 = 'SELECT s.song_name, s.youtube_link, s.cover_art ' +
        'FROM song_ranking as sr ' +
        'LEFT JOIN songs AS s ON sr.song_id = s.song_id ' +
        'LEFT JOIN user as u ON sr.user_id = u.id ' +
        'WHERE u.username = ? AND sr.`rank` IS NOT NULL ' +
        'ORDER BY sr.`rank`';
  
      db.query(query, [username], (error, albumResults) => {
        if (error) {
          console.error('Error fetching album rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {

          const AlbumSongRankings = [];
          const SongRankings = [];

          db.query(query3, [username], (error, songResults) => {
            if (error) {
              console.error('Error fetching song rankings:', error);
              res.status(500).send('Internal Server Error');
            } else {
              const getSongRankings = (index) => {
                if (index > 10) {
                  // Finished querying all song rankings
                  res.json({ albums: albumResults, albumSongs: AlbumSongRankings, songs: songResults });
                  return;
                }
      
                const albumId = index;
                db.query(query2, [username, albumId], (error, AlbumSongResults) => {
                  if (error) {
                    console.error(`Error fetching song rankings for album ID ${albumId}:`, error);
                    res.status(500).send('Internal Server Error');
                  } else {
                    // Add song rankings to the songRankings list
                    AlbumSongRankings.push(AlbumSongResults);
      
                    // Move to the next album ID
                    getSongRankings(index + 1);
                
              }
            });
          };
            getSongRankings(1);
            }
          });
  
          
        }
      });
    });
  }
  
  
  checkUser(app,db) {
    app.get('/checkUser', (req, res) => {

      const username = req.query.username;

      const query = 'SELECT COUNT(username) ' +
      'FROM user ' +
      'WHERE username = ?';
  
      db.query(query, [`${username}`], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } 
        else if (results[0]['COUNT(username)'] === 0){
          res.json(false);
        }
        else {
          res.json(true);
        }
      });
    });
  }

  getFollowing(app,db) {
    app.get('/getFollowing', (req, res) => {

      const username = req.query.username;

      const subquery = 'SELECT id FROM user WHERE username = ?';

      const query = 'SELECT user.username ' +
                    'FROM following ' +
                    'LEFT JOIN user ON following.following_id = user.id ' +
                    `WHERE following.user_id = (${subquery})`;
  
      db.query(query, [`${username}`], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } 
        else {
          res.json(results);
        }
      });
    });
  }

  insertFollow(app,db) {
    app.get('/insertFollow', (req, res) => {

      const username = req.query.username;

      const subquery = 'SELECT id FROM user WHERE username = ?';

      const query = 'INSERT INTO following (user_id, following_id) ' +
                     `VALUES (?, (${subquery}))`;
                
      db.query(query, [req.session.userID, username], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {
          res.sendStatus(200);
        }
      });
    });
  }

  removeFollow(app,db) {
    app.get('/removeFollow', (req, res) => {

      const username = req.query.username;

      const query = 'DELETE FROM following WHERE user_id = ? AND following_id = (SELECT id FROM user WHERE username = ?)';
                
      db.query(query, [req.session.userID, username], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {
          res.sendStatus(200);
        }
      });
    });
  }

  checkFollowing(app,db) {
    app.get('/checkFollowing', (req, res) => {

      const username = req.query.username;

      const query = 'SELECT COUNT(user_id) ' +
                    'FROM following ' + 
                    'WHERE user_id = ? AND following_id = (SELECT id FROM user WHERE username = ?)';
                
      db.query(query, [req.session.userID, username], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } 
        else if (results[0]['COUNT(user_id)'] > 0) {
          res.json(true)
        }
        else {
          res.json(false)
        }
      });
    });
  }

  getFavorites(app,db) {
    app.get('/getFavorites', (req, res) => {

      const query = 'SELECT a.album_name, a.youtube_link ' +
                    'FROM albums as a ' + 
                    'LEFT JOIN album_ranking as ar ON a.album_id = ar.album_id ' +
                    'WHERE user_id = ? AND ar.`rank` = 1 ' +
                    'LIMIT 1';
      
      const query2 = 'SELECT s.song_name, s.youtube_link, s.cover_art ' +
                  'FROM songs as s LEFT JOIN song_ranking as sr ' + 
                  'ON s.song_id = sr.song_id ' +
                  'WHERE user_id = ? and sr.`rank` = 1 ' +
                  'LIMIT 1';
            
      db.query(query, [req.session.userID], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } 
        else {
          const favorites = [];

          favorites.push(results[0]);
          db.query(query2, [req.session.userID], (error, results2) => {
            if (error) {
              console.error('Error fetching rankings:', error);
              res.status(500).send('Internal Server Error');
            } else{
              favorites.push(results2[0]);
              
              res.json(favorites);
            }
          })
        }
      });
    });
  }

  getPreSorted(app, db) {
    app.get('/getPreSorted', (req, res) => {
      const userId = req.session.userID;
  
      const query = `
        SELECT 
          s.song_name,
          s.youtube_link,
          s.cover_art,
          sr.album_song_rank,
          s.album_id,
          sr.album_song_rank
        FROM songs as s
        LEFT JOIN song_ranking AS sr ON s.song_id = sr.song_id AND sr.user_id = ?
        ORDER BY s.album_id ASC, COALESCE(sr.album_song_rank, s.song_id) ASC
      `;
  
      db.query(query, [userId], (error, results) => {
        if (error) {
          console.error('Error fetching rankings:', error);
          res.status(500).send('Internal Server Error');
        } else {
          const sortedLists = [];
          let currentAlbumId = null;
          let currentList = [];
  
          for (const row of results) {
            if (row.album_id !== currentAlbumId) {
              // Start a new inner list for each album_id
              if (currentList.length > 0) {
                sortedLists.push(currentList);
              }
              currentList = [];
              currentAlbumId = row.album_id;
            }
  
            if (row.album_song_rank !== null) {
              currentList.push({
                song_name: row.song_name,
                youtube_link: row.youtube_link,
                cover_art: row.cover_art,
              });
            } else {
              // Create a single-element inner list for songs without album_song_rank
              sortedLists.push([
                {
                  song_name: row.song_name,
                  youtube_link: row.youtube_link,
                  cover_art: row.cover_art,
                },
              ]);
            }
          }
  
          // Add the last inner list
          if (currentList.length > 0) {
            sortedLists.push(currentList);
          }
  
          res.json(sortedLists);
        }
      });
    });
  }
  
}

module.exports = Router;
