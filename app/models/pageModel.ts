import { DocumentElement } from "@keystatic/core";

export interface PageModel {
  title: string;
  image: string | null;
  excerpt: string;
  content: () => Promise<DocumentElement[]>;
  subsections: readonly {
    readonly title: string;
    readonly content: () => Promise<DocumentElement[]>;
    readonly image: string | null;
    readonly imageDirection: "right" | "left";
  }[];
  multipleImages:
    | {
        readonly discriminant: true;
        readonly value: readonly Value[];
      }
    | {
        readonly discriminant: false;
        readonly value: Value[] | null;
      };
}

export interface Content {
  image: string | null;
  imageDirection: string;
  title: string | null;
  content: () => Promise<DocumentElement[]>;
}

export interface Value {
  image: string | null;
  caption: string;
  subCaption: string;
  category: string;
  link: string;
}
