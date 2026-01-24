# DNS Setup Guide (Urdu/English)
## Email Spam Se Bachne Ke Liye Complete Guide

---

## 🎯 KYA KARNA HAI?

Aapko **3 cheezein** apni domain (mamasign.com) ki DNS settings mein add karni hain:
1. **SPF Record** - Batata hai ke Resend aapki taraf se email bhej sakta hai
2. **DMARC Record** - Security policy set karta hai
3. **DKIM Records** - Email ko digitally sign karta hai (Resend se milenge)

---

## STEP 1: APNI DNS PROVIDER PE JAO

**Pehle check karo** aapka domain kahan registered hai:

### Option 1: GoDaddy
1. https://godaddy.com pe login karo
2. "My Products" pe click karo
3. Domain ke sath "DNS" button pe click karo
4. "Manage DNS" pe click karo

### Option 2: Namecheap
1. https://namecheap.com pe login karo
2. "Domain List" pe click karo
3. "Manage" button pe click karo
4. "Advanced DNS" tab pe click karo

### Option 3: Cloudflare
1. https://cloudflare.com pe login karo
2. Apni website (mamasign.com) pe click karo
3. "DNS" tab pe click karo

### Option 4: Dusre Providers (HostGator, Bluehost, etc.)
1. Apne hosting control panel (cPanel) mein login karo
2. "Zone Editor" ya "DNS Management" dhundo
3. DNS settings kholo

---

## STEP 2: SPF RECORD ADD KARO

### GoDaddy Pe:

1. **"Add" button pe click karo**

2. **Yeh details bharo**:
   - Type: `TXT`
   - Name: `@` (ya khali chhor do)
   - Value: `v=spf1 include:_spf.resend.com ~all`
   - TTL: `1 Hour` (ya default)

3. **"Save" pe click karo**

### Namecheap Pe:

1. **"Add New Record" pe click karo**

2. **Yeh details bharo**:
   - Type: `TXT Record`
   - Host: `@`
   - Value: `v=spf1 include:_spf.resend.com ~all`
   - TTL: `Automatic`

3. **Green checkmark pe click karo (Save)**

### Cloudflare Pe:

1. **"Add Record" pe click karo**

2. **Yeh details bharo**:
   - Type: `TXT`
   - Name: `@`
   - Content: `v=spf1 include:_spf.resend.com ~all`
   - TTL: `Auto`
   - Proxy status: `DNS Only` (gray cloud)

3. **"Save" pe click karo**

### ⚠️ IMPORTANT NOTES:
- **Value** ko EXACTLY copy karo: `v=spf1 include:_spf.resend.com ~all`
- Koi space extra mat dalo
- Spelling mistake nahi honi chahiye
- Agar pehle se SPF record hai, toh use update karo (delete nahi karo)

---

## STEP 3: DMARC RECORD ADD KARO

### Har Provider Ke Liye (Same Process):

1. **"Add Record" ya "Add New Record" pe click karo**

2. **Yeh details bharo**:
   - Type: `TXT`
   - Name: `_dmarc` (underscore zaruri hai!)
   - Value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@mamasign.com; pct=100`
   - TTL: `3600` ya `Auto` ya `1 Hour`

3. **Save karo**

### ⚠️ CRITICAL:
- **Name** mein `_dmarc` exactly likh do (underscore ke sath)
- `@` ya `mamasign.com` mat likho
- Sirf `_dmarc` likho

---

## STEP 4: CHECK KARO - DNS SAHI ADD HUA YA NAHI

### Method 1: MXToolbox Use Karo (EASIEST)

1. **SPF Check**:
   - https://mxtoolbox.com/spf.aspx pe jao
   - "mamasign.com" type karo
   - "SPF Record Lookup" pe click karo
   - Result mein dikhna chahiye: `v=spf1 include:_spf.resend.com ~all`

2. **DMARC Check**:
   - https://mxtoolbox.com/dmarc.aspx pe jao
   - "mamasign.com" type karo
   - "DMARC Lookup" pe click karo
   - Result mein dikhna chahiye: `v=DMARC1; p=quarantine...`

### Method 2: WhatsMyDNS Use Karo

1. https://whatsmydns.net pe jao
2. "TXT" select karo dropdown se
3. "mamasign.com" enter karo
4. "Search" pe click karo
5. Multiple locations mein green ticks dikhnay chahiye

### Agar Nahi Dikha?

**Wait karo 2-6 hours** - DNS propagation mein time lagta hai

**Phir bhi nahi dikha?**:
- DNS records dobara check karo
- Name/Value sahi hai ya nahi dekho
- DNS provider ka support contact karo

---

## STEP 5: RESEND SETUP (DKIM RECORDS)

### 5.1: Resend Account Mein Login Karo

1. https://resend.com pe jao
2. Login karo apne account se
3. Dashboard khulega

### 5.2: Domain Add Karo

1. **Left menu se "Domains" pe click karo**
   Ya direct: https://resend.com/domains

2. **"Add Domain" button pe click karo**

3. **Domain name enter karo**: `mamasign.com`
   - `www` mat lagao
   - `https://` mat lagao
   - Sirf `mamasign.com` likho

