from django.forms import ModelForm
from .models import Request

class RequestForm(ModelForm):
    class Meta:
        model = Request
        fields = "__all__"
    
    def __init__(self):
        super().__init__()
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = "form-control"