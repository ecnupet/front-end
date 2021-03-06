/**
 * Created by 亚仪 on 2017/3/16.
 */

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
/******************************************/
//加载医院平面图热点
// function action_initMaps(){
//     for(var i=0;i<sceneData.length;i++){
//         var layer=sceneData[i];
//         var str='';
//         str+='set(ln,'+'spot_location_'+layer.name+');';
//         str+='addlayer(get(ln));';
//         str+='copy(lr, layer[get(ln)]);';
//         str+='set(lr.parent, bd_scroller_container);';
//         str+='set(lr.keep, true);';
//         str+='lr.loadstyle('+mapSpotStyle_normal+');';
//         str+='set(lr.tooltip, '+layer.tooltip+');';
//         str+='set(lr.width, '+layer.width+');';
//         str+='set(lr.height,'+layer.height+');';
//         str+='set(lr.x, '+layer.x+');';
//         str+='set(lr.y, '+layer.y+');';
//         str += 'set(lr.onclick,transition_location(spot_location_' + layer.name + ',scene_' + layer.name + ',-98,0,31););';
//         krpano.call(str);
//     }
// }
//根据角色权限更新医院平面图热点
// function action_updateMapsWithRole(){
//     for(var i=0;i<sceneData.length;i++){
//         var layer=sceneData[i];
//         var str='';
//         str+='set(ln,'+'spot_location_'+layer.name+');';
//         str+='addlayer(get(ln));';
//         str+='copy(lr, layer[get(ln)]);';
//         str+='set(lr.parent, bd_scroller_container);';
//         str+='set(lr.keep, true);';
//         str+='set(lr.tooltip, '+layer.tooltip+');';
//         str+='set(lr.width, '+layer.width+');';
//         str+='set(lr.height,'+layer.height+');';
//         str+='set(lr.x, '+layer.x+');';
//         str+='set(lr.y, '+layer.y+');';
//         if(roles[currentRoleId].room.contains(layer.id)){
//             str+='lr.loadstyle('+mapSpotStyle_normal+');';
//             str+='set(lr.onclick,transition_location(spot_location_'+layer.name+',scene_'+layer.name+',-98,0,31););';
//         }else{
//             str+='lr.loadstyle('+mapSpotStyle_forbid+');';
//         }
//         krpano.call(str);
//     }
// }
//跟换角色之后每次都将房间显示属性设置为True
function action_setAllSceneShow(){
    var str="";
    for(var i=0;i<sceneData.length;i++){
        var textname='current_location'+i.toString();
        var imgname='bd_scroller_container'+i.toString();
        str += 'set(layer['+textname+'].visible,true);';
        str += 'set(layer['+imgname+'].visible,true);';
    }
    krpano.call(str);
}
//根据角色权限设定当前起始位置
function action_setInitScene(){
    var str='';
    console.log(currentRoleId);
    if(currentRoleId==0) {
        str += 'loadscene(scene_qiantai, null, MERGE);';
        str += 'set(layer[current_role].html,"当前角色：前台");';
        str += 'set(layer[current_desc].html,"包括接待挂号导医咨询病历档案发出与回收收费");';
        str += 'set(layer[current_location].html,"前台");';
    }else if(currentRoleId==1) {
        str += 'loadscene(scene_zhenshi, null, MERGE);';
        str += 'set(layer[current_role].html,"当前角色：专业医师");';
        str += 'set(layer[current_desc].html,"对宠物进行临床基本检查、疾病诊断");';
        str += 'set(layer[current_location].html,"诊室")';
    }else if(currentRoleId==2) {
        str += 'loadscene(scene_zhusheshi, null, MERGE);';
        str += 'set(layer[current_role].html,"当前角色：医助");';
        str += 'set(layer[current_desc].html,"包括静脉注射、皮下注射、肌肉注射、局部封闭注射的操作流程");';
        str += 'set(layer[current_location].html,"注射室")';
    }else{
        str += 'loadscene(scene_qiantai, null, MERGE);';
        str += 'set(layer[current_role].html,"当前角色：游客");';
        str += 'set(layer[current_desc].html,"包括接待挂号、导医咨询、收费等");';
        str += 'set(layer[current_location].html,"前台");';
    }
    krpano.call(str);
}

