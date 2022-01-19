const PORT = process.env.PORT || 3001;
const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');
const routes = require('./controllers');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const app = express();

const ses = {
    secret: 'password',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(ses));
app.engine('handlebars', hbs.engine); 
app.set('view engine', 'handlebars'); 


app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log('Listening'));
});

