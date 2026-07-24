"""
aishowcase.qzz.io - Web UI for M5 16GB Hero Generator
Drag-and-drop web interface: paste a title, get 1920x1280 WebP instantly.

INSTALL:
  pip install -r requirements_local_m5.txt
  pip install gradio

RUN:
  python aishowcase_web_ui.py
  -> opens http://localhost:7860

Features:
 - Live prompt preview
 - Fast (SDXL Turbo) / Quality (FLUX) toggle
 - Batch mode
 - One-click download as WebP 1920x1280
 - Warm palette locked in
"""

import gradio as gr
import re
import torch
from pathlib import Path
from PIL import Image
import time
import os

# --- BRAND ---
PALETTE = (
    "warm earthy palette terracotta rust red #C25E3E, warm brown #8B5A3C, "
    "golden amber #D4A056, cream #FFF8F0, deep chocolate brown #3E2723, "
    "editorial tech illustration, minimal clean, no large text, cinematic"
)

STORYLINES = {
    "resend": "GitHub secret scanning detecting exposed Resend API key, email infrastructure protection, scanning beams, shield dome",
    "github": "code repository security, secret scanning, API key protection",
    "openai": "giant translucent AI brain made of golden circuits floating over futuristic server city, honeycomb protective dome, epic",
    "hf": "giant AI brain over server city, neural network",
    "hack": "protective dome, security scanning beams, lock icons",
    "autonomous": "giant brain, AI city, autonomous agents, warm cosmic amber sky",
    "secret-scanning": "secret scanning amber beams detecting keys, email towers protected",
}

def build_prompt(title: str) -> str:
    slug = title.lower()
    hints = [desc for k, desc in STORYLINES.items() if k in slug]
    base = ", ".join(hints) if hints else "futuristic tech infrastructure, secure minimal symbolic"
    clean = re.sub(r'[-_]+', ' ', title).strip()
    return f"hero banner for blog '{clean}', {base}, {PALETTE}, wide composition 1920x1280, epic scale, futuristic city of servers below, golden amber light rays, negative space, flat vector with soft grain, no text overlay, no words, 8k"

# Global pipeline cache (so we don't reload model every click)
PIPE_CACHE = {}

def get_pipe(model_choice: str):
    if model_choice in PIPE_CACHE:
        return PIPE_CACHE[model_choice]
    
    from diffusers import AutoPipelineForText2Image
    
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    dtype = torch.float16 if device == "mps" else torch.float32
    
    if model_choice == "SDXL Turbo (Fast - 10 sec)":
        model_id = "stabilityai/sdxl-turbo"
        pipe = AutoPipelineForText2Image.from_pretrained(model_id, torch_dtype=dtype, variant="fp16")
    else:
        model_id = "black-forest-labs/FLUX.1-schnell"
        pipe = AutoPipelineForText2Image.from_pretrained(model_id, torch_dtype=torch.bfloat16)
        pipe.enable_model_cpu_offload()
        pipe.enable_vae_slicing()
        pipe.enable_vae_tiling()
    
    pipe = pipe.to(device)
    try:
        pipe.enable_attention_slicing()
    except:
        pass
    
    PIPE_CACHE[model_choice] = pipe
    return pipe

def generate(title: str, model_choice: str, seed: int):
    if not title.strip():
        return None, "Please enter a title", ""
    
    prompt = build_prompt(title)
    
    # Lazy load pipe
    pipe = get_pipe(model_choice)
    
    generator = torch.Generator(device=pipe.device).manual_seed(int(seed))
    is_turbo = "Turbo" in model_choice
    steps = 1 if is_turbo else 4
    
    start = time.time()
    image = pipe(
        prompt=prompt,
        negative_prompt="big text, large headline, watermark, logo, blue, purple, neon" if steps > 1 else None,
        num_inference_steps=steps,
        guidance_scale=0.0 if is_turbo else 3.5,
        width=1280,
        height=832,
        generator=generator,
    ).images[0]
    
    # Upscale to exact 1920x1280
    image_final = image.resize((1920, 1280), Image.LANCZOS)
    
    # Save temp for download
    out_dir = Path("./heroes")
    out_dir.mkdir(exist_ok=True)
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:60]
    save_path = out_dir / f"{slug}_1920x1280.webp"
    image_final.save(save_path, "WEBP", quality=92)
    
    elapsed = time.time() - start
    info = f"✅ {elapsed:.1f}s | {save_path.name} | 1920x1280 WebP"
    return image_final, info, prompt

