"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/blog";
import { PostCard } from "./post-card";

/** The journal list, filterable by category, with cards that reflow instead of jumping. */
export function PostGrid({ posts }: { posts: Post[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((post) => post.category)))], [posts]);
  const [active, setActive] = useState("All");
  const visible = active === "All" ? posts : posts.filter((post) => post.category === active);
  return (
    <LayoutGroup>
      <div className="journal-filters" role="group" aria-label="Filter articles by topic">
        {categories.map((category) => (
          <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)} data-cursor="Filter">
            {active === category && <motion.span layoutId="journal-filter" className="journal-filters__pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span>{category}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="journal-grid" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {visible.map((post, index) => (
            <motion.div key={post.slug} layout initial={{ opacity: 0, y: 60, rotateX: -18, scale: 0.94 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }} transition={{ duration: 0.6, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
