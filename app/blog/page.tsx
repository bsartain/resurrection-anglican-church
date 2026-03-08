import HeroImage from "../components/HeroImage";
import { getAllPosts, getAuthor } from "../api/keystatic/lib/keystatic";
import RevealSection from "../components/RevealSection";
import { buildMetadata } from "../lib/buildMetadata";
import Link from "next/link";
import Image from "next/image";

export default async function Blog() {
  const posts = await getAllPosts();

  const postsWithAuthors = await Promise.all(
    posts
      .sort((a, b) => {
        const dateA = a.entry.date ? new Date(a.entry.date).getTime() : 0;
        const dateB = b.entry.date ? new Date(b.entry.date).getTime() : 0;
        return dateB - dateA;
      })
      .map(async (post) => {
        const author = post.entry.author ? await getAuthor(post.entry.author) : null;
        return { ...post, author };
      })
  );

  return (
    <div>
      <HeroImage image="/images/icon-cieling.jpg">Blog</HeroImage>

      <RevealSection id="blogListing" image="/images/pages/jesus-cross.jpg" opacity={0.005}>
        <div className="blog-grid reveal pt-5 pb-5">
          {postsWithAuthors.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
              <div className="blog-card-image" style={{ backgroundImage: `url(${post.entry.image ?? ""})` }}>
                <div className="entry-title">{post.entry.title}</div>
                <div className="overlay"></div>
              </div>
              <div className="blog-card-body">
                <h3 className="blog-card-title">{post.entry.excerpt}...Read more</h3>
                {post.entry.date && (
                  <p className="blog-card-date">
                    {new Date(post.entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
                {post.author && (
                  <div className="blog-card-author">
                    {post.author.avatar && <Image src={post.author.avatar} alt={String(post.author.name)} width={32} height={32} className="blog-card-avatar" />}
                    <span>By {String(post.author.name).toUpperCase()}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </RevealSection>
    </div>
  );
}

export async function generateMetadata() {
  return buildMetadata({
    title: "Blog | Resurrection Anglican Church",
    excerpt: "Keep updated on content and articles",
    image: "/images/icon-cieling.jpg",
    path: "/blog",
  });
}
