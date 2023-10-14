import json
from django.http import JsonResponse
from .models import Request, Evaluation
from .serializers import RequestSerializer, EvaluationSerializer
from django.core.files.storage import FileSystemStorage

def get_request(request):
    data = json.loads(request.body or "{}")
    request = Request.objects.get(**data)
    request = RequestSerializer(request)
    return JsonResponse({"status": "success", "request": request.data})

def get_requests(request):
    if request.method == "POST":
        data = json.loads(request.body or "{}")
        requests = Request.objects.filter(**data)
        requests = RequestSerializer(requests, many=True)
        return JsonResponse({"status": "success", "requests": requests.data})

def save_request(request):
    data = json.loads(request.body)
    if "id" in data:
        del data["created_by"]
        r = Request.objects.get(id=data["id"])
        for k, v in data.items():
            setattr(r, k, v)
        r.save()
    else:
        Request.objects.create(created_by=request.user, **data)
    return JsonResponse({"status": "success", "requests": RequestSerializer(Request.objects, many=True).data})

def delete_request(request):
    data = json.loads(request.body)
    Request.objects.get(id=data["id"]).delete()
    return JsonResponse({"status": "success", "requests": RequestSerializer(Request.objects, many=True).data})

def upload(request):
    fileSystemStorage = FileSystemStorage("media/")
    file = fileSystemStorage.save(request.FILES["file"].name, request.FILES["file"])
    return JsonResponse({"status": "success", "file": file})

def upload_files(request):
    fileSystemStorage = FileSystemStorage("media/")
    files = []
    for filename, file in request.FILES.items():
        file = fileSystemStorage.save(filename, file)
        files.append(file)
    return JsonResponse({"status": "success", "files": files})

def get_evaluation(request):
    data = json.loads(request.body or "{}")
    evaluation = Evaluation.objects.get(**data)
    evaluation = EvaluationSerializer(evaluation)
    return JsonResponse({"status": "success", "evaluation": evaluation.data})

def get_evaluations(request):
    data = json.loads(request.body or "{}")
    evaluations = Evaluation.objects.filter(**data)
    evaluations = EvaluationSerializer(evaluations, many=True)
    return JsonResponse({"status": "success", "evaluations": evaluations.data})

def create_evaluation(request):
    data = json.loads(request.body)
    for evaluator in data["evaluators"]:
        Evaluation.objects.create(request_id=data["request_id"], evaluator_id=evaluator, note=data["note"], created_by=request.user)
    return JsonResponse({"status": "success", "evaluations": EvaluationSerializer(Evaluation.objects.filter(request_id=data["request_id"]), many=True).data})

def save_evaluation(request):
    data = json.loads(request.body)
    e = Evaluation.objects.get(id=data["id"])
    for k, v in data.items():
        setattr(e, k, v)
    e.save()
    return JsonResponse({"status": "success", "evaluations": EvaluationSerializer(Evaluation.objects, many=True).data})

def delete_evaluation(request):
    data = json.loads(request.body)
    Evaluation.objects.get(**data).delete()
    return JsonResponse({"status": "success", "evaluations": EvaluationSerializer(Evaluation.objects, many=True).data})
