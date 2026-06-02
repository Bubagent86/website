export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("dateReadable", (value) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("dateISO", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

  return {
    // Repo is Bubagent86/website, so the site is served from /website/.
    // If you later move to a user site (bubagent86.github.io) or a custom
    // domain served at the root, change this to "/".
    pathPrefix: "/website/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
