import {Dashboard} from './dashboard.js';
import {loadState,saveState} from './storage.js';
const grid=document.querySelector('#dashboard-grid');const empty=document.querySelector('#empty-state');const notice=document.querySelector('#notice');const state=loadState();
const dashboard=new Dashboard(grid,state,()=>{save();renderState();});dashboard.onNotice=(message)=>{notice.textContent=message;notice.classList.add('show');clearTimeout(window.__noticeTimer);window.__noticeTimer=setTimeout(()=>notice.classList.remove('show'),2200);};
for(const button of document.querySelectorAll('[data-add-widget]'))button.addEventListener('click',()=>dashboard.addWidget(button.dataset.addWidget));
function save(){if(!saveState(dashboard.getSnapshot()))dashboard.onNotice?.('Не удалось сохранить данные на устройстве');}
function renderState(){const count=dashboard.widgets.size;empty.hidden=count>0;grid.hidden=count===0;}
function updateClock(){const now=new Date();document.querySelector('#clock').textContent=new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'}).format(now);const hour=now.getHours();const greeting=hour<5?'Доброй ночи':hour<12?'Доброе утро':hour<18?'Добрый день':'Добрый вечер';document.querySelector('#date-heading').textContent=greeting;}
renderState();updateClock();setInterval(updateClock,30000);
