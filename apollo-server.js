(async () => {

    // global error handler
    try {
        if (process.argv[2] === 'dev') {
            require('dotenv').config()
        }
        //  else {
        //     // get secrets from cloud sercret manager
        // }

        const port = process.env.PORT || 4334

        const express = require('express');
        const app = express();

        const { ApolloServer } = require('apollo-server-express');

        const GithubAPIResource = require('./GithubAPIResource')

        const typeDefs = require('./typeDefs')

        const resolvers = require('./resolvers')

        const apollo_server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                githubAPIResource: new GithubAPIResource()
            })
        });

        // setting up client
        app.use(express.static('client'));

        // native request logger
        app.use((req, res, next) => {
            console.info(`[${new Date().toLocaleString()}] - ${req.method} - ${req.url}`)
            next()
        });

        // spinning up apollo server and atteching it with express app 
        await apollo_server.start();
        apollo_server.applyMiddleware({ app });

        // bootstraping apollo_server
        await app.listen({ port })
        console.info(`INFO_MSG: SERVICE IS UP @ localhost:${port}${apollo_server.graphqlPath}`)
    } catch (e) {
        console.error(e.message)
    }
})()
