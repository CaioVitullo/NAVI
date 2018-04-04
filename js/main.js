
var mainApp = angular.module('mainApp', []);

mainApp.controller('ctrl', function ($http, $scope, $timeout, $interval) {
	var me = $scope;
	dataManager($http, me);
	histogramManager(me);
	classUtil(me);
	
	me.mobileSelectedPage = 'main';
	me.isMobile = $('#mobileMenu').is(':visible');
	
	me._mainCtrl = true;
	
	me.mainObjs = [];
	me.loadCtrl = function(){	
		me.getDefaultLists(null, function(){
			
		});	
		resizeHorizontalScroll();
		me.mainObj = me.stack[me.mainIndex];
		me.mainObjs = [me.stack[me.mainIndex]];
		$timeout(function(){
			$('.chartjs-size-monitor').remove();
		},100);
	}; 
	
	me.showRadarChart = function(){
		var ctx = document.getElementById("myChart")
		
	
		var radar =new Chart(
			document.getElementById("mainChart"),
				{type:"radar",
				data:{
						labels:me.getLabels(),
						datasets:[
								{
									label:"2018",
									data:me.getRandomData(),
									fill:true,
									backgroundColor:"rgba(108, 163, 210, 0.2)",
									borderColor:"rgb(108, 163, 210)",
									pointBackgroundColor:"rgb(108, 163, 210)",
									pointBorderColor:"#fff",
									pointHoverBackgroundColor:"#fff",
									pointHoverBorderColor:"rgb(108, 163, 210)"
								},
								{
									label:"2017",
									data:me.getRandomData(),
									fill:true,
									backgroundColor:"rgba(81, 45, 121, 0.2)",
									borderColor:"rgb(81, 45, 121)",
									pointBackgroundColor:"rgb(81, 45, 121)",
									pointBorderColor:"#fff",
									pointHoverBackgroundColor:"#fff",
									pointHoverBorderColor:"rgb(81, 45, 121)"
								}]
				},
				options:{
					responsive:true,
					maintainAspectRatio: true,
					layout:{
						width:'400'
					},
					elements:
						{line:{
							tension:0,
							borderWidth:3
							}
						}
					}
				})
	};
	me.drawMiniChart = function(id){
		var radar =new Chart(
			document.getElementById(id),
				{type:"radar",
				data:{
						labels:me.getLabels(),
						datasets:[
								{
									label:"2018",
									data:me.getRandomData(),
									fill:true,
									backgroundColor:"rgba(108, 163, 210, 0.2)",
									borderColor:"rgb(108, 163, 210)",
									pointBackgroundColor:"rgb(108, 163, 210)",
									pointBorderColor:"#fff",
									pointHoverBackgroundColor:"#fff",
									pointHoverBorderColor:"rgb(108, 163, 210)"
								},
								{
									label:"2017",
									data:me.getRandomData(),
									fill:true,
									backgroundColor:"rgba(81, 45, 121, 0.2)",
									borderColor:"rgb(81, 45, 121)",
									pointBackgroundColor:"rgb(81, 45, 121)",
									pointBorderColor:"#fff",
									pointHoverBackgroundColor:"#fff",
									pointHoverBorderColor:"rgb(81, 45, 121)"
								}]
				},
				options:{
					responsive:true,
					maintainAspectRatio: true,
					layout:{
						width:'400'
					},
					elements:
						{line:{
							tension:0,
							borderWidth:3
							}
						}
					}
				});
	}
	me.getRoot = function(file='index'){
		return  window.location.href.substring(0, window.location.href.indexOf(file +'.html'));
	};
	
	me.chartData = {}
	me.getGenericData = function(propery, name, n=1, fnValueX, fnValueY, fnTooltip, checkLine){
		if(me.chartData.hasOwnProperty(propery)){
			if(me.chartData[propery].hasOwnProperty(me.selectedPeriod))
				return me.chartData[propery][me.selectedPeriod];
		}
		
			var d= [];
			var fn=null;
			if(typeof(fnTooltip)=='function'){
				fn = fnTooltip;
			}else{
				fn = function(item, fig){
					html= '<h5 style="width:300px;font-size:1.3rem;">' + item.name + '</h5><p>' + name + ': ' + (item.info.hasOwnProperty(propery) ? item.info[propery] : fig[propery]) + '</p>';
					html += '<p>Rendimento: ' + fig.performance + '% acumulado nos ' + me.filters.Periodo[me.selectedPeriod].Title.toLowerCase();
					return html;
				}
			}

			var fnVal = function(val,item){return val;}
			if(typeof(fnValueY) == 'function')
				fnVal = fnValueY;
			
			var fnX = function(val,item){return val;}
			if(typeof(fnValueX) == 'function')
				fnX = fnValueX;
			
			if(checkLine==null)
				checkLine = function(item){return true;}

			for(var i=0;i<me.defaultLists[3].length;i++){
				var item = me.defaultLists[3][i]
				var fig = item.figures[me.selectedPeriod];
				if(fig != null && checkLine(item)){
					
					d.push([
						fnX(item.info.hasOwnProperty(propery) ? item.info[propery]/n : fig[propery]/n, item),
						item.info.isAcao ? fnVal(fig.performance/100.0,item) : null,
						fn(item, fig) ,
						item.info.isMultimercado ? fnVal(fig.performance/100.0, item) : null,
						fn(item, fig) ,
						item.info.isRendaFixa ? fnVal(fig.performance/100.0,item) : null,
						fn(item, fig)
					])
				}		
			}

			if(me.chartData.hasOwnProperty(propery) == false)
				me.chartData[propery] = {};
			me.chartData[propery][me.selectedPeriod]=d;
			return d;
	}
	
	me.currentCharTitle = '';
	me.gerDefaultChartOptions = function(title){
		var w =  $('#modal1').width()*0.85;
		var h = Math.min(w / 1.61, $('#modal1').height()) 
		return {
			//width:w,
			height: h,
			chart: {
			  //title: 'Students\' Final Grades',
			  //subtitle: 'based on hours studied'
			},
			chartArea: {width: '80%', 'height': '70%', top:35},
			colors: ['#E94D20', '#ECA403', '#63A74A'],
			hAxis: {title: title},
			vAxis: {
				title: 'Rentabilidade(%) acumulada nos ' + me.filters.PeriodoTitle(),
				minValue:-0.3,
				textStyle : {
					fontSize: 12,
					'font-style':'normal',
					'font-name':'sans-serif'
				},
				format: 'percent'
			},
			legend: {position:'top'},
			
			
			tooltip:{isHtml: true}//{isHtml:true, textStyle: {color: 'black'}, showColorCode: true}
			//bubble: {textStyle: {fontSize: 11}}
		  };
	}
	me.analiseRecuperacao = {};
	
	me.openChart = function(name, propery, text){
		ga('send', {
			hitType: 'event',
			eventCategory: name,
			eventAction: 'chart'
		  });
		
		  if(propery=='diasRecuperacao'){
			  me.openAnaliseDiasRecuperacao();
			  return;
		  }

		me.currentCharTitle = name + ' vs Rentabilidade';
		if(text != null)
			me.currentChartText = text.replace('Clique e confira!', '');
		
		$('#modal1').modal('open');

		var data = new google.visualization.DataTable();
		
		data.addColumn({type:'number',label: name});
		data.addColumn('number', 'Ação');
		data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		data.addColumn('number', 'Multimercado');
		data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		data.addColumn('number', 'Renda Fixa');
		data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		
		
		data.addRows(me.getGenericData(propery, name, propery == 'admTax'?100.0:1));

		var options = me.gerDefaultChartOptions(name);
		
		if(propery == 'admTax')
		  options.hAxis.format='percent';

		//var chart = new google.charts.Scatter(document.getElementById('chart_txdm_scatter'));
		var chart = new google.visualization.ScatterChart(document.getElementById('chart_txdm_scatter'));

		//chart.draw(data, google.charts.Scatter.convertOptions(options));
		chart.draw(data, options);
	}
	me.mobSelectPage = function(page){
		if(page=='histogram')
			$timeout(function(){
				me.drawLineChart(me.currentRow, true);
				me.drawRankChart(me.currentRow, true);
				resizeHorizontalScroll();

			} ,50);
			

		me.mobileSelectedPage = page;
	};
	
	
	
	me.getPeriodNames = function(){
		var month = 2;
		var year = 18;
		var list = [];
		for(var i = 0;i<36;i++){
			list.push(me.getMonthName(month, year));
			month -=1;
			if(month == 0){
				month = 12;
				year-=1;
			}
		}
		return list;
	};
	me._monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
	me.getMonthName = function(monthIndex, year){
		return me._monthNames[monthIndex-1] + '/' + year
	}
	me.periodName = me.getPeriodNames();
	me.filterHideClosed = false;
	me.filterHideRestrict = false;
	me.filters = {
		PeriodoTitle:function(){
			return me.filters.Periodo[me.selectedPeriod].Title.toLowerCase();},
		Periodo : [
			{id:0,len:12, Title:'Últimos 12 meses', visible:true, default:true},
			{id:1,len:24, Title:'Últimos 24 meses', visible:true, default:true},
			{id:2,len:36, Title:'Últimos 36 meses', visible:true, default:true}
			//{id:3, Title:'2017', visible:false, default:false},
			//{id:4, Title:'2016', visible:false, default:false}
		],
		Tipo : [
			{id:0, Title:'Renda Fixa', checked:true, visible:true, default:true},
			{id:1, Title:'Multimercado', checked:true, visible:true, default:true},
			{id:2, Title:'Ações', checked:true, visible:true, default:true},
			{id:3, Title:'Long And Short', checked:true, visible:false, default:false},
			{id:4, Title:'Cambial', checked:true, visible:false, default:false},
			{id:5, Title:'Indexado', checked:true, visible:false, default:false},
			{id:6, Title:'Exterior', checked:true, visible:false, default:false},
		],
		InitialValue : [
			{id:0, Title:'500', checked:true, visible:false, default:false, filter:true, disabled:true},
			{id:1, Title:'1k', checked:true, visible:true, default:true, filter:true, disabled:false},
			{id:2, Title:'3k', checked:true, visible:false, default:false, filter:true, disabled:false},
			{id:3, Title:'5k', checked:true, visible:true, default:true, filter:true, disabled:false},
			{id:4, Title:'10k', checked:true, visible:false, default:false, filter:true, disabled:false},
			{id:5, Title:'15k', checked:true, visible:false, default:false, filter:true, disabled:false},
			{id:6, Title:'20k', checked:true, visible:false, default:false, filter:true, disabled:false},
			{id:7, Title:'25k', checked:true, visible:true, default:true, filter:true, disabled:false},
			{id:8, Title:'30k', checked:true, visible:false, default:false, filter:true, disabled:false},
			{id:9, Title:'50k', checked:true, visible:false, default:false, filter:true, disabled:false},
			{id:10, Title:'200k', checked:true, visible:false, default:false, filter:true, disabled:false}
			//{id:11, Title:'Qualificados', checked:true, visible:false, default:false, filter:false}
		],
		resgate : [
			{id:0, Title:'D+0', checked:true, visible:true, default:true},
			{id:1, Title:'D+1', checked:true, visible:true, default:true},
			{id:2, Title:'D+7', checked:true, visible:true, default:true},
			{id:3, Title:'D+30', checked:true, visible:false, default:false},
			{id:4, Title:'D+60', checked:true, visible:false, default:false}
		],
		volume : [
			{id:0, Title:'1M', checked:true, visible:true, default:true},
			{id:1, Title:'10M', checked:true, visible:true, default:true},
			{id:2, Title:'100M', checked:true, visible:true, default:true},
			{id:3, Title:'500M', checked:true, visible:false, default:false},
			{id:4, Title:'1B', checked:true, visible:false, default:false}
		]
	};
	
});

