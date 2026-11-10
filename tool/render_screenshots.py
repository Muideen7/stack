#!/usr/bin/env python3
"""Render authentic, high-resolution device screenshots and hero banner for Stack.

Matches Stack's exact React Native / NativeWind theme:
- Canvas: #0A0D0E (Obsidian)
- Brand Accent: #D6FB61 (Neon Acid Lime)
- Surfaces: #161B1E, #1F262B
- Ink: #F1F5F9, #94A3B8, #585F54
- Card Finishes: Volt (#1F2A12, #D6FB61), Obsidian (#121619), Teal (#0B2320, #00F2B5)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SCREENSHOTS = DOCS / "screenshots"

FONT_PATH = ROOT / "assets/fonts/BricolageGrotesque.ttf"

# Color palette
OBSIDIAN = (10, 13, 14)
SURFACE = (22, 27, 30)
SURFACE_SUBTLE = (31, 38, 43)
BRAND = (214, 251, 97)
BRAND_INK = (10, 13, 14)
INK_LIGHT = (241, 245, 249)
INK_MUTED = (148, 163, 184)
INK_DIM = (88, 95, 84)
BORDER = (255, 255, 255, 22)
BORDER_LIME = (214, 251, 97, 100)

CYAN = (0, 242, 181)
VIOLET = (79, 70, 229)
CORAL = (255, 77, 77)

PHONE_W = 600
PHONE_H = 1300
CORNER_RADIUS = 52

def get_font(size: int, bold: bool = False):
    try:
        return ImageFont.truetype(str(FONT_PATH), size=size)
    except Exception:
        return ImageFont.load_default()

def draw_stack_mark(draw, cx, cy, w, color=BRAND, alpha_mult=1.0):
    scale = w / 28.0
    h = 19.5 * scale
    x0 = cx - w / 2.0
    y0 = cy - h / 2.0
    slabs = [
        (0.0 * scale, 0.0 * scale, 22.0 * scale, 4.5 * scale, 2.0 * scale, 1.0),
        (3.0 * scale, 7.5 * scale, 22.0 * scale, 4.5 * scale, 2.0 * scale, 0.75),
        (6.0 * scale, 15.0 * scale, 22.0 * scale, 4.5 * scale, 2.0 * scale, 0.50),
    ]
    for dx, dy, sw, sh, rx, a in slabs:
        alpha = int(255 * a * alpha_mult)
        draw.rounded_rectangle(
            (x0 + dx, y0 + dy, x0 + dx + sw, y0 + dy + sh),
            radius=rx,
            fill=color + (alpha,)
        )

def create_phone_base():
    """Create a phone frame with status bar, dynamic island, and home bar."""
    img = Image.new("RGBA", (PHONE_W, PHONE_H), OBSIDIAN + (255,))
    draw = ImageDraw.Draw(img)

    # Dynamic Island
    island_w, island_h = 170, 36
    ix0 = (PHONE_W - island_w) // 2
    draw.rounded_rectangle((ix0, 16, ix0 + island_w, 16 + island_h), radius=18, fill=(0, 0, 0, 255))

    # Time (9:41)
    font_time = get_font(20)
    draw.text((44, 22), "9:41", font=font_time, fill=INK_LIGHT)

    # Status Bar Icons (Cellular, Wifi, Battery) on right
    # Cellular bars
    for i in range(4):
        bx = PHONE_W - 130 + i * 6
        bh = 6 + i * 3
        draw.rounded_rectangle((bx, 34 - bh, bx + 4, 34), radius=1, fill=INK_LIGHT)
    # Wifi arc / dot
    draw.ellipse((PHONE_W - 98, 26, PHONE_W - 92, 32), fill=INK_LIGHT)
    draw.arc((PHONE_W - 103, 20, PHONE_W - 87, 36), start=210, end=330, fill=INK_LIGHT, width=2)
    # Battery
    draw.rounded_rectangle((PHONE_W - 74, 22, PHONE_W - 42, 36), radius=4, outline=INK_LIGHT, width=2)
    draw.rounded_rectangle((PHONE_W - 71, 25, PHONE_W - 49, 33), radius=2, fill=BRAND)
    draw.rectangle((PHONE_W - 41, 26, PHONE_W - 39, 32), fill=INK_LIGHT)

    # Home indicator bar at bottom
    draw.rounded_rectangle(((PHONE_W - 160) // 2, PHONE_H - 22, (PHONE_W + 160) // 2, PHONE_H - 16),
                           radius=3, fill=(120, 125, 120, 200))

    return img

def draw_tab_bar(img: Image.Image, active_tab: str = "home"):
    """Draw FloatingTabBar component."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    bar_w, bar_h = 420, 68
    bx0 = (PHONE_W - bar_w) // 2
    by0 = PHONE_H - 104

    # Shadow
    draw.rounded_rectangle((bx0, by0 + 4, bx0 + bar_w, by0 + bar_h + 4), radius=34, fill=(0, 0, 0, 120))
    overlay = overlay.filter(ImageFilter.GaussianBlur(12))
    img.alpha_composite(overlay)

    draw = ImageDraw.Draw(img)
    # Background dock
    draw.rounded_rectangle((bx0, by0, bx0 + bar_w, by0 + bar_h), radius=34, fill=(22, 27, 30, 245),
                           outline=(255, 255, 255, 30), width=1)

    tabs = [("home", "Home"), ("cards", "Cards"), ("profile", "Profile")]
    seg_w = bar_w / len(tabs)
    for i, (tid, label) in enumerate(tabs):
        cx = bx0 + (i + 0.5) * seg_w
        cy = by0 + bar_h / 2
        is_active = (tid == active_tab)
        color = BRAND if is_active else INK_MUTED

        if is_active:
            # Active indicator pill
            draw.rounded_rectangle((cx - 42, cy - 24, cx + 42, cy + 24), radius=20, fill=(214, 251, 97, 32))

        # Icon representation & label
        if tid == "home":
            # House shape
            draw.polygon([(cx, cy - 14), (cx - 10, cy - 5), (cx + 10, cy - 5)], fill=color)
            draw.rectangle((cx - 8, cy - 5, cx + 8, cy + 4), fill=color)
        elif tid == "cards":
            # Overlapping cards
            draw.rounded_rectangle((cx - 11, cy - 11, cx + 5, cy + 1), radius=2, outline=color, width=2)
            draw.rounded_rectangle((cx - 6, cy - 5, cx + 10, cy + 7), radius=2, fill=color)
        else:
            # User
            draw.ellipse((cx - 5, cy - 12, cx + 5, cy - 2), fill=color)
            draw.arc((cx - 10, cy - 2, cx + 10, cy + 12), start=180, end=360, fill=color, width=2)

        font_tab = get_font(12)
        draw.text((cx, cy + 13), label, font=font_tab, fill=color, anchor="mm")

