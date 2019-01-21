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
            resolve: (parent, args) => {
                return Product.deleteOne({id: args.id});
            }
        },
        clearProducts: { // deletes all products
            type: new GraphQLList(ProductType),
            resolve: (parent, args) => {
                return Product.deleteMany({ });
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
                quantity: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (parent, args) => {
                let product = await Product.findById(args.productId);
                let quantity = args.quantity;
                let totalProductPrice = product.price * quantity;
                if(product.inventory_count<=0){
                    throw new Error(`Cart Adding Error: product is out of stock`);
                }
                if(args.quantity > product.inventory_count){
                    throw new Error(`Cart Adding Error: Only ${product.inventory_count} units left`);
                }
                return Cart.findOneAndUpdate(
                   args.cartId,
                   { 
                        $inc: {size: quantity},
                        $inc: {total_value: totalProductPrice},
                        $push: {products: product}
                   }
                );
            }
        },
        checkoutCart: { // checks out cart: checks if cart is empty, or if items in cart are sold out before completing action
            type: CartType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parent, args) => {
                let cart = await Cart.findById(args.id);
                let products = cart.products;
                if(!products.length){
                    throw new Error(`Checkout Error: cart is empty`);
                }
                for(product in products){
                    if(product.inventory_count <= 0){
                        throw new Error(`Checkout Error: item is out of stock`);
                    }
                    await product.updateOne({
                        $inc: {inventory_count: -1}
                    });
                }
          
                Cart.deleteOne({id: cart.id});
                return null;
            } 
        }
    }
});

module.exports = Mutation;