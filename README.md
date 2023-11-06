# GitHub Repository APIs with GraphQL Types
Apollo Server for GitHub Repository Resource

## To run server and test APIs locally and independently
Clone the project

```bash
  git clone https://github.com/ajaysinhgohil77/repo_apis_with_gql.git
```

Install dependencies

```bash
  npm install
```

No Need for .env file, owner and token will be accepted as input to GraphQL API or client's inputbox

Start the development server

```bash
  npm run dev
```

## To test these APIs from client

1. Run dev server first with `npm run dev`

2. Go to `localhost:4334/index.html` in browser

3. Provide owner, token, Repo Names for Listing (if no repo names are provided, it will list all the repos)

3. To see content of any GitHub Repo, Click on anyone of the listed Repos and wait till it loads content below
