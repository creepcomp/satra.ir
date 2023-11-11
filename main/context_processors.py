import json

def config(request):
    return {"config": json.load(open("config/config.json", encoding="utf8"))}