4. **"Add" pe click karo**

### 5.3: DKIM Records Copy Karo

Domain add karne ke baad, Resend aapko **3 records** dikhayega:

**Screenshot dekh kar samjho** (ya neeche description):

```
Record 1:
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA... (bahut lamba string)

Record 2:
Type: TXT
Name: resend2._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA... (bahut lamba string)

Record 3:
Type: CNAME (ya TXT)
Name: resend
Value: feedback-smtp.resend.com
```

**⚠️ IMPORTANT**:
- Yeh example hai
- Aapko APNE actual values use karne hain
- Resend dashboard se EXACT copy karo
- Screenhot le lo taaki bhool na jao

### 5.4: DKIM Records DNS Mein Add Karo

**Har record ke liye repeat karo**:

1. **DNS provider pe jao** (jahan Step 2 aur 3 mein records add kiye the)

2. **"Add Record" pe click karo**

3. **Pehla DKIM Record add karo**:
   - Type: `TXT`
   - Name: `resend._domainkey` (Resend se copy karo)
   - Value: (Resend se COMPLETE value copy karo - bahut lamba hoga)
   - TTL: `3600` ya `Auto`
   - Save karo

4. **Doosra DKIM Record add karo**:
   - Type: `TXT`
   - Name: `resend2._domainkey`
   - Value: (Resend se copy karo)
   - TTL: `3600` ya `Auto`
   - Save karo

5. **Teesra Record add karo** (CNAME ya TXT):
   - Type: `CNAME` (ya jo Resend ne bataya)
   - Name: `resend`
   - Value: `feedback-smtp.resend.com`
   - TTL: `3600` ya `Auto`
   - Save karo

### 5.5: Resend Mein Domain Verify Karo

1. **2-6 hours wait karo** DNS propagation ke liye

2. **Resend dashboard pe wapas jao**: https://resend.com/domains

3. **"Verify" button pe click karo** mamasign.com ke sath

4. **Result dekho**:
   - ✅ **Green "Verified"** = SUCCESS! Sab sahi hai
   - ❌ **Red "Failed"** = Wait karo, ya DNS records dobara check karo
   - ⏳ **Yellow "Pending"** = Abhi bhi propagate ho raha hai

### Agar Verify Nahi Hua?

1. **24 hours tak wait karo** - kabhi kabhi DNS slow hota hai
2. **MXToolbox se check karo** - Records add hue ya nahi
3. **DNS records exactly match karte hain Resend se?** - Ek ek character check karo
4. **Resend support ko email karo**: support@resend.com

---

## STEP 6: TEST KARO - EMAIL SPAM MEIN JAYEGA YA INBOX MEIN?

### Test 1: Mail-Tester (SABSE IMPORTANT)

1. **https://mail-tester.com pe jao**

2. **Test email address copy karo** (jo page pe dikhega)
   Example: `test-abc123@mail-tester.com`

3. **Apni website se email bhejo**:
   - Sign in karo apni website pe
   - "Send Signing Invite" use karo
   - Recipient mein mail-tester ka email paste karo
   - Send karo

4. **Mail-tester pe wapas jao**

5. **"Then check your score" pe click karo**

6. **Score dekho**:
   - **10/10** = Perfect! 🎉
   - **8-9/10** = Excellent! Emails inbox mein jayengi ✅
   - **5-7/10** = Thik hai, but improve karo ⚠️
   - **Below 5** = Spam mein jayega, fix karo ❌

7. **Agar score kam hai**:
   - Report mein jo errors dikhe, unhe fix karo
   - Usually DNS records ka issue hota hai
   - Fix karke dobara test karo

### Test 2: Real Email Bhej Kar Test Karo

1. **Gmail pe bhejo**:
   - Apne Gmail account pe test email bhejo
   - Check karo - Inbox mein aya ya Spam mein?
   - Agar Spam mein gaya, toh "Not Spam" pe click karo

2. **Outlook pe bhejo**:
   - Outlook.com account pe email bhejo
   - Inbox check karo

3. **Dusre emails pe**:
   - Yahoo (if you have)
   - Custom domain emails
   - Check all

**Success = Sab inbox mein**

---

## COMMON PROBLEMS AUR SOLUTIONS

### Problem 1: "SPF record not found" (Mail-tester pe)

**Solution**:
- DNS mein SPF record add kiya tha?
- Check karo: https://mxtoolbox.com/spf.aspx
- Agar nahi dikha, wait karo 6-12 hours
- Dobara add karo agar galat tha

### Problem 2: "DKIM not configured"

**Solution**:
- Resend se DKIM records copy kiye?
- DNS mein add kiye?
- Verify kiya Resend mein?
- Wait karo DNS propagation ke liye

