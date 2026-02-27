import { config, collection, fields, singleton } from "@keystatic/core";

export default config({
  storage:
    process.env.NODE_ENV === "development"
      ? { kind: "local" }
      : {
          kind: "github",
          repo: "bsartain/resurrection-anglican-church",
        },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.document({
          label: "Content",
          formatting: true,
          links: true,
        }),
      },
    }),
    pages: collection({
      label: "Pages",
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
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
  },
});
