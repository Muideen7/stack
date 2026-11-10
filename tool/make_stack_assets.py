#!/usr/bin/env python3
"""Generate Stack's app icons, launch/splash artwork, and documentation assets.

Brand Tokens:
  Brand Lime: #D6FB61 (rgb: 214, 251, 97)
  Obsidian Dark: #0A0D0E (rgb: 10, 13, 14)
  Surface Dark: #161B1E (rgb: 22, 27, 30)
  Ink Light: #F1F5F9 (rgb: 241, 245, 249)

Glyph Geometry (based on viewBox 0 0 28 20):
  3 rounded rectangles (slabs):
    1. Rect(x=0, y=0, w=22, h=4.5, rx=2), fill=#D6FB61, alpha=1.0
    2. Rect(x=3, y=7.5, w=22, h=4.5, rx=2), fill=#D6FB61, alpha=0.75
    3. Rect(x=6, y=15, w=22, h=4.5, rx=2), fill=#D6FB61, alpha=0.50
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
DOCS = ROOT / "docs"
SCREENSHOTS = DOCS / "screenshots"

LIME = (214, 251, 97)
OBSIDIAN = (10, 13, 14)
SURFACE = (22, 27, 30)
INK_LIGHT = (241, 245, 249)
MUTED = (148, 163, 184)
CYAN = (0, 242, 181)
VIOLET = (79, 70, 229)
CORAL = (255, 77, 77)

def draw_stack_mark(img: Image.Image, cx: float, cy: float, glyph_w: float, color=LIME, add_shadow=True):
    """Draw the 3-slab Stack mark centered at (cx, cy) with overall width glyph_w."""
    scale = glyph_w / 28.0
    glyph_h = 19.5 * scale
    x0 = cx - glyph_w / 2.0
    y0 = cy - glyph_h / 2.0

    slabs = [
        # (dx, dy, width, height, rx, alpha)
        (0.0 * scale, 0.0 * scale, 22.0 * scale, 4.5 * scale, 2.0 * scale, 1.0),
        (3.0 * scale, 7.5 * scale, 22.0 * scale, 4.5 * scale, 2.0 * scale, 0.75),
        (6.0 * scale, 15.0 * scale, 22.0 * scale, 4.5 * scale, 2.0 * scale, 0.50),
    ]

    # Draw bottom to top if shadowing
    for dx, dy, w, h, rx, alpha in reversed(slabs):
        x = x0 + dx
        y = y0 + dy
        if add_shadow:
            shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
            s_draw = ImageDraw.Draw(shadow_layer)
            s_draw.rounded_rectangle(
                (x - 2 * scale, y + 2 * scale, x + w + 2 * scale, y + h + 4 * scale),
                radius=rx,
                fill=(0, 0, 0, int(90 * alpha))
            )
            shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(scale * 1.5))
            img.alpha_composite(shadow_layer)

        slab_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(slab_layer)
        draw.rounded_rectangle(
            (x, y, x + w, y + h),
            radius=rx,
            fill=color + (int(255 * alpha),)
        )
        img.alpha_composite(slab_layer)

def make_app_icon(size: int = 1024) -> Image.Image:
    S = size * 2  # 2x supersampling
    img = Image.new("RGBA", (S, S), OBSIDIAN + (255,))

    # Radial ambient glow in center
    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    cx, cy = S / 2.0, S / 2.0
    r = S * 0.42
    g_draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=LIME + (35,))
    glow = glow.filter(ImageFilter.GaussianBlur(S * 0.18))
    img.alpha_composite(glow)

    # Subtle sleek diagonal sheen
    sheen = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(sheen)
    s_draw.ellipse((S * 0.1, -S * 0.2, S * 1.1, S * 0.6), fill=(255, 255, 255, 12))
    sheen = sheen.filter(ImageFilter.GaussianBlur(S * 0.12))
    img.alpha_composite(sheen)

    # Center Stack mark
    glyph_w = S * 0.54
    draw_stack_mark(img, cx, cy, glyph_w, LIME, add_shadow=True)

    return img.resize((size, size), Image.Resampling.LANCZOS)

def make_adaptive_icon(size: int = 1024) -> Image.Image:
    S = size * 2
    # Android adaptive foreground is safe within inner 66% circle (safe zone = S * 0.66)
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    cx, cy = S / 2.0, S / 2.0
    glyph_w = S * 0.42
    draw_stack_mark(img, cx, cy, glyph_w, LIME, add_shadow=True)
    return img.resize((size, size), Image.Resampling.LANCZOS)

def make_splash_image(size: int = 1024) -> Image.Image:
    S = size * 2
    img = Image.new("RGBA", (S, S), OBSIDIAN + (255,))
    cx, cy = S / 2.0, S * 0.46
    glyph_w = S * 0.36
    draw_stack_mark(img, cx, cy, glyph_w, LIME, add_shadow=True)

    # Add wordmark "STACK"
    try:
        font = ImageFont.truetype(str(ASSETS / "fonts/BricolageGrotesque.ttf"), size=int(S * 0.075))
    except Exception:
        font = ImageFont.load_default()
    
    text = "STACK"
    draw = ImageDraw.Draw(img)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((cx - tw / 2.0, cy + glyph_w * 0.52), text, font=font, fill=INK_LIGHT)

    return img.resize((size, size), Image.Resampling.LANCZOS)

if __name__ == "__main__":
    print("Generating brand icon...")
    icon = make_app_icon(1024)
    icon.save(ASSETS / "icon.png")
    print("Saved assets/icon.png")

    adaptive = make_adaptive_icon(1024)
    adaptive.save(ASSETS / "adaptive-icon.png")
    print("Saved assets/adaptive-icon.png")

    splash = make_splash_image(1024)
    splash.save(ASSETS / "splash.png")
    print("Saved assets/splash.png")
    print("All icons successfully generated!")

