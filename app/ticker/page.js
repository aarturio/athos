export default async function Page() {
  const data = await fetch("http://localhost:8000/ticker/TSLA");
  const posts = (await data.json()).data.docs;

  console.log(posts);
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
