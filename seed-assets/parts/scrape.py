"""Crawl rippagroup.ca parts categories: products per category (with pagination) + images. Output rippagroup-parts.json."""
import re, json, html, hashlib, os, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
BASE="https://www.rippagroup.ca"; UA={"User-Agent":"Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
OUT=os.path.dirname(os.path.abspath(__file__)); IMG=os.path.join(OUT,"images")
def get(url, retries=3):
    for i in range(retries):
        try:
            req=urllib.request.Request(url, headers=UA); return urllib.request.urlopen(req, timeout=60).read()
        except Exception as e:
            time.sleep(2*(i+1))
    return b""
cats=json.load(open(os.path.join(OUT,"categories.json")))
CARD=re.compile(r'<form[^>]*class="[^"]*oe_product_cart[^"]*"[^>]*>(.*?)</form>', re.S)
LINK=re.compile(r'href="(/en/shop/(?!category/)([^"?/]+?)-(\d+))(?:\?[^"]*)?"')
TITLE=re.compile(r'<h6[^>]*o_wsale_products_item_title[^>]*>(.*?)</h6>', re.S)
products={}; membership={}
def crawl_cat(c):
    found=[]; page=1
    while True:
        url=f"{BASE}{c['href']}" + (f"/page/{page}" if page>1 else "")
        h=get(url).decode("utf8","ignore")
        cards=CARD.findall(h)
        if not cards: break
        for block in cards:
            l=LINK.search(block); t=TITLE.search(block)
            if not l: continue
            href,slug,pid=l.groups(); name=html.unescape(re.sub(r"<[^>]+>","",t.group(1))).strip() if t else slug
            found.append((pid,slug,name))
        # Odoo pagers are inconsistent; keep going until a page repeats or is empty.
        ids=[c[0] for c in found]
        if len(found) >= 2 and ids.count(ids[-1]) > 1: found=found[:-len(cards)]; break
        if len(cards) < 20: break
        page+=1
        if page > 60: break
    return c, found
t0=time.time()
with ThreadPoolExecutor(8) as ex:
    for c,found in ex.map(crawl_cat, cats):
        for pid,slug,name in found:
            p=products.setdefault(pid,{"id":pid,"slug":slug,"name":name,"url":f"{BASE}/en/shop/{slug}-{pid}","imageUrl":f"{BASE}/web/image/product.template/{pid}/image_1024","categories":[]})
            if c["href"] not in p["categories"]: p["categories"].append(c["href"])
        print(f"{c['slug']}: {len(found)}", flush=True)
print("products:", len(products), "in", round(time.time()-t0), "s", flush=True)
for p in products.values():
    m=re.match(r"^(lp\d{6,12})", p["slug"]); p["sku"]=m.group(1).upper() if m else None
# images
os.makedirs(IMG, exist_ok=True); hashes={}
def dl(p):
    path=os.path.join(IMG, f"{p['id']}.img")
    if not os.path.exists(path):
        b=get(p["imageUrl"]); 
        if not b: return p["id"], None
        open(path,"wb").write(b)
    b=open(path,"rb").read(); return p["id"], hashlib.md5(b).hexdigest()
with ThreadPoolExecutor(8) as ex:
    for pid,h in ex.map(dl, list(products.values())):
        if h: hashes.setdefault(h,[]).append(pid)
# the Odoo placeholder is the single most-shared image; flag it
common=max(hashes.items(), key=lambda kv: len(kv[1])) if hashes else (None,[])
print("most shared image hash", common[0], "count", len(common[1]), flush=True)
for h,pids in hashes.items():
    for pid in pids: products[pid]["imageHash"]=h; products[pid]["hasImage"]= (h!=common[0] or len(common[1])<5)
json.dump(list(products.values()), open(os.path.join(OUT,"rippagroup-parts.json"),"w"), indent=1)
print("done", flush=True)
