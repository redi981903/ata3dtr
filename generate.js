const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "images");

let images = [];
let categoriesSet = new Set();

function walk(dir, category = "") {

    const files = fs.readdirSync(dir);

    files.forEach(file => {

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        // =========================
        // 📁 DIRECTORY HANDLING
        // =========================
        if (stat.isDirectory()) {

            const relative = path.relative(imagesDir, fullPath);

            // ❌ HERO tamamen ignore
            if (relative.startsWith("hero")) {
                return;
            }

            // ✅ SADECE products içi kategori
            if (relative.startsWith("products")) {

                const parts = relative.split(path.sep);
                // ["products", "kategori"]

                if (parts.length === 2) {
                    categoriesSet.add(parts[1]);
                }

                walk(fullPath, parts[1] || "");
            }

            return;
        }

        // =========================
        // 🖼 FILE HANDLING
        // =========================
        if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {

            images.push({
                file: category ? `${category}/${file}` : file,
                category: category || "genel"
            });
        }
    });
}

walk(imagesDir);

// 📦 images.js
fs.writeFileSync(
    path.join(__dirname, "images.js"),
    `const images = ${JSON.stringify(images, null, 2)};`
);

// 📦 categories.js
const categories = ["all", ...Array.from(categoriesSet)];

fs.writeFileSync(
    path.join(__dirname, "categories.js"),
    `const categories = ${JSON.stringify(categories, null, 2)};`
);

console.log("✔ images.js + categories.js oluşturuldu");