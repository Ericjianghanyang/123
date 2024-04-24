import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {



const romms = [
  {
    name: 'r1',
    cameraCount: 3
  },
  {
    name: 'r2',
    cameraCount: 0
  },
  {
    name: 'r3',
    cameraCount: 2
  },
]







  return (
    <>
      {
        romms.map(r =>
          <> 
            <div>{r.name}, {r.cameraCount}</div>
            <div>{r.name}, {r.cameraCount}</div>
            <div>{r.name}, {r.cameraCount}</div>
            <div>{r.name}, {r.cameraCount}</div>
          </>

        )
      }
    </>
  );
}
