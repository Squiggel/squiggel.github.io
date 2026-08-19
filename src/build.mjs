import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import MarkdownIt from "markdown-it";
import footnote from "markdown-it-footnote";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const SITE = path.join(ROOT, "_site");
const PUBLIC = path.join(ROOT, "public");

const BASE_PATH = process.env.BASE_PATH || "";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(footnote);

function cleanSite() {
  if (fs.existsSync(SITE)) {
    fs.rmSync(SITE, { recursive: true, force: true });
  }

  fs.mkdirSync(SITE, { recursive: true });
}

function walk(dir) {
  const result = [];

  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...walk(full));
    } else if (entry.name.endsWith(".md")) {
      result.push(full);
    }
  }

  return result;
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseArticle(file) {
  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split(/\r?\n/);

  if (!lines[0]?.startsWith("# ")) {
    throw new Error(
      `${file}: first line must be an H1 title, e.g. "# My Article"`
    );
  }

  const title = lines[0].slice(2).trim();

  const topics = [];
  let index = 1;

  // Skip blank lines immediately after title.
  while (index < lines.length && lines[index].trim() === "") {
    index++;
  }

  // Parse:
  //
  // topics:
  //   - Science
  //   - Science > Biology
  //
  if (lines[index]?.trim() === "topics:") {
    index++;

    while (index < lines.length) {
      const line = lines[index];

      if (line.trim() === "") break;

      const match = line.match(/^\s*-\s+(.+?)\s*$/);

      if (!match) break;

      topics.push(match[1].trim());
      index++;
    }
  }

  // Skip the blank line after topics.
  while (index < lines.length && lines[index].trim() === "") {
    index++;
  }

  const body = lines.slice(index).join("\n");

  return {
    title,
    topics,
    body,
    source: file
  };
}

function articleUrl(article) {
  return `${BASE_PATH}/article/${article.slug}/`;
}

function processWikiLinks(html, articlesByTitle) {
  return html.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_, target, label) => {
      const cleanTarget = target.trim();
      const article = articlesByTitle.get(cleanTarget.toLowerCase());

      if (!article) {
        return `<span class="broken-link" title="Article not found">${label || cleanTarget}</span>`;
      }

      const text = label ? label.trim() : article.title;

      return `<a href="${articleUrl(article)}">${text}</a>`;
    }
  );
}

function buildTopicTree(articles) {
  const root = {
    name: "",
    children: new Map(),
    articles: []
  };

  for (const article of articles) {
    for (const topic of article.topics) {
      const parts = topic
        .split(">")
        .map(part => part.trim())
        .filter(Boolean);

      if (parts.length === 0) continue;

      let node = root;

      for (const part of parts) {
        if (!node.children.has(part)) {
          node.children.set(part, {
            name: part,
            children: new Map(),
            articles: []
          });
        }

        node = node.children.get(part);
      }

      node.articles.push(article);
    }
  }

  return root;
}

function sortedArticles(articles) {
  return [...articles].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, {
      sensitivity: "base"
    })
  );
}

function renderTopicNode(node) {
  const children = [...node.children.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base"
    })
  );

  const articles = sortedArticles(node.articles);

  if (children.length === 0 && articles.length === 0) {
    return "";
  }

  const childHtml = children
    .map(renderTopicNode)
    .join("");

  const articleHtml = articles
    .map(
      article =>
        `<li class="sidebar-article">
          <a href="${articleUrl(article)}">${article.title}</a>
        </li>`
    )
    .join("");

  const content = `
    ${articleHtml}
    ${childHtml}
  `;

  return `
    <li class="sidebar-topic">
      <details>
        <summary>${node.name}</summary>
        <ul>
          ${content}
        </ul>
      </details>
    </li>
  `;
}

function renderSidebar(tree) {
  const topLevel = [...tree.children.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      sensitivity: "base"
    })
  );

  return `
    <nav class="sidebar-nav" aria-label="Topics">
      <div class="sidebar-heading">Topics</div>
      <ul class="topic-tree">
        ${topLevel.map(renderTopicNode).join("")}
      </ul>
    </nav>
  `;
}

