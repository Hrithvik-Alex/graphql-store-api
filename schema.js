const graphql = require('graphql');
const { GraphQLSchema } = graphql;

const RootQuery = require('./schema/query');
const Mutation = require('./schema/mutation');



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})