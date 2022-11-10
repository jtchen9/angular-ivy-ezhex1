import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import cytoscape from 'cytoscape';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ngCytoscapeSample';
  val1: number = 50;
  val2: number = 50;
  val3: number = 50;

  cy: any;
  label: string = 'CoSE';
  layoutJson:any= {
    name: 'cose',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 10,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 20,
    // coolingFactor: 0.95,
    minTemp: 1.0,
    animate: true,
    animationDuration: 5000,
  };


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    var styleJson = this.http.get<any>('assets/cy-style.json');
    var dataJson = this.http.get<any>('assets/data.json');
    var val1Copy = this.val1;
    var val2Copy = this.val2;
    var val3Copy = this.val3;
    var layoutJsonCopy = this.layoutJson;
    combineLatest([styleJson, dataJson]).subscribe(([sty, dat]: any[]) => {
      this.cy = cytoscape({
        container: document.getElementById('cy'),

        layout: this.layoutJson,

        style: sty,

        elements: dat,
      });
      console.log(this.layoutJson);
      this.cy.nodes().on('mouseup', function($event:any) {
        // console.log('tap ' + evt.target.position('x') + ', ' + evt.target.position('y'));
        layoutJsonCopy['gravity'] = 30 * val1Copy;
        layoutJsonCopy['edgeElasticity'] = val2Copy + 1;
        layoutJsonCopy['initialTemp'] = val3Copy / 20;
        // this.cy.layout().stop();
        $event.cy.layout(layoutJsonCopy).run();
        $event.cy.layout(layoutJsonCopy).run();
        $event.cy.layout(layoutJsonCopy).run();}
      );
    });
  }
  randomLayout() {
    // console.log(this.label);
    if (this.label === 'CoSE') {
      this.cy
        .layout({
          name: 'grid',
          animate: true,
          animationDuration: 1000,
        })
        .run();
      this.label = 'Grid';
    } else if (this.label === 'Grid') {
      this.cy
        .layout({
          name: 'random',
          animate: true,
          animationDuration: 1000,
        })
        .run();
      this.label = 'Random';
    } else {
      this.cy.layout(this.layoutJson).run();
      this.label = 'CoSE';
    }
  }
  sliderChange() {
    this.layoutJson['gravity'] = 30 * this.val1;
    this.layoutJson['edgeElasticity'] = this.val2 + 1;
    this.layoutJson['initialTemp'] = this.val3 / 20;
    // this.cy.layout().stop();
    this.cy.layout(this.layoutJson).run();
  }
}
