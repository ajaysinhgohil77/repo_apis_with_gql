let firstOccuredYMLFilePath;

const setYMLFilePath = (item) => {
    if (!firstOccuredYMLFilePath && (item.name.includes('.yml') || item.path.includes('.yml'))) {
        firstOccuredYMLFilePath = item.path
    }
}

const getFileCountOfDirectory = async ({ repoName, dir, dataSources }) => {
    let noOfFiles = 0;
    const content = await dataSources.githubAPIResource.getContentOfDirectory({ repoName, dir })
    for (const item of content) {
        if (item.type === 'file') {
            noOfFiles++
            setYMLFilePath(item)
        } else if (item.type === 'dir') {
            noOfFiles += await getFileCountOfDirectory({ repoName, dir: item.path, dataSources })
        }
    }
    // perf can be improved with Promise.all or Promise.allSettled

    return noOfFiles
}
const getRepoByName = async (_, { repoName, filesLimit }, { dataSources }) => {

    // console.time('perf')
    let repo = await dataSources.githubAPIResource.getRepoByName({ repoName })
    if (!repo) {
        return;
    }

    const results = await Promise.all([
        dataSources.githubAPIResource.getContentOfRepo({ repoName }),
        dataSources.githubAPIResource.getWebhooksOfRepo({ repoName })
    ])

    const contentOfRepo = results[0]
    const webhooks = results[1]

    let noOfFiles = 0;
    for (const item of contentOfRepo) {
        if (item.path.includes('node_modules') || item.path.includes('12213213')) {
            continue;
        }
        if (item.type === 'file') {
            noOfFiles++
        } else if (item.type === 'dir') {
            const noOfFilesInDir = await getFileCountOfDirectory({ repoName, dir: item.path, dataSources });
            noOfFiles += noOfFilesInDir;
        }
        if (filesLimit && noOfFiles >= filesLimit) break;
    }

    const { content } = await dataSources.githubAPIResource.getContentOfDirectory({ repoName, dir: firstOccuredYMLFilePath })

    const firstYMLFileContent = Buffer.from(content, 'base64').toString('utf8')

    repo = { ...repo, noOfFiles, firstYMLFileContent, webhooks }

    // console.timeEnd('perf')

    return repo
}

const listRepos = async (_, { }, { dataSources }) => {
    const repos = (await dataSources.githubAPIResource.listRepos())
        .filter(repo => ["repoA", "repoB", "repoC"].includes(repo.name));
    return repos
}

const resolvers = {
    Query: {
        listRepos,
        getRepoByName
    },
};

module.exports = resolvers