import { createRoot } from 'react-dom/client';
require("@babel/core").transformSync("code", {
    presets: ["@babel/preset-react"],
});
// Очистимо існуючий зміст HTML
document.body.innerHTML = '<div id="app"></div>';

// Замість нього відрендеримо ваш React компонент
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
