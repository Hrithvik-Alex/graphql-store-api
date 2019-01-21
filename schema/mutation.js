const graphql = require('graphql');
const { GraphQLObjectType, GraphQLInt, GraphQLFloat, GraphQLID, GraphQLNonNull, GraphQLList } = graphql;
const Product = require('../model/product');
const Cart = require('../model/cart'); 
const { ProductType, CartType } = require('./type');


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createProduct: { // creates a new product into the database
            type: ProductType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLID)},
                price: {type: new GraphQLNonNull(GraphQLFloat)},
                inventory_count: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                let product = new Product({
                    title: args.title,
                    price: args.price,
                    inventory_count: args.inventory_count
                });
                return product.save();

            }
        },
        deleteProduct: { // deletes a product from the database
            type: ProductType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parent, args) => {
                let product = await Product.findById(args.id);
                product.remove();
                return null;
            }
        },
        clearProducts: { // deletes all products
            type: ProductType,
            resolve: async (parent, args) => {
                await Product.remove({});
                return null;
            }
        },
        createCart: { // initializes cart object
            type: CartType,
            resolve: (parent, args) => {
                let cart = new Cart({
                    size: 0,
                    total_value: 0.0,
                    products: []
                });
                return cart.save();
            }
        },
        addProductToCart: {
            type: CartType,
            args: {
                cartId: {type: new GraphQLNonNull(GraphQLID)},
                productId: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve: async (parent, args) => {
                let product = await Product.findById(args.productId);
                if(product.inventory_count<=0){
                    throw new Error(`Cart Adding Error: product is out of stock`);
                }
                let cart = await Cart.findById(args.cartId);
                await cart.update({ 
                            $inc: {total_value: product.price, size: 1},
                            $push: {products: product}
                       });
                return cart;
                // return Cart.findOneAndUpdate(
                //    args.cartId,
                //    { 
                //         $inc: {total_value: product.price, size: 1},
                //         $push: {products: product}
                //    }
                // );
            }
        },
        checkoutCart: { // checks out cart: checks if cart is empty, or if items in cart are sold out before completing action
            type: CartType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parent, args) => {
                let cart = await Cart.findById(args.id);
                if(!cart){
                    throw new Error(`Checkout Error: couldn't find cart`)
                }
                let products = cart.products;
                console.log(products.length);
                if(!products.length){
                    throw new Error(`Checkout Error: cart is empty`);
                }

                for( i = 0; i < products.length; i++) {
                    console.log(products[i]);
                    if(products[i].inventory_count <= 0){
                        throw new Error(`Checkout Error: item is out of stock`);
                    }

                   let product = await Product.findById(products[i].id);
                   await product.update(
                       { $inc: {inventory_count: -1}} 
                       );
                };
          
                cart.remove();
                return null;
            } 
        }
    }
});

module.exports = Mutation;