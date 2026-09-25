import type { Metadata } from "next";
import Link from "next/link";
import { PostCover, PostMeta } from "@/components/blog/post-card";
import { PostGrid } from "@/components/blog/post-grid";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { featuredPost, getAllPosts } from "@/lib/posts";
import "../pages.css";

export const metadata: Metadata = {
  title: "Journal — Tetheric Systems",
  description: "Notes from Tetheric Systems on building clearer systems: product thinking, brand, security and the work in between.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();
  const featured = featuredPost(posts);
  const rest = posts.filter((post) => post !== featured);
  return (
    <div className="page page--journal">
      <SiteHeader current="/blog" theme="dark" />
      <main id="main">
        <section className="page-hero page-hero--journal" data-theme="dark">
          <div className="journal-orbits" aria-hidden="true"><i /><i /><i /></div>
          <div className="page-hero__content site-wrap">
            <p className="site-kicker" data-scramble-in>THE TETHERIC JOURNAL</p>
            <h1 data-split>Notes on building<br /><em>clearer systems.</em></h1>
            <p className="page-hero__lead" data-reveal>Product thinking, brand, security and the work in between—written by the team behind SeerFlow and Auctra.</p>
          </div>
        </section>

        <section className="journal-featured site-wrap" data-theme="light" aria-label="Featured article">
          <Link href={`/blog/${featured.slug}`} className="journal-featured__card" data-cursor="Read">
            <PostCover post={featured} size="hero" />
            <div className="journal-featured__body">
              <span className="journal-featured__label">FEATURED</span>
              <PostMeta post={featured} />
              <h2>{featured.title}</h2>
              <p>{featured.dek}</p>
              <span className="post-card__more">Read the article <b aria-hidden="true">↗</b></span>
            </div>
          </Link>
        </section>

        <section className="journal-list site-wrap" data-theme="light" aria-label="All articles">
          <div className="page-head"><p className="site-kicker" data-scramble-in>ALL ARTICLES</p><h2 data-split>Pick a <em>thread.</em></h2></div>
          <PostGrid posts={rest} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