# --- GRADIO UI ---
with gr.Blocks(title="aishowcase.qzz.io Hero Generator", theme=gr.themes.Soft(primary_hue="amber", neutral_hue="stone")) as demo:
    gr.Markdown(
        """
        # 🎨 aishowcase.qzz.io Hero Generator
        **M5 16GB Optimized** | Warm Terracotta / Brown / Amber palette | 1920×1280 WebP | No big text
        Paste your post slug and get a cinematic hero like the Resend x GitHub one we made.
        """
    )
    
    with gr.Row():
        with gr.Column():
            title_input = gr.Textbox(
                label="Post Title / Slug",
                placeholder="Resend-is-now-a-githubs-secret-scanning-partner",
                value="Resend-is-now-a-githubs-secret-scanning-partner",
                lines=2
            )
            model_choice = gr.Radio(
                ["SDXL Turbo (Fast - 10 sec)", "FLUX Schnell (Quality - 30 sec)"],
                value="SDXL Turbo (Fast - 10 sec)",
                label="Model"
            )
            seed = gr.Slider(1, 99999, value=42, step=1, label="Seed")
            generate_btn = gr.Button("✨ Generate Hero", variant="primary", size="lg")
            
            with gr.Accordion("Prompt Preview (auto-generated)", open=False):
                prompt_preview = gr.Textbox(label="Full Prompt", lines=4, interactive=False)
        
        with gr.Column():
            output_image = gr.Image(label="Result - 1920×1280 WebP", type="pil", height=420)
            info_text = gr.Textbox(label="Info", interactive=False)
            download_btn = gr.DownloadButton("⬇️ Download WebP", variant="secondary")
    
    gr.Markdown("### Batch Mode")
    with gr.Row():
        batch_input = gr.Textbox(
            label="Batch - one title per line",
            placeholder="Resend-is-now-a-githubs-secret-scanning-partner\nOpenAI-HF-investigate-autonomous-AI-hack\nNew-Vibe-Coding-Tool-Launches",
            lines=4
        )
        batch_btn = gr.Button("Generate Batch (saves to ./heroes/)")
        batch_output = gr.Textbox(label="Batch Log", lines=6)
    
    # Wiring
    def on_title_change(title):
        return build_prompt(title)
    
    title_input.change(fn=on_title_change, inputs=title_input, outputs=prompt_preview)
    generate_btn.click(
        fn=generate,
        inputs=[title_input, model_choice, seed],
        outputs=[output_image, info_text, prompt_preview]
    )
    
    # Auto-download path
    def get_download_path(title):
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:60]
        p = Path(f"./heroes/{slug}_1920x1280.webp")
        return str(p) if p.exists() else None
    
    # Update download button after generation
    def update_download(title):
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:60]
        return f"./heroes/{slug}_1920x1280.webp"
    
    generate_btn.click(fn=update_download, inputs=title_input, outputs=download_btn)
    
    def batch_generate(batch_text, model_choice):
        lines = [l.strip() for l in batch_text.splitlines() if l.strip()]
        log = ""
        for t in lines:
            try:
                img, info, _ = generate(t, model_choice, 42)
                log += f"{info}\n"
            except Exception as e:
                log += f"❌ {t}: {e}\n"
        return log
    
    batch_btn.click(fn=batch_generate, inputs=[batch_input, model_choice], outputs=batch_output)

    gr.Markdown(
        """
        **Tips for M5 16GB:**
        - Use **SDXL Turbo** for 10-20/day - it's fast and uses <8GB RAM
        - First run downloads ~6GB model, then it's offline forever
        - Outputs auto-saved to `./heroes/` as WebP
        """
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860, show_api=False)
