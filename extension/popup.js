document.addEventListener('DOMContentLoaded', function() {
    // 'Create Case' 버튼
    let createButton = document.getElementById('createCaseBtn');

    createButton.addEventListener('click', function(event) {
        event.preventDefault();  // 폼의 기본 제출 동작을 막음

        let caseData = {
            case_name: document.getElementById('caseName').value,
            case_number: document.getElementById('caseNumber').value,
            investigator: document.getElementById('investigator').value,
            description: document.getElementById('description').value
        };

        // 새 사례 생성을 위한 POST 요청
        fetch('http://127.0.0.1:5000/case/createCase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(caseData),
        })
        .then(response => {
            if(response.ok) { 
                console.info("Case created successfully");
                return response.json();
            } else {
                console.error('Failed to create case: ', response.status);
                return Promise.reject('Server responded with an error: ' + response.status);
            }
        })
        .then(data => {
            console.log('Created Case:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // 필요에 따라 새 창을 열거나, 다른 작업을 수행
        window.open('http://127.0.0.1:3000', '_blank');
    });

    // 'Search Case' 입력 
    let searchInput = document.getElementById('searchCaseName');
    let searchResultsDiv = document.getElementById('searchResults');

    searchInput.addEventListener('input', function() {
        fetch('http://127.0.0.1:5000/case/searchCases?query=' + encodeURIComponent(searchInput.value),{
            method: 'GET'})
            .then(response => response.json())
            .then(data => {
                searchResultsDiv.innerHTML = '';  // 이전 결과 지우기
                data.forEach(caseItem => {
                    let p = document.createElement('div');
                    p.classList.add('case-item')
                    p.innerText = caseItem.case_name;
                    p.dataset.caseId = caseItem.case_id;
                    p.addEventListener('click', function() {
                        searchInput.value = caseItem.case_name;
                        searchInput.dataset.caseId = caseItem.case_id;
                    });
                    searchResultsDiv.appendChild(p);
                });
            })
            .catch((error) => {
                console.error('Search Error:', error);
            });
    });

    // 'Continue' 버튼
    let continueButton = document.getElementById('searchCaseBtn');

    continueButton.addEventListener('click', function(event) {
        event.preventDefault();
        let selectedCaseId = searchInput.dataset.caseId;
        if (selectedCaseId) {
            window.open('http://127.0.0.1:3000/casepage/' + selectedCaseId, '_blank');
        } else {
            alert('케이스를 선택해주세요.');
        }
    });
});
