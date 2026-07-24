## How it works for your 10-20 images/day need:

    It auto-translates your slug into a storyline — Resend-is-now... → adds "secret scanning detecting exposed API key, email envelope protection, shield dome" to the prompt, OpenAI-HF-... → giant brain over server city.
    Locked to your palette — terracotta/rust, warm brown, golden amber, cream, deep chocolate. No big text, negative space for your blog headline.
    Exact 1920×1280 WebP output, 92 quality.

Setup (30 seconds):

Output goes to ./heroes/resend-is-now-a-githubs-secret-scanning-partner_1920x1280.webp

Cost: With FLUX Schnell on Replicate it's ∼$0.003 per image, so 20/day = ∼$1.80/month. Together AI has a free tier that would cover you completely.

## M5 Local Section:

Why this will work great on M5 16GB:

I made 2 modes because 16GB unified memory is tight for the biggest models:

1. Fast mode (recommended to start) - SDXL Turbo:

    ∼8-12 sec per image on M5
    Generates at 1280×832 then upscales to your exact 1920×1280 WebP (saves RAM, same quality for blog)
    Fully offline, no API

2. Quality mode - FLUX Schnell:

    Matches what we just made (that epic brain/city look)
    ∼25-35 sec per image on M5, uses CPU offload trick for 16GB
    Best quality for your warm palette

Install & Run on your Mac:
# 1. Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements_local_m5.txt

# 2. Single hero
python aishowcase_hero_local_m5.py --title "Resend-is-now-a-githubs-secret-scanning-partner" --model sdxl-turbo

# 3. Batch 10-20 images per day
echo "Resend-is-now-a-githubs-secret-scanning-partner
OpenAI-HF-investigate-autonomous-AI-hack
New-Vibe-Coding-Tool-Launches" > titles.txt

python aishowcase_hero_local_m5.py --batch titles.txt --model sdxl-turbo --output ./heroes

# For 10-20 images/day you'll be totally fine locally — no cost, no watermark, and it keeps your exact warm terracotta/brown/amber scheme we designed.


    Text box for your slug (e.g. Resend-is-now-a-githubs-secret-scanning-partner)
    Toggle: SDXL Turbo (Fast - 10 sec) vs FLUX Schnell (Quality - 30 sec) - use Turbo for your 10-20/day workflow, it's only ∼8GB RAM
    Live prompt preview showing how I convert your title to that epic warm brain/city storyline
    Batch mode - paste 20 titles, hit generate, all saved to ./heroes/ as exact 1920×1280 WebP
    One-click download button

# First run will download ∼6GB model (one-time), then it's fully offline forever — no API costs.

# The prompt logic is locked to your site palette (terracotta #C25E3E, warm brown #8B5A3C, amber #D4A056) and that cinematic brain-over-city composition you loved, but it automatically switches to partnership/security layout when it detects "resend" or "github" in the title.

