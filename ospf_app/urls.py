from django.urls import path
from ospf_app import views


urlpatterns = [
	path('', views.index, name='index'),
	path('ping/', views.ping_test, name='ping_test'),
]