import HeroImage from "../../components/HeroImage";
import { getAllPosts, getAuthor } from "../../api/keystatic/lib/keystatic";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
import Link from "next/link";
import Image from "next/image";
import BlogList from "@/app/components/BlogList";

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
        return {
          slug: post.slug,
          entry: {
            title: post.entry.title,
            image: post.entry.image,
            excerpt: post.entry.excerpt,
            date: post.entry.date,
          },
          author,
        };
      })
  );

  return (
    <div>
      <HeroImage image="/images/icon-cieling.jpg">Blog</HeroImage>

      <RevealSection id="blogListing" image="/images/pages/jesus-cross.jpg" opacity={0.005}>
        <div className="blog-grid reveal pt-5 pb-5">
          <BlogList posts={postsWithAuthors} />
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
