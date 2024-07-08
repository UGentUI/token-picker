import { Token, CoreTokens } from "../types";
import { isToken, isNestedToken, createTokenLabels } from "./utils";

export function renderBorderTokens(
  borderTokens: CoreTokens,
  container: HTMLElement
) {
  const categoryHeader = document.createElement("h2");
  categoryHeader.id = "border";
  categoryHeader.textContent = "Border";
  container.appendChild(categoryHeader);

  const subCategories = Object.keys(borderTokens);

  subCategories.forEach((subCategory) => {
    renderSubCategory(
      borderTokens[subCategory] as CoreTokens,
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
  subCategoryHeader.id = `border-${subCategory}`;
  subCategoryHeader.textContent =
    subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
  container.appendChild(subCategoryHeader);

  const table = createBorderTable();
  container.appendChild(table);
  const tableBody = table.querySelector("tbody")!;

  renderNestedBorderTokens(tableBody, subCategoryTokens, [
    "border",
    subCategory,
  ]);
}

function createBorderTable(): HTMLTableElement {
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

function renderNestedBorderTokens(
  tableBody: HTMLElement,
  borderTokens: CoreTokens,
  path: string[]
) {
  const tokenNames = Object.keys(borderTokens);

  tokenNames.forEach((tokenName) => {
    const token = borderTokens[tokenName];
    if (isToken(token)) {
      renderBorderTokenRow(tableBody, token, path.concat(tokenName).join("."));
    } else if (isNestedToken(token)) {
      renderNestedBorderTokens(
        tableBody,
        token as CoreTokens,
        path.concat(tokenName)
      );
    }
  });
}

function renderBorderTokenRow(
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

  const sampleClass = getBorderSampleClass(tokenName);
  const borderWidth = tokenName.includes("width") ? token.$value : "1px)";
  const borderRadius = tokenName.includes("radius") ? token.$value : "0";

  valueCell.innerHTML = `
      <div class="border-preview">
          <div class="${sampleClass}" style="border-width: ${borderWidth}; border-radius: ${borderRadius}"></div>
          <div><small><code>${token.$value}</code></small></div>
      </div>
    `;
  row.appendChild(valueCell);

  tableBody.appendChild(row);
}

function getBorderSampleClass(tokenName: string): string {
  if (tokenName.includes("width")) {
    return "border-sample width";
  } else if (tokenName.includes("radius")) {
    return "border-sample radius";
  } else {
    return "border-sample";
  }
}
