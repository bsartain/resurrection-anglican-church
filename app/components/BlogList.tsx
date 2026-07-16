"use client";

import { useState } from "react";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import Image from "next/image";

const POSTS_PER_PAGE = 6; // adjust as needed

export default function BlogList({ posts }: Readonly<{ posts: any[] }>) {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  const offset = currentPage * POSTS_PER_PAGE;
  const currentPosts = posts.slice(offset, offset + POSTS_PER_PAGE);

  const todaysDate = new Date().toISOString().split("T")[0];

  const currentFilteredPosts = currentPosts.filter((post) => post.entry.date <= todaysDate);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);

    document.getElementById("blogListing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {currentFilteredPosts.map((post) => (
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
                {post.author.avatar && (
                  <Image src={post.author.avatar} alt={String(post.author.name)} width={32} height={32} className="blog-card-avatar" />
                )}
                <span className="flex-grow-1">By {String(post.author.name).toUpperCase()}</span>
                <div>
                  Category: <span className="text-uppercase">{post.entry.category ? post.entry.category : "Uncategorized"}</span>
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}

      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          previousLabel="Prev"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="pagination-active"
          previousClassName="page-link"
          previousLinkClassName="pagination-prev-link"
          nextClassName="page-link"
          nextLinkClassName="pagination-next-link"
          breakClassName="pagination-break"
          breakLinkClassName="pagination-break-link"
          disabledClassName="pagination-disabled"
        />
      )}
    </>
  );
}
