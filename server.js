// --------
// Packages and middleware
// --------
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema.js')
const mongoose = require('mongoose');

const app = express();

// ---------
// DataBase 
// ---------


mongoose.connect(
    'mongodb://halex:UWaterlooShopify2019@ds259154.mlab.com:59154/shopify-challenge',
    { useNewUrlParser: true }
    );
mongoose.connection.once('open', () => {
    console.log("DB connected");
})


// --------
//  Setup
// --------


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () =>
  console.log(`🚀 Server ready at port 4000`)
)