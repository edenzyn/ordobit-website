import { renderHeader } from "../../components/header.js";
import { renderFooter } from "../../components/footer.js";

const app = document.getElementById("app");

app.innerHTML = `
  ${renderHeader({ basePath: "./", active: "landing" })}

  <main class="landing-page container">
    <section class="under-dev" aria-labelledby="dev-title">
      <div class="under-dev-badge">
        <span class="status-dot"></span>
        <span class="badge-text">Under Development</span>
      </div>

      <h1 id="dev-title">
        This website is<br />
        under development.
      </h1>

      <p class="under-dev-lede">
        Ordobit provides device software for kiosk, counter, kitchen and
        display devices used by food businesses. We are working on it.
      </p>

      <div class="under-dev-actions">
        <a class="button button-primary" href="downloads/">
          Download Device Client <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  </main>

  ${renderFooter({ basePath: "./" })}
`;
