
// for pagination
const PER_PAGE = 30; // Default and Recommnded by github REST API Documentation

let firstOccuredYMLFilePath;

const setYMLFilePath = (item) => {
    if (!firstOccuredYMLFilePath && (item.name.includes('.yml') || item.path.includes('.yml'))) {
        firstOccuredYMLFilePath = item.path
    }
}

const getFileCountOfDirectory = async ({ owner, token, repoName, dir, dataSources }) => {
    try {
        const content = await dataSources.githubAPIResource.getContentOfDirectory({ owner, token, repoName, dir });

        if (content && Array.isArray(content) && content.length) {
            // creating promises for parallel requests
            const subDirPromises = content
                .filter(item => item.type === 'dir')
                .map(item => getFileCountOfDirectory({ owner, token, repoName, dir: item.path, dataSources }));

            const subDirCounts = await Promise.all(subDirPromises);

            const noOfFiles = content.filter(item => {
                if (item.type === 'file') {
                    setYMLFilePath(item)
                    return true
                }
            }).length;

            const subDirFileCounts = subDirCounts.reduce((acc, count) => acc + count, 0);

            return noOfFiles + subDirFileCounts;
        } else {
            return 0
        }
    } catch (e) {
        throw e;
    }
};

const getRepoByName = async (_, { owner, token, repoName, filesLimit }, { dataSources }) => {
    try {
        // logger for perf measurement
        console.time('perf')

        let repo = await dataSources.githubAPIResource.getRepoByName({ owner, token, repoName })
        if (!repo) {
            return;
        }

        const results = await Promise.all([
            dataSources.githubAPIResource.getContentOfRepo({ owner, token, repoName }),
            dataSources.githubAPIResource.getWebhooksOfRepo({ owner, token, repoName })
        ])

        const contentOfRepo = results && results[0] ? results[0] : []
        const webhooks = results && results[1] ? results[1] : []

        let noOfFiles = 0;
        for (const item of contentOfRepo) {
            if (item) {
                if (item.path && (item.path.includes('node_modules') || item.path.includes('12213213'))) {
                    continue;
                }
                if (item.type === 'file') {
                    noOfFiles++
                } else if (item.type === 'dir') {
                    const noOfFilesInDir = await getFileCountOfDirectory({ owner, token, repoName, dir: item.path, dataSources });
                    noOfFiles += noOfFilesInDir;
                }
                if (filesLimit && noOfFiles >= filesLimit) break;
            }
        }

        repo = { ...repo, noOfFiles }

        if (firstOccuredYMLFilePath) {
            const { content } = await dataSources.githubAPIResource.getContentOfDirectory({ owner, token, repoName, dir: firstOccuredYMLFilePath })
            const firstYMLFileContent = Buffer.from(content, 'base64').toString('utf8')
            repo['firstYMLFileContent'] = firstYMLFileContent;
        } else {
            repo['firstYMLFileContent'] = '';
        }

        repo['webhooks'] = webhooks;

        console.timeEnd('pf')

        return repo;
    } catch (e) {
        throw e;
    }

}

const listRepos = async (_, { token, repoNames }, { dataSources }) => {
    try {
        let page = 1;
        let repos = await dataSources.githubAPIResource.listRepos({ token, page });
        if (repoNames?.length) {
            const filteredRepos = [];
            for (const incomingRepoName of repoNames) {
                const existingRepo = repos.find(repo => repo?.name.trim().toLowerCase() === incomingRepoName.trim().toLowerCase())
                if (existingRepo) {
                    filteredRepos.push(existingRepo)
                }
            }

            // pagination
            let noOfReposOnCurrentPage = repos.length;
            while (noOfReposOnCurrentPage === PER_PAGE) {
                if (repoNames.length === filteredRepos.length) {
                    break;
                }
                page++;
                let nextPageRepos = await dataSources.githubAPIResource.listRepos({ token, page });
                for (const incomingRepoName of repoNames) {
                    const existingRepo = nextPageRepos.find(repo => repo.name.toLowerCase() === incomingRepoName.toLowerCase())
                    if (existingRepo) {
                        filteredRepos.push(existingRepo)
                    }
                }
                noOfReposOnCurrentPage = nextPageRepos.length;
            }
            return filteredRepos
        }
        return repos
    } catch (e) {
        throw e;
    }
}

const resolvers = {
    Query: {
        listRepos,
        getRepoByName
    },
};

module.exports = resolvers