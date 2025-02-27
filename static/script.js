document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("downloadBtn");
    const loading = document.getElementById("loading");
    const listaDiv = document.getElementById("listaResultados");
    const resultadosDiv = document.getElementById("resultados");

    function enviarDados() {
        const users = document.getElementById("users").value.split("\n").map(u => u.trim()).filter(u => u);
        const meta_xp = document.getElementById("meta_xp").value;

        if (users.length === 0 || !meta_xp) {
            alert("⚠ Preencha todos os campos antes de continuar.");
            return;
        }

        // Oculta o botão de download e exibe o loader
        downloadBtn.classList.add("hidden");
        loading.classList.remove("hidden");
        resultadosDiv.classList.add("hidden"); // Esconde a div de resultados antes de carregar

        fetch("/processar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ users: users, meta_xp: meta_xp })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loading.classList.add("hidden");

            if (data.file_url) {
                downloadBtn.href = data.file_url;
                downloadBtn.classList.remove("hidden"); // Exibe o botão de download
            }

            if (data.dados && data.dados.length > 0) {
                mostrarListaXP(data.dados);
                resultadosDiv.classList.remove("hidden"); // Mostra a div de resultados
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Ocorreu um erro ao processar os dados.");
            loading.classList.add("hidden");
        });
    }

    function mostrarListaXP(dados) {
        listaDiv.innerHTML = ""; // Limpa o conteúdo anterior

        let table = `<table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-4">
            <thead>
                <tr class="bg-gray-200 dark:bg-gray-700">
                    <th class="border border-gray-300 dark:border-gray-600 px-4 py-2">Usuário</th>
                    <th class="border border-gray-300 dark:border-gray-600 px-4 py-2">XP Inglês</th>
                    <th class="border border-gray-300 dark:border-gray-600 px-4 py-2">Meta XP</th>
                </tr>
            </thead>
            <tbody>`;

        dados.forEach(user => {
            table += `<tr>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${user["Usuário"]}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${user["XP Inglês"] ?? "N/A"}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${user["Meta XP"]}</td>
            </tr>`;
        });

        table += `</tbody></table>`;
        listaDiv.innerHTML = table;
    }

    // Adiciona o evento ao botão apenas quando o DOM estiver carregado
    document.querySelector("button").addEventListener("click", enviarDados);
});

