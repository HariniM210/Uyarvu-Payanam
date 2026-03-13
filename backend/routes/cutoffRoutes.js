const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
let puppeteer = null;
try {
    puppeteer = require("puppeteer");
} catch (err) {
    console.warn("puppeteer not found; dynamic site scraping fallback disabled. Install puppeteer for full capability.");
}
const Cutoff = require("../models/Cutoff");

// robust scraper: cheerio fallback then puppeteer for JS-rendered data
async function scrapeTneaOnline(year) {
    const url = "https://tnea.kanna.in/search";

    // 1) quick static HTML parse
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                Accept: "text/html",
            },
            timeout: 45000,
        });
        const $ = cheerio.load(response.data);

        const headerMap = {};
        $("table thead th").each((index, th) => {
            const key = $(th).text().trim().toLowerCase();
            headerMap[key] = index;
        });

        const rows = [];
        $("table tbody tr").each((_, tr) => {
            const cols = $(tr).find("td");
            if (cols.length < 8) return;

            const getByLabel = (label, fallbackIndex) => {
                const normalized = label.trim().toLowerCase();
                const idx = headerMap[normalized];
                if (typeof idx !== 'undefined' && idx < cols.length) {
                    return $(cols[idx]).text().trim();
                }
                return $(cols[fallbackIndex] || cols[0]).text().trim();
            };

            const collegeCode = getByLabel('college code', 0);
            const collegeName = getByLabel('college name', 1);
            const department = getByLabel('department', 2);
            const oc = parseFloat(getByLabel('oc cutoff', 3)) || 0;
            const bc = parseFloat(getByLabel('bc cutoff', 4)) || 0;
            const mbc = parseFloat(getByLabel('mbc cutoff', 5)) || 0;
            const sc = parseFloat(getByLabel('sc cutoff', 6)) || 0;
            const st = parseFloat(getByLabel('st cutoff', 7)) || 0;

            if (!collegeCode || !collegeName || !department) return;

            rows.push({
                collegeCode,
                collegeName,
                department,
                year,
                oc,
                bc,
                mbc,
                sc,
                st,
                source: "tnea",
            });
        });

        if (rows.length > 0) {
            return rows;
        }

    } catch (error) {
        console.warn("Cheerio scrape attempt failed, falling back to Puppeteer", error.message);
    }

    // 2) Puppeteer fallback for JS-rendered table
    if (!puppeteer) {
        throw new Error("No rows found while scraping with cheerio, and puppeteer is not installed.");
    }

    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    try {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });

        await page.waitForSelector("table tbody tr", { timeout: 60000 });
        const scrapedRows = await page.evaluate((yearArg) => {
            const rows = [];
            const headerMap = {};
            document.querySelectorAll("table thead th").forEach((th, index) => {
                headerMap[th.innerText.trim().toLowerCase()] = index;
            });

            const getByLabel = (cols, label, fallbackIndex) => {
                const idx = headerMap[label.trim().toLowerCase()];
                if (typeof idx !== 'undefined' && cols[idx]) {
                    return cols[idx].innerText.trim();
                }
                return cols[fallbackIndex] ? cols[fallbackIndex].innerText.trim() : '';
            };

            document.querySelectorAll("table tbody tr").forEach((tr) => {
                const cols = tr.querySelectorAll("td");
                if (cols.length < 8) return;
                const collegeCode = getByLabel(cols, 'college code', 0);
                const collegeName = getByLabel(cols, 'college name', 1);
                const department = getByLabel(cols, 'department', 2);
                const oc = Number(getByLabel(cols, 'oc cutoff', 3)) || 0;
                const bc = Number(getByLabel(cols, 'bc cutoff', 4)) || 0;
                const mbc = Number(getByLabel(cols, 'mbc cutoff', 5)) || 0;
                const sc = Number(getByLabel(cols, 'sc cutoff', 6)) || 0;
                const st = Number(getByLabel(cols, 'st cutoff', 7)) || 0;

                if (!collegeCode || !collegeName || !department) return;
                rows.push({
                    collegeCode,
                    collegeName,
                    department,
                    year: yearArg,
                    oc,
                    bc,
                    mbc,
                    sc,
                    st,
                    source: "tnea",
                });
            });
            return rows;
        }, year);

        if (Array.isArray(scrapedRows) && scrapedRows.length > 0) {
            return scrapedRows;
        }

        throw new Error("No rows found while scraping. Data may be JS-rendered or source table format changed.");
    } finally {
        await browser.close();
    }
}

