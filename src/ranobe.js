const id = "ranobe_source";
const name = "Ranobe (Custom)";
const site = "https://ranobe.top";

// 1. FETCH LATEST/POPULAR NOVELS
async function popularNovels(pageNo) {
    const url = `${site}/api/novels?page=${pageNo}&sort=popular`;
    const result = await fetch(url);
    const data = await result.json(); // Ranobe uses a clean JSON API instead of messy HTML!
    
    const novels = [];
    if (data && data.items) {
        data.items.forEach(item => {
            novels.push({
                name: item.title,
                cover: item.poster ? `${site}${item.poster}` : "",
                path: `/api/novels/${item.id}` // Internal path for the engine
            });
        });
    }
    return novels;
}

// 2. FETCH REAL NOVEL DETAILS & CHAPTER LIST
async function parseNovel(novelPath) {
    const url = `${site}${novelPath}`;
    const result = await fetch(url);
    const data = await result.json();
    
    const chapters = [];
    if (data && data.chapters) {
        data.chapters.forEach(chap => {
            chapters.push({
                name: chap.title,
                path: `${site}/api/chapters/${chap.id}` // Direct link to the text content
            });
        });
    }

    return {
        name: data.title,
        cover: data.poster ? `${site}${data.poster}` : "",
        summary: data.description || "No description available.",
        author: data.author || "Unknown Author",
        chapters: chapters
    };
}

// 3. FETCH ACTUAL TEXT CONTENT FOR THE READER
async function parseChapter(chapterUrl) {
    const result = await fetch(chapterUrl);
    const data = await result.json();
    
    // Returns the clean content formatted in readable paragraph tags
    if (data && data.content) {
        return `<div>${data.content}</div>`;
    }
    return "<div><p>Failed to load light novel content.</p></div>";
}

module.exports = {
    id,
    name,
    site,
    version: "1.0.0",
    popularNovels,
    parseNovel,
    parseChapter,
};

