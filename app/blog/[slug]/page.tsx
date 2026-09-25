import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard, PostCover, PostMeta } from "@/components/blog/post-card";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { PostBody } from "@/components/blog/post-body";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import "../../pages.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} — Tetheric Journal`,
    description: post.dek,
    openGraph: { type: "article", title: post.title, description: post.dek, publishedTime: post.date, authors: [post.author], images: post.coverImage ? [{ url: post.coverImage.url, alt: post.coverImage.alt }] : undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const related = (await getAllPosts()).filter((item) => item.slug !== post.slug).slice(0, 2);
  return (
    <div className="page page--post">
      <SiteHeader current="/blog" theme="dark" />
      <main id="main">
        <article className="post">
          <header className="post-hero" data-theme="dark">
            <PostCover post={post} size="hero" />
            <div className="post-hero__shade" aria-hidden="true" />
            <div className="post-hero__content site-wrap">
              <Link href="/blog" className="post-back" data-cursor="Back">← The journal</Link>
              <PostMeta post={post} />
              <h1 data-split>{post.title}</h1>
              <p className="post-hero__dek" data-reveal>{post.dek}</p>
              <p className="post-hero__byline">By {post.author}</p>
            </div>
          </header>
          <div className="post-body" data-theme="light">
            <PostBody blocks={post.body} />
            <p className="post-body__sign">— {post.author}</p>
          </div>
        </article>
        <section className="page-journal site-wrap" data-theme="light">
          <div className="page-head"><p className="site-kicker" data-scramble-in>KEEP READING</p><h2 data-split>More from <em>the journal.</em></h2></div>
          <div className="page-journal__grid" data-reveal="stagger">{related.map((item) => <PostCard key={item.slug} post={item} />)}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
