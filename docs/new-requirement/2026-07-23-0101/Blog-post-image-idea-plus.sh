# 1. Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements_local_m5.txt

# 2. Single hero
python aishowcase_hero_local_m5.py --title "Resend-is-now-a-githubs-secret-scanning-partner" --model sdxl-turbo

# 3. Batch 10-20 per day
echo "Resend-is-now-a-githubs-secret-scanning-partner
OpenAI-HF-investigate-autonomous-AI-hack
New-Vibe-Coding-Tool-Launches" > titles.txt

python aishowcase_hero_local_m5.py --batch titles.txt --model sdxl-turbo --output ./heroes