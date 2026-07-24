"""
aishowcase.qzz.io - LOCAL M5 16GB Hero Generator
Optimized for Apple Silicon M5/M4/M3 with MPS acceleration.
No API key needed, runs fully offline.

Generates 1920x1280 WebP in your warm terracotta/brown/amber palette.

INSTALL:
  python3 -m venv venv
  source venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements_local_m5.txt

USAGE:
  python aishowcase_hero_local_m5.py --title "Resend-is-now-a-githubs-secret-scanning-partner"
  python aishowcase_hero_local_m5.py --batch titles.txt --output ./heroes

PERFORMANCE on M5 16GB:
  - SDXL Turbo: ~8-12 sec per image
  - FLUX Schnell (4-step): ~25-35 sec per image, better quality
"""

import argparse
import re
import time
from pathlib import Path
from PIL import Image

# --- YOUR BRAND ---
PALETTE = (
    "warm earthy color palette terracotta rust red #C25E3E, "
    "warm brown #8B5A3C, golden amber #D4A056, cream #FFF8F0, deep chocolate brown #3E2723, "
    "editorial tech illustration, minimal clean, no large text"
)

STORYLINES = {
    "resend": "GitHub secret scanning detecting exposed Resend API key, email infrastructure protection, scanning beams, shield dome over email towers",
    "github": "code repository security, secret scanning, API key protection with shield",
    "openai": "giant translucent AI brain made of golden circuits floating over futuristic server city, epic cinematic, honeycomb protective dome",
    "hf": "giant AI brain over futuristic server city, neural network cityscape, golden light",
    "hack": "protective dome, security scanning beams, lock and shield icons floating",
    "autonomous": "giant brain, AI city, autonomous agents, warm cosmic sky with amber data streams",
    "secret-scanning": "secret scanning, glowing amber beams detecting keys, email towers protected",
}

def build_prompt(title: str) -> str:
    slug = title.lower()
    hints = [desc for key, desc in STORYLINES.items() if key in slug]
    base_story = ", ".join(hints) if hints else "futuristic tech infrastructure, secure minimal symbolic"
    clean = re.sub(r'[-_]+', ' ', title).strip()
    return (
        f"hero banner illustration for blog '{clean}', {base_story}, "
        f"{PALETTE}, "
        f"cinematic wide composition, epic scale, futuristic city of servers and code towers below, "
        f"golden amber light rays, lots of negative space, flat vector with soft grain texture, "
        f"no text overlay, no words, no watermark, 8k, highly detailed"
    )

def get_pipeline(model_choice: str = "sdxl-turbo"):
    """
    M5 16GB optimized pipeline.
    Two options:
    - sdxl-turbo: fastest on 16GB, ~10 sec
    - flux-schnell: best quality, needs more RAM but works on 16GB with 4 steps
    """
    import torch
    from diffusers import AutoPipelineForText2Image

    # Enable MPS
    if not torch.backends.mps.is_available():
        print("⚠️ MPS not available, falling back to CPU (will be slow)")
        device = "cpu"
        dtype = torch.float32
    else:
        device = "mps"
        dtype = torch.float16

    if model_choice == "sdxl-turbo":
        model_id = "stabilityai/sdxl-turbo"
        print(f"Loading {model_id} on {device}...")
        pipe = AutoPipelineForText2Image.from_pretrained(
            model_id, 
            torch_dtype=dtype,
            variant="fp16" if dtype == torch.float16 else None
        )
    else: # flux-schnell
        model_id = "black-forest-labs/FLUX.1-schnell"
        print(f"Loading {model_id} on {device} (may take ~4GB download first time)...")
        # FLUX needs transformer offload for 16GB
        pipe = AutoPipelineForText2Image.from_pretrained(
            model_id,
            torch_dtype=torch.bfloat16 if device == "mps" else torch.float32,
        )
        # Enable memory efficient tricks for M5 16GB
        if device == "mps":
            pipe.enable_model_cpu_offload()  # critical for 16GB
            pipe.enable_vae_slicing()
            pipe.enable_vae_tiling()

    pipe = pipe.to(device)
    
    # M5 optimizations
    try:
        pipe.enable_attention_slicing()
    except:
        pass
    
    return pipe

def generate_image(pipe, prompt: str, negative_prompt: str = "big text, large headline, watermark, logo, blue, purple, neon, low quality", seed: int = 42):
    import torch
    generator = torch.Generator(device=pipe.device).manual_seed(seed)
    
    # SDXL Turbo is 1-step model, FLUX is 4-step
    is_turbo = "turbo" in pipe.__class__.__name__.lower() or "sdxl-turbo" in str(pipe).lower()
    steps = 1 if "turbo" in str(pipe.config).lower() or is_turbo else 4
    
    print(f"Generating {steps} steps...")
    start = time.time()
    
    # For SDXL Turbo, guidance_scale = 0.0 is required
    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt if steps > 1 else None,
        num_inference_steps=steps if steps == 1 else 4,
        guidance_scale=0.0 if steps == 1 else 3.5,
        width=1280,  # Generate smaller then upscale to save RAM
        height=832,  # 3:2 aspect, will upscale to 1920x1280
        generator=generator,
    ).images[0]
    
    elapsed = time.time() - start
    print(f"✅ Generated in {elapsed:.1f}s")
    return image

def save_final(img: Image.Image, title: str, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:80]
    # Upscale to exact 1920x1280 with Lanczos - much faster than generating at full res on M5
    img_final = img.resize((1920, 1280), Image.LANCZOS)
    final_path = out_dir / f"{slug}_1920x1280.webp"
    img_final.save(final_path, "WEBP", quality=92, method=6)
    print(f"💾 Saved: {final_path} ({final_path.stat().st_size/1024:.0f}KB)")
    return final_path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--title", help="Single title")
    parser.add_argument("--batch", help="File with one title per line")
    parser.add_argument("--output", default="./heroes", help="Output folder")
    parser.add_argument("--model", choices=["sdxl-turbo", "flux-schnell"], default="sdxl-turbo", help="sdxl-turbo is fastest on M5 16GB")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    titles = []
    if args.title:
        titles = [args.title]
    elif args.batch:
        titles = [line.strip() for line in Path(args.batch).read_text().splitlines() if line.strip()]
    else:
        print("Provide --title or --batch")
        return

    print(f"🚀 Loading model {args.model} for M5 16GB...")
    pipe = get_pipeline(args.model)

    for title in titles:
        print(f"\n--- {title} ---")
        prompt = build_prompt(title)
        print(f"Prompt: {prompt[:120]}...")
        img = generate_image(pipe, prompt, seed=args.seed)
        save_final(img, title, Path(args.output))

if __name__ == "__main__":
    main()
