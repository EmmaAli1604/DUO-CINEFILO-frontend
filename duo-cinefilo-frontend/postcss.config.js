
// postcss.config.mjs
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
    plugins: [
        tailwindcss(),   // plugin de Tailwind
        autoprefixer(),
    ],
};