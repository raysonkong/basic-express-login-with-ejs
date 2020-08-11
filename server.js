const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

app.use(helmet());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, 'views'))

// Works perfectly
// app.use((req,res, next) => {
//     if (req.query.msg === 'fail'){
//         res.locals.msg = 'Sorry Invalid Credentials';
//     } else {
//         res.locals.msg = ''
//     }

//     next();
// })

const wrongCredential = (req, res, next) => {
    if (req.query.msg === 'fail') {
        res.locals.msg = 'Sorry! Invalid Credentials haha';
    } else {
        res.locals.msg = '';
    }

    next();
} 

app.use(wrongCredential);

app.get('/' , (req, res, next) => {
    res.send("Hello World");
})

app.get('/login', (req, res) => {
    //console.log(req.query)
    res.render('login');

})

app.post('/process_login', (req, res) => {
    const password = req.body.password;
    const username = req.body.username;

    if (password === 'x') {
        res.cookie('username', username);
        res.redirect('/welcome');
    } else {
        res.redirect('/login?msg=fail&test=hello');
    }

    res.json(req.body)
})

app.get('/welcome', (req, res) => {
    res.render('welcome', {
        username: req.cookies.username
    });
})

app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/login');
})

app.listen(port, () => console.log(`App is listening on port ${port}`));