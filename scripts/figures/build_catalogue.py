import json
import math
import os
import re
import sys
import unicodedata
import urllib.request

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

CACHE = sys.argv[1]
OUT = sys.argv[2]
LICENSES_OUT = sys.argv[3]
SIZE = 48
CHECK_WIDTH = 40
CHUNK_SIZE = 400
MIN_BEADS = 24
EMOJI_COLOURS = 6
ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
NOTO = 'https://raw.githubusercontent.com/notofonts/notofonts.github.io/main/fonts/{0}/{1}/{0}-Regular.{2}'
NOTO_LICENSE = 'https://raw.githubusercontent.com/notofonts/notofonts.github.io/main/LICENSE'
CLDR = 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-annotations-full/annotations/en/annotations.json'
EMOJI_TEST = 'https://unicode.org/Public/emoji/latest/emoji-test.txt'
UNICODE_LICENSE = 'https://www.unicode.org/license.txt'
FAMILIES = (
    'NotoSans NotoSansSymbols NotoSansSymbols2 NotoSansMath NotoMusic NotoSansEgyptianHieroglyphs '
    'NotoSansAnatolianHieroglyphs NotoSansYi NotoSansCanadianAboriginal NotoSansEthiopic NotoSansArabic '
    'NotoSansHebrew NotoSansDevanagari NotoSansBengali NotoSansGujarati NotoSansGurmukhi NotoSansKannada '
    'NotoSansTelugu NotoSansMalayalam NotoSansOriya NotoSansTamil NotoSansSinhala NotoSansThai NotoSansLao '
    'NotoSansKhmer NotoSansMyanmar NotoSerifTibetan NotoSansMongolian NotoSansGeorgian NotoSansArmenian '
    'NotoSansCherokee NotoSansRunic NotoSansOgham NotoSansTifinagh NotoSansCuneiform NotoSansLinearB '
    'NotoSansLinearA NotoSansBamum NotoSansVai NotoSansCoptic NotoSansGothic NotoSansPhoenician '
    'NotoSansOldItalic NotoSansGlagolitic NotoSansAdlam NotoSansNKo NotoSansJavanese NotoSansBalinese '
    'NotoSansMayanNumerals NotoSansCypriot NotoSansOldPersic NotoSansUgaritic NotoSansDeseret '
    'NotoSansShavian NotoSansOsage NotoSansBuginese NotoSansSundanese NotoSansCham NotoSansTaiTham '
    'NotoSansSoraSompeng NotoSansMeeteiMayek NotoSansOlChiki NotoSansLisu NotoSansMro NotoSansBassaVah'
).split()
SKIP_CATEGORIES = {'Mn', 'Me', 'Cc', 'Cf', 'Cs', 'Co', 'Cn', 'Zs', 'Zl', 'Zp'}
PITCH = {'peyote': (13, 16), 'brick': (16, 13), 'loom': (13, 16)}


def fetch(url, name):
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'bead-chart-figures'})
            with urllib.request.urlopen(request, timeout=60) as response:
                data = response.read()
        except Exception:
            return None
        with open(path + '.part', 'wb') as handle:
            handle.write(data)
        os.replace(path + '.part', path)
    return path


def chart_cells(pixels, stitch, width):
    pitch_x, pitch_y = PITCH[stitch]
    height = math.floor(width * pitch_x / pitch_y + 0.5)
    extent_x = width + (0.5 if stitch == 'brick' and height > 1 else 0)
    extent_y = height + (0.5 if stitch == 'peyote' and width > 1 else 0)
    cells = []
    for row in range(height):
        for col in range(width):
            x = col + (0.5 if stitch == 'brick' and row % 2 == 1 else 0)
            lifted = stitch == 'peyote' and col % 2 != (width - 1) % 2
            y = row + (0.5 if lifted else 0)
            sx = min(SIZE - 1, math.floor((x + 0.5) / extent_x * SIZE))
            sy = min(SIZE - 1, max(0, math.floor((1 - (y + 0.5) / extent_y) * SIZE)))
            cells.append(pixels[sy * SIZE + sx])
    return bytes(cells)


def dedupe_key(pixels, palette):
    parts = [chart_cells(pixels, stitch, CHECK_WIDTH) for stitch in PITCH]
    if sum(1 for value in parts[0] if value) < MIN_BEADS or all(parts[0]):
        return None
    return palette + b'|' + b'|'.join(parts)


