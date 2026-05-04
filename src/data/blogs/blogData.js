const transformBlogData = (blogs = [], destinations = []) => {
  const grouped = {};

  destinations.forEach((destination) => {
    if (!destination?.slug) return;

    grouped[destination.slug] = {
      destination: destination.name,
      slug: destination.slug,
      image: destination.image || "",
      description: destination.description || "",
      blogs: [],
    };
  });

  blogs.forEach((blog) => {
    if (!blog.destination) return;

    const slug = blog.destination.slug;

    if (!grouped[slug]) {
      grouped[slug] = {
        destination: blog.destination.name,
        slug,
        image: blog.destination.image || blog.image,
        description: blog.excerpt || "",
        blogs: [],
      };
    }

    if (!grouped[slug].image) grouped[slug].image = blog.image;
    if (!grouped[slug].description) grouped[slug].description = blog.excerpt || "";

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
