import {UIComponent} from './ui-component.js';

const CATEGORIES = ['Транспорт', 'Жильё', 'Еда', 'Развлечения', 'Покупки', 'Другое'];

export class ExpenseWidget extends UIComponent {
  constructor(id, expenses = []) {
    super(id, 'Расходы', 'expense');
    this.expenses = Array.isArray(expenses) ? expenses : [];
  }

  icon() { return '₽'; }
  subtitle() { return `${this.formatMoney(this.total)} всего`; }
  get total() { return this.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0); }
  formatMoney(value) { return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value) + ' ₽'; }

  render() {
    const card = super.render();
    this.body.innerHTML = `
      <form class="expense-form">
        <div class="form-row">
          <label>Сумма<input name="amount" type="number" min="1" step="1" placeholder="0" required /></label>
          <label>Категория<select name="category">${CATEGORIES.map(category => `<option value="${category}">${category}</option>`).join('')}</select></label>
        </div>
        <label>Комментарий<input name="note" type="text" maxlength="80" placeholder="Например, билет на поезд" /></label>
        <button class="primary-button expense-submit" type="submit">Добавить расход <span>+</span></button>
      </form>
      <div class="expense-summary"><span>Потрачено</span><strong class="expense-total"></strong></div>
      <div class="expense-list"></div>`;
    this.form = this.body.querySelector('form');
    const onSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(this.form);
      const amount = Number(formData.get('amount'));
      if (!Number.isFinite(amount) || amount <= 0) return;
      this.expenses.unshift({
        id: crypto.randomUUID?.() || String(Date.now()),
        amount: Math.round(amount),
        category: String(formData.get('category') || 'Другое'),
        note: String(formData.get('note') || '').trim(),
        createdAt: new Date().toISOString()
      });
      this.form.reset();
      this.paint();
      this.onChange?.();
    };
    this.form.addEventListener('submit', onSubmit);
    this.boundHandlers.push([this.form, 'submit', onSubmit]);
    this.paint();
    return card;
  }

  paint() {
    const totalElement = this.body.querySelector('.expense-total');
    if (totalElement) totalElement.textContent = this.formatMoney(this.total);
    const list = this.body.querySelector('.expense-list');
    if (!list) return;
    list.innerHTML = '';
    if (!this.expenses.length) {
      list.innerHTML = '<p class="empty-expenses">Добавьте первый расход для поездки.</p>';
      this.updateSubtitle();
      return;
    }
    for (const expense of this.expenses.slice(0, 8)) {
      const item = document.createElement('div');
      item.className = 'expense-item';
      const info = document.createElement('div');
      info.className = 'expense-info';
      const category = document.createElement('strong');
      category.textContent = expense.category;
      const note = document.createElement('small');
      note.textContent = expense.note || 'Без комментария';
      info.append(category, note);
      const value = document.createElement('span');
      value.className = 'expense-value';
      value.textContent = `− ${this.formatMoney(expense.amount)}`;
      const remove = document.createElement('button');
      remove.className = 'delete-task';
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Удалить расход ${this.formatMoney(expense.amount)}`);
      const onRemove = () => {
        this.expenses = this.expenses.filter(itemEntry => itemEntry.id !== expense.id);
        this.paint();
        this.onChange?.();
      };
      remove.addEventListener('click', onRemove);
      item.append(info, value, remove);
      list.append(item);
    }
    this.updateSubtitle();
  }

  updateSubtitle() {
    const label = this.element?.querySelector('.widget-header small');
    if (label) label.textContent = `${this.formatMoney(this.total)} всего`;
  }
}
