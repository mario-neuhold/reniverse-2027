import json
import time
import urllib.parse
import urllib.request

UA = "reniverse/0.1 (https://github.com/mario-neuhold/reniverse-2027)"


def get(path, **params):
    params["fmt"] = "json"
    url = "https://musicbrainz.org/ws/2/" + path + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    time.sleep(1.1)
    return json.load(urllib.request.urlopen(req, timeout=30))
