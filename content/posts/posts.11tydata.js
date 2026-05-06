export default {
  layout: "post.liquid",
  lang: "ja",
  eleventyComputed: {
    /** Eleventy の page.date・コレクションソート用（フロントマターでは `published` を使う） */
    date: (data) => data.published,
  },
};