def render_home_screen() -> Image.Image:
    img = create_phone_base()
    draw = ImageDraw.Draw(img)

    # Header Greeting
    f_sm = get_font(14)
    f_md = get_font(26)
    f_sub = get_font(15)
    f_hero = get_font(52)
    f_card = get_font(20)

    draw.text((40, 84), "GOOD DAY", font=f_sm, fill=INK_MUTED)
    draw.text((40, 106), "Olympicson", font=f_md, fill=INK_LIGHT)

    # Bell button
    draw.rounded_rectangle((PHONE_W - 84, 88, PHONE_W - 40, 132), radius=22, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    # Bell icon
    bcx, bcy = PHONE_W - 62, 110
    draw.arc((bcx - 8, bcy - 10, bcx + 8, bcy + 2), start=180, end=360, fill=INK_LIGHT, width=2)
    draw.line([(bcx - 9, bcy + 2), (bcx + 9, bcy + 2)], fill=INK_LIGHT, width=2)
    draw.ellipse((bcx - 2, bcy + 4, bcx + 2, bcy + 7), fill=BRAND)

    # Unified Total Balance Section
    draw.text((40, 168), "TOTAL BALANCE", font=f_sm, fill=INK_MUTED)
    draw.text((40, 192), "$30,344.61", font=f_hero, fill=INK_LIGHT)
    draw.text((40, 260), "Across 3 cards in your stack", font=f_sub, fill=INK_MUTED)

    # Quick Actions Row (Send, Convert, Add Card, Activity)
    actions = [
        ("Send", BRAND, "↗"),
        ("Convert", CYAN, "⇄"),
        ("Add Card", VIOLET, "+"),
        ("Activity", CORAL, "≡")
    ]
    ax_start = 40
    aw = (PHONE_W - 80) / 4
    for i, (title, color, sym) in enumerate(actions):
        acx = ax_start + (i + 0.5) * aw
        acy = 330
        draw.rounded_rectangle((acx - 30, acy - 30, acx + 30, acy + 30), radius=30, fill=SURFACE,
                               outline=(color[0], color[1], color[2], 60), width=1)
        # Symbol
        f_sym = get_font(26)
        draw.text((acx, acy), sym, font=f_sym, fill=color, anchor="mm")
        draw.text((acx, acy + 44), title, font=get_font(13), fill=INK_LIGHT, anchor="mm")

    # Spending Summary Card
    sy0 = 420
    draw.rounded_rectangle((40, sy0, PHONE_W - 40, sy0 + 170), radius=28, fill=SURFACE,
                           outline=(255, 255, 255, 18), width=1)
    draw.text((64, sy0 + 24), "THIS WEEK'S SPENDING", font=f_sm, fill=INK_MUTED)
    draw.text((64, sy0 + 48), "$1,420.85", font=f_md, fill=INK_LIGHT)

    # Segmented progress bar
    bar_y = sy0 + 104
    bw = PHONE_W - 128
    segments = [
        (0.38, BRAND),
        (0.26, CYAN),
        (0.18, VIOLET),
        (0.12, CORAL),
        (0.06, INK_MUTED),
    ]
    cur_x = 64
    for frac, col in segments:
        seg_len = bw * frac
        draw.rounded_rectangle((cur_x, bar_y, cur_x + seg_len - 4, bar_y + 12), radius=6, fill=col)
        cur_x += seg_len

    # Legend text
    draw.text((64, sy0 + 132), "● Food (38%)   ● Shopping (26%)   ● Travel (18%)", font=get_font(12), fill=INK_MUTED)

    # Recent Activity Section
    ry0 = 620
    draw.text((40, ry0), "RECENT ACTIVITY", font=f_sm, fill=INK_MUTED)
    draw.text((PHONE_W - 40, ry0), "View All", font=f_sm, fill=BRAND, anchor="ra")

    txs = [
        ("Apple Store", "Hardware & Tech", "-$1,099.00", INK_LIGHT),
        ("Whole Foods Market", "Groceries", "-$84.20", INK_LIGHT),
        ("Stripe Deposit", "Freelance / Transfer", "+$4,500.00", CYAN),
        ("Blue Bottle Coffee", "Food & Drink", "-$6.50", INK_LIGHT),
        ("Uber Technologies", "Transportation", "-$24.50", INK_LIGHT),
    ]

    ty = ry0 + 34
    for name, cat, amt, amt_color in txs:
        draw.rounded_rectangle((40, ty, PHONE_W - 40, ty + 76), radius=20, fill=SURFACE,
                               outline=(255, 255, 255, 12), width=1)
        # Left icon square
        draw.rounded_rectangle((56, ty + 16, 100, ty + 60), radius=14, fill=SURFACE_SUBTLE)
        draw.text((78, ty + 38), name[0], font=get_font(20), fill=BRAND, anchor="mm")

        # Name and category
        draw.text((116, ty + 20), name, font=get_font(17), fill=INK_LIGHT)
        draw.text((116, ty + 44), cat, font=get_font(13), fill=INK_MUTED)

        # Amount
        draw.text((PHONE_W - 60, ty + 38), amt, font=get_font(17), fill=amt_color, anchor="rm")
        ty += 88

    draw_tab_bar(img, "home")
    return img

def render_cards_screen() -> Image.Image:
    img = create_phone_base()
    draw = ImageDraw.Draw(img)

    f_title = get_font(32)
    f_sm = get_font(14)

    # Header
    draw.text((40, 84), "Cards", font=f_title, fill=INK_LIGHT)

    # Layout toggle (Stack vs Carousel)
    draw.rounded_rectangle((PHONE_W - 170, 84, PHONE_W - 40, 126), radius=21, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    draw.rounded_rectangle((PHONE_W - 168, 86, PHONE_W - 106, 124), radius=19, fill=BRAND)
    draw.text((PHONE_W - 137, 105), "Stack", font=get_font(13), fill=BRAND_INK, anchor="mm")
    draw.text((PHONE_W - 73, 105), "Deck", font=get_font(13), fill=INK_MUTED, anchor="mm")

    # Card 1: Volt Card (Active / Top)
    cy1 = 154
    cw, ch = PHONE_W - 80, 310
    # Card background
    draw.rounded_rectangle((40, cy1, 40 + cw, cy1 + ch), radius=28, fill=(31, 42, 18),
                           outline=BRAND, width=2)
    # Card inner sheen glow
    draw_stack_mark(draw, 72, cy1 + 38, 28, color=BRAND)
    draw.text((98, cy1 + 38), "STACK", font=get_font(15), fill=BRAND, anchor="lm")
    draw.text((40 + cw - 28, cy1 + 38), "EVERYDAY", font=get_font(13), fill=BRAND, anchor="rm")

    # EMV Chip
    draw.rounded_rectangle((68, cy1 + 80, 116, cy1 + 118), radius=8, fill=(214, 251, 97, 80),
                           outline=BRAND, width=1)
    # Contactless wave symbol
    draw.arc((130, cy1 + 86, 150, cy1 + 112), start=300, end=420, fill=BRAND, width=2)
    draw.arc((136, cy1 + 82, 160, cy1 + 116), start=300, end=420, fill=BRAND, width=2)

    # Card number & balance
    draw.text((68, cy1 + 152), "••••  ••••  ••••  8152", font=get_font(20), fill=BRAND)
    draw.text((68, cy1 + 204), "$24,092.67", font=get_font(34), fill=BRAND)
    draw.text((68, cy1 + 266), "OLYMPICSON", font=get_font(14), fill=(163, 217, 74))
    draw.text((40 + cw - 28, cy1 + 266), "07/29", font=get_font(14), fill=(163, 217, 74), anchor="ra")

    # Card 2: Moss Card (Cascading behind / below)
    cy2 = cy1 + 230
    draw.rounded_rectangle((48, cy2, 48 + cw - 16, cy2 + ch), radius=28, fill=(28, 62, 43),
                           outline=(127, 211, 164, 80), width=1)
    draw_stack_mark(draw, 80, cy2 + 38, 26, color=(127, 211, 164))
    draw.text((106, cy2 + 38), "STACK", font=get_font(15), fill=(127, 211, 164), anchor="lm")
    draw.text((48 + cw - 44, cy2 + 38), "TRAVEL", font=get_font(13), fill=(127, 211, 164), anchor="rm")
    draw.text((76, cy2 + 130), "••••  ••••  ••••  4410", font=get_font(18), fill=(127, 211, 164))
    draw.text((76, cy2 + 172), "€5,062.54", font=get_font(30), fill=(226, 232, 228))

    # Card 3: Obsidian / Sage Card (Cascading third)
    cy3 = cy2 + 200
    draw.rounded_rectangle((56, cy3, 56 + cw - 32, cy3 + ch), radius=28, fill=(18, 22, 25),
                           outline=(255, 255, 255, 40), width=1)
    draw_stack_mark(draw, 88, cy3 + 38, 26, color=INK_LIGHT)
    draw.text((114, cy3 + 38), "STACK", font=get_font(15), fill=INK_LIGHT, anchor="lm")
    draw.text((56 + cw - 60, cy3 + 38), "HOUSEHOLD", font=get_font(13), fill=INK_MUTED, anchor="rm")
    draw.text((84, cy3 + 120), "$1,189.40", font=get_font(28), fill=INK_LIGHT)

    # Card Action Controls (Freeze, Spend Limit, Details)
    ay = cy3 + 220
    actions = [
        ("Freeze Card", BRAND, "❄"),
        ("Monthly Limit", INK_LIGHT, "⛨"),
        ("Card Details", INK_LIGHT, "ℹ"),
    ]
    for i, (title, col, ico) in enumerate(actions):
        draw.rounded_rectangle((40, ay + i * 70, PHONE_W - 40, ay + i * 70 + 58), radius=18,
                               fill=SURFACE, outline=(255, 255, 255, 15), width=1)
        draw.text((68, ay + i * 70 + 29), ico, font=get_font(20), fill=col, anchor="mm")
        draw.text((100, ay + i * 70 + 29), title, font=get_font(16), fill=INK_LIGHT, anchor="lm")
        draw.text((PHONE_W - 68, ay + i * 70 + 29), "›", font=get_font(22), fill=INK_MUTED, anchor="mm")

    draw_tab_bar(img, "cards")
    return img

def render_onboarding_screen() -> Image.Image:
    img = create_phone_base()
    draw = ImageDraw.Draw(img)

    # Progress Indicators (3 pills)
    draw.rounded_rectangle((44, 90, 84, 96), radius=3, fill=BRAND)
    draw.rounded_rectangle((92, 90, 108, 96), radius=3, fill=SURFACE_SUBTLE)
    draw.rounded_rectangle((116, 90, 132, 96), radius=3, fill=SURFACE_SUBTLE)
    draw.text((PHONE_W - 44, 93), "SKIP", font=get_font(13), fill=INK_MUTED, anchor="ra")

    # Center Hero Glyph in Container
    cx, cy = PHONE_W // 2, 420
    # Outer dark circle
    draw.ellipse((cx - 150, cy - 150, cx + 150, cy + 150), fill=SURFACE,
                 outline=(255, 255, 255, 18), width=1)
    # Inner lime wash
    draw.ellipse((cx - 105, cy - 105, cx + 105, cy + 105), fill=(214, 251, 97, 24))
    # Stack 3-slab mark
    draw_stack_mark(draw, cx, cy, 110, color=BRAND)

    # Slide Copy
    draw.text((44, 650), "EVERYTHING IN ONE PLACE", font=get_font(14), fill=BRAND)
    draw.text((44, 690), "Every card,\none balance", font=get_font(46), fill=INK_LIGHT)
    draw.text((44, 830),
              "Stack gathers your cards into a single wallet\nand keeps the running total honest, down\nto the cent.",
              font=get_font(19), fill=INK_MUTED)

    # Bottom CTA Button
    btn_y = PHONE_H - 120
    draw.rounded_rectangle((44, btn_y, PHONE_W - 44, btn_y + 64), radius=32, fill=BRAND)
    draw.text((PHONE_W // 2, btn_y + 32), "Get Started", font=get_font(18), fill=BRAND_INK, anchor="mm")

    return img

def render_signin_screen() -> Image.Image:
    img = create_phone_base()
    draw = ImageDraw.Draw(img)

    # Brand Logo & Wordmark
    cx = PHONE_W // 2
    draw_stack_mark(draw, cx, 170, 72, color=BRAND)
    draw.text((cx, 230), "STACK", font=get_font(38), fill=INK_LIGHT, anchor="mm")
    draw.text((cx, 266), "EVERY CARD, ONE BALANCE.", font=get_font(13), fill=BRAND, anchor="mm")

    # Form Fields
    fy = 330
    draw.text((44, fy), "EMAIL ADDRESS", font=get_font(13), fill=INK_MUTED)
    draw.rounded_rectangle((44, fy + 14, PHONE_W - 44, fy + 72), radius=18, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    draw.text((64, fy + 43), "hello@flutterzip.com", font=get_font(17), fill=INK_LIGHT, anchor="lm")

    fy += 92
    draw.text((44, fy), "PASSWORD", font=get_font(13), fill=INK_MUTED)
    draw.rounded_rectangle((44, fy + 14, PHONE_W - 44, fy + 72), radius=18, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    draw.text((64, fy + 43), "••••••••••••", font=get_font(20), fill=INK_LIGHT, anchor="lm")

    # Sign In Button
    btn_y = fy + 104
    draw.rounded_rectangle((44, btn_y, PHONE_W - 44, btn_y + 64), radius=32, fill=BRAND)
    draw.text((cx, btn_y + 32), "Sign In", font=get_font(18), fill=BRAND_INK, anchor="mm")

    # Divider
    div_y = btn_y + 110
    draw.line([(44, div_y), (cx - 70, div_y)], fill=(255, 255, 255, 25), width=1)
    draw.line([(cx + 70, div_y), (PHONE_W - 44, div_y)], fill=(255, 255, 255, 25), width=1)
    draw.text((cx, div_y), "OR CONTINUE WITH", font=get_font(11), fill=INK_MUTED, anchor="mm")

    # Social Buttons
    s_y = div_y + 40
    # Apple
    draw.rounded_rectangle((44, s_y, PHONE_W - 44, s_y + 60), radius=30, fill=(255, 255, 255))
    draw.text((cx, s_y + 30), "  Sign in with Apple", font=get_font(16), fill=(0, 0, 0), anchor="mm")

    # Google
    s_y += 76
    draw.rounded_rectangle((44, s_y, PHONE_W - 44, s_y + 60), radius=30, fill=SURFACE,
                           outline=(255, 255, 255, 25), width=1)
    draw.text((cx, s_y + 30), "G  Sign in with Google", font=get_font(16), fill=INK_LIGHT, anchor="mm")

    return img

def render_send_screen() -> Image.Image:
    img = create_phone_base()
    draw = ImageDraw.Draw(img)

    # Top Header
    draw.text((44, 88), "Send Money", font=get_font(24), fill=INK_LIGHT)
    draw.text((PHONE_W - 44, 88), "✕", font=get_font(22), fill=INK_MUTED, anchor="ra")

    # Recipient Card
    ry = 146
    draw.rounded_rectangle((44, ry, PHONE_W - 44, ry + 92), radius=22, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    draw.ellipse((64, ry + 16, 124, ry + 76), fill=(214, 251, 97, 40))
    draw.text((94, ry + 46), "SJ", font=get_font(20), fill=BRAND, anchor="mm")
    draw.text((140, ry + 32), "Sarah Jenkins", font=get_font(18), fill=INK_LIGHT)
    draw.text((140, ry + 58), "@sarahj · Revolut", font=get_font(14), fill=INK_MUTED)

    # Amount Entry Hero
    ay = 280
    draw.text((PHONE_W // 2, ay), "$250.00", font=get_font(60), fill=BRAND, anchor="mm")
    draw.text((PHONE_W // 2, ay + 50), "USD · Zero fee transfer", font=get_font(15), fill=INK_MUTED, anchor="mm")

    # Funding Source Pill
    fy = ay + 96
    draw.rounded_rectangle((64, fy, PHONE_W - 64, fy + 54), radius=27, fill=SURFACE_SUBTLE,
                           outline=(255, 255, 255, 15), width=1)
    draw.text((PHONE_W // 2, fy + 27), "Paying from Volt Card (•••• 8152)", font=get_font(14), fill=INK_LIGHT, anchor="mm")

    # 4-Digit Security PIN dots
    py = fy + 80
    draw.text((PHONE_W // 2, py), "ENTER PIN TO CONFIRM", font=get_font(13), fill=INK_MUTED, anchor="mm")
    dots_x = PHONE_W // 2
    for di in range(4):
        dx = dots_x - 45 + di * 30
        is_filled = di < 2
        col = BRAND if is_filled else SURFACE_SUBTLE
        draw.ellipse((dx - 6, py + 22, dx + 6, py + 34), fill=col, outline=BRAND, width=1)

    # Keypad
    ky = py + 70
    keys = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["", "0", "⌫"]
    ]
    kw = (PHONE_W - 88) / 3
    for r_idx, row in enumerate(keys):
        for c_idx, k in enumerate(row):
            kcx = 44 + (c_idx + 0.5) * kw
            kcy = ky + r_idx * 76
            if k:
                draw.text((kcx, kcy), k, font=get_font(26), fill=INK_LIGHT, anchor="mm")

    # Action CTA
    btn_y = PHONE_H - 120
    draw.rounded_rectangle((44, btn_y, PHONE_W - 44, btn_y + 64), radius=32, fill=BRAND)
    draw.text((PHONE_W // 2, btn_y + 32), "Send $250.00 Now", font=get_font(18), fill=BRAND_INK, anchor="mm")

    return img

def render_convert_screen() -> Image.Image:
    img = create_phone_base()
    draw = ImageDraw.Draw(img)

    draw.text((44, 88), "Convert Currency", font=get_font(24), fill=INK_LIGHT)
    draw.text((PHONE_W - 44, 88), "✕", font=get_font(22), fill=INK_MUTED, anchor="ra")

    # From Container
    cy1 = 154
    draw.rounded_rectangle((44, cy1, PHONE_W - 44, cy1 + 130), radius=24, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    draw.text((68, cy1 + 24), "YOU CONVERT", font=get_font(13), fill=INK_MUTED)
    draw.text((68, cy1 + 68), "$1,000.00", font=get_font(38), fill=INK_LIGHT)
    draw.rounded_rectangle((PHONE_W - 148, cy1 + 54, PHONE_W - 68, cy1 + 94), radius=20, fill=SURFACE_SUBTLE)
    draw.text((PHONE_W - 108, cy1 + 74), "USD  ▼", font=get_font(14), fill=BRAND, anchor="mm")
    draw.text((68, cy1 + 104), "From Everyday Volt Card (•••• 8152)", font=get_font(13), fill=INK_MUTED)

    # Swap Circle in center
    scx, scy = PHONE_W // 2, cy1 + 155
    draw.ellipse((scx - 26, scy - 26, scx + 26, scy + 26), fill=BRAND)
    draw.text((scx, scy), "⇅", font=get_font(24), fill=BRAND_INK, anchor="mm")

    # To Container
    cy2 = cy1 + 180
    draw.rounded_rectangle((44, cy2, PHONE_W - 44, cy2 + 130), radius=24, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    draw.text((68, cy2 + 24), "YOU RECEIVE", font=get_font(13), fill=INK_MUTED)
    draw.text((68, cy2 + 68), "€924.50", font=get_font(38), fill=CYAN)
    draw.rounded_rectangle((PHONE_W - 148, cy2 + 54, PHONE_W - 68, cy2 + 94), radius=20, fill=SURFACE_SUBTLE)
    draw.text((PHONE_W - 108, cy2 + 74), "EUR  ▼", font=get_font(14), fill=CYAN, anchor="mm")
    draw.text((68, cy2 + 104), "To Travel Moss Card (•••• 4410)", font=get_font(13), fill=INK_MUTED)

    # Live Rate Details Box
    ry = cy2 + 160
    draw.rounded_rectangle((44, ry, PHONE_W - 44, ry + 160), radius=22, fill=SURFACE_SUBTLE,
                           outline=(255, 255, 255, 12), width=1)
    details = [
        ("Guaranteed Rate", "1 USD = 0.9245 EUR"),
        ("Basis Point Fee (0.15%)", "$1.50 USD"),
        ("Transfer Speed", "Instant Settlement"),
        ("New USD Balance", "$23,091.17 USD"),
    ]
    for i, (k, v) in enumerate(details):
        draw.text((68, ry + 22 + i * 34), k, font=get_font(14), fill=INK_MUTED)
        draw.text((PHONE_W - 68, ry + 22 + i * 34), v, font=get_font(14), fill=INK_LIGHT, anchor="ra")

    # Convert CTA
    btn_y = PHONE_H - 120
    draw.rounded_rectangle((44, btn_y, PHONE_W - 44, btn_y + 64), radius=32, fill=BRAND)
    draw.text((PHONE_W // 2, btn_y + 32), "Convert USD to EUR", font=get_font(18), fill=BRAND_INK, anchor="mm")

    return img


def render_transactions_screen() -> Image.Image:
    img = create_phone_base()
    draw = ImageDraw.Draw(img)

    draw.text((44, 88), "Activity", font=get_font(28), fill=INK_LIGHT)

    # Search bar
    sy = 140
    draw.rounded_rectangle((44, sy, PHONE_W - 44, sy + 54), radius=20, fill=SURFACE,
                           outline=(255, 255, 255, 20), width=1)
    draw.text((68, sy + 27), "🔍  Search transactions...", font=get_font(15), fill=INK_MUTED, anchor="lm")

    # Filter chips
    fy = sy + 70
    chips = [("All", True), ("Food", False), ("Shopping", False), ("Travel", False), ("Income", False)]
    cx = 44
    for label, active in chips:
        bg = BRAND if active else SURFACE
        fg = BRAND_INK if active else INK_MUTED
        txt_len = len(label) * 10 + 32
        draw.rounded_rectangle((cx, fy, cx + txt_len, fy + 38), radius=19, fill=bg)
        draw.text((cx + txt_len // 2, fy + 19), label, font=get_font(13), fill=fg, anchor="mm")
        cx += txt_len + 10

    # Grouped Transactions List
    groups = [
        ("TODAY", [
            ("Apple Store", "Hardware", "-,099.00", INK_LIGHT),
            ("Blue Bottle Coffee", "Food & Drink", "-.50", INK_LIGHT),
        ]),
        ("YESTERDAY", [
            ("Whole Foods Market", "Groceries", "-4.20", INK_LIGHT),
            ("Uber Technologies", "Ride & Transport", "-4.50", INK_LIGHT),
        ]),
        ("OCTOBER 24", [
            ("Payroll Direct Deposit", "Income / Salary", "+,500.00", CYAN),
            ("Figma Subscription", "Software Tools", "-44.00", INK_LIGHT),
        ])
    ]

    gy = fy + 58
    for group_title, items in groups:
        draw.text((44, gy), group_title, font=get_font(12), fill=INK_MUTED)
        gy += 22
        for name, cat, amt, amt_col in items:
            draw.rounded_rectangle((44, gy, PHONE_W - 44, gy + 74), radius=18, fill=SURFACE,
                                   outline=(255, 255, 255, 12), width=1)
            draw.rounded_rectangle((58, gy + 15, 102, gy + 59), radius=12, fill=SURFACE_SUBTLE)
            draw.text((80, gy + 37), name[0], font=get_font(19), fill=BRAND, anchor="mm")
            draw.text((118, gy + 20), name, font=get_font(16), fill=INK_LIGHT)
            draw.text((118, gy + 44), cat, font=get_font(13), fill=INK_MUTED)
            draw.text((PHONE_W - 64, gy + 37), amt, font=get_font(16), fill=amt_col, anchor="rm")
            gy += 84
        gy += 14

    draw_tab_bar(img, "home")
    return img

def apply_device_frame(img: Image.Image) -> Image.Image:
    """Round phone corners and add sleek border edge."""
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, PHONE_W - 1, PHONE_H - 1), radius=CORNER_RADIUS, fill=255)
    framed = img.copy()
    framed.putalpha(mask)

    # Add hairline bezel border
    bezel = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(bezel).rounded_rectangle(
        (0, 0, PHONE_W - 1, PHONE_H - 1),
        radius=CORNER_RADIUS,
        outline=(255, 255, 255, 45),
        width=2
    )
    framed.alpha_composite(bezel)
    return framed

def render_hero_banner(shots: dict) -> Image.Image:
    """Compose the showcase hero banner featuring 5 Stack app screens."""
    W, H = 2400, 1260
    canvas = Image.new("RGBA", (W, H), OBSIDIAN + (255,))

    # Ambient brand bloom top center
    bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(bloom)
    b_draw.ellipse((W // 2 - 600, -200, W // 2 + 600, 700), fill=BRAND + (22,))
    b_draw.ellipse((W // 2 - 400, 300, W // 2 + 400, 900), fill=CYAN + (12,))
    bloom = bloom.filter(ImageFilter.GaussianBlur(140))
    canvas.alpha_composite(bloom)

    # 5 phones ordered: Onboarding -> Sign In -> Home (Center) -> Cards -> Send
    keys = ["onboarding", "sign-in", "home", "cards", "send"]
    phone_w = 410
    scale = phone_w / PHONE_W
    phone_h = int(PHONE_H * scale)
    gap = 26
    total_w = 5 * phone_w + 4 * gap
    x0 = (W - total_w) // 2

    # Lifts create an arched elevation where Center (Home) stands out highest
    lifts = [64, 28, 0, 28, 64]

    for i, k in enumerate(keys):
        screen = shots[k]
        framed = apply_device_frame(screen)
        scaled = framed.resize((phone_w, phone_h), Image.Resampling.LANCZOS)

        x = x0 + i * (phone_w + gap)
        y = (H - phone_h) // 2 + lifts[i] + 20

        # Drop shadow
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.rounded_rectangle(
            (x + 4, y + 16, x + phone_w + 4, y + phone_h + 24),
            radius=int(CORNER_RADIUS * scale),
            fill=(0, 0, 0, 160)
        )
        shadow = shadow.filter(ImageFilter.GaussianBlur(32))
        canvas.alpha_composite(shadow)

        canvas.alpha_composite(scaled, (x, y))

    return canvas

def main():
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    print("Rendering Stack screens...")

    screens = {
        "onboarding": render_onboarding_screen(),
        "sign-in": render_signin_screen(),
        "home": render_home_screen(),
        "cards": render_cards_screen(),
        "send": render_send_screen(),
        "convert": render_convert_screen(),
        "transactions": render_transactions_screen(),
    }

    for name, img in screens.items():
        framed = apply_device_frame(img)
        framed.save(SCREENSHOTS / f"{name}.png", optimize=True)
        print(f"  Saved docs/screenshots/{name}.png")

    print("Rendering docs/hero.png...")
    hero = render_hero_banner(screens)
    hero.save(DOCS / "hero.png", optimize=True)
    print("  Saved docs/hero.png")
    print("Screenshot suite complete!")

if __name__ == "__main__":
    main()
