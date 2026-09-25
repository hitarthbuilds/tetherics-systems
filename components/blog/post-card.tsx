import Link from "next/link";
import { formatDate, readingMinutes, type Post } from "@/lib/blog";

/** Generative cover art built from the brand's shapes: bars, grids, orbits, gates and bridges. */
export function PostCover({ post, size = "card" }: { post: Post; size?: "card" | "hero" }) {
  const id = `cover-${post.slug}-${size}`;
  return (
    <div className={`post-cover post-cover--${post.cover} post-cover--${size}`} aria-hidden="true">
      <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${id}-accent`} x1="0" x2="1"><stop offset="0" stopColor="#2b86e6" /><stop offset="1" stopColor="#2bd8f0" /></linearGradient>
          <radialGradient id={`${id}-glow`} cx="70%" cy="30%" r="70%"><stop offset="0" stopColor="#20d2ee" stopOpacity=".35" /><stop offset="1" stopColor="#20d2ee" stopOpacity="0" /></radialGradient>
          <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#8fb6dc" strokeOpacity=".12" /></pattern>
        </defs>
        <rect width="640" height="400" fill="#0a1520" />
        <rect width="640" height="400" fill={`url(#${id}-grid)`} />
        <rect width="640" height="400" fill={`url(#${id}-glow)`} />
        {post.cover === "bars" && (
          <g className="cover-bars">
            <rect className="cover-bar" x="150" y="96" width="340" height="54" fill="#eef4fa" />
            <path className="cover-bar cover-bar--accent" d="M150 173H487L452 227H150Z" fill={`url(#${id}-accent)`} />
            <rect className="cover-bar" x="150" y="250" width="340" height="54" fill="#eef4fa" />
          </g>
        )}
        {post.cover === "grid" && (
          <g className="cover-grid">
            {Array.from({ length: 60 }, (_, index) => {
              const x = 110 + (index % 12) * 38, y = 110 + Math.floor(index / 12) * 44, missing = [7, 19, 22, 38, 41, 53].includes(index);
              return missing
                ? <rect key={index} className="cover-gap" x={x - 11} y={y - 11} width="22" height="22" rx="4" fill="none" stroke={`url(#${id}-accent)`} strokeWidth="2" strokeDasharray="4 4" />
                : <circle key={index} className="cover-dot" cx={x} cy={y} r="4.5" fill="#dbe8f5" opacity={0.35 + ((index * 7) % 10) / 16} />;
            })}
          </g>
        )}
        {post.cover === "orbit" && (
          <g className="cover-orbit" fill="none">
            <ellipse cx="320" cy="200" rx="230" ry="90" stroke="#8fb6dc" strokeOpacity=".35" />
            <ellipse cx="320" cy="200" rx="160" ry="150" stroke={`url(#${id}-accent)`} strokeWidth="2" transform="rotate(-24 320 200)" />
            <ellipse cx="320" cy="200" rx="100" ry="100" stroke="#8fb6dc" strokeOpacity=".5" strokeDasharray="3 8" />
            <circle cx="320" cy="200" r="34" fill="#eef4fa" />
            <circle className="cover-node" cx="550" cy="200" r="10" fill="#2bd8f0" />
            <circle className="cover-node" cx="215" cy="92" r="8" fill="#2b86e6" />
          </g>
        )}
        {post.cover === "gate" && (
          <g className="cover-gate" fill="none">
            <rect x="120" y="70" width="400" height="260" rx="40" stroke="#8fb6dc" strokeOpacity=".4" strokeDasharray="8 8" />
            <rect x="200" y="120" width="240" height="160" rx="24" stroke={`url(#${id}-accent)`} strokeWidth="2.5" />
            <circle cx="320" cy="186" r="22" fill="#eef4fa" />
            <path d="M309 204H331L338 246H302Z" fill="#eef4fa" />
            <path className="cover-pulse" d="M40 200H200M440 200H600" stroke={`url(#${id}-accent)`} strokeWidth="2" strokeDasharray="6 10" />
          </g>
        )}
        {post.cover === "bridge" && (
          <g className="cover-bridge" fill="none">
            <rect x="70" y="140" width="170" height="120" rx="22" fill="#132a47" stroke="#2b86e6" strokeWidth="2" />
            <rect x="400" y="140" width="170" height="120" rx="22" fill="#0e3a4a" stroke="#2bd8f0" strokeWidth="2" />
            <path className="cover-flow" d="M240 180C300 130 340 130 400 180" stroke={`url(#${id}-accent)`} strokeWidth="3" strokeDasharray="8 10" />
            <path className="cover-flow cover-flow--back" d="M400 220C340 270 300 270 240 220" stroke="#8fb6dc" strokeWidth="2" strokeDasharray="8 10" />
            <text x="155" y="206" textAnchor="middle" fill="#eef4fa" fontSize="20" fontWeight="700" fontFamily="var(--font-text)">create</text>
            <text x="485" y="206" textAnchor="middle" fill="#eef4fa" fontSize="20" fontWeight="700" fontFamily="var(--font-text)">understand</text>
          </g>
        )}
      </svg>
    </div>
  );
}

export function PostMeta({ post }: { post: Post }) {
  return <p className="post-meta"><span>{post.category}</span><time dateTime={post.date}>{formatDate(post.date)}</time><span>{readingMinutes(post)} min read</span></p>;
}

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={`post-card${featured ? " post-card--featured" : ""}`} data-cursor="Read">
      <PostCover post={post} />
      <div className="post-card__body">
        <PostMeta post={post} />
        <h3>{post.title}</h3>
        <p>{post.dek}</p>
        <span className="post-card__more">Read the article <b aria-hidden="true">↗</b></span>
      </div>
    </Link>
  );
}
