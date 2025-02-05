const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');

const replaceTemplate = require('./templates/replaceTempl');

//FILES
//Bloking code!
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non-bloking code
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) {return console.log('ERROR!');}

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);

//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log("File is written");
//             })
//         })
//     })
// })

// console.log("Reading in progress!");

//SERVER
const PORT = 3000;

const productData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'));
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const server = http.createServer((req, res) => {
    let respData = "";

    const {query, pathname} = url.parse(req.url, true); 

    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = productData.map(el => {
            return replaceTemplate(tempCard, el);
        }).join('');

        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

        respData = output;

    } else if (pathname === "/product") {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const product = productData[query.id];
        const output = replaceTemplate(tempProduct, product);

        respData = output;
    } else if (pathname === "/api") {
        respData = productData;
        res.writeHead(200, { 'Content-type': 'application/json' });


    } else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        respData = "<h1>Page not found!</h1>";
    }

    res.end(respData);
});

server.listen(PORT, (req, res) => {
    console.log(`Server listened on host: ${PORT}`);
})