import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8082/graphql', // Replace with your GraphQL endpoint
    cache: new InMemoryCache(),
});

export default client;
