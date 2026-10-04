#!/usr/bin/env python3
"""Site crawler for SEO audits (run against a local production build: npm run preview, then python3 scripts/audit-crawl.py http://localhost:3001 crawl.json).
usage: crawl.py BASE OUT.json [--max 500]
Crawls every internal HTML page reachable from BASE and the sitemap, then checks every linked asset.
Reports: status codes, redirects inside internal links, titles/descriptions (length + duplicates), canonicals,
robots meta, H1 count, image alt coverage, JSON-LD validity/types, placeholder text, orphans vs sitemap, FAQ sections
without FAQPage schema, thin pages, and pages in the sitemap that are noindex."""
import json, re, sys, time, urllib.request, urllib.error, urllib.parse, concurrent.futures as cf
from html.parser import HTMLParser

BASE = sys.argv[1].rstrip("/")
OUT = sys.argv[2]
MAX = int(sys.argv[sys.argv.index("--max") + 1]) if "--max" in sys.argv else 600
HOST = urllib.parse.urlparse(BASE).netloc
PLACEHOLDERS = [r"111-111-1111", r"\blorem\b", r"\bTODO\b", r"\bundefined\b", r"\bNaN\b", r"\[object Object\]", r"Sample data", r"placeholder", r"coming soon", r"xxx"]

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title=""; self._in_title=False; self.meta={}; self.links=[]; self.canonical=None; self.robots=None
        self.h1=[]; self._h=None; self.h2=0; self.imgs=[]; self.jsonld=[]; self._in_ld=False; self._skip=0; self.text=[]
        self.og={}; self.forms=0; self.buttons=0; self.iframes=0; self.assets=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=="title": self._in_title=True
        elif tag=="meta":
            n=a.get("name") or a.get("property")
            if n: self.meta[n.lower()]=a.get("content","")
        elif tag=="link":
            if a.get("rel")=="canonical": self.canonical=a.get("href")
        elif tag=="a" and a.get("href"): self.links.append((a["href"], a.get("rel","")))
        elif tag=="h1": self._h="h1"; self.h1.append("")
        elif tag=="h2": self.h2+=1; self._h="h2"
        elif tag=="img": self.imgs.append({"src":a.get("src",""),"alt":a.get("alt"),"w":a.get("width"),"h":a.get("height"),"loading":a.get("loading"),"fetchpriority":a.get("fetchpriority")});
        elif tag=="script":
            if a.get("type")=="application/ld+json": self._in_ld=True; self.jsonld.append("")
            else: self._skip+=1
        elif tag in ("style","noscript","template"): self._skip+=1
        elif tag=="form": self.forms+=1
        elif tag=="button": self.buttons+=1
        elif tag=="iframe": self.iframes+=1
        if tag in ("img","source") and (a.get("src") or a.get("srcset")):
            src=a.get("src") or a.get("srcset","").split(",")[0].split()[0]
            self.assets.append(src)
    def handle_endtag(self, tag):
        if tag=="title": self._in_title=False
        elif tag in ("h1","h2"): self._h=None
        elif tag=="script":
            if self._in_ld: self._in_ld=False
            elif self._skip: self._skip-=1
        elif tag in ("style","noscript","template") and self._skip: self._skip-=1
    def handle_data(self, d):
        if self._in_title: self.title+=d
        if self._in_ld: self.jsonld[-1]+=d; return
        if self._skip: return
        if self._h=="h1" and self.h1: self.h1[-1]+=d
        self.text.append(d)

