import { Token, CoreTokens } from "../types";
import { isToken, isNestedToken, createTokenLabels } from "./utils";

export function renderFontTokens(
  fontTokens: CoreTokens,
  container: HTMLElement
) {
  const categoryHeader = document.createElement("h2");
  categoryHeader.id = `font`;
  categoryHeader.textContent = "Font";
  container.appendChild(categoryHeader);

  const subCategories = Object.keys(fontTokens);

  subCategories.forEach((subCategory) => {
    renderSubCategory(
      fontTokens[subCategory] as CoreTokens,
      subCategory,
      container
    );
  });
}

function renderSubCategory(
  subCategoryTokens: CoreTokens,
  subCategory: string,
  container: HTMLElement
) {
  const subCategoryHeader = document.createElement("h3");
  subCategoryHeader.id = `font-${subCategory}`;
  subCategoryHeader.textContent =
    subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
  container.appendChild(subCategoryHeader);

  const table = createFontTable();
  container.appendChild(table);
  const tableBody = table.querySelector("tbody")!;

  renderNestedFontTokens(tableBody, subCategoryTokens, ["font", subCategory]);
}

function createFontTable(): HTMLTableElement {
  const table = document.createElement("table");
  table.innerHTML = /*html*/ `
    <thead>
        <tr>
            <th class="token-column">Token</th>
            <th class="value-column">Value</th>
        </tr>
    </thead>
    <tbody></tbody>
  `;
  return table;
}

function renderNestedFontTokens(
  tableBody: HTMLElement,
  fontTokens: CoreTokens,
  path: string[]
) {
  const tokenNames = Object.keys(fontTokens);

  tokenNames.forEach((tokenName) => {
    const token = fontTokens[tokenName];
    if (isToken(token)) {
      renderFontTokenRow(tableBody, token, path.concat(tokenName).join("."));
    } else if (isNestedToken(token)) {
      renderNestedFontTokens(
        tableBody,
        token as CoreTokens,
        path.concat(tokenName)
      );
    }
  });
}

function renderFontTokenRow(
  tableBody: HTMLElement,
  token: Token,
  tokenName: string
) {
  const row = document.createElement("tr");

  const tokenNameCell = document.createElement("td");
  tokenNameCell.innerHTML = /*html*/ `
    <code>${tokenName}</code>
    ${createTokenLabels(tokenName.split("."))}
  `;
  row.appendChild(tokenNameCell);

  const valueCell = document.createElement("td");

  const previewStyle = getFontPreviewStyle(tokenName, token.$value);

  valueCell.innerHTML = `
    <div class="font-preview">
        <div class="font-sample" style="${previewStyle}">The quick brown fox jumps over the lazy dog</div>
        <div><small><code>${token.$value}</code></small></div>
    </div>
  `;
  row.appendChild(valueCell);

  tableBody.appendChild(row);
}

function getFontPreviewStyle(tokenName: string, value: string): string {
  if (tokenName.includes("family")) {
    return `font-family: ${value};`;
  } else if (tokenName.includes("weight")) {
    return `font-weight: ${value};`;
  } else if (tokenName.includes("body")) {
    return `font-size: ${value};`;
  } else if (tokenName.includes("heading")) {
    return `font-size: ${value};`;
  } else if (tokenName.includes("lineheight")) {
    return `line-height: ${value}; background-color: var(--color-background-neutral-default);`;
  } else if (tokenName.includes("letterspacing")) {
    return `letter-spacing: ${value};`;
  } else {
    return ``;
  }
}
