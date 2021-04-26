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
function action_initMaps(){
    for(var i=0;i<sceneData.length;i++){
        var layer=sceneData[i];
        var str='';
        str+='set(ln,'+'spot_location_'+layer.name+');';
        str+='addlayer(get(ln));';
        str+='copy(lr, layer[get(ln)]);';
        str+='set(lr.parent, bd_scroller_container);';
        str+='set(lr.keep, true);';
        str+='lr.loadstyle('+mapSpotStyle_normal+');';
        str+='set(lr.tooltip, '+layer.tooltip+');';
        str+='set(lr.width, '+layer.width+');';
        str+='set(lr.height,'+layer.height+');';
        str+='set(lr.x, '+layer.x+');';
        str+='set(lr.y, '+layer.y+');';
        str += 'set(lr.onclick,transition_location(spot_location_' + layer.name + ',scene_' + layer.name + ',-98,0,31););';
        console.log(sceneData[i]);
        krpano.call(str);
    }
}
//根据角色权限更新医院平面图热点
function action_updateMapsWithRole(){
    for(var i=0;i<sceneData.length;i++){
        var layer=sceneData[i];
        var str='';
        str+='set(ln,'+'spot_location_'+layer.name+');';
        str+='addlayer(get(ln));';
        str+='copy(lr, layer[get(ln)]);';
        str+='set(lr.parent, bd_scroller_container);';
        str+='set(lr.keep, true);';
        str+='set(lr.tooltip, '+layer.tooltip+');';
        str+='set(lr.width, '+layer.width+');';
        str+='set(lr.height,'+layer.height+');';
        str+='set(lr.x, '+layer.x+');';
        str+='set(lr.y, '+layer.y+');';
        if(roles[currentRoleId].room.contains(layer.id)){
            str+='lr.loadstyle('+mapSpotStyle_normal+');';
            str+='set(lr.onclick,transition_location(spot_location_'+layer.name+',scene_'+layer.name+',-98,0,31););';
        }else{
            str+='lr.loadstyle('+mapSpotStyle_forbid+');';
        }
        krpano.call(str);
    }
}
//根据角色权限设定当前起始位置
function action_setInitScene(){
    var str='';
    if(currentRoleId==0) {
        str += 'loadscene(scene_qiantai, null, MERGE);';
        str += 'set(layer[current_location].html,"前台");';
    }else if(currentRoleId==1) {
        str += 'loadscene(scene_zhenshi, null, MERGE);';
        str += 'set(layer[current_location].html,"诊室")';
    }else if(currentRoleId==2) {
        str += 'loadscene(scene_zhusheshi, null, MERGE);';
        str += 'set(layer[current_location].html,"注射室")';
    }
    krpano.call(str);
}
//根据模式与角色权限更新热点
function action_updateSceneHotspotWithRole(curScene){
    var str='';
    if(currentMode==0){//3D导览模式下：隐藏设备热点
        for(var i=0;i<deviceList.length;i++){
            var name='spot_'+deviceList[i].name;
            str += 'set(hotspot['+name+'].visible,false);';
        }
    }else if(currentMode==1){//角色扮演模式：根据角色权限更新场景切换热点
        for(var i=0;i<sceneData.length;i++){
            if(!roles[currentRoleId].room.contains(i)){
                var name='spot_'+sceneData[i].name;
                str += 'set(hotspot['+name+'].visible,false);';
            }
        }
    }
    console.log(curScene);
    str += 'set(layer[current_desc].html,"Loading")';
    str += 'layer[spot_location_'+lastActiveMapSpot+'].loadStyle('+mapSpotStyle_normal+');';
    str += 'layer[spot_location_'+curScene+'].loadStyle('+mapSpotStyle_active+');';
    lastActiveMapSpot=curScene;
    krpano.call(str);
    action_updateHotspotName();
}
//每次切换场景时设置当前active位置
function action_setCurrentMapLocation(curRole){
    if(!curRole){
        lastActiveMapSpot='qiantai';
    }else{
        if(curRole==0){
            lastActiveMapSpot='qiantai';
        }else if(curRole==1){
            lastActiveMapSpot='zhenshi';
        }else if(curRole==2){
            lastActiveMapSpot='zhusheshi';
        }else{
            console.log('action_setCurrentMapLocation() 传参有误');
        }
    }
    var str = 'layer[spot_location_'+lastActiveMapSpot+'].loadStyle('+mapSpotStyle_active+');';
    krpano.call(str);
}
//返回上级
function action_goBack(){
    krpano.call("openurl('skin/test.mp4',_self);");
}
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
        {id: 0, name: '前台', room: [0, 3]},
        {id: 1, name: '兽医', room: [4, 5, 6, 7, 8, 9, 10, 11]},
        {id: 2, name: '助理', room: [1, 2, 5, 6, 7, 9]}
    ];
    callback();
}
function callback_walkthrough(){
    action_initMaps();//加载全部小地图
    action_setCurrentMapLocation();
    action_updateSceneAndMapName();
}
function callback_roleplay() {
    action_setInitScene(currentRoleId);
    action_updateMapsWithRole(currentRoleId);
    action_updateSceneHotspotWithRole(currentRoleId);
    action_setCurrentMapLocation(currentRoleId);
    action_updateSceneAndMapName();
}