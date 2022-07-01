import { useMemo } from "react";
import Image from "next/image";
import { getFiles, getFileBySlug } from "../../lib/mdx";
import { getMDXComponent } from "mdx-bundler/client";
import MDXComponent from "../../components/MDXComponents";

const RandomNav = (props: any) => {
  return (
    <div className="RANDOM1" >
      <div className="RANDOM2" {...props} />
      <div className="RANDOM3"> Random 3 </div>
    </div>
  )
}


export default function BlogSlug({ code, frontMatter }: any) {
const Component = useMemo(() => getMDXComponent(code), [code]);

return (
  <>
    <div>
      <div>
        <div>
          <h2 >
            {frontMatter.title}
          </h2>
          <p>{frontMatter.summary}</p>
          <div>
            <p>
              Date : {frontMatter.publishedAt}
            </p>
          </div>
          <div >
            <Image
              src={frontMatter.image}
              width={800}
              height={533}
              layout="responsive"
              alt="cover image"
            />
          </div>
        </div>
        <article>
          <Component components={{nav: RandomNav}} />
        </article>
      </div>
    </div>
  </>
);
}

// we will generate all the blog posts at build time.

export async function getStaticPaths() {
  const posts = await getFiles();

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.replace(/\.mdx/, ""),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const post = await getFileBySlug(params.slug);
  
  return { props: { ...post } };
}
