import {ToDoWidget} from './todo-widget.js';
import {WeatherWidget} from './weather-widget.js';
import {CurrencyWidget} from './currency-widget.js';
import {ExpenseWidget} from './expense-widget.js';
export class Dashboard{
  constructor(container,{widgets=[],todos=[],expenses=[]}={},onChange=()=>{}){this.container=container;this.widgets=new Map();this.todos=todos;this.expenses=expenses;this.onChange=onChange;this.types={todo:{label:'Задачи'},weather:{label:'Погода'},currency:{label:'Курс валют'},expense:{label:'Расходы'}};for(const saved of widgets)this.addWidget(saved.type,saved.id,saved.collapsed,true);}
  addWidget(type,id=crypto.randomUUID?.()||`${type}-${Date.now()}`,collapsed=false,silent=false){if(!this.types[type]||this.hasType(type)){if(!silent)this.notify(`Виджет «${this.types[type]?.label||type}» уже добавлен`);return null;}let widget;if(type==='todo')widget=new ToDoWidget(id,this.todos);if(type==='weather')widget=new WeatherWidget(id);if(type==='currency')widget=new CurrencyWidget(id);if(type==='expense')widget=new ExpenseWidget(id,this.expenses);widget.collapsed=collapsed;widget.onChange=()=>this.onChange();widget.onRemove=()=>this.removeWidget(widget.id);this.widgets.set(widget.id,widget);const element=widget.render();this.container.append(element);if(collapsed)element.classList.add('is-collapsed');if(!silent)this.onChange();return widget;}
  hasType(type){return [...this.widgets.values()].some(widget=>widget.type===type)}
  removeWidget(id){const widget=this.widgets.get(id);if(!widget)return;widget.destroy();this.widgets.delete(id);this.onChange();}
  getSnapshot(){return {widgets:[...this.widgets.values()].map(widget=>({id:widget.id,type:widget.type,collapsed:widget.collapsed})),todos:this.todos,expenses:this.expenses};}
  notify(message){this.onNotice?.(message);}
}
