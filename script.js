let people = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expenseForm');
    form.addEventListener('submit', handleFormSubmit);

    const calculateButton = document.getElementById('calculateButton');
    calculateButton.addEventListener('click', calculateSplit);
});

function handleFormSubmit(event) {
    event.preventDefault();
    addPerson();
}

function addPerson() {
    const nameInput = document.getElementById('personName');
    const amountInput = document.getElementById('personAmount');
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (name && !isNaN(amount) && amount >= 0) {
        people.push({ name, amount });
        updatePeopleList();
        nameInput.value = '';
        amountInput.value = '';
        nameInput.focus();
    } else {
        alert('Por favor, ingrese un nombre y una cantidad válida.');
    }
}

function updatePeopleList() {
    const list = document.getElementById('peopleList');
    list.innerHTML = '';
    people.forEach((person, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${person.name}: $${person.amount.toFixed(2)}</span>
            <button onclick="deletePerson(${index})" aria-label="Eliminar ${person.name}">Eliminar</button>
        `;
        list.appendChild(li);
    });
}

function deletePerson(index) {
    people.splice(index, 1);
    updatePeopleList();
}

function calculateSplit() {
    if (people.length === 0) {
        alert('Por favor, agregue al menos una persona.');
        return;
    }

    const total = people.reduce((sum, person) => sum + person.amount, 0);
    const average = total / people.length;
    const results = document.getElementById('results');
    results.innerHTML = `
        <h2>Resultados:</h2>
        <p>Total gastado: $${total.toFixed(2)}</p>
        <p>Promedio por persona: $${average.toFixed(2)}</p>
        <h3>Ajustes:</h3>
    `;

    const debtors = [];
    const creditors = [];

    people.forEach(person => {
        const difference = person.amount - average;
        if (difference > 0) {
            creditors.push({ ...person, credit: difference });
            results.innerHTML += `<p>${person.name} debe recibir: $${difference.toFixed(2)}</p>`;
        } else if (difference < 0) {
            debtors.push({ ...person, debt: -difference });
            results.innerHTML += `<p>${person.name} debe pagar: $${Math.abs(difference).toFixed(2)}</p>`;
        } else {
            results.innerHTML += `<p>${person.name} está en equilibrio</p>`;
        }
    });

    results.innerHTML += `<h3>Pagos:</h3>`;

    while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[0];
        const creditor = creditors[0];
        const amount = Math.min(debtor.debt, creditor.credit);

        results.innerHTML += `<p>${debtor.name} debe pagarle $${amount.toFixed(2)} a ${creditor.name}</p>`;

        debtor.debt -= amount;
        creditor.credit -= amount;

        if (debtor.debt === 0) debtors.shift();
        if (creditor.credit === 0) creditors.shift();
    }
}