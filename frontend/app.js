const form = document.getElementById("printForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const file = document.getElementById("file").files[0];

    const copies = document.getElementById("copies").value;

    const colorMode = document.getElementById("colorMode").value;

    const formData = new FormData();

    formData.append("file", file);

    formData.append("copies", copies);

    formData.append("color_mode", colorMode);

    try {

        const response = await fetch(

            "http://localhost:5000/upload",

            {
                method: "POST",
                body: formData
            }

        );

        const data = await response.json();

        alert(data.message);

        form.reset();

    } catch (err) {

        console.log(err);

    }

});