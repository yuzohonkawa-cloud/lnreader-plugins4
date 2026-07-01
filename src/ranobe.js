const id = "lightnovelpub_source";
const name = "LightNovelPub (Custom)";
const site = "https://www.lightnovelpub.com";

async function popularNovels(pageNo) {
    const url = `${site}/browse/all/popular/all/${pageNo}`;
    const result = await fetch(url);
    const html = await result.text();
    const document = Jsoup.parse(html);
    const novels = [];
    
    const elements = document.select("li.novel-item");
    for (let i = 0; i < elements.size(); i++) {
        const el = elements.get(i);
        const titleEl = el.selectFirst("h4.novel-title a");
        const imgEl = el.selectFirst("img");
        if (titleEl) {
            novels.push({
                name: titleEl.text().trim(),
                cover: imgEl ? imgEl.attr("src") : "",
                path: titleEl.attr("href")
            });
        }
    }
    return novels;
}

async function parseNovel(novelUrl) {
    const result = await fetch(novelUrl);
    const html = await result.text();
    const document = Jsoup.parse(html);
    const chapters = [];
    
    const chapterElements = document.select("ul.chapter-list li a");
    for (let i = 0; i < chapterElements.size(); i++) {
        const el = chapterElements.get(i);
        chapters.push({
            name: el.selectFirst("span.chapter-title").text().trim(),
            path: site + el.attr("href")
        });
    }

    return {
        name: document.selectFirst("h1.novel-title").text().trim(),
        cover: document.selectFirst("div.fixed-img img").attr("src"),
        summary: document.selectFirst("div.summary").text().trim(),
        author: document.selectFirst("div.author a").text().trim(),
        chapters: chapters
    };
}

async function parseChapter(chapterUrl) {
    const result = await fetch(chapterUrl);
    const html = await result.text();
    const document = Jsoup.parse(html);
    const content = document.selectFirst("div#chapter-container");
    if (content) {
        return content.html();
    }
    return "<div><p>Failed to load text content.</p></div>";
}

module.exports = { id, name, site, version: "1.0.0", popularNovels, parseNovel, parseChapter };

        
