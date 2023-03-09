// The GitHub user
const user = "imjxlian";
const basic_url = `https://api.github.com/users/${user}`;

/**
 * Get all the user's public repositories
 * @returns all the user's public repositories
 */
async function getUserRepos() {
    var data = 
    await fetch(`${basic_url}/repos`)
        .then((res) => res.json())
        .catch((err) => console.log(err));
    return data;
}

/**
 * Show the GitHub projects in the projects section
 * @param {String} username - GitHub's username
 */
async function showRepos() {
    let repos = await getUserRepos();
    repos.forEach((repo) => {
        if (repo.name != `${user}` && repo.name != `${user}.github.io`) {
        let projectItemElement = document.createElement("div");
        createProjectItem(projectItemElement, repo);
        document.getElementById("projects").appendChild(projectItemElement);
        }
    });
}

/**
 * Count all the user's events in the current year
 * @returns sum of all the user's events
 */
async function getEventsCount() {
    let count = 0;
    let page = 1;

    do {
        const url = `${basic_url}/events?page=${page}`;
        var body = await fetch(url).then((res) => res.json());
        page++;
        count += body.length;
    } while (body.length != 0);
    return count;
}

/**
 * Count all the user's stars on the public repositories
 * @returns sum of all the stars on public repositories
 */
async function getStarsCount() {
    let count = 0;
    const url = `${basic_url}/repos`;
    var data = await fetch(url).then((res) => res.json());
    data.forEach((repo) => {
        count += repo.stargazers_count;
    });
    return count;
}

/**
 * Get all user's statistics
 * @returns all user's statistics
 */
async function getUserStats() {
  let stats = {
    account_created_at: "",
    public_repos_count: 0,
    followers_count: 0,
    following_count: 0,
    stars_count: 0,
    contributions_count: 0,
  };

  const url = `${basic_url}`;
  var user_data = await fetch(url).then((res) => res.json());
  stats.account_created_at = user_data.created_at;
  stats.public_repos_count = user_data.public_repos;
  stats.followers_count = user_data.followers;
  stats.following_count = user_data.following;
  stats.stars_count = await getStarsCount();
  stats.contributions_count = await getEventsCount();
  return stats;
}

/**
 * Show the user's GitHub statistics
 */
async function showUserStats() {
    let stats = await getUserStats();
    let created_at = getFormattedDate(stats.account_created_at);
    document.getElementById("date-creation-account").innerHTML = created_at;
    document.getElementById("public-repos-count").innerHTML = stats.public_repos_count;
    document.getElementById("followers-count").innerHTML = stats.followers_count;
    document.getElementById("following-count").innerHTML = stats.following_count;
    document.getElementById("contributions-count").innerHTML =
    stats.contributions_count;
    document.getElementById("stars-count").innerHTML =
    stats.stars_count;
}

/**
 * Randomize hover colors
 * @param {String} className name of the class to randomize colors
 */
function randomHoverColor(className) {
    var icons = document.getElementsByClassName(className);
    for (let i = 0; i < icons.length; i++) {
        icons[i].onmouseover = function (e) {
        let random_color =
            "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.style = "color: " + random_color + ";";
        };
        icons[i].onmouseout = function (e) {
        this.style = "color: var(--icons-color);";
        };
    }
}

/**
 * Convert a non-formatted date to a formatted one
 * @param {String} str_date - not formatted date
 * @returns a formatted date dd/mm/yyyy
 */
function getFormattedDate(str_date) {
    let date = str_date.split("T")[0];
    date = date.split("-");
    return `${date[2]}/${date[1]}/${date[0]}`;
}

/**
 * Create a project item HTML Element
 * @param {HTMLDivElement} projectItemElement
 * @param {Array} repo
 */
function createProjectItem(projectItemElement, repo) {
    let titleContainerElement = document.createElement("div"),
        topicContainerElement = document.createElement("div"),
        titleElement = document.createElement("h5"),
        urlElement = document.createElement("a"),
        dateCreatedElement = document.createElement("p"),
        descriptionElement = document.createElement("p"),
        starsElement = document.createElement("p"),
        starsIcon = document.createElement("i"),
        forksElement = document.createElement("p"),
        forksIcon = document.createElement("i"),
        lastUpdateElement = document.createElement("p");

    projectItemElement.append(
        titleContainerElement,
        dateCreatedElement,
        descriptionElement,
        starsElement,
        starsIcon,
        forksElement,
        forksIcon,
        lastUpdateElement
    );
    titleContainerElement.append(
        titleElement,
        topicContainerElement
    );
    titleElement.appendChild(urlElement);

    projectItemElement.classList.add("project-item");
    titleElement.classList.add("section-subtitle", "m-0");
    dateCreatedElement.classList.add("secondary-info");
    titleContainerElement.classList.add("d-flex", "justify-content-between");
    topicContainerElement.classList.add(
        "d-flex",
        "align-self-center",
        "topic-list"
    );
    starsIcon.classList.add("bi", "bi-star-fill", "star"),
        starsElement.classList.add("d-inline", "me-1"),
        forksElement.classList.add("d-inline", "me-1");
    forksIcon.classList.add("bi", "bi-bezier", "fork"),
        lastUpdateElement.classList.add("mt-3", "secondary-info");

    urlElement.href = repo.html_url;
    urlElement.textContent = repo.name;
    dateCreatedElement.textContent = getFormattedDate(repo.created_at);
    descriptionElement.textContent =
        repo.description != null ? repo.description : "No description";
    starsElement.textContent = repo.stargazers_count;
    forksElement.textContent = repo.forks_count;
    lastUpdateElement.textContent = `Last update on ${getFormattedDate(
        repo.pushed_at
    )}`;

    repo.topics.forEach((topic) => {
        var topicElement = document.createElement("div");
        topic = topic.toUpperCase();
        topicElement.classList.add("topic");
        if (topic == "IUT") topicElement.classList.add("iut-bg");
        if (topic == "OWN") topicElement.classList.add("own-bg");
        topicElement.textContent = topic;
        topicContainerElement.appendChild(topicElement);
    });
}

/**
 * When document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelectorAll(".year").forEach((y) => {
        y.innerHTML = new Date().getFullYear();
    });
    showRepos();
    showUserStats();
    randomHoverColor("rand-color");
});
