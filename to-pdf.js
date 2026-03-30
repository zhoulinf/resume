#!/usr/bin/env node

/**
 * 将简历 HTML 转换为 PDF
 * 使用: node to-pdf.js
 * 或者: chmod +x to-pdf.js && ./to-pdf.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const HTML_FILE = path.join(__dirname, 'index.html');
const OUTPUT_FILE = path.join(__dirname, 'resume.pdf');

async function htmlToPdf() {
  const htmlPath = path.resolve(HTML_FILE);
  const outputPath = path.resolve(OUTPUT_FILE);

  if (!fs.existsSync(htmlPath)) {
    console.error(`错误: 找不到文件 ${htmlPath}`);
    process.exit(1);
  }

  console.log('正在启动浏览器...');

  const browser = await puppeteer.launch({
    headless: 'new',
  });

  const page = await browser.newPage();

  console.log('正在加载 HTML...');

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0',
  });

  console.log('正在生成 PDF...');

  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm',
    },
    printBackground: true,
  });

  await browser.close();

  console.log(`✓ PDF 已生成: ${outputPath}`);
}

htmlToPdf().catch((err) => {
  console.error('转换失败:', err);
  process.exit(1);
});
