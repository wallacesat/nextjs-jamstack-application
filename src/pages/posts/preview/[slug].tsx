import * as React from 'react'
import { GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import Head from "next/head"
import Link from "next/link"
import { RichText } from "prismic-dom"

import { prismicClient } from '../../../services/prismic'

import styles from '../post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const session = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session.data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session, post, router]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const document = await prismicClient.getByUID('post', slug as string);

  const post = {
    slug,
    title: RichText.asText(document.data.title),
    content: RichText.asHtml(document.data.content.splice(0, 3)),
    updatedAt: new Date(document.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutos
  }
}