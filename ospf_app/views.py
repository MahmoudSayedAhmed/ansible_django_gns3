from django.shortcuts import render
import subprocess, json
from django.http import JsonResponse


def index(request):
	DeviceList = [('R1 - Cisco ios', 'R1'), ('R2 - Cisco ios', 'R2'),
	 				('R3 - Junos srx', 'R3'), ('R4 - Cisco ios xr', 'R4'),
	 				('R5 - Cisco ios', 'R5')]
	return render(request, 'ospf_app/index.html', {'DeviceList': DeviceList})


def ping_test(request):
	device = request.POST.get('device_name')
	result = subprocess.Popen(['ansible-playbook', 'ping-playbook.yml', '--extra-vars', 'host='+device ], stdout=subprocess.PIPE)
	output, err = result.communicate()
	return JsonResponse(json.loads(output))



