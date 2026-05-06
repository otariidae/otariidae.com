import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

import externalPosts from "./content/_data/externalPosts.js";

const dateJaFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeZone: "Asia/Tokyo",
});

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatYyyyMmDd(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatDateJa(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return dateJaFormatter.format(d);
}

export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

  eleventyConfig.addPassthroughCopy("content/img");

  eleventyConfig.addPlugin(syntaxHighlight);

  /** 文中の http(s)://… などを自動で <a> にする（フェンス済みコード内はリンク化しない） */
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.set({ linkify: true });
  });
  eleventyConfig.addFilter("yyyyMmDd", (value) => formatYyyyMmDd(value));

  /** 投稿日などの人向け表記（datetime 用 yyyyMmDd と同じ UTC 暦日） */
  eleventyConfig.addFilter("dateJa", (value) => formatDateJa(value));

  /**
   * 日付から <time datetime="…">…</time> を生成する（Liquid: {% time published %}）
   * 第2引数で表示テキストを上書き可（例: {% time published "2026年2月24日" %}）
   */
  eleventyConfig.addShortcode("time", (value, displayText) => {
    const datetime = formatYyyyMmDd(value);
    if (!datetime) return "";
    const label =
      displayText != null && String(displayText).trim() !== ""
        ? String(displayText).trim()
        : formatDateJa(value);
    if (!label) return "";
    return `<time datetime="${datetime}">${escapeHtml(label)}</time>`;
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    const local = collectionApi.getFilteredByGlob("content/posts/**/*.md").map((item) => ({
      url: item.url,
      date: item.date,
      data: item.data,
      external: false,
    }));
    const external = externalPosts.map((p) => ({
      url: p.url,
      date: new Date(p.published),
      data: {
        title: p.title,
        published: p.published,
      },
      external: true,
      publication: p.publication,
    }));
    return [...local, ...external].sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "content",
    },
    markdownTemplateEngine: false,
  };
}