### Problem 3: "Domain not verified in Resend"

**Solution**:
- DNS records sahi add hue?
- 24-48 hours wait karo
- MXToolbox se manually check karo
- Resend support ko contact karo

### Problem 4: "Emails still going to spam"

**Solution**:
- Mail-tester score 8+ hai?
- DNS sab verify hai?
- Domain verified in Resend?
- Agar sab sahi hai, 1-2 weeks wait karo (domain warmup)
- Too many emails ek sath mat bhejo (warmup strategy follow karo)

---

## EMAIL WARMUP STRATEGY

### Kya Hai Warmup?

**Domain warmup** = Naye domain se dhire dhire emails bhejni shuru karo

**Kyun Zaruri Hai?**
- Naye domain se zyada emails = Automatic spam
- Dhire dhire bhejne se reputation build hoti hai
- Email providers ko trust hota hai

### Warmup Schedule

| Week | Maximum Emails Per Day | Total Per Week |
|------|----------------------|----------------|
| Week 1 | 50 emails/day | 350 emails |
| Week 2 | 100 emails/day | 700 emails |
| Week 3 | 250 emails/day | 1,750 emails |
| Week 4 | 500 emails/day | 3,500 emails |
| Month 2+ | 3000+ emails/day | Unlimited |

### Follow Kaise Kare?

1. **Week 1**: Maximum 50 emails daily bhejo
2. **Agar zyada users hain**: Queue mein rakho, next day bhejo
3. **Gradually increase** according to schedule
4. **Monitor** Resend dashboard daily

**Agar is rule ko skip karoge** = Emails spam mein jayengi guaranteed!

---

## CHECKLIST - SAB KUCH DONE HAI?

### DNS Records:
- [ ] SPF record added
- [ ] DMARC record added
- [ ] DKIM records added (from Resend)
- [ ] DNS propagation complete (checked on MXToolbox)

### Resend:
- [ ] Account created/logged in
- [ ] Domain added (mamasign.com)
- [ ] DKIM records copied
- [ ] Domain verified (green checkmark)
- [ ] API key in .env file

### Testing:
- [ ] Mail-tester score 8+
- [ ] Test email to Gmail - in inbox
- [ ] Test email to Outlook - in inbox
- [ ] All DNS records verified on MXToolbox

### Monitoring:
- [ ] Resend dashboard checked
- [ ] Delivery rate >95%
- [ ] Bounce rate <5%
- [ ] Following warmup strategy

**Jab sab [ ] checked ho jayenge ✅, aapki emails KABHI spam mein nahi jayengi!**

---

## HELP CHAHIYE?

### Video Tutorials (YouTube):

Search karo YouTube pe:
- "How to add SPF record GoDaddy"
- "How to add DKIM record Namecheap"
- "Resend domain verification tutorial"

### Support Contacts:

**Resend Support**:
- Email: support@resend.com
- Reply time: 24-48 hours

**DNS Provider Support**:
- GoDaddy: Chat support available
- Namecheap: Ticket system
- Cloudflare: Community forum + support

### Tools:

- **MXToolbox**: https://mxtoolbox.com (DNS check karne ke liye)
- **Mail-tester**: https://mail-tester.com (spam score check)
- **WhatMyDNS**: https://whatsmydns.net (propagation check)

---

## SUMMARY - QUICK STEPS

1. ✅ **Code fix** (already done by me)
2. ⏳ **DNS mein SPF add karo** (5 minutes)
3. ⏳ **DNS mein DMARC add karo** (5 minutes)
4. ⏳ **Resend mein domain add karo** (2 minutes)
5. ⏳ **DKIM records copy karo** (2 minutes)
6. ⏳ **DNS mein DKIM add karo** (10 minutes)
7. ⏳ **Wait 2-24 hours** (DNS propagation)
8. ⏳ **Resend mein verify karo** (1 minute)
9. ⏳ **Mail-tester pe test karo** (5 minutes)
10. ✅ **Done! Emails inbox mein jayengi**

**Total Time**: 30 minutes work + 24 hours wait

---

## IMPORTANT NOTES

1. **Sabr rakho** - DNS propagation mein time lagta hai (2-48 hours)
2. **Exactly copy karo** - DNS records mein ek bhi galti = fail
3. **Don't panic** - Agar pehli baar mein nahi hua, dobara try karo
4. **Test karo** - Mail-tester pe test zarur karo
5. **Warmup follow karo** - Pehle week 50 emails se zyada mat bhejo

**Yeh setup ek baar sahi karo, phir zindagi bhar kaam karega!**

---

**Next Month (UK Company Registration)**:
- Sirf address change karna hai code mein
- DNS records same rahenge
- Email continue working karega

**Any Questions?**
- Read: `EMAIL_COMPLETE_SETUP_GUIDE.md` (detailed English guide)
- Or contact Resend support

**Good Luck! 🚀**
