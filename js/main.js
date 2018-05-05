
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
	me.loadCtrl = function () {
		me.getDefaultLists(null, function () {
			me.mainObj = me.defaultLists[0];
			me.mainObjs = [me.defaultLists[0]];
			me.updateFilter(me.mainObj.childs);
			$timeout(function(){
				skipIntroduction();
			},500);
		});
		resizeHorizontalScroll();

		$timeout(function () {
			$('.chartjs-size-monitor').remove();
		}, 100);
	};
	me.updateFilter = function (list) {
		me.calcQualidadeDeEnsinoFilterHist(list);
		me.calcQualidadeDeServicoFilterHist(list);
		me.calcICCFilterHist(list);
		me.calcCarreiraEmpregabilidadeFilterHist(list);
	}
	me.getList = function (top) {
		if (me.mainObj == null || me.mainObj.childs == null || me.mainObj.childs.length == 0)
			return [];

		var list = me.mainObj.childs;

		if (me.allFilterAreUntouched()) {
			if (top == true)
				return list.top();

			return list.bottom();
		}

		var n = list.length;

		var result = [];
		for (var i = 0; i < n; i++) {
			var item = list[i];
			if (item.QualidadeEnsino <= me.filterQualidadeEnsino &&
				item.QualidadeServico <= me.filterQualidadeServico &&
				item.ICC <= me.filterICC &&
				item.CarreiraEmpregabilidade <= me.filterCarreiraEmpregabilidade) {
				result.push(item);
			}
		}
		if (top == true)
			return result.top();

		return result.bottom();


	};
	me.allFilterAreUntouched = function () {
		return me.filterQualidadeEnsino == 100 &&
			me.filterQualidadeServico == 100 &&
			me.filterICC == 100 &&
			me.filterCarreiraEmpregabilidade == 100;
	};
	me.showRadarChart = function () {
		var ctx = document.getElementById("myChart")


		var radar = new Chart(
			document.getElementById("mainChart"),
			{
				type: "radar",
				data: {
					labels: me.getLabels(),
					datasets: [
						{
							label: "2018",
							data: me.getRandomData(),
							fill: true,
							backgroundColor: "rgba(108, 163, 210, 0.2)",
							borderColor: "rgb(108, 163, 210)",
							pointBackgroundColor: "rgb(108, 163, 210)",
							pointBorderColor: "#fff",
							pointHoverBackgroundColor: "#fff",
							pointHoverBorderColor: "rgb(108, 163, 210)"
						},
						{
							label: "2017",
							data: me.getRandomData(),
							fill: true,
							backgroundColor: "rgba(81, 45, 121, 0.2)",
							borderColor: "rgb(81, 45, 121)",
							pointBackgroundColor: "rgb(81, 45, 121)",
							pointBorderColor: "#fff",
							pointHoverBackgroundColor: "#fff",
							pointHoverBorderColor: "rgb(81, 45, 121)"
						}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: true,
					layout: {
						width: '400'
					},
					elements:
						{
							line: {
								tension: 0,
								borderWidth: 3
							}
						}
				}
			})
	};
	me.drawMiniChart = function (id) {
		var radar = new Chart(
			document.getElementById(id),
			{
				type: "radar",
				data: {
					labels: me.getLabels(),
					datasets: [
						{
							label: "2018",
							data: me.getRandomData(),
							fill: true,
							backgroundColor: "rgba(108, 163, 210, 0.2)",
							borderColor: "rgb(108, 163, 210)",
							pointBackgroundColor: "rgb(108, 163, 210)",
							pointBorderColor: "#fff",
							pointHoverBackgroundColor: "#fff",
							pointHoverBorderColor: "rgb(108, 163, 210)"
						},
						{
							label: "2017",
							data: me.getRandomData(),
							fill: true,
							backgroundColor: "rgba(81, 45, 121, 0.2)",
							borderColor: "rgb(81, 45, 121)",
							pointBackgroundColor: "rgb(81, 45, 121)",
							pointBorderColor: "#fff",
							pointHoverBackgroundColor: "#fff",
							pointHoverBorderColor: "rgb(81, 45, 121)"
						}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: true,
					layout: {
						width: '400'
					},
					elements:
						{
							line: {
								tension: 0,
								borderWidth: 3
							}
						}
				}
			});
	}
	me.getRoot = function (file = 'index') {
		return window.location.href.substring(0, window.location.href.indexOf(file + '.html'));
	};

	me.chartData = {}
	me.getGenericData = function (propery, name, n = 1, fnValueX, fnValueY, fnTooltip, checkLine) {
		if (me.chartData.hasOwnProperty(propery)) {
			if (me.chartData[propery].hasOwnProperty(me.selectedPeriod))
				return me.chartData[propery][me.selectedPeriod];
		}

		var d = [];
		var fn = null;
		if (typeof (fnTooltip) == 'function') {
			fn = fnTooltip;
		} else {
			fn = function (item, fig) {
				html = '<h5 style="width:300px;font-size:1.3rem;">' + item.name + '</h5><p>' + name + ': ' + (item.info.hasOwnProperty(propery) ? item.info[propery] : fig[propery]) + '</p>';
				html += '<p>Rendimento: ' + fig.performance + '% acumulado nos ' + me.filters.Periodo[me.selectedPeriod].Title.toLowerCase();
				return html;
			}
		}

		var fnVal = function (val, item) { return val; }
		if (typeof (fnValueY) == 'function')
			fnVal = fnValueY;

		var fnX = function (val, item) { return val; }
		if (typeof (fnValueX) == 'function')
			fnX = fnValueX;

		if (checkLine == null)
			checkLine = function (item) { return true; }

		for (var i = 0; i < me.defaultLists[3].length; i++) {
			var item = me.defaultLists[3][i]
			var fig = item.figures[me.selectedPeriod];
			if (fig != null && checkLine(item)) {

				d.push([
					fnX(item.info.hasOwnProperty(propery) ? item.info[propery] / n : fig[propery] / n, item),
					item.info.isAcao ? fnVal(fig.performance / 100.0, item) : null,
					fn(item, fig),
					item.info.isMultimercado ? fnVal(fig.performance / 100.0, item) : null,
					fn(item, fig),
					item.info.isRendaFixa ? fnVal(fig.performance / 100.0, item) : null,
					fn(item, fig)
				])
			}
		}

		if (me.chartData.hasOwnProperty(propery) == false)
			me.chartData[propery] = {};
		me.chartData[propery][me.selectedPeriod] = d;
		return d;
	}

	me.currentCharTitle = '';
	me.gerDefaultChartOptions = function () {
		var w = $('#modal1').width() * 0.85;
		var h = Math.min(w / (1.81), $('#modal1').height())
		return {
			//width:w,
			height: h,
			chart: {
				//title: 'Students\' Final Grades',
				//subtitle: 'based on hours studied'
			},
			chartArea: { width: '90%', 'height': '70%', top: 15 },
			colors: ['#512d79', '#ECA403', '#63A74A'],
			hAxis: { 
				title: me.chartX.label,
				minValue: 0,
				maxValue:100 },
			vAxis: {
				title: me.chartY.label,
				minValue: 0,
				maxValue:100,
				textStyle: {
					fontSize: 12,
					'font-style': 'normal',
					'font-name': 'sans-serif'
				},
				//format: 'percent'
			},
			legend: { position: 'none' },
			series: {
				
			  },

			tooltip: { isHtml: true }//{isHtml:true, textStyle: {color: 'black'}, showColorCode: true}
			//bubble: {textStyle: {fontSize: 11}}
		};
	}
	me.analiseRecuperacao = {};

	me.chartXY = [
		{id:0, label:'DPQ', val:function(item){return item.DPQ.valor;}, target:70},
		{id:1, label:'Qualide Ensino', val:function(item){return item.QualidadeEnsino;}, target:70},
		{id:2, label:'Qualidade Serviço', val:function(item){return item.QualidadeServico;}, target:70},
		{id:3, label:'ICC', val:function(item){return item.ICC;}, target:70},
		{id:4, label:'Carreira & Empregabilidade', val:function(item){return item.CarreiraEmpregabilidade;}, target:70}
	];
	me.chartY = me.chartXY[0];
	me.chartX = me.chartXY[1];
	me.avgOn = false;
	me.targetOn = false;
	me.openChart = function () {
		
		me.modalTitle = 'Compare propriedades';
		
		$('#modal1').modal('open');
		me.updateScatterChart();
		
	};
	me.changeScatter = function(){
		me.updateScatterChart();	
	};
	me.updateScatterChart = function(){
		var data = new google.visualization.DataTable();

		//data.addColumn({ type: 'number', label: name });
		data.addColumn('number', me.chartX.label);
		data.addColumn('number', me.chartY.label);
		data.addColumn({ 'type': 'string', 'role': 'tooltip', 'p': { 'html': true } });
		if(me.avgOn)
			data.addColumn('number', 'Média ' + me.chartY.label);
		
		if(me.targetOn)
			data.addColumn('number', 'Meta ' + me.chartY.label);

		
		
		var calcXAvg = function(list){
			var k =[];
			for(var i = 0;i<list.length;i++){
				k.push(me.chartX.val(list[i]));
			}
			return Math.round(k.avg(),2);
		}
		var calcYAvg = function(list){
			var k =[];
			for(var i = 0;i<list.length;i++){
				k.push(me.chartY.val(list[i]));
			}
			return Math.round(k.avg(),2);
		}
		var getTooltip = function(item){
			var html= '<h5 style="width:200px;font-size:1.3rem;">' + item.name + '</h5>';
			html += '<p>' + me.chartX.label + ': ' + me.chartX.val(item) + '</p>';
			html += '<p>' + me.chartY.label + ': ' + me.chartY.val(item) + '</p>';
			html += '</h5>';
			return html;
		};
		
		var d = [];
		
		var ap=null;
		if(me.avgOn)
			ap=[0,null, null, calcYAvg(me.mainObj.childs)];
		if(me.targetOn){
			if(ap != null){
				ap.push(me.chartY.target)
			}else{
				ap=[0,null, null, me.chartY.target];
			}
		}
		if(ap != null)
			d.push(ap);
			
		for(var i=0; i<me.mainObj.childs.length;i++){
			var item = me.mainObj.childs[i];
			var k = [
				me.chartX.val(item),
				me.chartY.val(item),
				getTooltip(item)
			];
			if(me.avgOn)
				k.push(calcYAvg(me.mainObj.childs));
		
			if(me.targetOn)
				k.push(me.chartY.target);
			
			d.push(k);
		}
		var af=null;
		if(me.avgOn)
			af=[100,null, null, calcYAvg(me.mainObj.childs)];
		if(me.targetOn){
			if(af != null){
				af.push(me.chartY.target)
			}else{
				af=[100,null, null, me.chartY.target];
			}
		}
		if(af != null)
			d.push(af);

		data.addRows(d);

		var options = me.gerDefaultChartOptions();
		
		var line=1;
		if(me.avgOn){
			options.series[line]= { color:'#6ca3d2', lineWidth: 1, pointSize: 0 , lineDashStyle: [4, 4]}
			line++;
		}
		if(me.targetOn){
			options.series[line]= { color:'#512d79', lineWidth: 1, pointSize: 0 , lineDashStyle: [4, 4]}
		}
		//
		//var chart = new google.charts.Scatter(document.getElementById('chart_txdm_scatter'));
		var chart = new google.visualization.ScatterChart(document.getElementById('chart_scatter'));

		//chart.draw(data, google.charts.Scatter.convertOptions(options));
		chart.draw(data, options);
		if(me.avgOn){
			me.drawVAxisLine(chart, calcXAvg(me.mainObj.childs), '#6ca3d2'); 
		}
		if(me.targetOn){
			me.drawVAxisLine(chart, me.chartX.target, '#512d79'); 
		}
		
	};
	me.drawVAxisLine = function(chart,value, color){
		var layout = chart.getChartLayoutInterface();
		var chartArea = layout.getChartAreaBoundingBox();
	
		var svg = chart.getContainer().getElementsByTagName('svg')[0];
		var xLoc = layout.getXLocation(value)
		svg.appendChild(me.createLine(xLoc,chartArea.top + chartArea.height,xLoc,chartArea.top,color,2)); // axis line 
	}
	
	me.createLine = function(x1, y1, x2, y2, color, w) {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.setAttribute('x1', x1);
		line.setAttribute('y1', y1);
		line.setAttribute('x2', x2);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke-dasharray', "4, 4" );
		line.setAttribute('stroke', color);
		line.setAttribute('stroke-width', w);
		return line;
	}
	me.mobSelectPage = function (page) {
		if (page == 'histogram')
			$timeout(function () {
				me.drawLineChart(me.currentRow, true);
				me.drawRankChart(me.currentRow, true);
				resizeHorizontalScroll();

			}, 50);


		me.mobileSelectedPage = page;
	};
	me.radarIsOn = false;
	me.changeChart = function(){
		if($("div.chart-container").is(':visible') == true){
			me.radarIsOn = false;		//i.right:contains('close')
			$("i.right:contains('close')").click()
			$('.card').each(function(index, item){
				var hbefore = $(this).attr('hBefore');
				$(item).height(hbefore)
			});
		}else{
			$('.activator').click();
			me.radarIsOn = true;
			window.setTimeout(function(){
				$('.card').each(function(index, item){
					$(this).attr('hBefore', $(this).height())
					var canvas = $(item).find('canvas');
					$(item).height($(canvas).height() * 2.2)
				});
			}, 100);
			
		}
		
	};
	me.getML = function(){
		return me.isMobile ? 0 : 40;
	}
	me.firtsTimeOpenDetailDialog = true;
	me.openDlgFotos = function(){
		$('#modalFotos').modal('open');
		$('#carouselDetail').css('height', '100%');
		if (me.firtsTimeOpenDetailDialog) {
			me.firtsTimeOpenDetailDialog = false;
			$('.carousel.carousel-slider').carousel({
				fullWidth: true,
				indicators: true
			});
		}
	};
	me.carouselInstance = null;
	me.getCarousel = function(){
		if(me.carouselInstance == null){
			me.carouselInstance = $('#carouselDetail');
		}
		return me.carouselInstance;
	};
	me.carouselRight = function(){
		me.getCarousel().carousel('next');
	};
	me.carouselLeft = function(){
		me.getCarousel().carousel('prev');
	};
	me.getPeriodNames = function () {
		var month = 4;
		var year = 18;
		var list = [];
		for (var i = 0; i < 36; i++) {
			list.push(me.getMonthName(month, year));
			month -= 1;
			if (month == 0) {
				month = 12;
				year -= 1;
			}
		}
		return list;
	};
	me._monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
	me.getMonthName = function (monthIndex, year) {
		return me._monthNames[monthIndex - 1] + '/' + year
	}
	me.periodName = me.getPeriodNames();
	me.filterHideClosed = false;
	me.filterHideRestrict = false;
	me.filters = {
		PeriodoTitle: function () {
			return me.filters.Periodo[me.selectedPeriod].Title.toLowerCase();
		},
		Periodo: [
			{ id: 0, len: 12, Title: 'Últimos 12 meses', visible: true, default: true },
			{ id: 1, len: 24, Title: 'Últimos 24 meses', visible: true, default: true },
			{ id: 2, len: 36, Title: 'Últimos 36 meses', visible: true, default: true }
			//{id:3, Title:'2017', visible:false, default:false},
			//{id:4, Title:'2016', visible:false, default:false}
		],
		Tipo: [
			{ id: 0, Title: 'Renda Fixa', checked: true, visible: true, default: true },
			{ id: 1, Title: 'Multimercado', checked: true, visible: true, default: true },
			{ id: 2, Title: 'Ações', checked: true, visible: true, default: true },
			{ id: 3, Title: 'Long And Short', checked: true, visible: false, default: false },
			{ id: 4, Title: 'Cambial', checked: true, visible: false, default: false },
			{ id: 5, Title: 'Indexado', checked: true, visible: false, default: false },
			{ id: 6, Title: 'Exterior', checked: true, visible: false, default: false },
		],
		InitialValue: [
			{ id: 0, Title: '500', checked: true, visible: false, default: false, filter: true, disabled: true },
			{ id: 1, Title: '1k', checked: true, visible: true, default: true, filter: true, disabled: false },
			{ id: 2, Title: '3k', checked: true, visible: false, default: false, filter: true, disabled: false },
			{ id: 3, Title: '5k', checked: true, visible: true, default: true, filter: true, disabled: false },
			{ id: 4, Title: '10k', checked: true, visible: false, default: false, filter: true, disabled: false },
			{ id: 5, Title: '15k', checked: true, visible: false, default: false, filter: true, disabled: false },
			{ id: 6, Title: '20k', checked: true, visible: false, default: false, filter: true, disabled: false },
			{ id: 7, Title: '25k', checked: true, visible: true, default: true, filter: true, disabled: false },
			{ id: 8, Title: '30k', checked: true, visible: false, default: false, filter: true, disabled: false },
			{ id: 9, Title: '50k', checked: true, visible: false, default: false, filter: true, disabled: false },
			{ id: 10, Title: '200k', checked: true, visible: false, default: false, filter: true, disabled: false }
			//{id:11, Title:'Qualificados', checked:true, visible:false, default:false, filter:false}
		],
		resgate: [
			{ id: 0, Title: 'D+0', checked: true, visible: true, default: true },
			{ id: 1, Title: 'D+1', checked: true, visible: true, default: true },
			{ id: 2, Title: 'D+7', checked: true, visible: true, default: true },
			{ id: 3, Title: 'D+30', checked: true, visible: false, default: false },
			{ id: 4, Title: 'D+60', checked: true, visible: false, default: false }
		],
		volume: [
			{ id: 0, Title: '1M', checked: true, visible: true, default: true },
			{ id: 1, Title: '10M', checked: true, visible: true, default: true },
			{ id: 2, Title: '100M', checked: true, visible: true, default: true },
			{ id: 3, Title: '500M', checked: true, visible: false, default: false },
			{ id: 4, Title: '1B', checked: true, visible: false, default: false }
		]
	};

});
mainApp.directive('singleLine', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/singleLine.html',
		scope: { data: '=', level: '=', ml: '=', meta:'=' }
	};
});
mainApp.directive('multiLine', function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/multiLine.html',
		scope: { data: '=', level: '=', ml: '=', meta:'=' }
	};
});
mainApp.directive('myHistogram', function () {
	return {
		restrict: 'E',
		scope: {
			data: '=',
			index: '=',
			main: '=',
			showup: '=',
			top: '=',
			fn: '&',
			up: '&',
			dlg: '&',
			ml: '=',
			mobile:'=',
			meta:'='
		},
		replace: true,
		templateUrl: 'templates/histogram.html',
		link: function ($scope, $element, attr, parentDirectCtrl) {
			$scope.radar = new Chart(
				$($element).find('canvas'),
				{
					type: "radar",
					data: {
						labels: $scope.labels,
						datasets: [
							{
								label: "",
								data: $scope.data.chartValues,
								fill: true,
								fontSize: 20,
								backgroundColor: $scope.main == true ? "rgba(108, 163, 210, 0.2)" : "rgb(81, 45, 121, 0.2)",
								borderColor: $scope.main == true ? "rgba(108, 163, 210)" : "rgb(81, 45, 121)",
								pointBackgroundColor: $scope.main == true ? "rgba(108, 163, 210)" : "rgb(81, 45, 121)",
								pointBorderColor: "#fff",
								pointHoverBackgroundColor: "#fff",
								pointHoverBorderColor: $scope.main == true ? "rgba(108, 163, 210)" : "rgb(81, 45, 121)",
							}, {
								data: [100, 100, 100, 100],
								fill: false,
								borderColor: 'transparent'
							}
						]
					},
					options: {

						responsive: true,
						maintainAspectRatio: false,
						layout: {
							
							
						},
						labels: {
							fontColor: 'rgb(255, 99, 132)',
							fontSize: 24
						},
						legend: { display: false },
						responsive: true,

						scale: {
							ticks: {
								display: false,
								beginAtZero: true,
								display: false,
								max: 100,
								min: 0,
								stepSize: 20
							},
							pointLabels: {
								fontSize: $scope.top == true ? 18 : 12
							},
							xAxes: [{
								display: false
							}],
							yAxes: [{
								display: false,
								ticks: {
									beginAtZero: true,
									display: false,
									max: 100,
									min: 0,
									stepSize: 20
								}
							}]
						},
						elements:
							{
								line: {
									tension: 0,
									borderWidth: 3
								}
							}
					}
				});
		},
		controller: function ($scope) {
			$scope.labels = ["Qualidade Ensino", "Qualidade Serviços", "ICC", "Carreira & Empregabilidade"];
			$scope.labels_provaInterna = ['Prova Modular', 'Prova Global', 'Avaliação institucional'];
			$scope.labels_provaExterna = ['IGC', 'CPC', 'ENADE', 'Conceito de Curso'];

			$scope.clickCanvas = function () {
				$scope.fn({ index: $scope.data.ID });
			};
			$scope.goup = function () {
				$scope.up({parentID:$scope.data.parentID});
			};
			$scope.openHist = function (index) {
				$scope.dlg({ label: $scope.labels[index] });
			}
			$scope.loadCtrl = function () {
				if ($scope.top == true) {
					var p = $scope.$parent;
					while (p != null && p.hasOwnProperty('_mainCtrl') == false) {
						if (typeof (p.$parent) != 'undefined' && p.$parent != null) {
							p = p.$parent;
						} else {
							break;
						}
					}
					if (p != null) {
						p.updateChart = function () {
							$scope.radar.update();
						}
					}
				}
			};
		}
	};
});

