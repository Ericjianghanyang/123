import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>欢迎来到我的app</h1>
      <Link href="/">Go to About Page</Link>
    </div>
  );
}