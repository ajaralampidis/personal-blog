import Link from "next/link";
import Image from "next/image";

const CustomLink = (props: any) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a {...props}>{props.children}</a>
      </Link>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const BlogImg = (props: any) => {
  return (
    <div className="my-3">
      <Image
        src={props.src}
        alt={props.alt}
        layout="responsive"
        {...props}
      />
    </div>
  );
};

const MDXComponent = {
  Image,
  a: CustomLink,
  BlogImg,
};

export default MDXComponent;