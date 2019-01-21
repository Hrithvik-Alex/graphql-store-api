const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql;
const Product = require('../model/product');
const Cart = require('../model/cart'); 
const { ProductType, CartType } = require('./type');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        product: { // returns product by querying id 
            type: ProductType,
            args: {id: {type: GraphQLID}},
            resolve: (parent, args) => {
                return Product.findById(args.id);
            }
        },
        cart: { // returns cart by querying id
            type: CartType,
            args: {id: {type: GraphQLID}},
            resolve: (parent, args) => {
                return Cart.findById(args.id);
            }
        },
        products: { // returns all products
            type: new GraphQLList(ProductType),
            resolve: (parent, args) => {
                return Product.find();
            }
        },
        carts: { // returns all carts (should not be accessed by users)
            type: new GraphQLList(CartType),
            resolve: (parent, args) => {
                return Cart.find();
            }
        },
        productsInStock: { // returns available products in stock
            type: new GraphQLList(ProductType),
            resolve: (parent, args) => {
                return Product.find({inventory_count: {$gt: 0}});
            }
        }
    }
    
});

module.exports = RootQuery;







// let cart = await Cart.findById(args.id);
                // if(!cart){
                //     throw new Error(`Checkout Error: couldn't find cart`)
                // }
                // let products = cart.products;
                // console.log(products.length);
                // if(!products.length){
                //     throw new Error(`Checkout Error: cart is empty`);
                // }
                // // let productFrequency = {};
                // // products.forEach(product => {
                // //     let id = product.id
                // //     productFrequency[id] = (productFrequency[id]==0) ? 0 : productFrequency[id]++;
                // // });

                // // let freqs = Object.keys(productFrequency);

                // // freqs.forEach(freq => {
                // //     let productFreq = productFrequency[freq];

                // // })

                // for( i = 0; i < products.length; i++) {
                //     if(product.inventory_count <= 0){
                //         throw new Error(`Checkout Error: item is out of stock`);
                //     }
                    

                //     await Product.findOneAndUpdate(
                //         product.id,
                //         {
                //         $inc: {inventory_count: -1}
                //         }
                //     );
                // };
          
                // cart.remove();
                // return null;