// GET /api/cutoff - paginate, search, filter by department and year
router.get("/", async (req, res) => {
    try {
const { year, q = "", department = "", page = 1, limit = 20, largeLimit } = req.query;

        const pageNum = Number(page);

        const filter = {};
        if (year) filter.year = Number(year);
        if (q) filter.collegeName = { $regex: q, $options: "i" };
        if (department) filter.department = department;

        const totalRows = await Cutoff.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(totalRows / Number(limit)));

        // Allow large limits for admin panel (up to 50k records)
        const effectiveLimit = largeLimit === 'true' ? Math.min(Number(limit) || 10000, 50000) : Number(limit);
        const skipAmount = largeLimit === 'true' ? 0 : (Number(page) - 1) * effectiveLimit;

        const cutoffs = await Cutoff.find(filter)
            .sort({ year: -1, collegeName: 1 })
            .skip(skipAmount)
            .limit(effectiveLimit);

        res.json({ 
            data: cutoffs,
            total: totalRows,
            page: Number(page),
            limit: effectiveLimit
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/import-tnea?year=2024
router.get("/import-tnea", async (req, res) => {
    try {
        const year = Number(req.query.year || 2024);

        const existing = await Cutoff.find({ year });
        if (existing.length > 0) {
            return res.json({ source: "db", message: "Already loaded (no re-scrape)", data: existing });
        }

        const rows = await scrapeTneaOnline(year);
        if (!rows || !rows.length) {
            return res.status(404).json({ message: "No rows found while scraping for year " + year });
        }

        const cutoffDocs = rows.map(item => ({
            collegeCode: item.collegeCode,
            collegeName: item.collegeName,
            department: item.department,
            year: item.year,
            oc: item.oc,
            bc: item.bc,
            mbc: item.mbc,
            sc: item.sc,
            st: item.st,
            source: item.source || 'tnea',
        }));

        await Cutoff.insertMany(cutoffDocs);

        const saved = await Cutoff.find({ year });
        res.json({ source: "scrape", message: `Imported ${saved.length} rows`, data: saved });
    } catch (err) {
        console.error("Import error", err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/cutoff/import
// body: { year: 2024 }
router.post("/import", async (req, res) => {
    try {
        const year = Number(req.body.year || req.query.year || 2024);

        // Always clear previous year data as requested (clean old incorrect rows)
        await Cutoff.deleteMany({ year });

        const rows = await scrapeTneaOnline(year);
        if (!rows || !rows.length) {
            return res.status(404).json({ message: "No rows found while scraping for year " + year });
        }

        // correct field mapping according to request
        const cutoffDocs = rows.map(item => ({
            collegeCode: item.collegeCode,
            collegeName: item.collegeName,
            department: item.department,
            year: item.year,
            oc: item.oc,
            bc: item.bc,
            mbc: item.mbc,
            sc: item.sc,
            st: item.st,
            source: item.source || 'tnea',
        }));

        await Cutoff.insertMany(cutoffDocs);

        const saved = await Cutoff.find({ year });
        res.json({ source: "scrape", message: `Imported ${saved.length} rows`, count: saved.length, data: saved });
    } catch (err) {
        console.error("Import error", err);
        res.status(500).json({ error: err.message });
    }
});

// Create a new cutoff
router.post("/", async (req, res) => {
    try {
        const newCutoff = new Cutoff(req.body);
        const savedCutoff = await newCutoff.save();
        res.status(201).json(savedCutoff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an existing cutoff
router.put("/:id", async (req, res) => {
    try {
        const updatedCutoff = await Cutoff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCutoff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a cutoff
router.delete("/:id", async (req, res) => {
    try {
        await Cutoff.findByIdAndDelete(req.params.id);
        res.json({ message: "Cutoff deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

