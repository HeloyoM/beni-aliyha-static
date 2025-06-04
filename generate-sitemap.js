const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

console.log('⚙️ Starting sitemap generation...');

const sitemap = new SitemapStream({ hostname: 'https://bnei-aliyah-rbsd-production.up.railway.app/api' });


const routes = [
    '/',
    '/guest',
    '/home',
    '/profile',
    '/messages',
    '/campaings',
    '/documents/privacy.pdf',
    '/access-denied'
];

(async () => {
  try {
        const writeStream = fs.createWriteStream('./build/sitemap.xml');
        sitemap.pipe(writeStream);


        routes.forEach(route => {
            console.log(`Adding: ${route}`);
            sitemap.write({ url: route, changefreq: 'weekly', priority: 0.8 });
        });

        sitemap.end();

        await streamToPromise(sitemap);
        console.log('✅ Sitemap generated at public/sitemap.xml.gz');

    } catch(err) {
        console.error('❌ Error generating sitemap:', err);
    }
})();