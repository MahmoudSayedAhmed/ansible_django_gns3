function ValidateIPaddress(inputText){

    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(3[0-2]|2[0-9]|1[0-9]|[1-9])$/
    if(inputText.match(ipformat)){
      return true;
    }else{
      return false;
    }
}

function CommitNotif(d){
    if (d.result == true){
        swal({
            title:"Commit Succssfully",
            buttons: {
                cancel: false,
                confirm: "OK!"
            }
        }).then( val => {
            if(val)  {
                location.reload()
            }
        })
    }
    else{
        swal({
            title:"Commit Failed !!",
            buttons: {
                cancel: false,
                confirm: "OK!"
            }
        })
    }



}

$(document).ready(function(){


    $(document).on("click",'input[id^="portBtn"]',function(){
        var f_num = $(this).attr('title');
        if($(this).val() == "Range"){
            $("#port"+f_num).children().remove();
            $("#port"+f_num).append("<input type='number' class='form-control' id='from_port"+f_num+"' name='from_port"+f_num+"' placeholder='From Port' required>")
            $("#port"+f_num).append("<input type='number' class='form-control' id='to_port"+f_num+"' name='to_port"+f_num+"' placeholder='To Port' required>");
            $(this).val("Single")
        }
        else if($(this).val() == "Single"){
            $("#port"+f_num).children().remove();
            $("#port"+f_num).append("<input type='number' class='single_port form-control' id='single_port"+f_num+"' name='single_port"+f_num+"' placeholder='Single Port' required>");
            $(this).val("Range")
        }
    });


    $(document).on("focusout",'input[id^="Address_ip"]',function(){
        var f_num = $(this).attr('title');
        $("#address"+f_num+" span").remove();
        var ip = $(this).val();
        if(!ValidateIPaddress(ip)){
            $(this).val('');
            $( "<span style='color:red'>Invalid IP</span>" ).insertAfter( "#Address_ip"+f_num );
        }
    });


    $(document).on("focusin",'input[id^="Address_ip"]',function(){
        var f_num = $(this).attr('title');
        $("#address"+f_num+" span").remove();
    });


    $(document).on("focusout",'input[id^="address_name"]',function(){
        var f_num = $(this).attr('title');
        var address_name = $(this).val();
        var device_name = $('#device_name'+f_num).val();
        var log_sys =$('#logical_system'+f_num).val();
        var zone =$('#zone'+f_num).val();
        if(log_sys == undefined || log_sys == '') alert("Please add logical system")
        else if(zone == undefined || zone == '') alert("Please add zone")
        else{
            $.ajax({
                url: '/FW/ajax/check_address_name',
                data: {
                'address_name': address_name,
                'device': device_name,
                'logicalsys': log_sys,
                'zone': zone,
                },
                dataType: 'json',
                success: function (data) {
                if(data.data == "True")
                    $( "<span style='color:red'>Address-Book Name already exists</span>" ).insertAfter( "#address_name"+f_num );
                }
            });
        }
    });

    $(document).on("focusin",'input[id^="address_name"]',function(){
        var f_num = $(this).attr('title');
        $(".add_name"+f_num+" span").remove();
    });


    $("#confirm").click(function(e){
        e.preventDefault();
        device_name=$("select[name='device-name']").val()
        logical_system=$("select[name='logical_systems']").val()
        policy_name=$("input[name='policy_name']").val()
        from_zone=($("select[name='from_zone']").val())
        to_zone=($("select[name='to_zone']").val())
        app=($("select[name='app[]']").val())
        log=($("select[name='log']").val())
        // src_ip=($("select[name='source_ip[]']").val())
        // des_ip=($("select[name='dest_ip[]']").val())
        action=($("select[name='action']").val())
        T='Device Name= '+device_name+'\nLogical system=\t'+logical_system+'\nPolicy Name=\t'+policy_name+'\nSource IP=\t'+src_ip+'\nDestenation IP=\t'+des_ip+'\nfrom zone=\t'+from_zone+'\nto zone=\t'+to_zone+'\nApplicatio=\t'+app+'\nAction=\t'+action+'\nlog=\t'+log+""
       ///////////////////////////////////////////////// try swal to show results 
        swal({
            title:"Are you sure you want to commit with this value\n",
            text: T,
            buttons: {
               cancel: true,
               confirm: "Submit"
            }
        }).then( val => {
            if(val)  {
                // console.log("test")
                $.ajax({
                    url: '/FW/submit',
                    data: {
                        'device_name': device_name,
                        'logicalsys': logical_system,
                        'from_zone': from_zone,
                        'to_zone' : to_zone,
                        'app' : app,
                        'policy_name' : policy_name,
                        'src_ip' : src_ip ,
                        'des_ip' : des_ip ,
                        'log' : log,
                        'action' : action
                    },
                    dataType: 'json',
                    success: function (data) {
                        // console.log(data)
                        if (data.result == true){
                            swal({
                                title:"Commit Succssfully",
                                buttons: {
                                    cancel: false,
                                    confirm: "OK!"
                                }
                            }).then( val => {
                                if(val)  {
                                    location.reload()
                                }
                            })
                        }
                        else{
                            swal({
                                title:"Commit Failed !!",
                                buttons: {
                                    cancel: false,
                                    confirm: "OK!"
                                }
                            })
                        }
                    }
                });
            }
        });
        ////////////////////////////////////////////////
        // $("input[type='submit']").val("text 2");
        // return false;
        // }
    });


   

    $(document).on("focusout",'input[id^="app_name"]',function(){
        $("#app_name"+f_num+" span").remove();
        var f_num = $(this).attr('title');
        var app_name = $(this).val();
        var device_name = $('#device_name'+f_num).val();
        var log_sys =$('#logical_system'+f_num).val();
        if(device_name == undefined || device_name == '') alert("Please add device")
        else if(log_sys == undefined || log_sys == '') alert("Please add logical system")
        else{
            $.ajax({
                url: '/FW/ajax/check_app_name',
                data: {
                'app_name': app_name,
                'device': device_name,
                'logicalsys': log_sys,
                },
                dataType: 'json',
                success: function (data) {
                if(data.data == "True")
                    $( "<span style='color:red'>App-Name already exists</span>" ).insertAfter( "#app_name"+f_num );
                }
            });
        }
    });
   

    $(document).on("focusin",'input[id^="app_name"]',function(){
        var f_num = $(this).attr('title');
        console.log('yy')
        $(".app_name"+f_num+" span").remove();
    });


    function check_log_dev(f_num=""){
        var device_name = $('#device_name'+f_num).val();
        var log_sys =$('#logical_system'+f_num).val();
        // console.log(log_sys)
        // console.log(device_name)
        if (device_name !=undefined  && log_sys != undefined && device_name !='' && log_sys != '') return {"device_name":device_name,"log_sys":log_sys}
        else return false
    }    

    function checkzone(ip,device_name,log_sys, f_num = "", destination = false){
        $.ajax({
            url: '/FW/ajax/getZone',
            data: {
                'device_name': device_name,
                'logical_system': log_sys,
                'ip_list': ip
            },
            dataType: 'json',
            success: function (data) {
                // console.log(destination)
                if(destination){
                    if(data.zoneList.length == 0){
                        swal("There isn't common zones for those IPs")
                        $("#to_zone"+f_num).children().remove();
                    }else{
                        $("#to_zone"+f_num).empty()
                        for (index in data.zoneList) {
                            $("#to_zone"+f_num).append($("<option></option>")
                                        .attr("value",data.zoneList[index])
                                        .text(data.zoneList[index]));
                        }
                    }
                }else{
                    if(data.zoneList.length == 0){
                        swal("There isn't common zones for those IPs")
                        $("#from_zone"+f_num).children().remove();
                    }else{
                        $("#from_zone"+f_num).empty()
                        for (index in data.zoneList) {
                            $("#from_zone"+f_num).append($("<option></option>")
                                            .attr("value",data.zoneList[index])
                                            .text(data.zoneList[index]));

                        }
                    }
                }
            }
        });
    }


    $(document).on("click",'select[id^="device_name"]',function(){
        var f_num = $(this).attr('title');
        var device = 'device_name'+f_num;
        var device_name = $("#" + device).val();
        // console.log(device)
        $.ajax({
            url: '/FW/ajax/getLogicalSys',
            data: {
            'device_name': device_name,
            },
            dataType: 'json',
            success: function (data) {

                $("#logical_system"+f_num).children().remove();
                $("#logical_system"+f_num).append($("<option value='' hidden>Select an option</option>"))
                var u = window.location.href
                if(u.includes("newAppSet") || u.includes("app")){
                // console.log("enter app or appset")
                $("#logical_system"+f_num).append($("<option value='default' >Default</option>"))}
                for (index in data.logicalSys_List)
                $("#logical_system"+f_num).append($("<option></option>")
                        .attr("value",data.logicalSys_List[index])
                        .text(data.logicalSys_List[index]));
            }
        });
    });


    // $("#policy_name1").focusout(function () {
    $(document).on("focusout",'input[id^="policy_name"]',function(){

        $("#policy"+f_num + " span").remove();
        var f_num = $(this).attr('title');
        // console.log(f_num)

        var policy_name = $(this).val();

        var device = 'device_name'+f_num;
        var device_name = $("#" + device).val();

        var log_sys = 'logical_system'+f_num;
        var log_sys = $("#" + log_sys).val();

        if(log_sys == undefined || log_sys == '') alert("Please add logical system")
        else{
            $.ajax({
                url: '/FW/ajax/check_policy',
                data: {
                'policyname': policy_name,
                'device': device_name,
                'logicalsys': log_sys,
                },
                dataType: 'json',
                success: function (data) {
                    console.log("enter remove src_ip")
                    console.log(src_ip[f_num])
                    $(".srcips"+f_num).remove()
                    // delete ;
                    src_ip[f_num]=[]

                    $(".desips"+f_num).remove()
                    des_ip[f_num]=[]
                if(data.data == true){
                //    console.log(policy_name)
                    $( "<span style='color:red'>Policy Name already exists</span>" ).insertAfter( "#policy_name"+f_num );

                    $("#from_zone"+f_num).append($("<option></option>")
                    .attr("value",data.from_zone)
                    .text(data.from_zone));

                    $("#to_zone"+f_num).append($("<option></option>")
                    .attr("value",data.to_zone)
                    .text(data.to_zone));


                    var i;

                    for (i = 0; i < data.src_ips.length; i++)
                    {
                        console.log("after append")
                        appendSrcIP(data.src_ips[i],f_num)
                        
                        // console.log(src_ip)
                    }

                    for (i=0; i < data.dest_ips.length; i++)
                    {
                        // console.log(data.dest_ips[i])
                        appendDestIp(data.dest_ips[i],f_num)
                    }

                    // console.log(data.applications)
                    $("#app"+f_num).val(data.applications).change()



                    if(data.action_permit == true){$("#action"+f_num).val("permit")}
                    else{ $("#action"+f_num).val("deny")}

                    if(data.log_session_init == true && data.log_session_close == true ){$("#log"+f_num).val("both")}
                    else if(data.log_session_init == false && data.log_session_close == false ){$("#log"+f_num).val("none")}
                    else if(data.log_session_init == true && data.log_session_close == false ){$("#log"+f_num).val("session-init")}
                    else if(data.log_session_init == false && data.log_session_close == true ){$("#log"+f_num).val("session-close")}

                }
                else
                {
                    $("#log"+f_num).val("none")
                    $("#action"+f_num).val("permit")
                    $("#from_zone"+f_num).children().remove()
                    $("#to_zone"+f_num).children().remove()
                    $(".select2-selection__rendered"+f_num).children().remove()
                    $("#app"+f_num).val("")
                    // console.log("not exist ")
    
                }
            }
            });
        }
    });


    $(document).on("focusin",'input[id^="policy_name"]',function(){
        var f_num = $(this).attr('title');
        $(".policy"+f_num+" span ").remove();
    });


    $(document).on("focusout",'input[id^="appset_name"]',function(){
        var f_num = $(this).attr('title');
        $("#appset"+f_num+" span").remove();
        var appset_name = $(this).val();
        var device_name = $('#device_name'+f_num).val();
        var log_sys =$('#logical_system'+f_num).val();
        if(log_sys == undefined || log_sys == '') alert("Please add logical system")
        else{
            $.ajax({
                url: '/FW/ajax/check_appset',
                data: {
                'appsetname': appset_name,
                'device': device_name,
                'logicalsys': log_sys,
                },
                dataType: 'json',
                success: function (data) {
                if(data.data == "True"){

                $( "<span style='color:red'>AppSet Name already exists</span>" ).insertAfter( "#appset_name"+f_num );
                }

                appsSelected=$("#app"+f_num).val()
                for (index in appsSelected){

                    $("#app"+f_num +"option value["+appsSelected[index]+"]").remove();
                }
                $("#app"+f_num).trigger("change");
                for (index in data.apps){
                    var option = new Option(data.apps[index], data.apps[index]);
                    option.selected = true;
                    $("#app"+f_num).append(option);
                }
                $("#app"+f_num).trigger("change");

                }
            });
        }
    });


    $(document).on("focusin",'input[id^="appset_name"]',function(){
        var f_num = $(this).attr('title');
        $(".appset"+f_num+" span").remove();
    });


    $('.js-example-basic-multiple').select2({
        placeholder: "Select an option"
    });


    $('.js-address_books').select2({
        placeholder: "Select an option"
    })


    $(document).on("change",'select[id^="zone"]',function(){
        var f_num = $(this).attr('title');
        var device_name = $('#device_name'+f_num).val();
        var log_sys =$('#logical_system'+f_num).val();
        var zone=$(this).val();
        $.ajax({
            url: '/FW/ajax/get_addrBook',
            data: {
            'device_name': device_name,
            'logicalSys_name': log_sys,
            'zone':zone
            },
            dataType: 'json',
            success: function (data) {
                $("#AddrBooks"+f_num).children().remove();
                $("#AddrBooks"+f_num).append($("<option value='' hidden>Select an option</option>"))
                for (index in data.AddrBooks_List){
                $("#AddrBooks"+f_num).append($("<option></option>")
                .attr("value",data.AddrBooks_List[index])
                .text(data.AddrBooks_List[index]));}
            }
        });
    });


    $(document).on("change",'input[id^="addressSet_name"]',function(){
        var f_num = $(this).attr('title');
        $('#addressSet'+f_num+' span').remove();
        var device_name = $('#device_name'+f_num).val();
        var log_sys =$('#logical_system'+f_num ).val();
        var address_set=$(this).val();
        var zone=$('#zone'+f_num ).val();
        if (zone !=undefined && zone !='' && check_log_dev(f_num))
        {
        $.ajax({
            url: '/FW/ajax/check_addressSet_exist',
            data: {
            'device_name': device_name,
            'logicalSys_name': log_sys,
            'zone':zone,
            'Address_set':address_set
            },
            dataType: 'json',
            success: function (data) {
                if(data.AddrSetExist == true){
                $( "<span style='color:red'>Address-Set Name already exists</span>" ).insertAfter( "#addressSet_name"+f_num);
                for (index in data.addrs){
                    var option = new Option(data.addrs[index], data.addrs[index]);
                    option.selected = true;
                    $("#AddrBooks"+f_num).append(option);
                }
                $("#AddrBooks"+f_num).trigger("change");

            }

            }
        });
        }
        else{alert("logical system , device and zone can't be empty")
        $(this).val('');}
    });


    $(document).on("focusin",'input[id^="addressSet_name"]',function(){
        var f_num = $(this).attr('title');
        $(".addressSet"+f_num+" span").remove();
    });


    $(document).on("change",'select[id^="logical_system"]',function(){
        var f_num = $(this).attr('title');
        var device_name = $('#device_name'+f_num+' option:selected').val();
        var log_sys =$('#logical_system'+f_num+' option:selected' ).val();
        $.ajax({
            url: '/FW/ajax/get_zones',
            data: {
            'device_name': device_name,
            'logicalSys_name': log_sys
            },
            dataType: 'json',
            success: function (data) {
                $("#zone"+f_num).children().remove();
                $("#zone"+f_num).append($("<option value='' hidden>Select an option</option>"))
                for (index in data.zone_List){
                $("#zone"+f_num).append($("<option></option>")
                .attr("value",data.zone_List[index])
                .text(data.zone_List[index]));}

            }
        });
        $.ajax({
            url: '/FW/ajax/app',
            data: {
            'device_name': device_name,
            'logicalSys_name': log_sys
            },
            dataType: 'json',
            success: function (data) {
                $('#app'+f_num).children().remove();
                $("#app"+f_num).append($("<option value='' hidden>Select an option</option>"))
                for (index in data.app_list){
                    $("#app"+f_num).append($("<option></option>")
                        .attr("value",data.app_list[index])
                        .text(data.app_list[index]));
                }

            }

        });
    });


    next = 2
    var src_ip = {}

    function appendSrcIP(val,f_num){
        // console.log("enter appendSrcIp")
        // console.log(val)
        var validate = ValidateIPaddress(val)
        var chk_log_dev = check_log_dev(f_num)
        if(!(f_num in src_ip)){
            src_ip[f_num]=[]
        }
        if(val == "" && validate){
            alert("Please enter valid IP")
            $(".field1").val("")
        }else if(!chk_log_dev){
            alert("device name and logical system can't be empty")
            $(".field1").val("")
        }else if(src_ip[f_num].indexOf(val) === -1){
            $.ajax({
                url: '/FW/ajax/checkip',
                data: {
                    'device_name': chk_log_dev.device_name,
                    'logical_system': chk_log_dev.log_sys,
                    'ip': val
                },
                dataType: 'json',
                success: function (data) {
                    if(!data.result) swal( "IP address-book not found .. Please create one")
                    else{
                        src_ip[f_num].push(val);
                        checkzone(src_ip[f_num],chk_log_dev.device_name,chk_log_dev.log_sys,f_num)
                        input = '<div class="col-sm-6 col-sm-offset-6 has-feedback srcips'+f_num+' id='+next+'><span><i class="glyphicon glyphicon-minus form-control-feedback minsrc" id="i'+f_num+'" data="src" title="'+f_num+'"></i></span>' + 
                        '<input class="input form-control field'+next+'" id="source_ip'+f_num+'" name="source-address'+f_num+'[]" type="text" placeholder="Source IP" value= "'+val+'" readonly></div>';        
                        field = $(".src_field"+f_num);
                        field.append(input);
                        $(".field1").val("")
                        next = next + 1;
                    }
                    // console.log(Object.keys(src_ip).length)
                }
               
            });
            
        }else{
            // alert("IP already added")
        }
        // console.log(src_ip)
    }


    $(document).on("click",'i[id^="addsrc"]',function(){
        var f_num = $(this).attr('title');
        val = $(".field"+f_num).val();

        appendSrcIP(val, f_num)
    })


    next_des = 2
    var des_ip = {}

    function appendDestIp(val,f_num)
     {
        var validate = ValidateIPaddress(val)
        var chk_log_dev = check_log_dev(f_num)
        if(! (f_num in des_ip)){
            des_ip[f_num]=[]
        }
        if(val == "" && validate){
            alert("Please enter valid IP")
            $(".field_des1"+f_num).val("")
        }else if(!chk_log_dev){
            alert("device name and logical system can't be empty")
            $(".field_des1"+f_num).val("")
        }else if(des_ip[f_num].indexOf(val) === -1){
            $.ajax({
                url: '/FW/ajax/checkip',
                data: {
                    'device_name': chk_log_dev.device_name,
                    'logical_system': chk_log_dev.log_sys,
                    'ip': val
                },
                dataType: 'json',
                success: function (data) {
                    if(!data.result) swal("IP address-book not found .. Please create one")
                    else{
                        des_ip[f_num].push(val);
                        checkzone(des_ip[f_num],chk_log_dev.device_name,chk_log_dev.log_sys,f_num,true)
                        input = '<div class="col-sm-6 col-sm-offset-6 has-feedback desips"'+f_num+' id=' +next_des+'><span><i class="glyphicon glyphicon-minus form-control-feedback mindes" id="i'+f_num+'" data="des" title="'+f_num+'"></i></span>' + 
                        '<input class="input form-control field_des' +next_des+'" id="des_ip'+f_num+'" name="des-address'+f_num+'[]" type="text" placeholder="Destination IP" value= "'+val+'" readonly></div>';        
                        field = $(".des_field"+f_num);
                        field.append(input);
                        $(".field_des1").val("")
                        next_des = next_des + 1;
                    }
                }
            });
        }else{
            // alert("IP already added")
        }
     }

    $(document).on("click",'i[id^="add_des"]',function(){
        f_num = $(this).attr('title');
        val = $(".field_des1").val();
        appendDestIp(val, f_num)
    });


    $(document).on("click", "i[id^='i']", function(e) {
        var data = $(this).attr('data');
        if(data == "des"){
            e.preventDefault();
            f_num = $(this).attr('title');
            var rem = $(this).parents('div').attr('id');
            var value = $(".field_des"+rem).val();
            var index = des_ip[f_num].indexOf(value);
            if (index !== -1) des_ip[f_num].splice(index, 1);
            var chk_log_dev = check_log_dev(f_num)
            if(des_ip[f_num].length == 0) $("#to_zone"+f_num).empty()
            else checkzone(des_ip[f_num],chk_log_dev.device_name,chk_log_dev.log_sys,f_num,true)
            $('#' + rem).remove();
        }else{
            e.preventDefault();
            var f_num = $(this).attr('title');
            var rem = $(this).parents('div').attr('id');
            var value = $(".field"+rem).val();
            var index = src_ip[f_num].indexOf(value);
            if (index !== -1) src_ip[f_num].splice(index, 1);
            var chk_log_dev = check_log_dev(f_num)
            if(src_ip[f_num].length == 0)
                $("#from_zone"+f_num).empty()
            else
                checkzone(src_ip[f_num],chk_log_dev.device_name,chk_log_dev.log_sys,f_num)
            $('#' + rem).remove();
        }
    });


    /************** add Policy form ***************/


    $("#add").click(function() {
        form_num = $(this).attr('title');
        $("#policy"+ form_num).after("<div class='col-sm-9 col-sm-offset-3'><img id='theImg' src='../static/img/orange-line.png'/></div>");
        form_num++;
        addForm(form_num);
    });


    function addForm(form_num){
        var inputElem = document.createElement('input');
        inputElem.type = 'hidden';
        inputElem.name = 'csrfmiddlewaretoken'+form_num;
        inputElem.value = '{% csrf_token %}';
        $("#form").append($('<form name="form" class="form-horizontal" id="policy'+form_num+'" method="POST"> \
            <div class="form-group col-sm-5"> \
            <label for="device_name" class="col-sm-6 control-label">Device Name</label> \
            <div class="col-sm-6"> \
                <select class="form-control" id ="device_name'+form_num+'" name="device-name'+form_num+'" title="'+form_num+'" required>\
            </select> \
            </div>\
            </div>\
            <div class="form-group col-sm-5">\
            <label for="logical_systems" class="col-sm-6 control-label">Logical Systems</label>\
            <div class="col-sm-6">\
                <select class="form-control" id="logical_system'+form_num+'" name="logical_systems'+form_num+'" title="'+form_num+'" required></select>\
            </div>\
            </div>\
            <div class="form-group col-sm-5">\
                <label for="policy_name" class="col-sm-6 control-label">Policy Name</label>\
                <div class="col-sm-6 policy">\
                <input type="text" class="form-control" id="policy_name'+form_num+'" name="policy_name'+form_num+'" title="'+form_num+'" placeholder="Policy Name" required>\
                </div>\
            </div>\
            <div class="col-sm-5" style="width:100%"></div>\
            <div class="form-group col-sm-5 src_field'+form_num+'" id="field1" title="'+form_num+'">\
            <label class="col-sm-6 control-label" for="source_ip">Source IP</label>\
            <div class="col-sm-6 has-feedback">\
                <span><i class="glyphicon glyphicon-plus form-control-feedback" id="addsrc'+form_num+'" title="'+form_num+'"></i></span>\
                <input type="text" class="form-control field1" id="source_ip'+form_num+'" title="'+form_num+'" name="source_ip'+form_num+'[]" placeholder="Source IP" >\
            </div>\
            </div>\
            <div class="form-group col-sm-5 des_field'+form_num+'" id="field_des1" title="'+form_num+'">\
            <label class="col-sm-6 control-label" for="destination_ip">Destination IP</label>\
            <div class="col-sm-6 has-feedback">\
                <span><i class="glyphicon glyphicon-plus form-control-feedback" id="add_des'+form_num+'" title="'+form_num+'"></i></span>\
                <input type="text" class="form-control field_des1" id="destination_ip'+form_num+'" title="'+form_num+'" name="dest_ip'+form_num+'[]" placeholder="Destination IP" >\
            </div>\
            </div>\
            <div class="col-sm-12 group"> \
            <div class="form-group col-sm-5">\
                <label for="from_zone" class="col-sm-6 control-label">From Zone</label>\
                <div class="col-sm-6">\
                <select class="form-control" id="from_zone'+form_num+'" title="'+form_num+'" name="from_zone'+form_num+'" required></select>\
                </div>\
            </div>\
            <div class="form-group col-sm-5">\
                <label for="to_zone" class="col-sm-6 control-label">To Zone</label>\
                <div class="col-sm-6">\
                <select class="form-control" id="to_zone'+form_num+'" title="'+form_num+'" name="to_zone'+form_num+'" required></select>\
                </div>\
            </div>\
            <div class="form-group col-sm-5">\
                <label for="app" class="col-sm-6 control-label">Application</label>\
                <div class="col-sm-6">\
                    <select id="app'+form_num+'" name="app'+form_num+'[]" title="'+form_num+'" multiple class="form-control js-example-basic-multiple" required >\
                    </select>\
                </div>\
            </div>\
            <div class="form-group col-sm-5">\
                <label for="action" class="col-sm-6 control-label">Action</label>\
                <div class="col-sm-6">\
                <select class="form-control" title="'+form_num+'" name="action'+form_num+'" id="action'+form_num+'" required>\
                    <option value="permit">Permit</option>\
                    <option value="deny">Deny</option>\
                </select>\
                </div>\
            </div>\
            <div class="form-group col-sm-5">\
                <label for="log" class="col-sm-6 control-label">Log</label>\
                <div class="col-sm-6">\
                <select class="form-control" name="log'+form_num+'" id="log'+form_num+'" title="'+form_num+'" required>\
                    <option value="none">None</option>\
                    <option value="session-init">session-init</option>\
                    <option value="session-close">session-close</option>\
                    <option value="both">session-init && session-close</option>\
                </select>\
                </div>\
            </div>\
            </div>\
            </form>'
        ));

        var form = $('#policy'+form_num);
        form.append(inputElem);

        $.ajax({
            url: '/FW/ajax/get_device',
            dataType: 'json',
            success: function (data) {
                var s= document.getElementById('device_name'+form_num);
                for (index in data.devices){
                    $('#device_name'+form_num).append($("<option></option>")
                                .attr("value",data.devices[index])
                                .text(data.devices[index]));
                }
            }
        });

        $('.js-example-basic-multiple').select2({
            placeholder: "Select an option"
        });

        $("#add").attr("title",form_num);
        $("#field"+form_num).attr("title",form_num);

    }

    $("#commit").click(function() {
        data=[]
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var inputs = document.getElementsByTagName('form');

        for (var i=0; i<inputs.length; i+=1){
            j=i+1;
            data_form={
                'policy_name' : $('#policy_name'+j).val(),
                'device_name' : $('#device_name'+j).val(),
                'logicalsys' : $('#logical_system'+j).val(),
                'src_ip' :  src_ip[j],
                'dest_ip' : des_ip[j],
                'from_zone' : $('#from_zone'+j).val(),
                'to_zone' : $('#to_zone'+j).val(),
                'app' : $('#app'+j).val(),
                'action' : $('#action'+j).val(),
                'log' : $('#log'+j).val()
            };
            data.push(data_form);
        }
        
        data = JSON.stringify({ 'data': data });

        $.ajax({
            url  : '/FW/add',
            method:'GET',
            datatype: "json",
            data : {'data_form': data},
            success : function(d){
                    CommitNotif(d)
                } }
            
    );

             //add ajax request to fire submit 
    });


    /************** add App form ***************/

    $("#addapp").click(function() {
        form_num = $(this).attr('title');
        $("#app_form"+ form_num).after("<div class='col-sm-9 col-sm-offset-3'><img id='theImg' src='../static/img/orange-line.png'/></div>");
        form_num++;
        addAppForm(form_num);
    });


    function addAppForm(form_num){
        var inputElem = document.createElement('input');
        inputElem.type = 'hidden';
        inputElem.name = 'csrfmiddlewaretoken'+form_num;
        inputElem.value = '{% csrf_token %}';
        $("#appform").append($('<form class="form-horizontal" title="'+form_num+'" id="app_form'+form_num+'" method="POST"> \
        <div class="form-group col-sm-5"> \
          <label for="device_name" class="col-sm-6 control-label">Device Name</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id = "device_name'+form_num+'" name="device-name'+form_num+'" title="'+form_num+'" required></select> \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
          <label for="logical_systems" class="col-sm-6 control-label">Logical Systems</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id="logical_system'+form_num+'" name="logical_systems'+form_num+'" title="'+form_num+'" required></select> \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
            <label for="app_name" class="col-sm-6 control-label">Application Name</label> \
            <div class="col-sm-6 app_name"> \
              <input type="text" class="form-control" id="app_name'+form_num+'" name="app_name'+form_num+'" title="'+form_num+'" placeholder="Application Name" required> \
            </div> \
          </div> \
          <div class="form-group col-sm-5"> \
            <label for="protocol" class="col-sm-6 control-label">Protocol</label> \
            <div class="col-sm-6"> \
              <select class="form-control" id="protocol'+form_num+'" name="protocol'+form_num+'" title="'+form_num+'" required> \
                  <option value="tcp">TCP</option> \
                  <option value="udp">UDP</option> \
              </select> \
            </div> \
          </div> \
        <div class="col-sm-12" style="padding:0 !important"> \
          <div class="form-group col-sm-5"> \
            <label class="col-sm-6 control-label" for="single_port">Port</label> \
            <div class="col-sm-6" id="port'+form_num+'" title="'+form_num+'"> \
              <input type="number" class="single_port form-control" id="single_port'+form_num+'" title="'+form_num+'" name="single_port'+form_num+'" placeholder="Single Port" required> \
            </div> \
            <div class="col-sm-6 col-sm-offset-12"><input type="button" id="portBtn'+form_num+'" title="'+form_num+'" class="btn but" value="Range" name="range'+form_num+'"></div> \
          </div> \
        </div> \
        <div class="form-group"> \
        </div> \
      </form>'
        ));

        var form = $('#app_form'+form_num);
        form.append(inputElem);

        $.ajax({
            url: '/FW/ajax/get_device',
            dataType: 'json',
            success: function (data) {
                var s= document.getElementById('device_name'+form_num);
                for (index in data.devices){
                    $('#device_name'+form_num).append($("<option></option>")
                                .attr("value",data.devices[index])
                                .text(data.devices[index]));
                }
            }
        });

        $("#addapp").attr("title",form_num);
    }

    $("#commitapp").click(function() {
        data=[]
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var inputs = document.getElementsByTagName('form');

        for (var i=0; i<inputs.length; i+=1){
            j=i+1;
            data_form={
                'device_name' : $('#device_name'+j).val(),
                'logicalsys' : $('#logical_system'+j).val(),
                'app_name' : $('#app_name'+j).val(),
                'protocol' : $('#protocol'+j).val(),
            };
            if ($('#single_port'+j).val())
            {data_form['single_port']=$('#single_port'+j).val()}

            else if ($('#from_port'+j).val())
            {data_form['from_port']=$('#from_port'+j).val();
            data_form['to_port']=$('#to_port'+j).val()}
            data.push(data_form);
        }
        
        data = JSON.stringify({ 'data': data });

        $.ajax({
            url  : '/FW/newApp',
            method:'GET',
            datatype: "json",
            data : {'data_form': data},
            success : function(d){
                CommitNotif(d)
            }
            
        });

             //add ajax request to fire submit 
    });


    /************** add Address Book form ***************/

    $("#addrbkbtn").click(function() {
        form_num = $(this).attr('title');
        $("#addrbk"+ form_num).after("<div class='col-sm-9 col-sm-offset-3'><img id='theImg' src='../static/img/orange-line.png'/></div>");
        form_num++;
        addAddrBkForm(form_num);
    });


    function addAddrBkForm(form_num){
        var inputElem = document.createElement('input');
        inputElem.type = 'hidden';
        inputElem.name = 'csrfmiddlewaretoken'+form_num;
        inputElem.value = '{% csrf_token %}';
        $("#addrbk").append($('<form class="form-horizontal" id="addrbk'+form_num+'" method="POST"> \
        <div class="form-group col-sm-5">  \
          <label for="device_name" class="col-sm-6 control-label">Device Name</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id = "device_name'+form_num+'" name="device-name'+form_num+'" title="'+form_num+'" required> \
            </select> \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
          <label for="logical_systems" class="col-sm-6 control-label">Logical Systems</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id="logical_system'+form_num+'" name="logical_systems'+form_num+'" title="'+form_num+'" required></select> \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
          <label for="zone" class="col-sm-6 control-label">Zone</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id="zone'+form_num+'" name="zone'+form_num+'" title="'+form_num+'" required> \
            </select> \
          </div>  \
        </div> \
        <div class="col-sm-5" style="width:100%"></div> \
        <div class="form-group col-sm-5"> \
          <label for="app_name" class="col-sm-6 control-label">Address Book Name</label> \
          <div class="col-sm-6 add_name"> \
            <input type="text" class="form-control" id="address_name'+form_num+'" name="address_name'+form_num+'" title="'+form_num+'" placeholder="Address Book Name" required> \
          </div> \
        </div>   \
        <div class="form-group col-sm-5"> \
          <label class="col-sm-6 control-label" for="Address_ip">Address IP</label> \
          <div class="col-sm-6 address"> \
            <input type="text" class="form-control" id="Address_ip'+form_num+'" name="Address_ip'+form_num+'" title="'+form_num+'" placeholder="Ex : 10.10.10.1/32" required> \
          </div> \
        </div> \
      </form>' 
        ));

        var form = $('#addrbk'+form_num);
        form.append(inputElem);

        $.ajax({
            url: '/FW/ajax/get_device',
            dataType: 'json',
            success: function (data) {                
                var s= document.getElementById('device_name'+form_num);
                for (index in data.devices){
                    $('#device_name'+form_num).append($("<option></option>")
                                .attr("value",data.devices[index])
                                .text(data.devices[index]));
                }
            }
        });

        $("#addrbkbtn").attr("title",form_num);
    }

    $("#commitaddrbk").click(function() {  
        data=[]
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var inputs = document.getElementsByTagName('form');
        
        for (var i=0; i<inputs.length; i+=1){
            j=i+1; 
            data_form={
                'device_name' : $('#device_name'+j).val(),
                'logicalsys' : $('#logical_system'+j).val(),
                'zone' : $('#zone'+j).val(),
                'address_name' : $('#address_name'+j).val(),
                'Address_ip' : $('#Address_ip'+j).val()
            };
            data.push(data_form);
        }
        
        data = JSON.stringify({ 'data': data });

        $.ajax({
            url  : '/FW/newAddrBk',
            method:'GET',
            datatype: "json",
            data : {'data_form': data},
            success : function(d){
                CommitNotif(d)
            }
        });
    });


    /************** add Address Set form ***************/

    $("#addrset").click(function() {
        form_num = $(this).attr('title');
        $("#AddrSetform"+ form_num).after("<div class='col-sm-9 col-sm-offset-3'><img id='theImg' src='../static/img/orange-line.png'/></div>");
        form_num++;
        addAddrSetForm(form_num);
    });


    function addAddrSetForm(form_num){
        var inputElem = document.createElement('input');
        inputElem.type = 'hidden';
        inputElem.name = 'csrfmiddlewaretoken'+form_num;
        inputElem.value = '{% csrf_token %}';
        $("#AddrSet").append($('<form class="form-horizontal" id="AddrSetform'+form_num+'" method="POST"> \
        <div class="form-group col-sm-5">  \
          <label for="device_name" class="col-sm-6 control-label">Device Name</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id ="device_name'+form_num+'" name="device-name'+form_num+'" title="'+form_num+'" required> \
            </select>  \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
          <label for="logical_systems" class="col-sm-6 control-label">Logical Systems</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id="logical_system'+form_num+'" name="logical_systems'+form_num+'" title="'+form_num+'" required></select> \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
          <label for="zone" class="col-sm-6 control-label">Zone</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id="zone'+form_num+'" name="zone'+form_num+'" title="'+form_num+'" required> \
            </select> \
          </div> \
        </div> \
        <div class="col-sm-5" style="width:100%"></div> \
        <div class="form-group col-sm-5"> \
          <label for="AddressSet_name" class="col-sm-6 control-label">Address Set Name</label> \
          <div class="col-sm-6 addressSet"> \
            <input type="text" class="form-control " id="addressSet_name'+form_num+'" name="addressSet_name'+form_num+'" title="'+form_num+'" placeholder="Address Set Name" required> \
          </div> \
        </div>   \
        <div class="form-group col-sm-5"> \
          <label class="col-sm-6 control-label" for="Address_ip">Address Book</label> \
              <div class="col-sm-6"> \
                  <select id="AddrBooks'+form_num+'" name="AddrBooks'+form_num+'[]" multiple title="'+form_num+'" class="form-control js-address_books" > \
                  </select> \
            </div> \
          </div> \
        </div> \
      </form>' 
      ));

        var form = $('#AddrSetform'+form_num);
        form.append(inputElem);

        $.ajax({
            url: '/FW/ajax/get_device',
            dataType: 'json',
            success: function (data) {
                var s= document.getElementById('device_name'+form_num);
                for (index in data.devices){
                    $('#device_name'+form_num).append($("<option></option>")
                                .attr("value",data.devices[index])
                                .text(data.devices[index]));
                }
            }
        });

        $("#addrset").attr("title",form_num);
        $('.js-address_books').select2({
            placeholder: "Select an option"
        })
    }

    $("#commitaddrset").click(function() {
        data=[]
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var inputs = document.getElementsByTagName('form');

        for (var i=0; i<inputs.length; i+=1){
            j=i+1; 
            data_form={
                'device_name' : $('#device_name'+j).val(),
                'logicalsys' : $('#logical_system'+j).val(),
                'zone' : $('#zone'+j).val(),
                'addressSet_name' : $('#addressSet_name'+j).val(),
                'AddrBooks' : $('#AddrBooks'+j).val()
            };
            data.push(data_form);
        }

        data = JSON.stringify({ 'data': data });

        $.ajax({
            url  : '/FW/newAddrSet',
            method:'GET',
            datatype: "json",
            data : {'data_form': data},
            success : function(d){
                CommitNotif(d)
            }
        });
    });


    /************** add Application Set form ***************/

    $("#addappset").click(function() {
        form_num = $(this).attr('title');
        $("#appsetform"+ form_num).after("<div class='col-sm-9 col-sm-offset-3'><img id='theImg' src='../static/img/orange-line.png'/></div>");
        form_num++;
        addAppSetForm(form_num);
    });


    function addAppSetForm(form_num){
        var inputElem = document.createElement('input');
        inputElem.type = 'hidden';
        inputElem.name = 'csrfmiddlewaretoken'+form_num;
        inputElem.value = '{% csrf_token %}';
        $("#appsetform").append($('<form class="form-horizontal" id="appsetform'+form_num+'" method="POST"> \
        <div class="form-group col-sm-5">  \
          <label for="device_name" class="col-sm-6 control-label">Device Name</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id = "device_name'+form_num+'" name="device-name'+form_num+'" title="'+form_num+'" required> \
            </select> \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
          <label for="logical_systems" class="col-sm-6 control-label">Logical Systems</label> \
          <div class="col-sm-6"> \
            <select class="form-control" id="logical_system'+form_num+'" name="logical_systems'+form_num+'" title="'+form_num+'" required></select> \
          </div> \
        </div> \
        <div class="form-group col-sm-5">  \
          <label for="App_name" class="col-sm-6 control-label">App Name</label> \
          <div class="col-sm-6 appset'+form_num+'" title="'+form_num+'"> \
            <input type="text" class="form-control" id="appset_name'+form_num+'" name="appset_name'+form_num+'" title="'+form_num+'" placeholder="APP Name" required> \
          </div> \
        </div> \
        <div class="form-group col-sm-5"> \
          <label for="app" class="col-sm-6 control-label">Application</label> \
            <div class="col-sm-6"> \
                <select id="app'+form_num+'" name="app'+form_num+'[]" title="'+form_num+'" multiple class="form-control js-example-basic-multiple" > \
                </select> \
          </div> \
        </div> \
      </form>' 
      ));

        var form = $('#appsetform'+form_num);
        form.append(inputElem);

        $.ajax({
            url: '/FW/ajax/get_device',
            dataType: 'json',
            success: function (data) {
                var s= document.getElementById('device_name'+form_num);
                for (index in data.devices){
                    $('#device_name'+form_num).append($("<option></option>")
                                .attr("value",data.devices[index])
                                .text(data.devices[index]));
                }
            }
        });

        $("#addappset").attr("title",form_num);
        $('.js-example-basic-multiple').select2({
            placeholder: "Select an option"
        })
    }

    $("#commitappset").click(function() {
        data=[]
        var csrftoken = $("[name=csrfmiddlewaretoken]").val();
        var inputs = document.getElementsByTagName('form');

        for (var i=0; i<inputs.length; i+=1){
            j=i+1;
            data_form={
                'device_name' : $('#device_name'+j).val(),
                'logicalsys' : $('#logical_system'+j).val(),
                'appset_name' : $('#appset_name'+j).val(),
                'app' : $('#app'+j).val()
            };
            data.push(data_form);
        }

        data = JSON.stringify({ 'data': data });

        $.ajax({
            url  : '/FW/createappset',
            method:'GET',
            datatype: "json",
            data : {'data_form': data},
            success : function(d){
                CommitNotif(d)

            }
        });
    });

});
