import { config, collection, fields, singleton } from "@keystatic/core";

export default config({
  storage:
    process.env.NODE_ENV === "development"
      ? { kind: "local" }
      : {
          kind: "cloud",
        },
  cloud: {
    project: "res-anglican-church/website",
  },
  collections: {
    authors: collection({
      label: "Authors",
      slugField: "name",
      path: "content/authors/*",
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        bio: fields.text({ label: "Bio", multiline: true }),
        avatar: fields.image({
          label: "Avatar",
          directory: "public/images/authors",
          publicPath: "/images/authors",
        }),
      },
    }),
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        image: fields.image({
          label: "Featured Image",
          directory: "public/images/pages",
          publicPath: "/images/pages",
        }),
        title: fields.slug({ name: { label: "Title" } }),
        author: fields.relationship({ label: "Author", collection: "authors" }),
        excerpt: fields.text({ label: "Excerpt" }),
        date: fields.date({ label: "Publish Date" }),
        content: fields.document({ label: "Content", formatting: true, links: true, images: true }),
      },
    }),

    pages: collection({
      label: "Pages",
      path: "content/pages/*/",
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        excerpt: fields.text({
          label: "Excerpt",
        }),
        image: fields.image({
          label: "Featured Image",
          directory: "public/images/pages",
          publicPath: "/images/pages",
        }),
        content: fields.document({
          label: "Content",
          formatting: true,
          links: true,
        }),
        subsections: fields.array(
          fields.object({
            title: fields.text({
              label: "Title",
            }),
            content: fields.document({
              label: "Content",
              formatting: true,
              links: true,
            }),
            image: fields.image({
              label: "Image",
              directory: "public/images/pages",
              publicPath: "/images/pages",
            }),
            imageDirection: fields.select({
              label: "Image Direction",
              options: [
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
              ],
              defaultValue: "left",
            }),
          }),
          {
            label: "Subsections",
            itemLabel: (props) => `Subsection - Image ${props.fields.imageDirection.value}`,
          }
        ),
        multipleImages: fields.conditional(fields.checkbox({ label: "Add multiple images for this page.", defaultValue: false }), {
          true: fields.array(
            fields.object({
              image: fields.image({
                label: "Image",
                directory: "public/images/pages",
                publicPath: "/images/pages",
              }),
              caption: fields.text({ label: "Caption" }),
              subCaption: fields.text({ label: "Sub Caption" }),
              category: fields.text({ label: "Category" }),
              link: fields.text({ label: "Link" }),
            }),
            {
              label: "Images",
              itemLabel: (props) => props.fields.caption.value || "Image",
            }
          ),
          false: fields.empty(),
        }),
      },
    }),
    sermons: collection({
      label: "Sermons",
      path: "content/sermons/*/",
      slugField: "title",
      columns: ["title", "date", "biblePassages"],
      schema: {
        date: fields.date({
          label: "Sermon Date",
          validation: { isRequired: true },
        }),
        audio: fields.text({
          label: "Sermon Audio (Google Drive Link)",
          description: "Paste the Google Drive share link for the audio file",
        }),
        title: fields.slug({ name: { label: "Sermon Title", validation: { isRequired: true } } }),
        series: fields.text({
          label: "Series",
          description: "Sermon series name (e.g. Letters of Paul)",
        }),
        pastor: fields.text({
          label: "Pastor / Preacher",
        }),
        duration: fields.text({
          label: "Duration",
          description: "Audio duration (e.g. 42:10)",
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "Short description shown on sermon cards",
          multiline: true,
        }),
        image: fields.image({
          label: "Sermon Image",
          directory: "public/images/sermons",
          publicPath: "/images/sermons",
        }),
        content: fields.document({
          label: "Sermon Description",
          formatting: true,
          links: true,
        }),
        biblePassages: fields.text({
          label: "Bible Passages",
        }),
        youTubLink: fields.text({
          label: "YouTube Link",
        }),
      },
    }),
  },
  singletons: {
    homePage: singleton({
      label: "Home Page",
      path: "content/home-page/",
      schema: {
        section1: fields.object(
          {
            title: fields.text({ label: "Title", validation: { isRequired: true } }),
            buttonPageLink: fields.text({
              label: "Button Link",
            }),
            buttonText: fields.text({
              label: "Button Text",
            }),
            description: fields.document({
              label: "Description",
              formatting: true,
              links: true,
            }),
            images: fields.array(
              fields.image({
                label: "Image",
                directory: "public/images/home",
                publicPath: "/images/home",
                validation: { isRequired: true },
              }),
              {
                label: "Images",
                validation: { length: { max: 3 } },
                itemLabel: () => `Image`,
              }
            ),
          },
          { label: "Section 1" }
        ),
        section2: fields.object(
          {
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            buttonPageLink: fields.text({
              label: "Button Link",
            }),
            buttonText: fields.text({
              label: "Button Text",
            }),
            description: fields.document({
              label: "Description",
              formatting: true,
              links: true,
            }),
            image: fields.image({
              label: "Image",
              directory: "public/images/home",
              publicPath: "/images/home",
              validation: { isRequired: true },
            }),
          },
          { label: "Section 2" }
        ),
        section3: fields.object(
          {
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            buttonPageLink: fields.text({
              label: "Button Link",
            }),
            buttonText: fields.text({
              label: "Button Text",
            }),
            description: fields.document({
              label: "Description",
              formatting: true,
              links: true,
            }),
            image: fields.image({
              label: "Image",
              directory: "public/images/home",
              publicPath: "/images/home",
              validation: { isRequired: true },
            }),
            images: fields.array(
              fields.image({
                label: "Image",
                directory: "public/images/home",
                publicPath: "/images/home",
                validation: { isRequired: true },
              }),
              {
                label: "Images",
                validation: { length: { max: 3 } },
                itemLabel: () => `Image`,
              }
            ),
          },
          { label: "Section 3" }
        ),
        section4: fields.object(
          {
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            buttonPageLink: fields.text({
              label: "Button Link",
            }),
            buttonText: fields.text({
              label: "Button Text",
            }),
            description: fields.document({
              label: "Description",
              formatting: true,
              links: true,
            }),
            image: fields.image({
              label: "Image",
              directory: "public/images/home",
              publicPath: "/images/home",
              validation: { isRequired: true },
            }),
            images: fields.array(
              fields.image({
                label: "Image",
                directory: "public/images/home",
                publicPath: "/images/home",
                validation: { isRequired: true },
              }),
              {
                label: "Images",
                validation: { length: { max: 3 } },
                itemLabel: () => `Image`,
              }
            ),
          },
          { label: "Section 4" }
        ),
        section5: fields.object(
          {
            title: fields.text({ label: "Title", validation: { isRequired: true } }),
            buttonPageLink: fields.text({
              label: "Button Link",
            }),
            buttonText: fields.text({
              label: "Button Text",
            }),
            description: fields.document({
              label: "Description",
              formatting: true,
              links: true,
            }),
            images: fields.array(
              fields.image({
                label: "Image",
                directory: "public/images/home",
                publicPath: "/images/home",
                validation: { isRequired: true },
              }),
              {
                label: "Images",
                validation: { length: { max: 3 } },
                itemLabel: () => `Image`,
              }
            ),
          },
          { label: "Section 5" }
        ),
        section6: fields.object(
          {
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            buttonPageLink: fields.text({
              label: "Button Link",
            }),
            buttonText: fields.text({
              label: "Button Text",
            }),
            description: fields.document({
              label: "Description",
              formatting: true,
              links: true,
            }),
            testimonials: fields.array(
              fields.object({
                name: fields.text({
                  label: "Name",
                  validation: { isRequired: true },
                }),
                testimonial: fields.text({
                  label: "Testimonial",
                  multiline: true,
                  validation: { isRequired: true },
                }),
              }),
              {
                label: "Testimonials",
                validation: { length: { min: 1 } },
                itemLabel: (props) => props.fields.name.value ?? "Testimonial",
              }
            ),
          },
          { label: "Section 6" }
        ),
        section7: fields.object(
          {
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            buttonPageLink: fields.text({
              label: "Button Link",
            }),
            buttonText: fields.text({
              label: "Button Text",
            }),
            description: fields.document({
              label: "Description",
              formatting: true,
              links: true,
            }),
            image: fields.image({
              label: "Image",
              directory: "public/images/home",
              publicPath: "/images/home",
              validation: { isRequired: true },
            }),
          },
          { label: "Section 7" }
        ),
      },
    }),
    specialAnnouncements: singleton({
      label: "Special Announcements",
      path: "content/special-announcements",
      schema: {
        announcement: fields.text({
          label: "Title",
        }),
        content: fields.document({
          label: "Content",
          formatting: true,
          links: true,
        }),
        image: fields.image({
          label: "Image",
          directory: "public/images/specialAnnouncement",
          publicPath: "/images/home",
        }),
        showAnnouncement: fields.checkbox({
          label: "Show Announcement",
          defaultValue: false,
        }),
      },
    }),
  },
});