def fetch(url, method="GET"):
    """Return (status, final_url, hops, headers, body_bytes or None, elapsed)."""
    hops=0; cur=url; t0=time.time()
    for _ in range(6):
        req=urllib.request.Request(cur, method=method, headers={"User-Agent":"NES-audit/1.0","Accept":"text/html,*/*"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body=r.read() if method=="GET" else None
                return r.status, cur, hops, dict(r.headers), body, time.time()-t0
        except urllib.error.HTTPError as e:
            if e.code in (301,302,307,308) and e.headers.get("Location"):
                hops+=1; cur=urllib.parse.urljoin(cur, e.headers["Location"]); continue
            return e.code, cur, hops, dict(e.headers), None, time.time()-t0
        except Exception as e:  # noqa
            return 0, cur, hops, {"error":str(e)}, None, time.time()-t0
    return 0, cur, hops, {"error":"too many redirects"}, None, time.time()-t0

def norm(href, base):
    u=urllib.parse.urljoin(base, href.split("#")[0])
    p=urllib.parse.urlparse(u)
    if p.scheme not in ("http","https"): return None
    return urllib.parse.urlunparse(p._replace(fragment=""))
def internal(u): return urllib.parse.urlparse(u).netloc==HOST

# ---- sitemap
sm=set()
st,_,_,_,body,_=fetch(BASE+"/sitemap.xml")
if body:
    for loc in re.findall(r"<loc>(.*?)</loc>", body.decode()):
        loc=loc.strip()
        sm.add(loc.replace(urllib.parse.urlparse(loc).scheme+"://"+urllib.parse.urlparse(loc).netloc, BASE))
print(f"sitemap: {len(sm)} urls (status {st})")

pages={}; queue=[BASE+"/"]+sorted(sm); seen=set(queue); linked_from={}; assets={}
def crawl(url):
    st,final,hops,hdr,body,el=fetch(url)
    rec={"url":url,"status":st,"final":final,"hops":hops,"ms":int(el*1000),"ctype":hdr.get("Content-Type","")}
    if body and "text/html" in rec["ctype"]:
        p=P(); p.feed(body.decode("utf-8","replace"))
        text=re.sub(r"\s+"," "," ".join(p.text)).strip()
        lds=[]; ld_err=[]
        for raw in p.jsonld:
            try:
                d=json.loads(raw); items=d.get("@graph",[d]) if isinstance(d,dict) else d
                for it in items: lds.append(it.get("@type") if isinstance(it,dict) else str(type(it)))
            except Exception as e: ld_err.append(str(e)[:80])
        rec.update({"bytes":len(body),"title":p.title.strip(),"description":p.meta.get("description"),"canonical":p.canonical,"robots":p.meta.get("robots"),
                    "og_title":p.meta.get("og:title"),"og_image":p.meta.get("og:image"),"h1":[re.sub(r"\s+"," ",h).strip() for h in p.h1],"h2":p.h2,
                    "imgs":len(p.imgs),"imgs_no_alt":[i["src"][:80] for i in p.imgs if i["alt"] is None],"imgs_empty_alt":sum(1 for i in p.imgs if i["alt"]==""),
                    "jsonld":lds,"jsonld_errors":ld_err,"words":len(text.split()),"forms":p.forms,"iframes":p.iframes,
                    "placeholders":sorted({m.group(0) for pat in PLACEHOLDERS for m in re.finditer(pat,text,re.I)}),
                    "faq_heading":bool(re.search(r"\bFAQ\b|Frequently asked|Common questions",text)),
                    "links":[], "ext_links":0})
        for href,rel in p.links:
            u=norm(href,final)
            if not u: continue
            if internal(u): rec["links"].append(u)
            else: rec["ext_links"]+=1
        rec["assets"]=[norm(a,final) for a in p.assets if norm(a,final) and internal(norm(a,final))]
    return rec

with cf.ThreadPoolExecutor(8) as ex:
    while queue and len(pages)<MAX:
        batch=queue[:16]; queue=queue[16:]
        for rec in ex.map(crawl,batch):
            pages[rec["url"]]=rec
            for l in rec.get("links",[]):
                linked_from.setdefault(l,set()).add(rec["url"])
                if l not in seen and len(seen)<MAX*3 and not re.search(r"\.(pdf|jpg|jpeg|png|webp|svg|xml|txt|ico)$",l,re.I) and "/_next/" not in l and "/api/" not in l and "/admin" not in l:
                    seen.add(l); queue.append(l)
            for a in rec.get("assets",[]): assets.setdefault(a,set()).add(rec["url"])
        print(f"  crawled {len(pages)} / queued {len(queue)}", end="\r")
print()

# ---- assets + non-HTML link targets (HEAD)
targets={}
for u,refs in list(assets.items()):
    targets.setdefault(u,set()).update(refs)
for p in pages.values():
    for l in p.get("links",[]):
        if l not in pages: targets.setdefault(l,set()).update(linked_from.get(l,set()))
def head(u):
    st,final,hops,hdr,_,_=fetch(u,"HEAD")
    if st in (405,403,0): st,final,hops,hdr,_,_=fetch(u,"GET")
    return u,st,hops,final
asset_results={}
with cf.ThreadPoolExecutor(8) as ex:
    for u,st,hops,final in ex.map(head,sorted(targets)[:1500]): asset_results[u]={"status":st,"hops":hops,"final":final,"refs":sorted(targets[u])[:3]}

# ---- analysis
html=[p for p in pages.values() if p.get("title") is not None]
indexable=[p for p in html if p["status"]==200 and not (p.get("robots") and "noindex" in p["robots"])]
def dupes(key):
    m={}
    for p in indexable: m.setdefault((p.get(key) or "").strip(),[]).append(p["url"])
    return {k:v for k,v in m.items() if k and len(v)>1}
report={
 "base":BASE,"pages":len(pages),"html_pages":len(html),"indexable":len(indexable),"sitemap_urls":len(sm),
 "non200":[{"url":p["url"],"status":p["status"],"refs":sorted(linked_from.get(p["url"],[]))[:3]} for p in pages.values() if p["status"]!=200],
 "redirecting_internal_links":[{"url":p["url"],"final":p["final"],"hops":p["hops"],"refs":sorted(linked_from.get(p["url"],[]))[:3]} for p in pages.values() if p["hops"]>0],
 "broken_assets":[{"url":u,**r} for u,r in asset_results.items() if r["status"]>=400 or r["status"]==0],
 "redirecting_assets":[{"url":u,**r} for u,r in asset_results.items() if r["hops"]>0],
 "missing_title":[p["url"] for p in html if not p["title"]],
 "missing_description":[p["url"] for p in indexable if not p.get("description")],
 "long_description":[{"url":p["url"],"len":len(p["description"])} for p in indexable if p.get("description") and len(p["description"])>160],
 "short_description":[{"url":p["url"],"len":len(p["description"])} for p in indexable if p.get("description") and len(p["description"])<70],
 "long_title":[{"url":p["url"],"len":len(p["title"])} for p in indexable if len(p["title"])>65],
 "missing_canonical":[p["url"] for p in indexable if not p.get("canonical")],
 "canonical_mismatch":[{"url":p["url"],"canonical":p["canonical"]} for p in indexable if p.get("canonical") and p["url"] in sm and p["canonical"].rstrip("/")!=p["url"].rstrip("/")],
 "h1_not_one":[{"url":p["url"],"h1":p["h1"]} for p in html if p["status"]==200 and len(p["h1"])!=1],
 "imgs_no_alt":[{"url":p["url"],"imgs":p["imgs_no_alt"]} for p in html if p["imgs_no_alt"]],
 "jsonld_errors":[{"url":p["url"],"errors":p["jsonld_errors"]} for p in html if p["jsonld_errors"]],
 "no_jsonld":[p["url"] for p in indexable if not p["jsonld"]],
 "faq_without_schema":[p["url"] for p in indexable if p["faq_heading"] and "FAQPage" not in json.dumps(p["jsonld"])],
 "placeholders":[{"url":p["url"],"found":p["placeholders"]} for p in html if p["placeholders"]],
 "thin_pages":[{"url":p["url"],"words":p["words"]} for p in indexable if p["words"]<250],
 "no_og_image":[p["url"] for p in indexable if not p.get("og_image")],
 "duplicate_titles":dupes("title"),"duplicate_descriptions":dupes("description"),
 "noindex_in_sitemap":[p["url"] for p in html if p["url"] in sm and p.get("robots") and "noindex" in p["robots"]],
 "orphans":sorted(u for u in sm if u not in linked_from and u!=BASE+"/"),
 "not_in_sitemap":sorted(p["url"] for p in indexable if p["url"] not in sm and "?" not in p["url"] and p.get("canonical","").rstrip("/")==p["url"].rstrip("/")),
 "slowest":sorted(({"url":p["url"],"ms":p["ms"],"kb":p.get("bytes",0)//1024} for p in html),key=lambda x:-x["ms"])[:8],
 "largest":sorted(({"url":p["url"],"kb":p.get("bytes",0)//1024} for p in html),key=lambda x:-x["kb"])[:8],
}
json.dump({"report":report,"pages":pages,"assets":asset_results},open(OUT,"w"),indent=1,default=list)
print(json.dumps({k:(v if isinstance(v,int) else len(v)) for k,v in report.items() if k!="base"},indent=1))