mainApp.directive('myHistogram', function(){
	return {
		restrict:'E',
		scope:{
			data:'=',
			index:'=',
			main:'=',
			showup:'=',
			top:'=',
			fn:'&',
			up:'&',
			dlg:'&'
		},
		replace:true,
		templateUrl:'templates/histogram.html',
		link: function($scope, $element, attr, parentDirectCtrl){
			$scope.radar =new Chart(
				$($element).find('canvas'),
					{type:"radar",
					data:{
							labels:$scope.labels,
							datasets:[
									{
										label:"2018",
										data:$scope.data.values,
										fill:true,
										fontSize: 40,
										backgroundColor:$scope.main == true?"rgba(108, 163, 210, 0.2)":"rgb(81, 45, 121, 0.2)",
										borderColor:$scope.main == true?"rgba(108, 163, 210)":"rgb(81, 45, 121)",
										pointBackgroundColor:$scope.main == true?"rgba(108, 163, 210)":"rgb(81, 45, 121)",
										pointBorderColor:"#fff",
										pointHoverBackgroundColor:"#fff",
										pointHoverBorderColor:$scope.main == true?"rgba(108, 163, 210)":"rgb(81, 45, 121)",
									},{
										data:[100,100,100,100,100,100],
										fill:false,
										borderColor:'transparent'
									}
								]
					},
					options:{
						responsive:true,
						maintainAspectRatio: true,
						layout:{
							width:'400'
						},
						labels: {
							fontColor: 'rgb(255, 99, 132)',
							fontSize: 24
						},
						legend:{display:false},
						responsive: true,
						scales: {
							pointLabels: {
								fontSize: 18	
							},
							yAxes: [{
								display: false,
								ticks: {
									beginAtZero: true,
									max: 100,
									min: 0
								}
							}]
						},
						elements:
							{line:{
								tension:0,
								borderWidth:3
								}
							}
						}
					});
		},
		controller:function($scope){
			$scope.labels= ["Pesquisa de satisfação","NPS","Carreira e Empregabilidade","ICC","Avaliação interna","Avaliação externa"];
			$scope.labels_provaInterna = ['Prova Modular', 'Prova Global', 'Avaliação institucional'];
			$scope.labels_provaExterna = ['IGC', 'CPC', 'ENADE', 'Conceito de Curso'];
			$scope.getRandomData = function(){
				return [parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100),parseInt(Math.random() * 100)];
			};
			$scope.clickCanvas = function(){
				$scope.fn({index:$scope.index});
			};
			$scope.goup = function(){
				$scope.up();
			};
			$scope.openHist = function(index){
				$scope.dlg({label:$scope.labels[index]});
			}
			$scope.loadCtrl = function(){
				if($scope.top == true){
					var p = $scope.$parent;
					while(p != null && p.hasOwnProperty('_mainCtrl') == false){
						if( typeof(p.$parent) != 'undefined' && p.$parent != null){
							p = p.$parent;
						}else{
							break;
						}
					}
					if(p != null){
						p.updateChart = function(){
							$scope.radar.update();
						}
					}
				}
			};
		}
	};
});

