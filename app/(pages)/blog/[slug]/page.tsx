import HeroImage from "@/app/components/HeroImage";
import { getPost, getAllPosts, getAuthor } from "@/app/api/keystatic/lib/keystatic";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { Container } from "react-bootstrap";
import RevealSection from "@/app/components/RevealSection";
import { buildMetadata } from "@/app/lib/buildMetadata";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const content = await post.content();
  const author = post.author ? await getAuthor(post.author) : null;

  return (
    <div className="blog-post">
      <HeroImage image={post.image ?? ""} author={author?.name ?? undefined}>{post.title}</HeroImage>

      <RevealSection id="blogPostContent" image="/images/pages/jesus-cross.jpg" opacity={0.01}>
        <Container className="pt-5 pb-5 reveal">
          <nav aria-label="breadcrumb" className="blog-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {String(post.title)}
              </li>
            </ol>
          </nav>
          {post.date && (
            <>
              <p className="text-muted">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              {author ? <p className="text-muted">by {author.name}</p> : null}
            </>
          )}
          <DocumentRenderer document={content ?? []} />
        </Container>
      </RevealSection>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return buildMetadata({
    title: post?.title,
    excerpt: post?.excerpt ?? undefined,
    image: post?.image ?? undefined,
    path: `/blog/${slug}`,
  });
}
