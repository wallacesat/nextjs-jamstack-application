import { GetStaticProps } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { prismicClient } from '../../services/prismic'

import styles from './styles.module.scss'

type Post = {
  slug: string;
  title: string;
  exerpt: string;
  updatedAt: string;
}

type PostProps = {
  posts: Post[];
}

const Posts = ({ posts }: PostProps) => {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <a href="#" key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.exerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export default Posts;

export const getStaticProps: GetStaticProps = async () => {

  const documents = await prismicClient.getAllByType('post', {
    fetch: ['post.title', 'post.content'],
    pageSize: 100
  });

  const posts = documents.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      exerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  });

  return {
    props: {
      posts
    }
  }
}