mainApp.filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
		if(input=='')
			return'';
		return $filter('number')(input, decimals)+'%';
    };
}]);
mainApp.filter('rounded', ['$filter', function($filter) {
    return function(input, decimals) {
        return $filter('number')(input, decimals);
    };
}]);
mainApp.filter('trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);


google.charts.load('current', {'packages':['corechart', 'scatter']});
google.charts.setOnLoadCallback(function(){
	window.googleChartHasFinished = true;
});

$(document).ready(function(){
	//$('.tooltipped').tooltip({delay: 50, html:true});
	$('.modal').modal({
			'startingTop':'3%',
			'endingTop': '4%'
			//ready: function(modal, trigger) { 
			//	$(modal).css('top','4%');
			//}
		});
	
		
	resizeHorizontalScroll();
});

$(window).resize(function(){
	resizeHorizontalScroll();
});
function resizeHorizontalScroll (){
	ww = $('#horizontalScollParent').width()
	$('#rankHorizontal').css('maxHeight', ww + 'px')
	$('#rankHorizontal').css('marginBottom',-(ww-100) + 'px')
}
function removeRotateGif(){
	$('.rotate').remove();
}

function removeCover(el){
	$(el).find('.overCanvas').css('display', 'none');
}
function setCover(el){
	$(el).find('.overCanvas').css('display', 'block');
}


/*
,
	{
		label:"2017",
		data:$scope.data.values,
		fill:true,
		backgroundColor:"rgba(81, 45, 121, 0.2)",
		borderColor:"rgb(81, 45, 121)",
		pointBackgroundColor:"rgb(81, 45, 121)",
		pointBorderColor:"#fff",
		pointHoverBackgroundColor:"#fff",
		pointHoverBorderColor:"rgb(81, 45, 121)"
	}

	*/