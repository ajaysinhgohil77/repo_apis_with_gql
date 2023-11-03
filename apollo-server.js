if (process.argv[2] === 'dev') {
    require('dotenv').config()
}
//  else {
//     // get secrets from cloud sercret manager
// }

const port = process.env.PORT || 4334

const { ApolloServer } = require('apollo-server');

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

// bootstraping apollo_server
apollo_server.listen({ port }).then(({ url }) => {
    console.info(`INFO_MSG: SERVICE IS UP @ ${url}`)
})