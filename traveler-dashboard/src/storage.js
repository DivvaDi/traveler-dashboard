const STORAGE_KEY = 'traveler-dashboard-v1';
const emptyState = () => ({widgets:[],todos:[],expenses:[]});
export function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return emptyState();const parsed=JSON.parse(raw);return {widgets:Array.isArray(parsed.widgets)?parsed.widgets:[],todos:Array.isArray(parsed.todos)?parsed.todos:[],expenses:Array.isArray(parsed.expenses)?parsed.expenses:[]};}catch{return emptyState();}}
export function saveState(state){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}
