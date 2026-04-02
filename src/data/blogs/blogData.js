const transformBlogData = (blogs = []) => {
  const grouped = {};

  blogs.forEach((blog) => {
    if (!blog.destination) return;

    const slug = blog.destination.slug;

    if (!grouped[slug]) {
      grouped[slug] = {
        destination: blog.destination.name,
        slug,
        image: blog.image,
        description: blog.excerpt || "",
        blogs: [],
      };
    }

    grouped[slug].blogs.push({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      image: blog.image,
      excerpt: blog.excerpt,
      date: blog.date,
      author: blog.author,
      category: blog.category,
      content: blog.content,
      readTime: blog.readTime,
    });
  });

  return grouped;
};

export default transformBlogData;