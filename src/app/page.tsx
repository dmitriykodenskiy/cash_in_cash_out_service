import Image from "next/image";
import Link from "next/link";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";


import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Please, choose the operation</h1>
      <ButtonGroup className={styles.buttonGroup}>
        <Link href="/cash_in" className={styles.link}>
          <Button className={styles.button} variant="contained">Cash In</Button>
        </Link>
        <Link href="/cash_out" className={styles.link}>
          <Button className={styles.button} variant="contained">Cash Out</Button>
        </Link>
      </ButtonGroup>
    </main>
  );
}
