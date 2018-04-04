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
    me.goup = function(){
        me.mainObj = me.prevParent;
        me.mainObjs=[me.mainObj];
        if(me.mainObj.name=='Anima')
            me.prevParent=null;
        
    }
    me.prevParent = null;
    
    me.inside = function(index){
        me.prevParent = me.mainObj;
        me.mainObj =me.mainObj.childs[index];
        me.mainObj.childs = me.mainObj.childs.sort(function(a,b){
            return b.total - a.total;
        });
        me.mainObjs=[me.mainObj];    
		$("html, body").animate({ scrollTop: 0 }, "slow");
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
    me.stack = [
		new heapItem('Anima', me.getRandomData(),me.getRandom(),[
			new heapItem('UniBH', me.getRandomData(),me.getRandom(),[
				new heapItem('Campus I', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus II', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus III', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus IV', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus V', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus VI', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				])
			]),
			new heapItem('São Judas', me.getRandomData(),me.getRandom(),[
				new heapItem('Campus I', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus II', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus III', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus IV', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus V', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus VI', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				])
			]),
			new heapItem('UNA', me.getRandomData(),me.getRandom(),[
				new heapItem('Campus I', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus II', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus III', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus IV', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus V', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				]),
				new heapItem('Campus VI', me.getRandomData(),me.getRandom(),[
					new heapItem('Coordenação I', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação II', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação III', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação IV', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação V', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VI', me.getRandomData(),me.getRandom(),[]),
					new heapItem('Coordenação VII', me.getRandomData(),me.getRandom(),[])
				])
			])
			
		])
	];

    
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