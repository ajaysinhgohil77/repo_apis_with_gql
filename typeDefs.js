const { gql } = require('apollo-server')


// TODO: create fragment for reusable fields

// type definitions
const types = `
    type Owner {
        login: String
    }

    type Repo {
        name: String
        size: Int
        owner: Owner,
        private: Boolean,
        noOfFiles: Int,
        firstYMLFileContent: String,
        webhooks: [String]
    }
    `

const query = `
    type Query {
        listRepos: [Repo]
        getRepoByName(repoName: String, filesLimit: Int): Repo
    }
    `

// combining types and query
const typeDefs = gql`
${types} 
${query}
`;

module.exports = typeDefs