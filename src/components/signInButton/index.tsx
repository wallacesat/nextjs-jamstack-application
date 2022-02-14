import { signIn, signOut, useSession } from "next-auth/react"
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function SignInButton() {

  const session = useSession();
  const isUserAuthenticated = session.status === 'authenticated';

  return isUserAuthenticated ? (
    <button className={styles.signInButton} type="button">
      <FaGithub color="#04d361"/>
        {session.data.user?.name}
      <FiX color="#737380" className={styles.closeIcon} onClick={() => signOut()}/>
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417"/>
      Sign in with Github
    </button>
  )
}