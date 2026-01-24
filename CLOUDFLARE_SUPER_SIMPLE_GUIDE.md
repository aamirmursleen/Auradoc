# Cloudflare DNS Setup - 10 Minute Guide
## Copy-Paste Only, No Thinking Required!

---

## 🎯 GOAL: 5 Records Add Karne Hain

Time: 10 minutes
Difficulty: Copy-paste only

---

## STEP 1: LOGIN (2 mins)

1. Open: https://dash.cloudflare.com
2. Login karo
3. Click: mamasign.com
4. Click: DNS tab (left side)

---

## STEP 2: SPF RECORD (2 mins)

**Click: "Add record" button (blue, top right)**

```
Copy these 5 things exactly:

1. Type dropdown: TXT
2. Name box: @
3. Content box: v=spf1 include:_spf.resend.com ~all
4. TTL dropdown: Auto
5. Proxy: Click kar ke GRAY cloud banao (orange nahi)
```

**Click: Save**

DONE! ✅

---

## STEP 3: DMARC RECORD - DELETE OLD + ADD NEW (3 mins)

**First - Delete existing DMARC:**

1. DNS records mein scroll karo
2. "_dmarc" naam ka record dhundo
3. Edit/Delete icon pe click karo
4. Delete karo (2 DMARC records honge, dono delete karo)

**Now - Add new DMARC:**

**Click: "Add record" button**

```
Copy these exactly:

1. Type: TXT
2. Name: _dmarc
3. Content: v=DMARC1; p=quarantine; rua=mailto:dmarc@mamasign.com; pct=100
4. TTL: Auto
5. Proxy: GRAY cloud
```

**Click: Save**

DONE! ✅

---

## STEP 4: RESEND SETUP (3 mins)

**New tab mein:**

1. Open: https://resend.com/login
2. Login (ya signup if new)
3. Click: Domains (left menu)
4. Click: Add Domain button
5. Type: mamasign.com
6. Click: Add

**Resend will show you 2 records like this:**

```
Record 1:
Name: resend._domainkey.mamasign.com
Value: p=MIGfMA0GCS... (very long string)

Record 2:
Name: resend2._domainkey.mamasign.com
Value: p=MIGfMA0GCS... (very long string)
```

**KEEP THIS PAGE OPEN!**

---

## STEP 5: ADD DKIM RECORD 1 (2 mins)

**Back to Cloudflare DNS tab:**

**Click: "Add record"**

**Copy from Resend:**

```
1. Type: TXT

2. Name: resend._domainkey
   (Important: DON'T copy ".mamasign.com" part, just "resend._domainkey")

3. Content: [Copy FULL value from Resend - the p=MIG... string]
   (Select all, Ctrl+C, paste here)

4. TTL: Auto

5. Proxy: GRAY cloud
```

**Click: Save**

DONE! ✅

---

## STEP 6: ADD DKIM RECORD 2 (2 mins)

**Click: "Add record" again**

```
1. Type: TXT

2. Name: resend2._domainkey

3. Content: [Copy SECOND value from Resend]

4. TTL: Auto

5. Proxy: GRAY cloud
```

**Click: Save**

DONE! ✅

---

## ✅ VERIFICATION

**In Cloudflare DNS, you should now see 5 NEW records:**

1. TXT | @ | v=spf1 include:_spf.resend.com ~all
2. TXT | _dmarc | v=DMARC1; p=quarantine...
3. TXT | resend._domainkey | p=MIGfMA...
4. TXT | resend2._domainkey | p=MIGfMA...

**See all 5?** PERFECT! ✅

---

## WHAT'S NEXT?

**Today**: Done! Close everything.

**Tomorrow (after 24 hours)**:
1. Go to: https://resend.com/domains
2. Click: "Verify" next to mamasign.com
3. Should turn GREEN ✅

**Test**:
1. Go to: https://mail-tester.com
2. Send test email
3. Score should be 8+/10

**Then**: Emails will go to inbox! 🎉

---

## SUMMARY

Total time: 10 minutes
Total records: 5
Total cost: $0
Result: Inbox delivery forever ✅

---

## IF YOU GET STUCK

**Screenshot le lo**
Mujhe bhej do
Main bataunga kya galat hai

---

**YEH GUIDE PRINT KAR LO**
**FOLLOW KARO STEP BY STEP**
**10 MINUTES MEIN DONE!**
