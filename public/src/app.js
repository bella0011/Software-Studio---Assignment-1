{   
    /**
     * Populates a data table with some data.
     * @param {HTMLDivElement} root 
     */
    async function updateTable(root) {
        root.querySelector(".table-refresh__button").classList.add("table-refresh__button--refreshing");

        const table = root.querySelector(".table-refresh__table");
        const response = await fetch(root.dataset.url);
        const data = await response.json();
        
        //Clear table
        table.querySelector("thread tr").innerHTML = "";
        table.querySelector("tbody").innerHTML = "";

        //Populate headers
        for(const header of data.headers) {
            table.querySelector("thread tr").insertAdjacentHTML("beforeend", `<th>${ header }`);
        }

        //Populate rows
        for (const row of data.rows) {
            table.querySelector("tbody").insertAdjacentHTML("beforeend", `
            <tr>
                ${ row.map(col => `<td>${ col }</td>`).join("") }
            </tr>
            `);
        }
    }

    for (const root of document.querySelectorAll(".table-refresh[data-url]")) {
        const table = document.createElement("table");
        const options = document.createElement("div");

        table.classList.add("table-refresh__table");
        options.classList.add("table-refresh__table");

        table.innerHTML = `
            <thead>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <td>Loading</td>
                </tr>
            </tbody>
        `;

        options.innerHTML = `
            <span class="table-fresh__label">Last Update: never</span>
            <button type="button" class="table-refresh__button">
                <i class="material-icons">refresh</i>
            </button>
        `;

        root.append(table, options);

        options.querySelector(".table-refresh__button").addEventListener("click", () => {
            updateTable(root);
        })

        updateTable(root);
    }
}