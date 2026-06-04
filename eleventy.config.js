import Image from "@11ty/eleventy-img";
import markdownIt from "markdown-it";

const md = markdownIt({ html: true, linkify: true, typographer: true });

// Keep the path prefix in one place: it feeds both Eleventy's pathPrefix
// and the URLs the image plugin writes. The site is served from the custom
// domain gabecuzzillo.com at the root, so this is "/". (If you ever serve it
// from the project URL bubagent86.github.io/website/ instead, set it back to
// "/website/" so the asset links resolve.)
const PATH_PREFIX = "/";

async function optimize(src) {
  return Image(src, {
    widths: [480, 720, 1080, 1440],
    formats: ["avif", "webp", "jpeg"],
    urlPath: PATH_PREFIX + "img/",
    outputDir: "_site/img/",
  });
}

// Displayed at the content width (~704px) or full viewport on small screens.
const SIZES = "(max-width: 44rem) 100vw, 704px";

// Build the overlaid-title figure, optionally wrapped in a link. When `role`
// is given it's overlaid under the title inside the same caption.
async function overlayFigure(src, alt, title, link, role) {
  if (!alt) throw new Error(`Missing alt text for screenshot: ${src}`);
  const metadata = await optimize(src);
  const picture = Image.generateHTML(metadata, {
    alt,
    sizes: SIZES,
    loading: "lazy",
    decoding: "async",
  });
  const roleLine = role ? `<span class="shot-role">${role}</span>` : "";
  const inner = `${picture}<figcaption><span class="shot-title">${title}</span>${roleLine}</figcaption>`;
  // External links open in a new tab; internal/placeholder links don't.
  const body = link
    ? `<a href="${link}"${
        /^https?:/i.test(link) ? ' target="_blank" rel="noopener"' : ""
      }>${inner}</a>`
    : inner;
  return `<figure class="shot-overlay">${body}</figure>`;
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  // Each file in src/games/ is one game page (tagged "game" via the
  // directory data file). Expose them ordered by their `order` front matter.
  eleventyConfig.addCollection("games", (api) =>
    api
      .getFilteredByTag("game")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  // Same workflow for "other work" (talks, videos): each file in src/other/
  // is its own page (tagged "other"), ordered by `order`.
  eleventyConfig.addCollection("otherWork", (api) =>
    api
      .getFilteredByTag("other")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

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

  // Full-width optimized screenshot. Write your title/description as normal
  // Markdown below it. Usage:
  //   {% screenshot "src/screenshots/baby-steps.jpg", "Baby Steps" %}
  eleventyConfig.addShortcode("screenshot", async function (src, alt) {
    if (!alt) throw new Error(`Missing alt text for screenshot: ${src}`);
    const metadata = await optimize(src);
    return Image.generateHTML(metadata, {
      alt,
      sizes: SIZES,
      loading: "lazy",
      decoding: "async",
      class: "shot-img",
    });
  });

  // Screenshot with the game title overlaid on the image. Pass an optional
  // URL to make the whole image a link to the game's site. Usage:
  //   {% gameOverlay "src/screenshots/despelote.jpg", "Despelote", "DESPELOTE", "https://despelote.com" %}
  eleventyConfig.addShortcode("gameOverlay", overlayFigure);

  // A full game entry with information hierarchy. The title sits on the image,
  // `role` becomes a small byline, and the body Markdown follows — its first
  // paragraph is styled as the tagline/lead. Usage:
  //   {% game "src/screenshots/x.jpg", "alt", "TITLE (2025)", "Co-creator · with …", "https://…" %}
  //   A one-line tagline about the game.
  //
  //   The longer reflection paragraph(s).
  //   {% endgame %}
  eleventyConfig.addPairedShortcode(
    "game",
    async function (content, src, alt, title, role, link) {
      const figure = await overlayFigure(src, alt, title, link, role);
      const bodyHtml = content.trim()
        ? `<div class="game-body">${md.render(content.trim())}</div>`
        : "";
      return `<article class="game">${figure}${bodyHtml}</article>`;
    }
  );

  // Image beside text. The photo sits in a column to the left and the body
  // Markdown flows to its right; on narrow screens they stack. Usage:
  //   {% sideBySide "src/screenshots/gabe.jpg", "A photo of Gabe" %}
  //   I'm an indie game developer based in Brooklyn…
  //   {% endsideBySide %}
  eleventyConfig.addPairedShortcode(
    "sideBySide",
    async function (content, src, alt) {
      if (!alt) throw new Error(`Missing alt text for image: ${src}`);
      const metadata = await optimize(src);
      const picture = Image.generateHTML(metadata, {
        alt,
        sizes: "(max-width: 34rem) 100vw, 260px",
        loading: "lazy",
        decoding: "async",
        class: "media-img",
      });
      const bodyHtml = md.render(content.trim());
      return `<div class="media"><div class="media-figure">${picture}</div><div class="media-body">${bodyHtml}</div></div>`;
    }
  );

  return {
    pathPrefix: PATH_PREFIX,
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
