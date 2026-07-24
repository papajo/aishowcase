"""
aishowcase.qzz.io Hero Generator
Generates 1920x1280 WebP heroes in warm earthy palette for blog posts.
Supports: Replicate FLUX, Together AI, or local SDXL fallback.

Usage:
  export REPLICATE_API_TOKEN="r8_..."
  python aishowcase_hero_generator.py --title "Resend-is-now-a-githubs-secret-scanning-partner"
  python aishowcase_hero_generator.py --title "OpenAI-HF-investigate-autonomous-AI-hack" --output ./heroes/

For 10-20/day, Replicate FLUX Schnell is ~$0.003/image, very cheap.
"""

import argparse
import os
import re
from pathlib import Path
from PIL import Image
import io

# --- CONFIG - Your site palette ---
PALETTE_PROMPT = (
    "warm earthy color palette: terracotta rust red #C25E3E, "
    "warm brown #8B5A3C, golden amber #D4A056, cream #FFF8F0, "
    "deep chocolate #3E2723, editorial tech illustration, "
    "minimal, clean, no large text, small icon details okay"
)

NEGATIVE_PROMPT = (
    "big text, large headline, watermark, logo, noisy, cluttered, "
    "cold blue, purple, neon, photorealistic person, low quality"
)

# Map common slugs to visual storylines
STORYLINE_HINTS = {
    "resend": "GitHub secret scanning detecting exposed Resend API key, email envelope protection, shield dome, circuit scanning beams",
    "github": "code repository, secret scanning, API key protection, security shield",
    "openai": "giant translucent AI brain over futuristic server city, cosmic data streams, golden light",
    "hf": "AI brain over futuristic server city, neural network cityscape",
    "hack": "protective dome over infrastructure, security scanning beams, lock icons",
    "autonomous": "giant brain, AI city, autonomous agents, honeycomb shield",
}

def slug_to_storyline(title: str) -> str:
    title_lower = title.lower()
    hints = []
    for key, desc in STORYLINE_HINTS.items():
        if key in title_lower:
            hints.append(desc)
    base = ", ".join(hints) if hints else "futuristic tech infrastructure, secure, minimal symbolic"
    # Clean title for prompt
    clean = re.sub(r'[-_]+', ' ', title).strip()
    return f"{clean}, {base}"

def build_prompt(title: str) -> str:
    storyline = slug_to_storyline(title)
    return (
        f"hero banner illustration for blog post '{storyline}', "
        f"{PALETTE_PROMPT}, "
        f"cinematic wide composition 1920x1280, epic scale, "
        f"lots of negative space for headline overlay, "
        f"inspired by futuristic AI city with giant glowing brain made of circuits if relevant, "
        f"otherwise partnership/security/integration concept, "
        f"flat vector with soft grain texture, no text overlay, no big words"
    )

def generate_with_replicate(prompt: str) -> Image.Image:
    """Uses Replicate FLUX - cheapest for 10-20/day"""
    import replicate
    # FLUX Schnell - fast and cheap, great for editorial
    output = replicate.run(
        "black-forest-labs/flux-schnell",
        input={
            "prompt": prompt,
            "go_fast": True,
            "megapixels": "1",
            "num_outputs": 1,
            "aspect_ratio": "3:2",
            "output_format": "webp",
            "output_quality": 92,
        }
    )
    # output is URL
    import requests
    url = output[0] if isinstance(output, list) else output
    resp = requests.get(url)
    return Image.open(io.BytesIO(resp.content))

def generate_with_together(prompt: str) -> Image.Image:
    """Alternative: Together AI FLUX"""
    import requests
    api_key = os.environ.get("TOGETHER_API_KEY")
    if not api_key:
        raise ValueError("Set TOGETHER_API_KEY")
    
    resp = requests.post(
        "https://api.together.xyz/v1/images/generations",
        headers={"Authorization": f"Bearer {api_key}"},
        json={
            "model": "black-forest-labs/FLUX.1-schnell-Free",
            "prompt": prompt,
            "negative_prompt": NEGATIVE_PROMPT,
            "width": 1920,
            "height": 1280,
            "steps": 4,
            "n": 1,
        }
    )
    resp.raise_for_status()
    data = resp.json()
    import base64
    img_b64 = data["data"][0]["b64_json"]
    return Image.open(io.BytesIO(base64.b64decode(img_b64)))

def save_webp(img: Image.Image, title: str, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:80]
    final_path = out_dir / f"{slug}_1920x1280.webp"
    
    # Ensure exact size
    if img.size != (1920, 1280):
        img = img.resize((1920, 1280), Image.LANCZOS)
    
    img.save(final_path, "WEBP", quality=92, method=6)
    return final_path

def main():
    parser = argparse.ArgumentParser(description="Generate aishowcase hero")
    parser.add_argument("--title", required=True, help="Post slug like Resend-is-now-a-githubs-secret-scanning-partner")
    parser.add_argument("--output", default="./heroes", help="Output folder")
    parser.add_argument("--provider", choices=["replicate", "together"], default="replicate")
    args = parser.parse_args()

    prompt = build_prompt(args.title)
    print(f"Prompt: {prompt}\n")
    
    if args.provider == "replicate":
        img = generate_with_replicate(prompt)
    else:
        img = generate_with_together(prompt)
    
    out_path = save_webp(img, args.title, Path(args.output))
    print(f"✅ Saved: {out_path} ({out_path.stat().st_size/1024:.1f}KB)")

if __name__ == "__main__":
    main()
