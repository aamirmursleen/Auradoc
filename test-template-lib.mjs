import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function testTemplateLibrary() {
  console.log('=== Testing Template Library Feature ===\n');
  let allPassed = true;

  // Test 1: Templates API endpoint exists
  console.log('Test 1: Templates API endpoint exists');
  {
    try {
      const res = await fetch(`${BASE_URL}/api/templates`);
      const data = await res.json();
      const pass = res.status === 200 && data.success !== undefined;
      console.log(`  GET /api/templates: status ${res.status}`);
      console.log(`  Response has success field: ${data.success !== undefined ? 'PASS' : 'FAIL'}`);
      console.log(`  Data array: ${Array.isArray(data.data) ? `PASS (${data.data.length} items)` : 'FAIL'}`);
      console.log(`  Overall: ${pass ? 'PASS' : 'FAIL'}`);
      if (!pass) allPassed = false;
    } catch (err) {
      console.log(`  FAIL: ${err.message}`);
      allPassed = false;
    }
  }
  console.log('');

  // Test 2: Templates API supports category filtering
  console.log('Test 2: Templates API category filtering');
  {
    try {
      const res = await fetch(`${BASE_URL}/api/templates?category=business`);
      const data = await res.json();
      const pass = res.status === 200 && data.success;
      console.log(`  GET /api/templates?category=business: status ${res.status}`);
      console.log(`  Filtered results: ${data.data?.length || 0} items`);
      console.log(`  Overall: ${pass ? 'PASS' : 'FAIL'}`);
      if (!pass) allPassed = false;
    } catch (err) {
      console.log(`  FAIL: ${err.message}`);
      allPassed = false;
    }
  }
  console.log('');

  // Test 3: Template library page loads
  console.log('Test 3: Template library page loads with templates');
  {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(`${BASE_URL}/template-library`, { waitUntil: 'networkidle2', timeout: 30000 });
      await wait(2000);

      const content = await page.content();
      const hasTitle = content.includes('Template Library') || content.includes('template');
      const hasNDA = content.includes('NDA') || content.includes('Non-Disclosure');
      const hasSearch = content.includes('Search');
      const hasCategories = content.includes('Business') && content.includes('Legal');

      console.log(`  Page loads: ${hasTitle ? 'PASS' : 'FAIL'}`);
      console.log(`  Has NDA template: ${hasNDA ? 'PASS' : 'FAIL'}`);
      console.log(`  Has search: ${hasSearch ? 'PASS' : 'FAIL'}`);
      console.log(`  Has categories: ${hasCategories ? 'PASS' : 'FAIL'}`);

      const pass = hasTitle && hasNDA && hasSearch;
      console.log(`  Overall: ${pass ? 'PASS' : 'FAIL'}`);
      if (!pass) allPassed = false;

      await page.close();
    } catch (err) {
      console.log(`  FAIL: ${err.message}`);
      allPassed = false;
    } finally {
      if (browser) await browser.close();
    }
  }
  console.log('');

  // Test 4: Migration file exists
  console.log('Test 4: Migration file exists with seed data');
  {
    const path = 'supabase/migrations/007_templates.sql';
    const exists = fs.existsSync(path);
    const content = exists ? fs.readFileSync(path, 'utf-8') : '';
    const hasCreateTable = content.includes('CREATE TABLE IF NOT EXISTS templates');
    const hasSeedData = content.includes('INSERT INTO templates');
    const hasNDA = content.includes('Non-Disclosure Agreement');

    console.log(`  Migration file exists: ${exists ? 'PASS' : 'FAIL'}`);
    console.log(`  CREATE TABLE: ${hasCreateTable ? 'PASS' : 'FAIL'}`);
    console.log(`  Seed data: ${hasSeedData ? 'PASS' : 'FAIL'}`);
    console.log(`  NDA in seed: ${hasNDA ? 'PASS' : 'FAIL'}`);

    const pass = exists && hasCreateTable && hasSeedData;
    console.log(`  Overall: ${pass ? 'PASS' : 'FAIL'}`);
    if (!pass) allPassed = false;
  }
  console.log('');

  console.log(`\n=== Template Library Tests: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'} ===`);
}

testTemplateLibrary().catch(console.error);
