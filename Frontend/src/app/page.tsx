import styles from './page.module.css'
import ContactTable from './components/ContactTable'
import 'bootstrap/dist/css/bootstrap.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <ContactTable></ContactTable>
    </main>
  )
}