mainApp.filter('percentage', ['$filter', function ($filter) {
	return function (input, decimals) {
		if (input == '')
			return '';
		return $filter('number')(input, decimals) + '%';
	};
}]);
mainApp.filter('rounded', ['$filter', function ($filter) {
	return function (input, decimals) {
		return $filter('number')(input, decimals);
	};
}]);
mainApp.filter('trusted', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);


google.charts.load('current', { 'packages': ['corechart', 'scatter'] });
google.charts.setOnLoadCallback(function () {
	window.googleChartHasFinished = true;
});

$(document).ready(function () {
	//$('.tooltipped').tooltip({delay: 50, html:true});
	$('.modal').modal({
		'startingTop': '3%',
		'endingTop': '4%'
		//ready: function(modal, trigger) { 
		//	$(modal).css('top','4%');
		//}
	});
	$('.collapsible').collapsible();
	$('select').material_select();

	resizeHorizontalScroll();
});

$(window).resize(function () {
	resizeHorizontalScroll();
});
function resizeHorizontalScroll() {
	ww = $('#horizontalScollParent').width()
	$('#rankHorizontal').css('maxHeight', ww + 'px')
	$('#rankHorizontal').css('marginBottom', -(ww - 100) + 'px')
}
function removeRotateGif() {
	$('.rotate').remove();
}

function removeCover(el) {
	$(el).find('.overCanvas').css('display', 'none');
}
function setCover(el) {
	$(el).find('.overCanvas').css('display', 'block');
}

function closeChartDialog(it) {
	$(it).parent().modal('close');
};
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