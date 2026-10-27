"""Open a built book in headless Chromium and take screenshots, run checks, or evaluate JS.

usage:
  python3 tools/shot.py <book> spreads            one screenshot per spread at rest  -> <book>/shots/s<n>.png
  python3 tools/shot.py <book> steps '<json>'      [{"name", "js", "frames", "dt"}, ...] -> <book>/shots/<name>.png
  python3 tools/shot.py <book> audit              layout audit of every spread (cards cut off, text covered)
  python3 tools/shot.py <book> eval '<js expr>' ...  print the JSON value of each expression
options (env): SIZE=930x700  DPR=1.5  P=<start spread>
The page runs in test mode: no animation loop, frames are stepped by window.__app.frame(dt, n);
window.__app has jump(n), mech(n), card(n, id, k), tapCard(n, id, k), toScreen(x, y, z), audit(n), info().
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NM = os.path.join(ROOT, 'vendor', 'node_modules')
CDN = {'https://cdn.jsdelivr.net/npm/three@0.169.0/': f'{NM}/three/', 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/': f'{NM}/mathjax/'}


def open_book(p, book, P=0):
    W, H = map(int, os.environ.get('SIZE', '930x700').split('x'))
    dpr = float(os.environ.get('DPR', '1.5'))
    dist = os.path.join(os.path.abspath(book), 'dist')

    def route(r):
        u = r.request.url
        for pre, local in CDN.items():
            if u.startswith(pre):
                f = local + u[len(pre):]
                return r.fulfill(status=200, body=open(f, 'rb').read(), headers={'content-type': 'application/javascript'})
        if u.startswith('https://local.test/a/'):
            f = os.path.join(dist, 'a', u.split('/a/')[1])
            if os.path.exists(f): return r.fulfill(status=200, body=open(f, 'rb').read(), headers={'content-type': 'image/webp'})
            print('MISSING', u); return r.fulfill(status=404, body='')
        if u.startswith('https://local.test/'):
            return r.fulfill(status=200, body=open(os.path.join(dist, 'index.html'), 'rb').read(), headers={'content-type': 'text/html; charset=utf-8'})
        print('BLOCKED', u); return r.abort()

    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=dpr)
    pg.on('console', lambda m: print('console', m.type, m.text[:400]) if m.type in ('error', 'warning') else None)
    pg.on('pageerror', lambda e: print('PAGEERROR', e))
    pg.route('**/*', route)
    pg.add_init_script('window.__TEST__ = %s;' % json.dumps({'P': P}))
    t0 = time.time()
    pg.goto('https://local.test/index.html')
    pg.wait_for_function('window.__ready === true || window.__ready === "error"', timeout=300000)
    print('ready %.1fs' % (time.time() - t0), pg.evaluate('JSON.stringify(window.__app.info())'))
    return b, pg


def main():
    book, cmd = sys.argv[1], sys.argv[2]
    out = os.path.join(os.path.abspath(book), 'shots'); os.makedirs(out, exist_ok=True)
    with sync_playwright() as p:
        b, pg = open_book(p, book, int(os.environ.get('P', '1')))
        n = pg.evaluate('window.__app.n')
        if cmd == 'spreads':
            for i in range(1, n + 1):
                pg.evaluate(f'window.__app.jump({i}); window.__app.frame(0.016, 2)')
                pg.screenshot(path=f'{out}/s{i}.png'); print('shot', f'{out}/s{i}.png')
        elif cmd == 'steps':
            for st in json.loads(sys.argv[3]):
                if st.get('js'): pg.evaluate(st['js'])
                if st.get('frames'): pg.evaluate(f"window.__app.frame({st.get('dt', 0.016)}, {st['frames']})")
                pg.screenshot(path=f"{out}/{st['name']}.png"); print('shot', f"{out}/{st['name']}.png")
        elif cmd == 'audit':
            bad = 0
            for i in range(1, n + 1):
                res = pg.evaluate(f'window.__app.audit({i})')
                title = pg.evaluate(f'window.__app.title({i})')
                print(f'--- spread {i} {title}: ' + ('ok' if not res else f'{len(res)} issue(s)'))
                for r in res: print('   ', json.dumps(r, ensure_ascii=False))
                bad += len(res)
            print('audit:', 'clean' if not bad else f'{bad} issue(s)')
        elif cmd == 'eval':
            for e in sys.argv[3:]: print(json.dumps(pg.evaluate(e), ensure_ascii=False))
        b.close()


if __name__ == '__main__':
    main()
