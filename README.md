# Shopify Backed Intern Challenge

This is my submission for the Summer 2019 backend intern challenge. I used GraphQL and Node.js to create the backend logic, and MongoDB to handle the database. I chose to use GraphQL as I love to learn new technologies, and I had always heard of the wonders of GraphQL over traditional REST APIs. 

## Getting Started:
For quick access, the server can be viewed [here](https://shopify-s19.herokuapp.com).

You may also download the API yourself:
First, clone the repository:
`git clone https://github.com/ShehryarX/shopify-intern-challenge`  

Then, install all the dependencies and run the server:

`npm install` 

`node server.js`

Finally, navigate to `localhost:4000/graphql` to demo the API.

## Overview

The main functionality that we want to achieve with the API is to be able to query and purchase products. I also chose to follow the optional challenge, and add the shopping cart feature. Mainly we want users to do the following:

- create an instance of the shopping cart
- allow users to query objects in the shopping cart, and filter by products in stock
- add products to the shopping cart
- checkout the shopping cart, given that the right amount of inventory is available and update it accordingly

We also want administrators to have the following priviledges:
- add items to the database given the parameters title, price, and inventory count
- delete items from the database
- query all available shopping carts from the database

None of these administrator commands are required, but I believe that they are nice to have.

## Models

In order to effectively create the skeleton of a market, I created two main Models: the Product and the Cart. 

#### Product
```
const productSchema = new Schema({
    title: {type: String, required: true},
    price: Number,
    inventory_count: Number
}) 
```
The product contains the required parameters of title, price, and inventory count. These parameters are adequate in describing the functionality of a product.
#### Cart

```
const cartSchema = new Schema({
    size: Number,
    total_value: Number,
    products: [
        { 
            title: {
                type: String,
                required: true
            },
            price: Number,
            inventory_count: Number  
    }
    ]
}) 
```

The cart contains a size(number of products), total value, and a list of all the products included in the cart.


# Documentation

## Queries

Queries are based on MongoDB generated IDs for each object.

The following queries are defined:

| Query         | Parameters                                                                                   | Operation         |
|---------------|----------------------------------------------------------------------------------------------|-------------------|
| product | `id`: String  | Returns the product specified by the ID  |
| products | none  | Returns all products |
| productsInStock | none  | Returns all products currently with an inventory count greater than 0 |
| cart |`id`: String | Returns the cart specified by the ID |
| carts | none | Returns all carts |
## Mutations

Mutations are based on MongoDB generated IDs for each object.


The API supports the following mutations:

| Mutation      | Parameters                                                                                   | Operation         |
|---------------|----------------------------------------------------------------------------------------------|-------------------|
| createProduct | `input` : {<br > `title` : String,<br > `price` : Float,<br > `inventory_count` : Int<br > } | Initializes a product |
| deleteProduct | `id`: String | Deletes the specified product by ID|
| clearProducts | none | Wipes all products |
| createCart | none | Initializes a cart |
| addProductToCart | `input` : {<br >`cartId`: String <br>  `productId`: String<br>} | Adds product specified by ID to cart specified by ID |
| checkoutCart | `Id`: String | checkouts cart, and removes product inventory accordingly |

