import { createReader } from "@keystatic/core/reader";
import config from "@/keystatic.config";

export const reader = createReader("", config);

// Use in Server Components or Server Actions
export async function getAllPosts() {
  return await reader.collections.posts.all();
}

export async function getPost(slug: string) {
  return await reader.collections.posts.read(slug);
}

export async function getAuthor(slug: string) {
  return await reader.collections.authors.read(slug);
}

export async function getHomePageData() {
  return await reader.singletons.homePage.read();
}

export async function getPageData(slug: string) {
  return await reader.collections.pages.read(slug);
}

export async function getSpecialAnnoucements() {
  return await reader.singletons.specialAnnouncements.read();
}

export async function getAllSermons() {
  return await reader.collections.sermons.all();
}

export async function getSermon(slug: string) {
  return await reader.collections.sermons.read(slug, { resolveLinkedFiles: true });
}
