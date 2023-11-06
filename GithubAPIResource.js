// creating rest resource to call external API 
const { RESTDataSource } = require('apollo-datasource-rest');

class GithubAPIResource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.github.com/';
    }

    async listRepos({ token, page }) {
        try {
            return await this.get(`/user/repos?page=${page}&per_page=30`, undefined, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
        } catch (e) {
            console.error("Error in listRepos API Call =>", e.message);
            throw e;
        }
    }

    async getRepoByName({ owner, token, repoName }) {
        try {
            return await this.get(`/repos/${owner}/${repoName}`, undefined, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
        } catch (e) {
            console.error("Error in getRepoByName API Call =>", e.message);
            throw e;
        }
    }

    async getContentOfRepo({ owner, token, repoName }) {
        try {
            return await this.get(`/repos/${owner}/${repoName}/contents`, undefined, {
                headers: {
                    Authorization: `token ${token}`
                }
            });;
        } catch (e) {
            console.error("Error in getContentOfRepo API Call =>", e.message);
            throw e;
        }
    }

    async getContentOfDirectory({ owner, token, repoName, dir }) {
        try {
            if (!repoName || !dir) {
                return []
            }
            return await this.get(`/repos/${owner}/${repoName}/contents/${dir}`, undefined, {
                headers: {
                    Authorization: `token ${token}`
                }
            });;
        } catch (e) {
            console.error("Error in getContentOfDirectory API Call =>", e.message);
            throw e;
        }
    }

    async getWebhooksOfRepo({ owner, token, repoName }) {
        try {
            return await this.get(`/repos/${owner}/${repoName}/hooks`, undefined, {
                headers: {
                    Authorization: `token ${token}`
                }
            });;
        } catch (e) {
            console.error("Error in getContentOfRepo API Call =>", e.message);
            throw e;
        }
    }
}

module.exports = GithubAPIResource
