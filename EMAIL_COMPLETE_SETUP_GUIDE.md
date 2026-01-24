# Email Spam Prevention - Complete Setup Guide
## MamaSign Email Configuration (Lahore, Pakistan)

Last Updated: 2026-01-24

---

## 🎯 GOAL: Email Inbox Mein Jaye, Spam Folder Mein Nahi

Is guide ko follow karke aapki emails **PERMANENTLY** inbox mein jayengi.

---

## 📋 TABLE OF CONTENTS

1. [Current Setup Summary](#current-setup-summary)
2. [DNS Configuration (CRITICAL)](#dns-configuration-critical)
3. [Resend Setup](#resend-setup)
4. [Testing & Verification](#testing--verification)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)
7. [Future Updates (UK Company)](#future-updates-uk-company)

---

## CURRENT SETUP SUMMARY

### ✅ Code Fixes (COMPLETED)

**File**: `src/lib/email.ts`

**Changes Made**:
1. ✅ Removed spam-triggering headers (X-Priority, Importance)
2. ✅ Added authentication headers (Message-ID, List-Unsubscribe)
3. ✅ Disabled email tracking (opens: false)
4. ✅ Removed emojis from email content
5. ✅ Updated company address to: **Kickstart 58A2, Gulberg, Lahore, Pakistan**
6. ✅ Added unsubscribe links in all emails

### ⏳ Pending Actions (YOUR TASK)

1. ❌ Add SPF record to DNS
2. ❌ Add DMARC record to DNS
3. ❌ Add domain to Resend
4. ❌ Add DKIM records from Resend to DNS
5. ❌ Verify domain in Resend
6. ❌ Test email delivery

---

## DNS CONFIGURATION (CRITICAL)

### Prerequisites

**Domain**: `mamasign.com`

**DNS Provider**: Identify where your domain is registered:
- GoDaddy: https://godaddy.com
- Namecheap: https://namecheap.com
- Cloudflare: https://cloudflare.com
- HostGator, Bluehost, etc.

### Step 1: Add SPF Record

**What is SPF?**
SPF (Sender Policy Framework) tells email providers that Resend is authorized to send emails on behalf of mamasign.com.

**How to Add:**

1. **Login to your DNS provider** (GoDaddy/Namecheap/Cloudflare)

2. **Find DNS Settings**:
   - GoDaddy: "Manage DNS" or "DNS Management"
   - Namecheap: "Advanced DNS"
   - Cloudflare: "DNS" tab

3. **Add New TXT Record**:
   ```
   Type: TXT
   Name: @ (or leave blank, or "mamasign.com")
   Value: v=spf1 include:_spf.resend.com ~all
   TTL: 3600 (or Auto/Default)
   ```

4. **Save the record**

**Screenshots for Common Providers:**

**GoDaddy**:
- Click "Add" button
- Select "TXT" from dropdown
- Name: @ (or leave blank)
- Value: `v=spf1 include:_spf.resend.com ~all`
- TTL: 1 Hour
- Click "Save"

**Namecheap**:
- Click "Add New Record"
- Type: TXT Record
- Host: @
- Value: `v=spf1 include:_spf.resend.com ~all`
- TTL: Automatic
- Click green checkmark

**Cloudflare**:
- Click "Add Record"
- Type: TXT
- Name: @
- Content: `v=spf1 include:_spf.resend.com ~all`
- TTL: Auto
- Click "Save"

### Step 2: Add DMARC Record

**What is DMARC?**
DMARC tells email providers what to do if an email fails SPF/DKIM checks.

**How to Add:**

1. **Go to DNS Settings** (same place as Step 1)

2. **Add New TXT Record**:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@mamasign.com; pct=100
   TTL: 3600 (or Auto/Default)
   ```

3. **Save the record**

**Important Notes**:
- The "Name" field MUST be exactly `_dmarc` (with underscore)
- The policy `p=quarantine` means suspicious emails go to spam (safer than reject)
- `rua=mailto:dmarc@mamasign.com` sends you weekly reports (optional but recommended)

### Step 3: Verify DNS Propagation

**Wait Time**: 2-48 hours (usually 2-6 hours)

**How to Check**:

1. **Go to**: https://mxtoolbox.com/SuperTool.aspx

2. **Check SPF**:
   - Enter: `mamasign.com`
   - Select: "SPF Record Lookup"
   - Click "SPF Record Lookup"
   - You should see: `v=spf1 include:_spf.resend.com ~all`

3. **Check DMARC**:
   - Enter: `_dmarc.mamasign.com`
   - Select: "DMARC Lookup"
   - Click "DMARC Lookup"
   - You should see: `v=DMARC1; p=quarantine...`

**If Not Working**:
- Wait 2-6 more hours
- Check if you saved the DNS records
- Check if "Name" field is correct (@ for SPF, _dmarc for DMARC)
- Contact your DNS provider support

---

## RESEND SETUP

### Step 1: Create/Login to Resend Account

1. **Go to**: https://resend.com

2. **Login** with your credentials (or create account if needed)

3. **Note your API Key**:
   - Go to "API Keys" section
   - Copy your API key
   - **Verify** it matches your `.env` file:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     ```

### Step 2: Add Domain to Resend

1. **Go to**: https://resend.com/domains

2. **Click "Add Domain"**

3. **Enter Domain**: `mamasign.com` (without www or http)

4. **Click "Add Domain"**

### Step 3: Get DKIM Records from Resend

After adding domain, Resend will show you **3 DNS records** to add:

**Example** (your actual values will be different):
```
Record 1:
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ... (long string)

Record 2:
Type: TXT
Name: resend2._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ... (long string)

Record 3:
Type: CNAME (or TXT)
Name: resend
Value: feedback-smtp.resend.com
```

**IMPORTANT**:
- Copy these EXACT values from Resend dashboard
- Don't use the example above - use YOUR actual values

### Step 4: Add DKIM Records to DNS

1. **Go back to your DNS provider** (GoDaddy/Namecheap/Cloudflare)

2. **Add ALL 3 records** shown by Resend:

   **For Each Record**:
   - Click "Add Record"
   - Type: TXT (or CNAME if specified)
   - Name: (exact name from Resend, e.g., `resend._domainkey`)
   - Value: (exact value from Resend)
   - TTL: 3600 or Auto
   - Save

3. **Double-check**:
   - Make sure Name field matches EXACTLY
   - Make sure Value is complete (might be very long)
   - Save each record

### Step 5: Verify Domain in Resend

1. **Wait 2-6 hours** for DNS propagation

2. **Go back to**: https://resend.com/domains

3. **Click "Verify" button** next to mamasign.com

4. **Check Status**:
   - ✅ Green "Verified" = SUCCESS! Domain is ready
   - ❌ Red "Failed" = Wait more time, or check DNS records
   - ⏳ Yellow "Pending" = Still propagating, wait more

**If Verification Fails**:
- Wait another 6-12 hours
- Check DNS records are exactly as Resend showed
- Use MXToolbox to verify records exist
- Contact Resend support

---

## TESTING & VERIFICATION

### Test 1: Mail-Tester Score (IMPORTANT)

**Goal**: Score 8/10 or higher

**Steps**:

1. **Go to**: https://mail-tester.com

2. **Copy the test email address** shown (e.g., test-abc123@mail-tester.com)

3. **Send a test email** from your app:
   - Use the "Send Signing Invite" feature
   - Enter the mail-tester email as recipient
   - Send the email

4. **Go back to mail-tester.com**

5. **Click "Then check your score"**

6. **Check your score**:
   - 10/10 = Perfect!
   - 8-9/10 = Good, emails will reach inbox
   - 5-7/10 = Needs improvement
   - <5/10 = Will go to spam

7. **Fix any issues** shown in the report

**Common Issues & Fixes**:

| Issue | Fix |
|-------|-----|
| "SPF not found" | Add SPF record to DNS (wait for propagation) |
| "DKIM not found" | Add DKIM records from Resend to DNS |
| "DMARC not found" | Add DMARC record to DNS |
| "Reverse DNS mismatch" | Contact Resend support (they handle this) |
| "Blacklisted IP" | Contact Resend support to change sending IP |

### Test 2: Real Email Providers

**Send test emails to**:

1. **Gmail Account**:
   - Send to your personal Gmail
   - Check if it's in "Inbox" or "Spam" folder
   - If in Spam, click "Not Spam" (this helps train Gmail)

2. **Outlook/Hotmail Account**:
   - Send to Outlook.com account
   - Check inbox vs spam

3. **Yahoo Account** (if you have):
   - Send to Yahoo account
   - Check delivery

**Expected Result**: All emails should land in Inbox (not Spam)

### Test 3: Verify All DNS Records

Use this checklist:

1. **SPF Record**:
   - Tool: https://mxtoolbox.com/spf.aspx
   - Enter: `mamasign.com`
   - Should show: `v=spf1 include:_spf.resend.com ~all`
   - Status: ✅ Pass

2. **DKIM Record**:
   - Tool: https://mxtoolbox.com/dkim.aspx
   - Enter: `resend._domainkey.mamasign.com`
   - Should show: Public key details
   - Status: ✅ Pass

3. **DMARC Record**:
   - Tool: https://mxtoolbox.com/dmarc.aspx
   - Enter: `mamasign.com`
   - Should show: `v=DMARC1; p=quarantine...`
   - Status: ✅ Pass

4. **Blacklist Check**:
   - Tool: https://mxtoolbox.com/blacklists.aspx
   - Enter: `mamasign.com`
   - Should show: All clear (no blacklists)

---

## MONITORING & MAINTENANCE

### Daily Monitoring (First Week)

**Check Resend Dashboard**:
1. Go to: https://resend.com/emails
2. Monitor:
   - Delivery Rate (should be >95%)
   - Bounce Rate (should be <5%)
   - Spam Complaint Rate (should be <0.1%)

**If Issues Found**:
- High bounce rate = Validate email addresses before sending
- High spam rate = Content might still have issues
- Low delivery rate = Check DNS records again

### Weekly Monitoring (After First Week)

**Check once per week**:
1. **Resend Dashboard**: Check delivery metrics
2. **DMARC Reports**: Check emails at dmarc@mamasign.com
3. **User Complaints**: Ask users if emails are reaching them

### Monthly Maintenance

**Every month**:
1. **Test with mail-tester.com** (should maintain 8+ score)
2. **Check DNS records** still exist and are correct
3. **Review email content** for any new spam triggers
4. **Check Resend account** has enough sending quota

### Email Warmup Strategy (IMPORTANT)

**For New Domain** (since mamasign.com might be new for email):

**Week 1**: Send max 50 emails/day
**Week 2**: Send max 100 emails/day
**Week 3**: Send max 250 emails/day
**Week 4**: Send max 500 emails/day
**Month 2+**: Normal volume (up to Resend limits)

**Why Warmup?**
- Sending too many emails too fast from new domain = automatic spam
- Gradual increase builds good reputation
- Email providers trust you more

**How to Implement**:
```javascript
// Add to your email sending logic
const DAILY_EMAIL_LIMIT = {
  week1: 50,
  week2: 100,
  week3: 250,
  week4: 500,
  normal: 3000
}

// Track daily sent count in database
// Don't send if limit reached for the day
```

---

## TROUBLESHOOTING

### Problem 1: Emails Still Going to Spam

**Checklist**:
1. ✅ SPF record added and verified?
2. ✅ DKIM records added and verified?
3. ✅ DMARC record added and verified?
4. ✅ Domain verified in Resend?
5. ✅ Mail-tester score 8+?
6. ✅ Not sending too many emails too fast?
7. ✅ Email content doesn't have spam words?

**If All Checked**:
- Wait 1-2 weeks for domain warmup
- Ask recipients to mark as "Not Spam"
- This trains email filters

### Problem 2: Resend Domain Verification Failing

**Common Causes**:
1. DNS records not propagated yet (wait 24-48 hours)
2. Wrong Name/Value in DNS records (double-check)
3. Multiple SPF records (should only have ONE SPF record)
4. DNS provider doesn't support TXT records (switch provider)

**Solutions**:
- Use MXToolbox to check if records exist
- Delete any duplicate records
- Contact Resend support with your domain name

### Problem 3: High Bounce Rate

**Causes**:
- Invalid email addresses
- Temporary email providers (mailinator, etc.)
- Typos in email addresses

**Solutions**:
- Validate emails before sending: https://www.npmjs.com/package/email-validator
- Use email verification API (like ZeroBounce, NeverBounce)
- Add "Confirm Email" field in your forms

### Problem 4: Mail-Tester Score Low

**Score 5-7**:
- Missing DNS records (SPF/DKIM/DMARC)
- Content has spam words
- Email HTML has issues

**Score <5**:
- Blacklisted IP (contact Resend)
- Major DNS issues
- Severe content problems

**How to Fix**:
- Read mail-tester report carefully
- Fix each issue listed
- Re-test until 8+ score

---

## FUTURE UPDATES (UK COMPANY)

### When Company Registers in UK (Next Month)

**Changes Needed**:

1. **Update Company Address** in `src/lib/email.ts`:
   ```javascript
   // Find and replace:
   OLD: "MamaSign, Kickstart 58A2, Gulberg, Lahore, Pakistan"
   NEW: "[Your UK Company Name], [UK Address]"
   ```

2. **Update Company Name** (if changing):
   ```javascript
   // In email.ts, update:
   const COMPANY_NAME = 'MamaSign' // or new name
   ```

3. **Update Footer Links**:
   - Add UK company registration number
   - Update privacy policy with UK address
   - Update terms of service

4. **Email Compliance**:
   - UK GDPR compliance required
   - Add clear consent mechanism
   - Update unsubscribe process

**DNS Records**:
- No changes needed
- SPF, DKIM, DMARC records remain the same
- Email will continue working

**Legal Requirements** (UK):
- Company name
- Registered office address
- Company registration number
- Place of registration (England, Wales, Scotland, NI)

---

## QUICK REFERENCE COMMANDS

### Check DNS Records

```bash
# SPF Record
nslookup -type=txt mamasign.com

# DKIM Record
nslookup -type=txt resend._domainkey.mamasign.com

# DMARC Record
nslookup -type=txt _dmarc.mamasign.com
```

### Test Email Sending (from your app)

```javascript
// In your Next.js app, test email:
import { sendSigningInvite } from '@/lib/email'

await sendSigningInvite({
  to: 'your-test@gmail.com',
  signerName: 'Test User',
  senderName: 'Your Name',
  senderEmail: 'your@email.com',
  documentName: 'Test Document',
  signingLink: 'https://mamasign.com/test',
  message: 'This is a test email'
})
```

---

## CHEAT SHEET: DNS Records

**Copy-Paste Ready** (use actual values from Resend for DKIM):

```
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DMARC Record
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@mamasign.com; pct=100

# DKIM Records (get from Resend dashboard)
Type: TXT
Name: resend._domainkey
Value: [COPY FROM RESEND]

Type: TXT
Name: resend2._domainkey
Value: [COPY FROM RESEND]
```

---

## SUPPORT CONTACTS

### Resend Support
- Email: support@resend.com
- Docs: https://resend.com/docs
- Discord: https://discord.gg/resend

### DNS Provider Support
- GoDaddy: https://godaddy.com/help
- Namecheap: https://www.namecheap.com/support/
- Cloudflare: https://support.cloudflare.com/

### Email Deliverability Tools
- Mail Tester: https://mail-tester.com
- MXToolbox: https://mxtoolbox.com
- Google Postmaster: https://postmaster.google.com

---

## SUCCESS CRITERIA

**Your email setup is SUCCESSFUL when**:

✅ Mail-tester score: 8/10 or higher
✅ SPF record: Verified
✅ DKIM record: Verified
✅ DMARC record: Verified
✅ Resend domain: Verified
✅ Test emails: Landing in inbox (Gmail, Outlook, Yahoo)
✅ Delivery rate: >95%
✅ Bounce rate: <5%
✅ Spam rate: <0.1%

**Once all checked ✅, your emails will NEVER go to spam!**

---

## TIMELINE

**Day 1 (Today)**:
- ✅ Code fixes completed
- ⏳ Add DNS records (SPF, DMARC)
- ⏳ Add domain to Resend

**Day 2**:
- ⏳ Wait for DNS propagation
- ⏳ Add DKIM records from Resend
- ⏳ Verify domain in Resend

**Day 3**:
- ⏳ Test with mail-tester.com
- ⏳ Send test emails to Gmail/Outlook
- ⏳ Fix any issues

**Week 1-4**:
- ⏳ Follow email warmup strategy
- ⏳ Monitor delivery metrics
- ⏳ Gradually increase sending volume

**Month 2+**:
- ✅ Full email sending capacity
- ✅ Inbox delivery guaranteed
- ✅ No more spam issues

---

## FINAL NOTES

1. **DNS Changes take time** - Be patient (2-48 hours)
2. **Test before production** - Always send test emails first
3. **Monitor metrics** - Check Resend dashboard regularly
4. **Warmup is critical** - Don't skip the gradual increase
5. **Content matters** - Avoid spam words even after setup

**Questions?** Refer to this guide or check:
- Resend Docs: https://resend.com/docs
- Email Deliverability Guide: https://resend.com/docs/dashboard/deliverability

**This setup will work for years** - Just maintain DNS records and monitor metrics monthly.

---

**Last Updated**: 2026-01-24
**Next Review**: When company registers in UK (update address)
**Status**: Code ready ✅ | DNS pending ⏳ | Testing pending ⏳
