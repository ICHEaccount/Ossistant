document.addEventListener('DOMContentLoaded', function() {
    let createButton = document.getElementById('createCaseBtn');

    createButton.addEventListener('click', function() {
        let caseData = {
            case_name: document.getElementById('caseName').value,
            case_number: document.getElementById('caseNumber').value,
            investigator: document.getElementById('investigator').value,
            description: document.getElementById('description').value
        };

        fetch('http://127.0.0.1:5000/case/createCase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(caseData),
        })
        .then(response => {
            console.error('response', response)
            if(response.data) { 
                console.info("success")
            } else {
                console.error('Failed to send data to server');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        window.open('http://127.0.0.1:3000', '_blank');
    });
});
