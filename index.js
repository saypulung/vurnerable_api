const data = require('./data.json');
const users = require('./users.json');
const express = require('express');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('static'));

function generateAccessToken(username) {
    return jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, u) => {
      if (err) return res.sendStatus(403);
      const user = users.find(d => d.username == u.username);
      if (!user) return res.sendStatus(403);
      req.user = user;
      next();
    });
}

app.post('/login', (req, res) => {
    let status = 200;
    let resBody = {};
    const {username, password} = req.body;
    if (username && password) {
        const user = users.find(e => e.username == username);
        if (user && user.pass == password)
        {
            resBody.message = "Login success";
            resBody.token = generateAccessToken(user.username);
        } else {
            status = 403;
            resBody.message = "Access denied";
        }
    } else {
        status = 403;
        resBody.message = "Username and password are required";
    }
    res.status(status).json(resBody);
});
app.get('/project_by_group', [authenticateToken, (req, res) => {
    const id = req.user.group;
    const projects = data.data.filter(e => e.group == id);
    if (projects)
    {
        res.status(200).json({data: projects, message: 'Success load project'});
    } else {
        res.status(404).json({message: 'No project available'});
    }
}]);
app.get('/me', [authenticateToken, (req, res) => {
    res.json(req.user);
}]);

app.listen(3001, console.log('Running'));