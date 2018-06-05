function histogramManager(me){
    me.mainIndex = 0;
    me.subIndex = 0;
    me.mainHeap = null;

	me.getRandom = function(){
		return parseInt(Math.random() * 100);
	}
    me.getRandomData = function(){
		return [parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100)];
	};
	me.getLabels = function(){
		return ["Pesquisa de satisfação","NPS","Carreira e Empregabilidade","ICC","Avaliação interna","Avaliação externa"];
	};
	me.turnObjInLine = function(){
		var a =[];
		var item = me.defaultLists[0];
		a.push(item);
		while(a.any(function(i){return i.hasOwnProperty('visited')==false;})){
			var n = a.length;
			for(var i=0;i<n;i++){
				
				if(a[i].hasOwnProperty('visited')==false && a[i].childs != null && a[i].childs.length > 0){
					a.addRange(a[i].childs);
					a[i].visited=true;
				}else{
					a[i].visited=true;
				}
			}
		}
		return a;
	}
	me.getItemByID = function(parentID){
		if(me.objInLine == null)
			me.objInLine = me.turnObjInLine();
		
		return me.objInLine.first({ID:parentID});
		
	};
	me.inlineObj = function(){
		if(me.objInLine == null)
			me.objInLine = me.turnObjInLine();
		return me.objInLine;
	}
	me.objInLine = null;
    me.goup = function(parentID){
		var parent = me.getItemByID(parentID);
		me.mainObj = parent;
        me.mainObjs=[me.mainObj];
		
	
    }
    me.prevParent = null;
    
    me.inside = function(index){
		var clicked = me.mainObj.childs.first({ID:index});
		if(clicked == null || clicked.childs==null || clicked.childs.length==0)
			return;
		
        me.mainObj =me.mainObj.childs.first({ID:index});
        me.mainObj.childs = me.mainObj.childs.sort(function(a,b){
            return b.DPQ.valor - a.DPQ.valor;
		});
		me.updateFilter(me.mainObj.childs);
        me.mainObjs=[me.mainObj];    
		$("html, body").animate({ scrollTop: 0 }, "slow");
		
		if(me.radarIsOn==true)
			window.setTimeout(function(){
				me.changeChart();
			},50)
	};
	me.qualidadeDeEnsinoFilterHist=[];
	
	me.filterQualidadeEnsino = 100;
	me.calcQualidadeDeEnsinoFilterHist = function(list){
		var count = list.length;
		me.qualidadeDeEnsinoFilterHist=[];
		var avg = list.select('QualidadeEnsino').avg().toFixed(0);
		var target = 70;
		for(var i=2;i<100;i++){
			var c =list.count(function(x){return x.QualidadeEnsino <= i;}); 
			me.qualidadeDeEnsinoFilterHist.push({
				h:(100*c/count).toFixed(2),
				w:1,
				v:i,
				isAvg:i==avg,
				isTarget:i==target
			})
		}
		me.QualidadeEnsinoMetadata = {
			belowAvg:(100 * list.count(function(x){return x.QualidadeEnsino < avg;})/count).toFixed(2),
			belowTarget:(100 * list.count(function(x){return x.QualidadeEnsino < target;})/count).toFixed(2),
			target:target,
			avg:avg
		};
	};
	me.filterQualidadeServico = 100;
	me.qualidadeServicoFilterHist=[];
	
	me.calcQualidadeDeServicoFilterHist = function(list){
		var count = list.length;
		me.qualidadeServicoFilterHist=[];
		var avg = list.select('QualidadeServico').avg().toFixed(0);
		var target = 70;
		for(var i=2;i<100;i++){
			var c =list.count(function(x){return x.QualidadeServico <= i;}); 
			me.qualidadeServicoFilterHist.push({
				h:(100*c/count).toFixed(2),
				w:1,
				v:i,
				isAvg:i==avg,
				isTarget:i==target
			})
		}
		me.QualidadeServicoMetadata = {
			belowAvg:(100 * list.count(function(x){return x.QualidadeServico < avg;})/count).toFixed(2),
			belowTarget:(100 * list.count(function(x){return x.QualidadeServico < target;})/count).toFixed(2),
			target:target,
			avg:avg
		};
	};
	me.filterICC = 100;
	me.ICCFilterHist=[];
	me.calcICCFilterHist = function(list){
		var count = list.length;
		me.ICCFilterHist=[];
		var avg = list.select('ICC').avg().toFixed(0);
		var target = 70;
		for(var i=2;i<100;i++){
			var c =list.count(function(x){return x.ICC <= i;}); 
			me.ICCFilterHist.push({
				h:(100*c/count).toFixed(2),
				w:1,
				v:i,
				isAvg:i==avg,
				isTarget:i==target
			})
		}
		me.ICCMetadata = {
			belowAvg:(100 * list.count(function(x){return x.ICC < avg;})/count).toFixed(2),
			belowTarget:(100 * list.count(function(x){return x.ICC < target;})/count).toFixed(2),
			target:target,
			avg:avg
		};
	};
	me.filterCarreiraEmpregabilidade= 100;
	me.carreiraEmpregabilidadeHist=[];
	me.calcCarreiraEmpregabilidadeFilterHist = function(list){
		var count = list.length;
		me.carreiraEmpregabilidadeHist=[];
		var avg = list.select('CarreiraEmpregabilidade').avg().toFixed(0);
		var target = 70;
		for(var i=2;i<100;i++){
			var c =list.count(function(x){return x.CarreiraEmpregabilidade <= i;}); 
			me.carreiraEmpregabilidadeHist.push({
				h:(100*c/count).toFixed(2),
				w:1,
				v:i,
				isAvg:i==avg,
				isTarget:i==target
			})
		};
		me.carreiraEmpregabilidadeMetadata = {
			belowAvg:(100 * list.count(function(x){return x.CarreiraEmpregabilidade < avg;})/count).toFixed(2),
			belowTarget:(100 * list.count(function(x){return x.CarreiraEmpregabilidade < target;})/count).toFixed(2),
			target:target,
			avg:avg
		}
	};
	
	me.openHistDlg = function(label){
		me.modalTitle = label;
		$('#modal1').modal('open');
		var a = [['Unidade', 'Pontos']];
		for(var i=0;i<100;i++){
			a.push(['Unidade ' + i,parseInt(Math.random() * 100) ]);
		}
		var data = google.visualization.arrayToDataTable(a);
		var options = {
			height:$('#modal1').height()*0.9,
			title: 'Pontos',
			legend: { position: 'none' },
		  };
  
		  var chart = new google.visualization.Histogram(document.getElementById('modalHistogram'));
		  chart.draw(data, options);

		//modalHistogram
	};
	me.openNotes = function(){
		$('#modalNodes').modal('open');
	};
	


    
}


var heapItem = function(_name,_values,_total, _child){
	this.values = _values || [];
	this.name = _name ||'';
	this.childs= _child || [];
	this.total = _total;
	this.avaliacaoExterna = createRandom(4),
	this.avaliacaoInterna = createRandom(3)
}

function createRandom(x){
	var k =[];
	for(var i=0;i<x;i++){
		k.push(parseInt(Math.random() * 100));
	}
	return k;
}