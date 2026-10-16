async function loadJobs() {

    try {

        const response = await fetch(
            "http://localhost:5000/jobs"
        );

        const jobs = await response.json();

        const tableBody = document.getElementById("tableBody");

        tableBody.innerHTML = "";

        jobs.forEach(job => {

            tableBody.innerHTML += `

                <tr>

                    <td>${job.id}</td>
                    <td>${job.file_name}</td>
                    <td>${job.copies}</td>
                    <td>${job.color_mode}</td>
                    <td>${job.status}</td>

                    <td>

                        <a href="http://localhost:5000/uploads/${job.file_name}" download>

                            Download

                        </a>

                    </td>

                    <td>

                        <button onclick="updateStatus(${job.id}, 'Printing')">

                            Printing

                        </button>

                        <button onclick="updateStatus(${job.id}, 'Completed')">

                            Completed

                        </button>

                        <button onclick="deleteJob(${job.id})">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}


async function updateStatus(id, status) {

    try {

        await fetch(

            `http://localhost:5000/update-status/${id}`,

            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ status })

            }

        );

        loadJobs();

    } catch (err) {

        console.log(err);

    }

}


async function deleteJob(id) {

    try {

        await fetch(

            `http://localhost:5000/delete-job/${id}`,

            {
                method: "DELETE"
            }

        );

        loadJobs();

    } catch (err) {

        console.log(err);

    }

}

loadJobs();