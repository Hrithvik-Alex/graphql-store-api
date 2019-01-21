const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;
const Product = require('../model/product');

// product object
const ProductType = new GraphQLObjectType({ 
    name: 'Product',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: {type: new GraphQLNonNull(GraphQLString)},
        price: {type: new GraphQLNonNull(GraphQLFloat)},
        inventory_count: {type: GraphQLInt}
    }) 
})

// cart object
const CartType = new GraphQLObjectType({
    name: 'Cart',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLID)},
        size: {type: GraphQLInt},
        total_value: {type: GraphQLFloat},
        products: {
            type: new GraphQLList(ProductType),
            resolve: (parent, args) => {
                Product.find({id: parent.products.id});
            }
        }
    }) 
})

module.exports = {
    ProductType,
    CartType
}