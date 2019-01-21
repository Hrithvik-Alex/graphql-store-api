const graphql = require('graphql');
const { GraphQLObjectType, GraphQLInt, GraphQLFloat, GraphQLID, GraphQLNonNull } = graphql;
const Product = require('../model/product');
const Cart = require('../model/cart'); 
const { ProductType, CartType } = require('./type');


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addProduct: { // creates a product to the database
            type: ProductType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLID)},
                price: {type: GraphQLFloat},
                inventory_count: {type: GraphQLInt}
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
                id: {type: GraphQLID}
            },
            resolve: (parent, args) => {
                let product = mongoose.products.findById({id: args.id});
            }
        },
        addCart: { // initializes cart object
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
        // addProductToCart: {
        //     type: ProductType,
        //     args: {
        //         cartId: {type: GraphQLID},
        //         productId: {type: GraphQLID}
        //     },
        //     resolve: (parent, args) => {
        //         let product = _.find(products, {id: args.productId});
        //         let cart = _.find(carts, {id: args.cartId});

        //     }
        // },
        // checkoutCart: {

        // }
    }
});

module.exports = Mutation;