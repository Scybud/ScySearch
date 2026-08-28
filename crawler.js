import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import { readFileSync } from "fs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const seeds = JSON.parse(readFileSync("./seeds.json", "utf-8"));

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function crawlPage(seed) {
  try {
    const res = await fetch(seed.url, {
      headers: {
        "User-Agent": "ScySearchBot/0.1 (+https://search.scybud.com)",
      },
    });

    if (!res.ok) {
      console.error(`Failed ${seed.url}: ${res.status}`);
      return;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("nav, footer, script, style, header, .sidebar").remove();

    const title = $("title").text().trim() || $("h1").first().text().trim();
    const content = $("main, article, body")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    if (!content || content.length < 100) {
      console.warn(`Thin content, skipping: ${seed.url}`);
      return;
    }

    const { error } = await supabase.from("pages").upsert(
      {
        url: seed.url,
        title,
        content,
        source: seed.source,
        crawled_at: new Date().toISOString(),
      },
      { onConflict: "url" },
    );

    if (error) console.error(`DB error for ${seed.url}:`, error.message);
    else console.log(`Indexed: ${seed.url}`);
  } catch (err) {
    console.error(`Crawl error for ${seed.url}:`, err.message);
  }
}

async function run() {
  for (const seed of seeds) {
    await crawlPage(seed);
    await delay(1000); // 1s between requests, be polite
  }
}

run();
