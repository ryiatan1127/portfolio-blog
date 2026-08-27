import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Featured } from "@/components/featured";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  // getAllPosts 依赖 fs（仅服务端），预取后传给客户端 Featured
  const posts = getAllPosts().slice(0, 3);
  return (<><Hero /><About /><Featured posts={posts} /></>);
}
