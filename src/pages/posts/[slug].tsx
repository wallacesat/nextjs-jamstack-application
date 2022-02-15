import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { RichText } from "prismic-dom"

import { prismicClient } from '../../services/prismic'

import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Posts({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { slug } = params;

  const session = await getSession({ req });

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const document = await prismicClient.getByUID('post', slug as string);

  const post = {
    slug,
    title: RichText.asText(document.data.title),
    content: RichText.asHtml(document.data.content),
    updatedAt: new Date(document.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post,
    }
  }
}