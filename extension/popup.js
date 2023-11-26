//const testUrl = "http://13.209.168.47"
const testUrl = 'http://127.0.0.1'


document.addEventListener('DOMContentLoaded', function() {
    // 'Create Case' 버튼
    let createButton = document.getElementById('createCaseBtn');

    createButton.addEventListener('click', function(event) {
        event.preventDefault();  

        let caseData = {
            case_name: document.getElementById('caseName').value,
            case_number: document.getElementById('caseNumber').value,
            investigator: document.getElementById('investigator').value,
            description: document.getElementById('description').value
        };

        fetch(testUrl+':5000/case/createCase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(caseData),
        })
        .then(response => response.json())  
        .then(data => {
            if(data && data.case_id) {  
                console.info("Case created successfully, ID:", data.case_id);
                chrome.runtime.sendMessage({ caseId: data.case_id }, function(response) {
                    console.log(response); 
                });
                window.open(`${testUrl}:3000/casepage/${data.case_id}`, '_blank');
            } else {
                throw new Error('Case ID not returned from server');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    });

    // 'Search Case' 입력 
    let searchInput = document.getElementById('searchCaseName');
    let searchResultsDiv = document.getElementById('searchResults');

    searchInput.addEventListener('input', function() {
        fetch(testUrl+':5000/case/searchCases?query=' + encodeURIComponent(searchInput.value),{
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
            chrome.runtime.sendMessage({ caseId: selectedCaseId }, function(response) {
                console.log(selectedCaseId); 
            });
            //window.open(testUrl+':3000/casepage/' + selectedCaseId, '_blank');
            window.open(`${testUrl}:3000/casepage/${selectedCaseId}`, '_blank');
        } else {
            alert('케이스를 선택해주세요.');
        }
    });
});