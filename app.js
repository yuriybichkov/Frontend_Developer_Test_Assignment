(async () => {

    async function getInvoices() {
        const response = await fetch('http://localhost:3000/invoices');
        return response.json();
    }

    let invoices = await getInvoices();

    const create = document.getElementById('createBtn');
    const modal = document.getElementById('modal');
    const form = document.getElementById('form');

    const formNumber = document.getElementById('number');
    const formDateCreated = document.getElementById('date_created');
    const formDateSupplied = document.getElementById('date_supplied');
    const formComment = document.getElementById('comment');

    console.log(invoices);

    function render(invoices) {

        const tableBody = document.getElementById('invoice-tbody');
        let dataHtml = '';

        for (let invoice of invoices) {
            dataHtml += `<tr id="${invoice._id}">
                 <td>${invoice.date_created}</td>
                 <td>${invoice.number}</td>
                 <td>${invoice.date_supplied}</td>
                 <td>${invoice.comment}</td>
                 <td><button name="edit" id="${invoice._id}">Edit</button>
                 <button name="del" id="${invoice._id}">Delete</button></td>
                 </tr>`;
            tableBody.innerHTML = dataHtml;
        }
    }

    render(invoices);


    document.querySelector('tbody')
        .addEventListener('click', async evt => {
            const btn = evt.target;
            if (btn.name === 'del') {
                await fetch(`http://localhost:3000/invoices/${btn.id}`, {
                    method: 'DELETE'
                });
            } else if (btn.name === 'edit') {
                modal.style.display = 'block';
                for (let invoice of invoices) {
                    console.log(invoice._id,invoice.comment);
                    if (invoice._id === btn.id) {
                        formNumber.setAttribute('value', `${invoice.number}`);
                        formDateCreated.setAttribute('value', `${invoice.date_created}`);
                        formDateSupplied.setAttribute('value', `${invoice.date_supplied}`);
                        formComment.innerText = `${invoice.comment}`;
                    }
                }

                form.addEventListener('submit',  evt => {
                    evt.preventDefault();
                    modal.style.display = 'none';

                    let number = document.forms['form'].elements['number'].value;
                    let dateCreated = document.forms['form'].elements['date_created'].value;
                    let dateSupplied = document.forms['form'].elements['date_supplied'].value;
                    let comment = document.forms['form'].elements['comment'].value;

                    const obj = {
                        number: number,
                        date_created: dateCreated,
                        date_supplied: dateSupplied,
                        comment: comment
                    };

                     fetch(`http://localhost:3000/invoices/${btn.id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(obj),
                        headers: {
                            'content-type': 'application/json'
                        }
                    });
                });
            }

            invoices = await getInvoices();
            console.log(invoices);
            await render(invoices)
        });

    create.addEventListener('click', evt => {
        modal.style.display = 'block';
    });


    form.addEventListener('submit', async evt => {
        evt.preventDefault();
        modal.style.display = 'none';

        let number = document.forms['form'].elements['number'].value;
        let dateCreated = document.forms['form'].elements['date_created'].value;
        let dateSupplied = document.forms['form'].elements['date_supplied'].value;
        let comment = document.forms['form'].elements['comment'].value;

        const obj = {
            number: number,
            date_created: dateCreated,
            date_supplied: dateSupplied,
            comment: comment
        };

        await fetch('http://localhost:3000/invoices', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'content-type': 'application/json'
            }
        });

        invoices = await getInvoices();
        console.log(invoices);
        await render(invoices)

    });

})();