function renderArticleList(articles) {
  return sortedArticles(articles)
    .map(
      article => `
        <li>
          <a href="${articleUrl(article)}">${article.title}</a>
        </li>
      `
    )
    .join("");
}

function renderTopicTags(article) {
  if (!article.topics.length) return "";

  return `
    <div class="article-topics">
      ${article.topics
        .map(topic => `<span class="topic-tag">${topic}</span>`)
        .join("")}
    </div>
  `;
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function renderHtml({
  title,
  content,
  sidebar,
  activePath = ""
}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

  <meta name="color-scheme" content="light dark">

  <title>${title}</title>

  <link
    rel="stylesheet"
    href="${BASE_PATH}/styles.css"
  >

  <link
    rel="icon"
    href="${BASE_PATH}/favicon.svg"
    type="image/svg+xml"
  >
</head>

<body>

  <header class="site-header">
    <div class="header-inner">

      <button
        class="menu-button"
        id="menu-button"
        aria-label="Open navigation"
        aria-expanded="false"
        aria-controls="sidebar"
      >
        ☰
      </button>

      <a class="site-title" href="${BASE_PATH}/">
        My Notes
      </a>

      <div class="header-actions">
        <button
          class="theme-button"
          id="theme-button"
          aria-label="Toggle dark mode"
        >
          ◐
        </button>
      </div>

    </div>
  </header>

  <div class="site-layout">

    <aside
      class="sidebar"
      id="sidebar"
      data-active-path="${activePath}"
    >
      ${sidebar}
    </aside>

    <div
      class="sidebar-overlay"
      id="sidebar-overlay"
    ></div>

    <main class="main">
      <article class="article">
        ${content}
      </article>

      <footer class="site-footer">
        <span>Built with Markdown.</span>
        <a href="${BASE_PATH}/">Home</a>
      </footer>
    </main>

  </div>

  <script src="${BASE_PATH}/script.js"></script>

</body>
</html>`;
}

cleanSite();

const files = walk(CONTENT);

const articles = files
  .filter(file => !file.endsWith("index.md"))
  .map(file => {
    const article = parseArticle(file);

    article.slug = slugify(article.title);

    return article;
  });

const articlesByTitle = new Map();

for (const article of articles) {
  const key = article.title.toLowerCase();

  if (articlesByTitle.has(key)) {
    throw new Error(`Duplicate article title: ${article.title}`);
  }

  articlesByTitle.set(key, article);
}

const topicTree = buildTopicTree(articles);
const sidebar = renderSidebar(topicTree);

// Convert article Markdown to HTML.
for (const article of articles) {
  let html = md.render(article.body);

  html = processWikiLinks(html, articlesByTitle);

  const topicTags = renderTopicTags(article);

  const content = `
    <div class="article-header">

      <h1>${article.title}</h1>

      ${topicTags}

    </div>

    <div class="article-body">
      ${html}
    </div>
  `;

  const page = renderHtml({
    title: `${article.title} — My Notes`,
    content,
    sidebar,
    activePath: article.slug
  });

  writeFile(
    path.join(SITE, "article", article.slug, "index.html"),
    page
  );
}

// Homepage.
const homepage = `
  <div class="home-header">
    <h1>My Notes</h1>

    <p class="lead">
      A personal collection of notes, ideas, references and curiosities.
    </p>
  </div>

  <section>
    <h2>Articles</h2>

    <ul class="article-index">
      ${renderArticleList(articles)}
    </ul>
  </section>
`;

writeFile(
  path.join(SITE, "index.html"),
  renderHtml({
    title: "My Notes",
    content: homepage,
    sidebar
  })
);

// Copy static assets.
if (fs.existsSync(PUBLIC)) {
  for (const file of fs.readdirSync(PUBLIC)) {
    fs.copyFileSync(
      path.join(PUBLIC, file),
      path.join(SITE, file)
    );
  }
}

console.log(
  `Built ${articles.length} articles and ${countTopics(topicTree)} topics.`
);

function countTopics(node) {
  let count = node.children.size;

  for (const child of node.children.values()) {
    count += countTopics(child);
  }

  return count;
}
