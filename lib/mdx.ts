import matter from "gray-matter";
import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import { bundleMDX } from "mdx-bundler";

import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from 'rehype-katex'
import toc from "@jsdevtools/rehype-toc";

import remarkMath from 'remark-math'

const basePath = process.cwd();

const logger = (TOC: any) => {
  console.log(TOC)
  return TOC
}

export async function getFiles() {
  return readdirSync(join(basePath, "_posts"));
}

export async function getFileBySlug(slug: any) {

  // we will pass in a slug of the page we want like /blogs/blog-1
  // example and we will get the parsed content for that particular
  // blog page.

  const mdxSource = readFileSync(
    join(basePath, "_posts", `${slug}.mdx`),
    "utf8"
  );

  const { code, frontmatter } = await bundleMDX({
    source: mdxSource,
    mdxOptions(options, frontmatter) {

      options.remarkPlugins = [
        ...(options?.remarkPlugins ?? []),
        remarkMath,
      ];

      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeKatex,
        rehypeSlug,
        rehypeCodeTitles,
        [
          toc, 
          { 
            customizeTOC: logger,
            customizeTOCItem: logger
          } 
        ],
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'befire',
            properties: {
              className: ["anchor"],
            },
          },
        ],
      ];


      return options;
    },
  });

  return {

    // return the parsed content for our page along with it's metadata
    // we will be using gray-matter for this.
    code,
    frontMatter: {
      slug: slug || null,
      ...frontmatter,
    },
  };
}

export async function getAllFilesFrontMatter() {
  const files = readdirSync(join(basePath, "_posts"));

  return files.reduce((allPosts: any, postSlug: any) => {

    // returns the parsed data for all the files within the posts directory
    const source = readFileSync(join(basePath, "_posts", postSlug), "utf8");
    const { data } = matter(source);

    return [
      {
        ...data,

        // we will be using the filename by removing the extension
        // as our slug for the file.
        slug: postSlug.replace(".mdx", ""),
      },
      ...allPosts,
    ];
  }, []);
}