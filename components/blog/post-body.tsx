import Image from "next/image";
import type { Block, ImageBlock } from "@/lib/blog";

export function PostFigure({ block, priority = false }: { block: ImageBlock; priority?: boolean }) {
  const sized = Boolean(block.width && block.height);
  return (
    <figure className={`post-figure${sized && block.height! > block.width! ? " is-portrait" : ""}`} data-reveal>
      <div className="post-figure__frame" style={sized ? undefined : { aspectRatio: "16 / 10" }}>
        {sized
          ? <Image src={block.url} alt={block.alt} width={block.width!} height={block.height!} sizes="(max-width: 900px) 100vw, 980px" priority={priority} />
          : <Image src={block.url} alt={block.alt} fill sizes="(max-width: 900px) 100vw, 980px" priority={priority} />}
      </div>
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  );
}

/** Renders an article body. Used by the live journal and the studio preview alike. */
export function PostBody({ blocks, animate = true }: { blocks: Block[]; animate?: boolean }) {
  const lead = blocks.findIndex((block) => block.type === "p");
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "h2") return <h2 key={index} data-split={animate || undefined}>{block.text}</h2>;
        if (block.type === "quote") return <blockquote key={index} data-reveal={animate || undefined}><p>{block.text}</p></blockquote>;
        if (block.type === "list") return <ul key={index} data-reveal={animate ? "stagger" : undefined}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>;
        if (block.type === "image") return <PostFigure key={index} block={block} priority={index < 2} />;
        return <p key={index} className={index === lead ? "post-body__lead" : undefined}>{block.text}</p>;
      })}
    </>
  );
}
