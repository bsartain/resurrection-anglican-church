import HeroImage from "../../components/HeroImage";
import { getAllPosts, getAuthor } from "../../api/keystatic/lib/keystatic";
import RevealSection from "../../components/RevealSection";
import { buildMetadata } from "../../lib/buildMetadata";
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
            category: post.entry.category,
          },
          author,
        };
      })
  );

  return (
    <div>
      <HeroImage image="/images/icon-cieling.jpg">Blog</HeroImage>

      <RevealSection id="blogListing" image="/images/pages/jesus-cross.jpg" opacity={0.005}>
        <div className="hosea-guide-card py-4 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-md-3 col-sm-4">
              <img
                src="/images/pages/hosea-s-family-hosea-1-1-3-5/image.png"
                alt="Hosea Liturgy Guide cover"
                style={{ width: "100%", border: "1px solid rgba(0,0,0,0.12)", display: "block" }}
              />
            </div>
            <div className="col-md-9 col-sm-8">
              <p className="text-uppercase mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.12em", opacity: 0.55 }}>
                Download
              </p>
              <h2 className="mb-1" style={{ fontSize: "1.75rem" }}>
                Hosea Liturgy Guide
              </h2>
              <p className="fst-italic mb-3" style={{ fontSize: "1rem", opacity: 0.7 }}>
                The Relentless Love of a Faithful God
              </p>
              <p className="mb-4" style={{ fontSize: "1rem" }}>
                Follow along during our Hosea sermon series with liturgy, prayers, and scripture readings prepared for congregational worship.
              </p>
              <a href="/Hosea_Liturgy_Guide.pdf" download className="btn btn-primary-light btn-lg">
                <i className="bi bi-download me-2"></i>Download PDF
              </a>
            </div>
          </div>
          <hr className="mt-5" style={{ opacity: 0.15 }} />
        </div>

        <BlogList posts={postsWithAuthors} />
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
