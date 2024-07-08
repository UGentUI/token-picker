import "./style.css";
import { renderBorderTokens } from "./tokenRenderers/borderTokens";
import { renderColorTokens } from "./tokenRenderers/colorTokens";
import { renderFontTokens } from "./tokenRenderers/fontTokens";
import { renderSpaceTokens } from "./tokenRenderers/spaceTokens";
import { renderElevationTokens } from "./tokenRenderers/elevationTokens";
import { Tokens, CoreTokens } from "./types";
import { addCopyEventListeners } from "./tokenRenderers/utils";
import tokens from "@ugent-ui/design-tokens/tokens-raw/tokens.json";
import { renderToC } from "./toc/toc";

const appDiv = document.querySelector<HTMLDivElement>("#app")!;
appDiv.innerHTML = /*html*/ `
<section>
    <header>
        <h1>Token Picker</h1>
        <p>Design Tokens zijn de <a href="https://github.com/UGentUI/design-tokens">Single source of truth</a> om UGent
            UI design beslissingen te benoemen en te bewaren.<br>
            Lees de <a href="https://github.com/UGentUI/design-tokens">documentatie</a> om te zien hoe je design tokens
            in je project kunt gebruiken.<br>
            Kies hier de juiste tokens en kopieer de <i>CSS custom property</i>, <i>SCSS variable</i> of <i>Figma definitie</i> door op het label te klikken. </p>
    </header>
    <header>
        <h2>TOC</h2>
    </header>
    <div id="toc-container"></div>
</section>
<section>
    <div id="token-container"></div>
</section>`;

const tocContainer = document.getElementById("toc-container")!;
renderToC(tokens as Tokens, tocContainer);

const tokenContainer = document.getElementById("token-container")!;
renderColorTokens(tokens as Tokens, tokenContainer);
renderElevationTokens(tokens as Tokens, tokenContainer);
renderSpaceTokens(tokens.core.space as CoreTokens, tokenContainer);
renderBorderTokens(tokens.core.border as CoreTokens, tokenContainer);
renderFontTokens(tokens.core.font as CoreTokens, tokenContainer);
addCopyEventListeners(tokenContainer);
