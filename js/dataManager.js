function dataManager($http, me){
    me.getFile = function(url, fileIndex , after){
		//var url = me.getRoot('resultado') + 'cursos/file_' + courses[index] + '.txt';
		try {
			var ajaxConfig = { url: url, cache: false };
			ajaxConfig.method = 'GET';
			ajaxConfig.cache = false;
			ajaxConfig.data= '';
			ajaxConfig.headers= {"Content-Type": "text/gzip"};
			ajaxConfig.params = {_t : new Date().getTime()};
			$http(ajaxConfig).then(function (result, status) {
				me.defaultLists[fileIndex]=result.data;
				console.log('load file:',url )
                if(typeof(after)=='function')
                    after();
			});
		} catch (error) {
			
		}
		 
	};
	me.getFromSrc = function(name, index, after){
		if(window[name] != null){
			me.defaultLists[index]=window[name];
			if(typeof(after)=='function')
                after();
		}
	};
    me.defaultFiles = [
		{index:0, name:'anima'},
		];

	me.defaultLists = [];
	me.getDefaultLists = function(fn, afterBigList){
		
		for(i=0;i<me.defaultFiles.length;i++){
			var file = me.defaultFiles[i].name;
			var index = me.defaultFiles[i].index;
			var url = 'data/' + file + '.txt';
			if(me.defaultFiles[i].name =='anima'){
				me.getFile(url, index, afterBigList);
			}else if(me.defaultFiles[i].name =='last24'){
				me.getFile(url, index, fn);
			}else{
				me.getFile(url, index, null);
				//me.defaultLists[index]=null;
			}
			
		}
	};
	me.getGenericFile = function(url, after){
		try {
			var ajaxConfig = { url: url, cache: false };
			ajaxConfig.method = 'GET';
			ajaxConfig.cache = false;
			//ajaxConfig.data= '';
			//ajaxConfig.headers= {
			//	"Content-Type": "text/gzip"
			//}
			ajaxConfig.params = {_t : new Date().getTime()};
			$http(ajaxConfig).then(function (result, status) {
				after(result.data);
			});
		} catch (error) {
			
		}
	};
	
	me.gettry = function(){
		me.getGZip('resultadoFundo/last24.gz', function(result){
			console.log(result);
		})
	};
    me.saveOnStorage = function(key, obj){
		
		if(typeof(localStorage) == 'object'){
			value = JSON.stringify(obj);
			localStorage.setItem(key, value);
			return true;
		}
		return false;
	};
	me.getFromStorage = function(key){
		if(typeof(localStorage) == 'object'){
			value =localStorage.getItem(key);
			return JSON.parse(value);
		}
		return null;
	};
	
	me.getQuerystring = function (name, _url) {
        var url = _url != null ? _url : window.location.href;
        if (url.indexOf('?') >= 0) {
            var parte = url.split('?')[1].split('#')[0];
            if (parte.indexOf('&') >= 0) {
                var retorno = '';
                $(parte.split('&')).each(function (index, item) {
                    var chaveValor = item.split('=');
                    if (chaveValor[0] == name) {
                        retorno = chaveValor[1];
                        return false;
                    }
                });
                return retorno;
            } else {
                if (parte.indexOf('=') >= 0 && parte.split('=')[0] == name) {
                    var str = parte.split('=')[1];
                    return str.split('#')[0];
                }
            }
        }
    };
    me.hasBeenShowed = function(name){
        var storage = me.getFromStorage(name);
        if(storage == null)
            return false;
        return storage.value;
    };
    me.canShowFeature = function(key){
        if(me.hasBeenShowed(key) == false){
            me.saveOnStorage(key, {value:true});
            return true;
        }
        return false;
	};
	me.textDialogHtml = '';
	me.titleDialogHtml = '';
	me.showCustomDialog = function(title, html){
		me.textDialogHtml = html;
		me.titleDialogHtml = title;
		$('#modalCustomText').modal('open');
	};
	me.interval_hover=null;
	
	me.rankingFullList = null

	me.currentSortCol = 0;
	me.sortReverse = true;
	me.setCurrentSort = function(i){
		if(me.currentSortCol == i){
			me.sortReverse = !me.sortReverse;
		}else{
			me.currentSortCol = i;
		}
	};
	
	
	me.blinkLock=false;
	
	
}

function closeChartDialog(it){
	$(it).parent().modal('close');
};