let quotes = [];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerText = quotes[randomIndex]
    ? quotes[randomIndex].text
    : "No quotes available";
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
  document.body.appendChild(formContainer);
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory,
    };
    quotes.push(newQuote);
    saveQuotes();
    populateCategoryFilter();
    showRandomQuote();
    postQuoteToServer(newQuote);
    notifyUser("Quote added and posted to server.");
  } else {
    alert("Please fill in both fields.");
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerText = filteredQuotes.length
    ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text
    : "No quotes available for this category";
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    const formattedQuotes = serverQuotes.map((post) => ({
      text: post.title,
      category: "Server Data",
    }));

    saveQuotes();
    showRandomQuote();
    notifyUser("Quotes fetched and updated successfully from server!");
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    notifyUser("Error fetching quotes from server.");
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });

    if (!response.ok) {
      throw new Error("Failed to post quote");
    }

    const result = await response.json();
    console.log("Quote posted successfully:", result);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

async function syncQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    const formattedServerQuotes = serverQuotes.map((post) => ({
      text: post.title,
      category: "Server Data",
    }));

    const localQuoteTexts = quotes.map((quote) => quote.text);
    const newQuotes = formattedServerQuotes.filter(
      (serverQuote) => !localQuoteTexts.includes(serverQuote.text)
    );

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      notifyUser("Quotes synced with server!");
    } else {
      notifyUser("No new quotes to sync.");
    }
  } catch (error) {
    console.error("Error syncing quotes with server:", error);
    notifyUser("Error syncing quotes with server.");
  }
}

function notifyUser(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  createAddQuoteForm();
  showRandomQuote();
  populateCategoryFilter();

  fetchQuotesFromServer();

  setInterval(syncQuotes, 600000);
});
message.txt;
