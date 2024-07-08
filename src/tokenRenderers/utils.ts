import { Token } from "../types";

export function tokenToCSSVariable(theme: string, path: string[]): string {
  return `--${theme}-${path.join("-")}`.toLowerCase();
}

// Type guard to check if an object is a Token
export function isToken(obj: any): obj is Token {
  return obj && typeof obj.$type === "string" && typeof obj.$value === "string";
}

// Function to check if a token is nested
export function isNestedToken(token: any): boolean {
  return typeof token === "object" && token && !("$type" in token);
}

export function createTokenLabels(path: string[]): string {
  const cssVarName = `var(--${path.join("-")})`.toLowerCase();
  const scssVarName = `$${path.join("-")}`;
  const figmaVarName = path.join(" / ");

  return /*html*/ `
    <div class="token-labels">
        <small>
            <ul>
                <li>
                    <a title="CSS" data-copy="${cssVarName}">${cssVarName}</a>
                    <span class="copy-label">Copy</span>
                </li>
                <li>
                    <a title="SCSS" data-copy="${scssVarName}">${scssVarName}</a>
                    <span class="copy-label">Copy</span>
                </li>
                <li>
                    <a title="Figma" data-copy="${figmaVarName}">${figmaVarName}</a>
                    <span class="copy-label">Copy</span>
                </li>
            </ul>
        </small>
    </div>`;
}

export function addCopyEventListeners(container: HTMLElement) {
  const links = container.querySelectorAll(".token-labels a");

  links.forEach((link) => {
    const copyLabel = document.createElement("div");
    copyLabel.className = "copy-label";
    copyLabel.textContent = "Copy";
    link.parentElement?.appendChild(copyLabel);

    link.addEventListener("mouseover", () => {
      copyLabel.style.visibility = "visible";
      copyLabel.style.opacity = "1";
    });

    link.addEventListener("mouseout", () => {
      if (copyLabel.textContent === "Copy") {
        copyLabel.style.visibility = "hidden";
        copyLabel.style.opacity = "0";
      }
    });

    link.addEventListener("click", (event) => {
      event.preventDefault();
      const textToCopy = (event.target as HTMLAnchorElement).getAttribute(
        "data-copy"
      );
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(
          () => {
            copyLabel.textContent = "Copied!";
            setTimeout(() => {
              copyLabel.textContent = "Copy";
              copyLabel.style.visibility = "hidden";
              copyLabel.style.opacity = "0";
            }, 1000);
          },
          (err) => {
            console.error("Could not copy text: ", err);
          }
        );
      }
    });
  });
}
