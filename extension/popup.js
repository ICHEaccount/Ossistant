document.addEventListener('DOMContentLoaded', function() {
    let button = document.querySelector('input[type="button"]');
    let input = document.querySelector('input[type="text"]');
    

    button.addEventListener('click', function() {
        let inputValue = input.value;
        console.log("Button Clicked!", inputValue);
        
        const requestData = {
            url: inputValue
        };

        // Flask 백엔드로 AJAX 요청 보낼 수 있음.
        fetch('http://127.0.0.1:5005/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
