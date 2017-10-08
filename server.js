const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// // use express middleware
// app.use(express.static(__dirname + '/public'));

// middleware (it will be called on each and every request the client made to the server)
app.use((req, res, next)  =>  {
  var now = new Date().toString();

  // console.log(`${now}: ${req.method} ${req.url}`);
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  // fs.appendFile('server.log', log + '\n'); // now this is depricated, and it is now converted to complete asynchronous. Below is the solution
  // after node 7+ released, there is minor change in appendFile function. now callback function with error message is required, else it will give deprecation warning in console ((node:9653) [DEP0013] DeprecationWarning: Calling an asynchronous function without callback is deprecated.)
  fs.appendFile('server.log', log + '\n', (err)  =>  {
    if(err) {
      console.log('Unable to append to server.log...');
    }
  });
  next();
});

// maintenance mode middleware
app.use((req, res, next)  =>  {
  // query to check if maintenance mode is enabled or not
  var maintenanceMode = false;

  if(maintenanceMode) {
    res.render('maintenance.hbs');
  } else {
    next();
  }
});

// use express middleware
app.use(express.static(__dirname + '/public'));

// register provider helper for the common data in all footer pages
hbs.registerHelper('getCurrentYear', () =>  {
  return new Date().getFullYear();
});

// for test purpose - helper taking argument(s)
hbs.registerHelper('screamIt', (text) =>  {
  console.log('hereeee');
  console.log(text);
  return text.toUpperCase();
});


app.get('/', (req, res) =>  {
  // res.send('<h1>hello express</h1>');
  // for json response, send object {} as a response to send method.

  // res.send({
  //   name: "Sanjay",
  //   likes: [
  //     'Biking',
  //     'Cities'
  //   ]
  // });

  res.render('home.hbs', {
    pageTitle: 'Home Page',
    // currentYear: new Date().getFullYear()
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res)  =>  {
  // res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Us',
    // currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (req, res)  =>  {
  res.send({
    errorMessage: 'Unable to handle request'
  });
})

// app.listen(3000);
app.listen(3000, () =>  {
  console.log('Server is up on port 3000!');
});
