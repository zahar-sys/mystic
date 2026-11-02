'use strict';
const plans = { ChatGPT: ['Go', 'Plus', 'Pro 100', 'Pro 200', 'Pro 500'], Claude: ['Pro', 'Max', 'Ultra'] };
const monthlyPrices = { ChatGPT: { Go: 8, Plus: 20, 'Pro 100': 100, 'Pro 200': 200, 'Pro 500': 500 }, Claude: { Pro: 20, Max: 100, Ultra: 200 } };
const formatPrice = amount => '$' + new Intl.NumberFormat('en-US').format(amount) + ' USD';
const form = document.getElementById('order-form');
if (form) {
  const term = document.getElementById('term');
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  const plan = params.get('plan');
  const validSelection = Object.hasOwn(plans, service) && plans[service].includes(plan);
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = !validSelection;
  term.disabled = !validSelection;
  if (validSelection) {
    document.getElementById('selected-service').textContent = service;
    document.getElementById('selected-plan').textContent = plan;
    const changePlan = document.getElementById('change-plan');
    changePlan.href = service === 'Claude' ? 'claude.html' : 'chatgpt.html';
    changePlan.hidden = false;
    document.getElementById('summary-service').textContent = service;
    document.getElementById('summary-includes').textContent = service === 'Claude'
      ? 'Персональная подписка Claude с доступом к Claude Code. Лимиты зависят от тарифа.'
      : 'Персональная подписка ChatGPT. Доступ к Codex и лимиты зависят от тарифа.';
    document.getElementById('selection-help').hidden = true;
    function updateSummary() {
      const monthly = monthlyPrices[service][plan];
      const months = parseInt(term.value, 10);
      document.getElementById('summary-plan').textContent = plan;
      document.getElementById('summary-term').textContent = `Желаемый период: ${term.value}`;
      document.getElementById('summary-price').textContent = formatPrice(monthly * months);
      document.getElementById('summary-calculation').textContent = `${formatPrice(monthly)} × ${months} мес.`;
      document.getElementById('demo-result').hidden = true;
    }
    updateSummary();
    term.addEventListener('change', updateSummary);
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validSelection) return;
    const result = document.getElementById('demo-result');
    result.textContent = `Тест пройден: ${service} ${plan}, ${term.value}, ${formatPrice(monthlyPrices[service][plan] * parseInt(term.value, 10))}. Ничего не оплачено и не отправлено.`;
    result.hidden = false;
  });
}
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('tr[data-service]').forEach(row => {
      row.hidden = button.dataset.filter !== 'all' && row.dataset.service !== button.dataset.filter;
    });
  });
});

const serviceChoice = document.getElementById('service-choice');
if (serviceChoice) {
  document.querySelectorAll('[data-open-service-choice]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      if (typeof serviceChoice.showModal !== 'function') return;
      event.preventDefault();
      serviceChoice.showModal();
    });
  });
  serviceChoice.addEventListener('click', event => {
    if (event.target !== serviceChoice) return;
    const bounds = serviceChoice.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      serviceChoice.close();
    }
  });
}

// Keep service names readable if an external brand asset cannot load.
document.querySelectorAll('.service-logo').forEach(image => {
  image.addEventListener('error', () => { image.hidden = true; });
});
