
const TOKEN = process.env.token;
const OWNER = process.env.owner;

const headers = { Authorization: `token ${TOKEN}` }

// creating rest resource to call external API 
const { RESTDataSource } = require('apollo-datasource-rest');

class GithubAPIResource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.github.com/';
    }

    async listRepos() {
        try {
            const response = await this.get('/user/repos', undefined, { headers });
            return response;
        } catch (e) {
            console.error("Error in listRepos API Call =>", e.message);
            throw e;
        }
    }

    async getRepoByName({ repoName }) {
        try {
            const response = await this.get(`/repos/${OWNER}/${repoName}`, undefined, { headers });
            return response;
        } catch (e) {
            console.error("Error in getRepoByName API Call =>", e.message);
            throw e;
        }
    }

    async getContentOfRepo({ repoName }) {
        try {
            const response = await this.get(`/repos/${OWNER}/${repoName}/contents`, undefined, { headers });
            return response;
        } catch (e) {
            console.error("Error in getContentOfRepo API Call =>", e.message);
            throw e;
        }
    }

    async getContentOfDirectory({ repoName, dir }) {
        try {
            if (!repoName || !dir) {
                return []
            }
            const response = await this.get(`/repos/${OWNER}/${repoName}/contents/${dir}`, undefined, { headers });
            return response;
        } catch (e) {
            console.error("Error in getContentOfDirectory API Call =>", e.message);
            throw e;
        }
    }

    async getWebhooksOfRepo({ repoName }) {
        try {
            const response = await this.get(`/repos/${OWNER}/${repoName}/hooks`, undefined, { headers });
            return response;
        } catch (e) {
            console.error("Error in getContentOfRepo API Call =>", e.message);
            throw e;
        }
    }
}

module.exports = GithubAPIResource
