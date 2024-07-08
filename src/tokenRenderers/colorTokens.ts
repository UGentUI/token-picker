import { Token, Tokens, ThemeTokens } from "../types";
import { tokenToCSSVariable, isNestedToken, createTokenLabels } from "./utils";

export function renderColorTokens(tokens: Tokens, container: HTMLElement) {
  const categories = ["color"];

  categories.forEach((category) => {
    renderCategory(tokens, category, container);
  });
}

function renderCategory(
  tokens: Tokens,
  category: string,
  container: HTMLElement
) {
  const categoryHeader = document.createElement("h2");
  categoryHeader.id = category;
  categoryHeader.textContent =
    category.charAt(0).toUpperCase() + category.slice(1);
  container.appendChild(categoryHeader);

  const subCategories = Object.keys(tokens.light[category]);

  subCategories.forEach((subCategory) => {
    renderSubCategory(tokens, category, subCategory, container);
  });
}

function renderSubCategory(
  tokens: Tokens,
  category: string,
  subCategory: string,
  container: HTMLElement
) {
  const subCategoryHeader = document.createElement("h3");
  subCategoryHeader.id = `${category}-${subCategory}`;
  subCategoryHeader.textContent =
    subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
  container.appendChild(subCategoryHeader);

  const table = createColorTable();
  container.appendChild(table);
  const tableBody = table.querySelector("tbody")!;

  const lightTokens = (tokens.light[category] as ThemeTokens)[
    subCategory
  ] as ThemeTokens;
  const darkTokens = (tokens.dark[category] as ThemeTokens)[
    subCategory
  ] as ThemeTokens;

  const allTokenNames = new Set([
    ...Object.keys(lightTokens),
    ...Object.keys(darkTokens),
  ]);

  allTokenNames.forEach((tokenName) => {
    renderTokenRow(tableBody, lightTokens[tokenName], darkTokens[tokenName], [
      category,
      subCategory,
      tokenName,
    ]);
  });
}

function createColorTable(): HTMLTableElement {
  const table = document.createElement("table");
  table.innerHTML = /*html*/ `
    <thead>
        <tr>
            <th class="token-column">Token</th>
            <th class="light-column">Light Theme</th>
            <th class="dark-column">Dark Theme</th>
        </tr>
    </thead>
    <tbody></tbody>
  `;
  return table;
}

function renderTokenRow(
  tableBody: HTMLElement,
  lightToken: any,
  darkToken: any,
  path: string[]
) {
  if (isNestedToken(lightToken) || isNestedToken(darkToken)) {
    renderNestedTokens(tableBody, lightToken, darkToken, path);
  } else {
    const row = document.createElement("tr");

    const tokenNameCell = createTokenNameCell(lightToken, path);
    row.appendChild(tokenNameCell);

    const lightCell = createThemeCell(lightToken, "light", path);
    row.appendChild(lightCell);

    const darkCell = createThemeCell(darkToken, "dark", path);
    row.appendChild(darkCell);

    tableBody.appendChild(row);
  }
}

function createTokenNameCell(
  token: Token | undefined,
  path: string[]
): HTMLTableCellElement {
  const cell = document.createElement("td");
  const description =
    token && token.$description
      ? token.$description.replace(" in het light theme", "")
      : "";
  cell.innerHTML = /*html*/ `
    <code>${path.join(".")}</code>
    <div>
        <small>${description}</small>
    </div>
    <div>${createTokenLabels(path)}</div>
  `;
  return cell;
}

function createThemeCell(
  token: Token | undefined,
  theme: string,
  path: string[]
): HTMLTableCellElement {
  const cell = document.createElement("td");
  cell.classList.add(`${theme}-column`);
  if (token) {
    const cssVarName = tokenToCSSVariable(theme, path);
    cell.innerHTML = /*html*/ `
      <div class="color-preview ${theme}">
          <div class="swatch" style="background-color: var(${cssVarName});"></div>
          <div><small><code>${token.$value}</code></small></div>
      </div>
    `;
  }
  return cell;
}

function renderNestedTokens(
  tableBody: HTMLElement,
  lightTokens: any,
  darkTokens: any,
  path: string[]
) {
  const allTokenNames = new Set([
    ...Object.keys(lightTokens || {}),
    ...Object.keys(darkTokens || {}),
  ]);

  allTokenNames.forEach((tokenName) => {
    renderTokenRow(
      tableBody,
      lightTokens ? lightTokens[tokenName] : undefined,
      darkTokens ? darkTokens[tokenName] : undefined,
      path.concat(tokenName)
    );
  });
}
