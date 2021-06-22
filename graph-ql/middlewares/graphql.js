import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from '../graphql/schema.js';
import graphqlResolver from '../graphql/resolvers.js';

export default graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn: function (err) {
        if (!err.originalError) {
            return err;
        } else {
            const { message = 'An error occurred!', status = 500 } = err.originalError;
            return { message: message, status: status };
        }
    }
})