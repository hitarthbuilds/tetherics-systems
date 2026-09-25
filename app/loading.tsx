import { BrandMark, Wordmark } from "@/components/brand/logo";

export default function Loading(){
  return <main className="company-system-page company-loading" role="status" aria-live="polite"><div className="company-system-content"><Wordmark className="company-system-wordmark" label="Tetheric Systems"/><div className="company-system-art" aria-hidden="true"><i/><BrandMark/></div><h1>Bringing it together.</h1><p>Loading the next part of the experience.</p></div></main>;
}
