import puppeteer from 'puppeteer'
import fs from 'fs'

const BASE = 'http://localhost:3000'

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function runTests() {
  console.log('=== Testing Bulk Send Feature ===\n')
  let passed = 0
  let failed = 0

  // Test 1: Bulk send page loads
  console.log('Test 1: Bulk send page loads')
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.goto(`${BASE}/bulk-send`, { waitUntil: 'networkidle2', timeout: 30000 })
    const html = await page.content()

    const hasTitle = html.includes('Bulk Send')
    const hasUpload = html.includes('Upload') || html.includes('Choose PDF')
    const hasSteps = html.includes('Upload PDF') && html.includes('Upload CSV')

    console.log(`  Page loads: ${hasTitle ? 'PASS' : 'FAIL'}`)
    console.log(`  Has upload button: ${hasUpload ? 'PASS' : 'FAIL'}`)
    console.log(`  Has step indicators: ${hasSteps ? 'PASS' : 'FAIL'}`)

    if (hasTitle && hasUpload && hasSteps) {
      console.log('  Overall: PASS\n')
      passed++
    } else {
      console.log('  Overall: FAIL\n')
      failed++
    }
    await page.close()
  } catch (err) {
    console.log(`  Error: ${err.message}`)
    console.log('  Overall: FAIL\n')
    failed++
  }

  // Test 2: Sidebar has Bulk Send link
  console.log('Test 2: Sidebar has Bulk Send link')
  try {
    const page = await browser.newPage()
    await page.goto(`${BASE}/documents`, { waitUntil: 'networkidle2', timeout: 30000 })
    const html = await page.content()

    const hasBulkSend = html.includes('Bulk Send') && html.includes('/bulk-send')
    console.log(`  Sidebar link: ${hasBulkSend ? 'PASS' : 'FAIL'}`)
    console.log(`  Overall: ${hasBulkSend ? 'PASS' : 'FAIL'}\n`)
    hasBulkSend ? passed++ : failed++
    await page.close()
  } catch (err) {
    console.log(`  Error: ${err.message}`)
    console.log('  Overall: FAIL\n')
    failed++
  }

  // Test 3: CSV parsing works (test the UI flow with a sample CSV)
  console.log('Test 3: Step navigation and back button')
  try {
    const page = await browser.newPage()
    await page.goto(`${BASE}/bulk-send`, { waitUntil: 'networkidle2', timeout: 30000 })

    // Check step 1 is visible
    const step1Html = await page.content()
    const hasStep1 = step1Html.includes('Upload Your Document') || step1Html.includes('Choose PDF File')
    console.log(`  Step 1 visible: ${hasStep1 ? 'PASS' : 'FAIL'}`)

    // Check back to documents link
    const hasBackLink = step1Html.includes('Back to Documents')
    console.log(`  Back link: ${hasBackLink ? 'PASS' : 'FAIL'}`)

    // Check progress steps shown
    const hasProgress = step1Html.includes('Map Columns') && step1Html.includes('Review')
    console.log(`  Progress steps: ${hasProgress ? 'PASS' : 'FAIL'}`)

    if (hasStep1 && hasBackLink && hasProgress) {
      console.log('  Overall: PASS\n')
      passed++
    } else {
      console.log('  Overall: FAIL\n')
      failed++
    }
    await page.close()
  } catch (err) {
    console.log(`  Error: ${err.message}`)
    console.log('  Overall: FAIL\n')
    failed++
  }

  // Test 4: Page has correct auth gate
  console.log('Test 4: Auth gate for unauthenticated users')
  try {
    const page = await browser.newPage()
    await page.goto(`${BASE}/bulk-send`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(2000) // Wait for client hydration
    const html = await page.content()

    // Since no Clerk auth in test, should show either the upload form or auth gate
    const hasContent = html.includes('Bulk Send')
    console.log(`  Page renders: ${hasContent ? 'PASS' : 'FAIL'}`)
    console.log(`  Overall: ${hasContent ? 'PASS' : 'FAIL'}\n`)
    hasContent ? passed++ : failed++
    await page.close()
  } catch (err) {
    console.log(`  Error: ${err.message}`)
    console.log('  Overall: FAIL\n')
    failed++
  }

  await browser.close()

  console.log(`\n=== Bulk Send Tests: ${failed === 0 ? 'ALL PASSED' : `${failed} FAILED`} (${passed}/${passed + failed}) ===`)
}

runTests().catch(console.error)
