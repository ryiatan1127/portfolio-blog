export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  links: { demo?: string; repo?: string };
  featured: boolean;
};
