import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/brand/logo";

export default function NotFound(){
  return <main className="company-system-page"><div className="company-system-content"><Link href="/" className="company-system-wordmark" aria-label="Tetheric Systems home"><Wordmark label={null}/></Link><div className="company-system-art" aria-hidden="true"><i/><BrandMark/><strong>404</strong></div><h1>A little outside the orbit.</h1><p>This page may have moved, or the address may be incomplete.<br/>There’s still plenty to explore in the Tetheric family.</p><div className="company-system-links"><Link href="/">Back to Tetheric ↗</Link><Link href="/records/auctra">Explore Auctra</Link><Link href="/records/seerflow">Explore SeerFlow</Link></div></div></main>;
}
