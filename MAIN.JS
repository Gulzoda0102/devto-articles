const apiURL = "https://dev.to/api/articles";
const articlesDiv = document.getElementById("articles");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

let articlesData = [];

// Fetch API
fetch(apiURL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Tarmoqda xatolik: " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    articlesData = data; // Saqlab qo'yamiz
    renderArticles(articlesData);
  })
  .catch(error => {
    articlesDiv.innerHTML = "Xatolik yuz berdi: " + error;
    console.error(error);
  });

// Render function
function renderArticles(data) {
  if (data.length === 0) {
    articlesDiv.innerHTML = "Hech qanday maqola topilmadi.";
    return;
  }

  const html = data.map(article => {
    return `
      <div class="article">
        ${article.cover_image ? `<img src="${article.cover_image}" alt="Maqola rasmi">` : ""}
        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
        <p>By: ${article.user.name}</p>
        <p>${article.description || ""}</p>
        <p><strong>Taglar:</strong> ${article.tag_list.join(", ")}</p>
      </div>
    `;
  }).join("");

  articlesDiv.innerHTML = html;
}

// Search function
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase();
  let filtered = articlesData.filter(article => 
    article.title.toLowerCase().includes(searchText) ||
    article.description.toLowerCase().includes(searchText) ||
    article.tag_list.some(tag => tag.toLowerCase().includes(searchText))
  );
  filtered = sortArticles(filtered);
  renderArticles(filtered);
});

// Sort function
sortSelect.addEventListener("change", () => {
  let filtered = filterBySearch(articlesData);
  filtered = sortArticles(filtered);
  renderArticles(filtered);
});

// Helper functions
function sortArticles(data) {
  const sortValue = sortSelect.value;
  return data.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return sortValue === "az" ? -1 : 1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return sortValue === "az" ? 1 : -1;
    return 0;
  });
}

function filterBySearch(data) {
  const searchText = searchInput.value.toLowerCase();
  return data.filter(article => 
    article.title.toLowerCase().includes(searchText) ||
    article.description.toLowerCase().includes(searchText) ||
    article.tag_list.some(tag => tag.toLowerCase().includes(searchText))
  );
}
