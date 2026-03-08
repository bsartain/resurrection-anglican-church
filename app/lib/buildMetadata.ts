import { Metadata } from "next";

export function buildMetadata({
  title,
  excerpt,
  image,
  path,
}: {
  title?: string | null | undefined;
  excerpt?: string | null | undefined;
  image?: string | null;
  path: string;
}): Metadata {
  const baseUrl = "https://www.resurrectionrockhill.org";

  return {
    title,
    description: excerpt,
    openGraph: {
      title: `${title} | Resurrection Anglican Church | Rock Hill, SC`,
      description: `${excerpt}`,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      url: `${baseUrl}${path}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Resurrection Anglican Church | Rock Hill, SC`,
      description: `${excerpt}`,
      images: image ? [image] : [],
    },
  };
}
