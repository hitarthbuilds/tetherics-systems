import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard, PostCover, PostMeta } from "@/components/blog/post-card";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { getPost, posts, type Block } from "@/lib/blog";
import "../../pages.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} — Tetheric Journal`,
    description: post.dek,
    openGraph: { type: "article", title: post.title, description: post.dek, publishedTime: post.date, authors: [post.author] },
  };
}

function Content({ block, first }: { block: Block; first: boolean }) {
  if (block.type === "h2") return <h2 data-split>{block.text}</h2>;
  if (block.type === "quote") return <blockquote data-reveal><p>{block.text}</p></blockquote>;
  if (block.type === "list") return <ul data-reveal="stagger">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  return <p className={first ? "post-body__lead" : undefined}>{block.text}</p>;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 2);
  const firstParagraph = post.body.findIndex((block) => block.type === "p");
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
            {post.body.map((block, index) => <Content key={index} block={block} first={index === firstParagraph} />)}
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
