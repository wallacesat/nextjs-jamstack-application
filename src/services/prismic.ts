import  * as prismic from '@prismicio/client'

// Fill in your repository name
export const repositoryName = process.env.PRISMIC_REPOSITORY_NAME;
const  endpoint = prismic.getEndpoint(repositoryName);

export const prismicClient = prismic.createClient(
  endpoint,
  {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  }
);