def encode(pixels):
    tokens = []
    index = 0
    while index < len(pixels):
        value = pixels[index]
        run = 1
        while index + run < len(pixels) and pixels[index + run] == value and run < 512:
            run += 1
        token = value * 512 + run - 1
        tokens.append(ALPHABET[token >> 6] + ALPHABET[token & 63])
        index += run
    return ''.join(tokens)


def fit(image):
    box = image.getbbox()
    if box is None:
        return None
    image = image.crop(box)
    scale = SIZE / max(image.width, image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    image = image.resize(target, Image.LANCZOS)
    canvas = Image.new(image.mode, (SIZE, SIZE))
    canvas.paste(image, ((SIZE - target[0]) // 2, (SIZE - target[1]) // 2))
    return canvas


def font_licence_ok(font):
    names = [record.toUnicode() for record in font['name'].names if record.nameID in (13, 14)]
    text = ' '.join(names)
    return 'Open Font License' in text or 'scripts.sil.org/OFL' in text or 'openfontlicense' in text


def label(family):
    words = re.sub(r'^Noto(Sans|Serif)?', '', family)
    return re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', words) or 'Latin, Greek and Cyrillic'


def keywords_for(char, name, annotations):
    entry = annotations.get(char, {})
    words = entry.get('default') or re.split(r'[\s-]+', name)
    return ' '.join(dict.fromkeys(word.lower() for word in words if word))


def glyph_figures(family, path, annotations, seen, figures, sources):
    font = TTFont(path, lazy=True)
    if not font_licence_ok(font):
        sources.append({'id': family, 'kept': False})
        return
    sources.append({'id': family, 'kept': True, 'label': label(family)})
    cmap = font.getBestCmap()
    pil = ImageFont.truetype(path, 160)
    for codepoint in sorted(cmap):
        char = chr(codepoint)
        if unicodedata.category(char) in SKIP_CATEGORIES or 'u%x' % codepoint in seen['ids']:
            continue
        canvas = Image.new('L', (420, 420))
        ImageDraw.Draw(canvas).text((210, 210), char, font=pil, fill=255, anchor='mm')
        fitted = fit(canvas)
        if fitted is None:
            continue
        pixels = bytes(1 if value >= 110 else 0 for value in fitted.getdata())
        key = dedupe_key(pixels, b'')
        if key is None or key in seen['keys']:
            continue
        seen['keys'].add(key)
        seen['ids'].add('u%x' % codepoint)
        name = unicodedata.name(char, 'glyph %04X' % codepoint).lower()
        figures.append(['u%x' % codepoint, name, keywords_for(char, name, annotations), label(family), family, encode(pixels), ''])


def emoji_list(path):
    entries = []
    group = ''
    for line in open(path, encoding='utf-8'):
        if line.startswith('# group:'):
            group = line.split(':', 1)[1].strip()
        if '; fully-qualified' not in line or group == 'Component':
            continue
        points = [int(part, 16) for part in line.split(';')[0].split()]
        points = [point for point in points if point != 0xFE0F]
        if len(points) == 1:
            entries.append((points[0], group))
    return entries


def emoji_pixels(folder, codepoint):
    path = os.path.join(folder, 'emoji_u%04x.png' % codepoint)
    if not os.path.exists(path):
        return None, None
    fitted = fit(Image.open(path).convert('RGBA'))
    if fitted is None:
        return None, None
    opaque = [pixel for pixel in fitted.getdata() if pixel[3] >= 128]
    if not opaque:
        return None, None
    strip = Image.new('RGB', (len(opaque), 1))
    strip.putdata([pixel[:3] for pixel in opaque])
    quantised = strip.quantize(colors=EMOJI_COLOURS, method=Image.Quantize.MEDIANCUT)
    raw = quantised.getpalette()
    indices = iter(quantised.getdata())
    pixels = bytes(next(indices) + 1 if pixel[3] >= 128 else 0 for pixel in fitted.getdata())
    used = sorted(set(pixels) - {0})
    remap = {old: new + 1 for new, old in enumerate(used)}
    pixels = bytes(remap.get(value, 0) for value in pixels)
    palette = ['#%02x%02x%02x' % tuple(raw[(old - 1) * 3:(old - 1) * 3 + 3]) for old in used]
    return pixels, ','.join(palette)


def emoji_figures(folder, test_path, annotations, seen, figures):
    for codepoint, group in emoji_list(test_path):
        char = chr(codepoint)
        pixels, palette = emoji_pixels(folder, codepoint)
        if pixels is None:
            continue
        key = dedupe_key(pixels, palette.encode())
        if key is None or key in seen['keys']:
            continue
        seen['keys'].add(key)
        entry = annotations.get(char, {})
        name = (entry.get('tts') or [unicodedata.name(char, 'emoji').lower()])[0]
        figures.append(['e%x' % codepoint, name, keywords_for(char, name, annotations), group, 'NotoEmoji', encode(pixels), palette])


def write_ts(path, header, rows):
    with open(path, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(header + json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + ';\n')


def main():
    os.makedirs(CACHE, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(LICENSES_OUT, exist_ok=True)
    for stale in os.listdir(OUT):
        os.remove(os.path.join(OUT, stale))
    annotations = json.load(open(fetch(CLDR, 'annotations.json'), encoding='utf-8'))['annotations']['annotations']
    seen = {'keys': set(), 'ids': set()}
    figures = []
    sources = []
    for family in FAMILIES:
        path = None
        for folder, ext in (('hinted/ttf', 'ttf'), ('unhinted/ttf', 'ttf'), ('unhinted/otf', 'otf')):
            path = path or fetch(NOTO.format(family, folder, ext), family + '.' + ext)
        if path is None:
            sources.append({'id': family, 'kept': False, 'missing': True})
            continue
        glyph_figures(family, path, annotations, seen, figures, sources)
        print(family, len(figures), flush=True)
    emoji_root = sys.argv[4]
    emoji_figures(os.path.join(emoji_root, '2D', 'png', '72'), fetch(EMOJI_TEST, 'emoji-test.txt'), annotations, seen, figures)
    sources.append({'id': 'NotoEmoji', 'kept': True, 'label': 'Emoji'})
    with open(os.path.join(emoji_root, 'LICENSE'), 'rb') as source, open(os.path.join(LICENSES_OUT, 'Apache-2.0-noto-emoji.txt'), 'wb') as target:
        target.write(source.read())
    print('emoji', len(figures), flush=True)
    figures.sort(key=lambda row: (row[3], row[0]))
    head = "import type { FigureChunkRow } from '../figureTypes';\n\nexport const FIGURE_CHUNK: readonly FigureChunkRow[] = "
    index = []
    chunk_count = math.ceil(len(figures) / CHUNK_SIZE)
    for chunk in range(chunk_count):
        rows = figures[chunk * CHUNK_SIZE:(chunk + 1) * CHUNK_SIZE]
        write_ts(os.path.join(OUT, 'chunk%02d.ts' % chunk), head, [[row[0], row[5], row[6]] for row in rows])
        index.extend([row[0], row[1], row[2], row[3], row[4], chunk] for row in rows)
    write_ts(os.path.join(OUT, 'figureIndex.ts'), "import type { FigureIndexRow } from '../figureTypes';\n\nexport const FIGURE_INDEX: readonly FigureIndexRow[] = ", index)
    kept = [source for source in sources if source.get('kept')]
    write_ts(os.path.join(OUT, 'figureFamilies.ts'), "export const FIGURE_FAMILIES: readonly (readonly [string, string])[] = ", [[s['id'], s['label']] for s in kept])
    loaders = ',\n'.join("  () => import('./chunk%02d')" % chunk for chunk in range(chunk_count))
    with open(os.path.join(OUT, 'chunkLoaders.ts'), 'w', encoding='utf-8', newline='\n') as handle:
        handle.write("import type { FigureChunkModule } from '../figureTypes';\n\nexport const CHUNK_LOADERS: readonly (() => Promise<FigureChunkModule>)[] = [\n" + loaders + ',\n];\n')
    for url, name in ((NOTO_LICENSE, 'OFL-1.1-noto-fonts.txt'), (UNICODE_LICENSE, 'Unicode-3.0.txt')):
        with open(fetch(url, name), 'rb') as source, open(os.path.join(LICENSES_OUT, name), 'wb') as target:
            target.write(source.read())
    json.dump(sources, open(os.path.join(CACHE, 'sources-report.json'), 'w'), indent=1)
    print('total', len(figures), 'chunks', chunk_count, 'dropped', [s['id'] for s in sources if not s.get('kept')])


main()