//根据模式与角色权限更新场景以及场景中的具体介绍
function action_updateSceneHotspotWithRole(curScene){
    var str = '';
   if(currentMode==1){//角色扮演模式：根据角色权限更新预览场景
        for(var i=0;i<sceneData.length;i++){
            if(!roles[currentRoleId].room.contains(i)){
                var textname='current_location'+i.toString();
                var imgname='bd_scroller_container'+i.toString();
                str += 'set(layer['+textname+'].visible,false);';
                str += 'set(layer['+imgname+'].visible,false);';
            }
        }
    }
    console.log(curScene);
    krpano.call(str);
}
//每次切换场景时设置当前active位置
function action_setCurrentMapLocation(currole){
    if(!currole){
        lastactivemapspot='qiantai';
    }else{
        if(currole==0){
            lastactivemapspot='qiantai';
        }else if(currole==1){
            lastactivemapspot='zhenshi';
        }else if(currole==2){
            lastactivemapspot='zhusheshi';
        }else{
            console.log('action_setcurrentmaplocation() 传参有误');
        }
    }
    var str = 'layer[spot_location_'+lastActiveMapSpot+'].loadStyle('+mapSpotStyle_active+');';
    krpano.call(str);
}
//返回上级

//根据roomList修改科室名称
function action_updateSceneAndMapName(){
    var str='';
    for(var i=0;i<roomList.length;i++){
        var name=roomList[i].name;
        var title=roomList[i].title;
        str+='set(scene[scene_'+name+'].title,'+title+');';
        str+='set(layer[spot_location_'+name+'].tooltip,'+title+');';
    }
    krpano.call(str);
}
function action_updateHotspotName(){
    var str='';
    for(var i=0;i<roomList.length;i++){
        var name=roomList[i].name;
        var title=roomList[i].title;
        str+='set(hotspot[spot_'+name+'].tooltip,'+title+');';
    }
    krpano.call(str);
}
function action_loadDevice(deviceName){
    var str='';
    for(var i=0;i<deviceList.length;i++){
        var name=deviceList[i].name;
        if(deviceName==name){
            var description=deviceList[i].description;
            var video=deviceList[i].video;
            str+='set(layer[device_description].html,'+description+');';
            str+='set(layer[device_video].videourl,'+video+');';
            krpano.call(str);
            action_flyin('layer_device');
            break;
        }
    }
}
function action_flyin(layerName){
    var str='';
    str+='if(layer['+layerName+'].flying == 0.0, layer[%1].resetsize(); calc_flyout_size('+layerName+'); );';
    str+='if(layer['+layerName+'].oldscale === null, copy(layer['+layerName+'].oldscale, layer['+layerName+'].scale) );';
    str+='if(layer['+layerName+'].oldrx === null, copy(layer['+layerName+'].oldrx, layer['+layerName+'].rx) );';
    str+='if(layer['+layerName+'].oldry === null, copy(layer['+layerName+'].oldry, layer['+layerName+'].ry) );';
    str+='if(layer['+layerName+'].oldrz === null, copy(layer['+layerName+'].oldrz, layer['+layerName+'].rz) );';
    str+='set(layer['+layerName+'].enabled,true);';
    str+='set(layer['+layerName+'].visible,true);';
    str+='tween(layer['+layerName+'].alpha,  1.0);';
    str+='tween(layer['+layerName+'].flying, 1.0);';
    str+='tween(layer['+layerName+'].scale,  1.0);';
    str+='tween(layer['+layerName+'].rx, 0.0);';
    str+='tween(layer['+layerName+'].ry, 0.0);';
    str+='tween(layer['+layerName+'].rz, 0.0);';
    krpano.call(str);
}
/**********************************/
function loadRoleData(callback){
    roles = [
        {id: 0, name: '前台', room: [0, 2]},
        {id: 1, name: '兽医', room: [1, 3, 4, 5, 6, 7, 8, 9,10,11,12,13]},
        {id: 2, name: '助理', room: [4, 5, 7, 8, 9, 10,11,12]}
    ];
    callback();
}
function callback_walkthrough(){
    action_setAllSceneShow();
    action_setInitScene(currentRoleId);
}
function callback_roleplay() {
    action_setAllSceneShow();
    action_setInitScene(currentRoleId);
   // action_updateMapsWithRole();
    action_updateSceneHotspotWithRole(currentRoleId);
    action_setCurrentMapLocation();
    //action_updateSceneAndMapName();
}