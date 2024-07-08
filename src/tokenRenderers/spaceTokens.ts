import { Token, CoreTokens } from "../types";
import { isToken, isNestedToken, createTokenLabels } from "./utils";

export function renderSpaceTokens(
  spaceTokens: CoreTokens,
  container: HTMLElement
) {
  const categoryHeader = document.createElement("h2");
  categoryHeader.id = "space";
  categoryHeader.textContent = "Space";
  container.appendChild(categoryHeader);

  const positiveTable = createSpaceTable();
  container.appendChild(positiveTable);
  const positiveTableBody = positiveTable.querySelector("tbody")!;

  const negativeHeader = document.createElement("h3");
  negativeHeader.id = "space-negative";
  negativeHeader.textContent = "Negative";
  container.appendChild(negativeHeader);

  const negativeTable = createSpaceTable();
  container.appendChild(negativeTable);
  const negativeTableBody = negativeTable.querySelector("tbody")!;

  renderNestedSpaceTokens(positiveTableBody, negativeTableBody, spaceTokens, [
    "space",
  ]);
}

function createSpaceTable(): HTMLTableElement {
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

function renderNestedSpaceTokens(
  positiveTableBody: HTMLElement,
  negativeTableBody: HTMLElement,
  spaceTokens: CoreTokens,
  path: string[]
) {
  const tokenNames = Object.keys(spaceTokens);
  tokenNames.sort((a, b) => {
    const numA = parseFloat(a.replace("negative.", "-").replace(".", ""));
    const numB = parseFloat(b.replace("negative.", "-").replace(".", ""));
    return numA - numB;
  });

  tokenNames.forEach((tokenName) => {
    const token = spaceTokens[tokenName];
    if (isToken(token)) {
      const isNegative = path.includes("negative");
      const tableBody = isNegative ? negativeTableBody : positiveTableBody;
      renderSpaceTokenRow(tableBody, token, path.concat(tokenName).join("."));
    } else if (isNestedToken(token)) {
      renderNestedSpaceTokens(
        positiveTableBody,
        negativeTableBody,
        token as CoreTokens,
        path.concat(tokenName)
      );
    }
  });
}

function renderSpaceTokenRow(
  tableBody: HTMLElement,
  token: Token,
  tokenName: string
) {
  const row = document.createElement("tr");

  const tokenNameCell = document.createElement("td");
  tokenNameCell.innerHTML = /*html*/ `
    <code>${tokenName}</code>${createTokenLabels(tokenName.split("."))}
  `;
  row.appendChild(tokenNameCell);

  const valueCell = document.createElement("td");

  const isNegative = token.$value.startsWith("-");
  const displayValue = isNegative ? token.$value.slice(1) : token.$value;
  const sampleClass = isNegative ? "space-sample negative" : "space-sample";

  valueCell.innerHTML = `
    <div class="space-preview">
        <div class="${sampleClass}" style="width: ${displayValue};"></div>
        <div><small><code>${token.$value}</code></small></div>
    </div>
  `;
  row.appendChild(valueCell);

  tableBody.appendChild(row);
}
