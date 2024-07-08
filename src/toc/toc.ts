import { Tokens } from "../types";

// Function to render the Table of Contents
export function renderToC(tokens: Tokens, container: HTMLElement) {
  const tocContainer = document.createElement("div");
  tocContainer.classList.add("toc");

  const categories = ["color", "elevation", "space", "border", "font"]; // Add other categories if needed

  const tocList = document.createElement("ul");

  categories.forEach((category) => {
    const categoryItem = document.createElement("li");
    categoryItem.innerHTML = `<a href="#${category}">${
      category.charAt(0).toUpperCase() + category.slice(1)
    }</a>`;

    const subCategories = getSubCategories(tokens, category);

    if (subCategories.length > 0) {
      const subCategoryList = document.createElement("ul");
      subCategories.forEach((subCategory) => {
        const subCategoryItem = document.createElement("li");
        subCategoryItem.innerHTML = `<a href="#${category}-${subCategory}">${
          subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
        }</a>`;
        subCategoryList.appendChild(subCategoryItem);
      });
      categoryItem.appendChild(subCategoryList);
    }

    tocList.appendChild(categoryItem);
  });

  tocContainer.appendChild(tocList);
  container.appendChild(tocContainer);
}

// Utility function to get subcategories from tokens
function getSubCategories(tokens: Tokens, category: string): string[] {
  const subCategories = new Set<string>();

  if (tokens.core && tokens.core[category]) {
    collectSubCategories(tokens.core[category], subCategories);
  }

  if (tokens.light && tokens.light[category]) {
    collectSubCategories(tokens.light[category], subCategories);
  }

  if (tokens.dark && tokens.dark[category]) {
    collectSubCategories(tokens.dark[category], subCategories);
  }

  // Remove "core" colors if category is "color"
  if (category === "color") {
    const coreColorNames = [
      "ugent-blue",
      "ugent-yellow",
      "mint",
      "coral",
      "electric-blue",
      "neutral",
    ];
    coreColorNames.forEach((name) => subCategories.delete(name));
  }

  return Array.from(subCategories);
}

// Recursive function to collect subcategories up to a specific depth
function collectSubCategories(
  tokenObject: any,
  subCategories: Set<string>,
  depth: number = 1,
  currentDepth: number = 0
) {
  if (currentDepth >= depth) return;

  Object.keys(tokenObject).forEach((key) => {
    if (
      typeof tokenObject[key] === "object" &&
      !("$value" in tokenObject[key])
    ) {
      subCategories.add(key);
      collectSubCategories(
        tokenObject[key],
        subCategories,
        depth,
        currentDepth + 1
      );
    }
  });
}
