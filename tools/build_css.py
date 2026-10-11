"""Build cache-versioned CSS assets using Python 3's standard library.

Run from any directory: python tools/build_css.py
Readable sources remain in style.css and css/*.css; HTML loads the .min.css files.
"""
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]


def minify_css(source):
    """Compact whitespace without changing strings, escapes or selector spacing.

    Comments become empty comments to preserve CSS token boundaries. Spaces
    around operators, including calc() +/-, are kept. No value rewriting occurs.
    """
    out = []
    pending_space = False
    index = 0
    while index < len(source):
        char = source[index]
        if source.startswith('/*', index):
            end = source.find('*/', index + 2)
            if end < 0:
                raise ValueError('Unclosed CSS comment')
            if pending_space and out and out[-1][-1] not in '{;,}':
                out.append(' ')
            out.append('/**/')
            pending_space = False
            index = end + 2
            continue
        if char.isspace():
            pending_space = True
            index += 1
            continue
        if pending_space and out and char not in '{};,' and out[-1][-1] not in '{;,}':
            out.append(' ')
        pending_space = False
        if char in '\"\'':
            quote = char
            start = index
            index += 1
            while index < len(source):
                if source[index] == '\\':
                    index += 2
                elif source[index] == quote:
                    index += 1
                    break
                else:
                    index += 1
            else:
                raise ValueError('Unclosed CSS string')
            out.append(source[start:index])
            continue
        if char == '\\' and index + 1 < len(source):
            out.append(source[index:index + 2])
            index += 2
            continue
        out.append(char)
        index += 1
    return ''.join(out).strip() + '\n'


def build():
    sources = [ROOT / 'style.css'] + sorted((ROOT / 'css').glob('*.css'))
    versions = {}
    for source in sources:
        if source.name.endswith('.min.css'):
            continue
        compiled = minify_css(source.read_text(encoding='utf-8')).encode('utf-8')
        target = source.with_name(source.stem + '.min.css')
        target.write_bytes(compiled)
        versions['/' + target.relative_to(ROOT).as_posix()] = hashlib.sha256(compiled).hexdigest()[:12]
    for page in ROOT.glob('*.html'):
        original = page.read_bytes().decode('utf-8')
        def replace_link(match):
            url = match.group(1).split('?', 1)[0]
            if url == '/style.css':
                url = '/style.min.css'
            if url not in versions:
                return match.group(0)
            return 'href="' + url + '?v=' + versions[url] + '"'
        updated = re.sub(r'href="([^\"]+\.css(?:\?[^\"]*)?)"', replace_link, original)
        if updated != original:
            page.write_bytes(updated.encode('utf-8'))
    print('Built ' + str(len(versions)) + ' CSS files; stylesheet versions updated.')


if __name__ == '__main__':
    build()
