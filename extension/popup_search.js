const mainUrl = 'http://127.0.0.1:3000'
//const mainUrl = 'http://ossistant.net'
const testUrl = 'http://127.0.0.1'
//const testUrl = 'http://13.209.168.47'

function validate (input) {
    // if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
    //     if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
    //         return false;
    //     }
    // }
    // else {
        if($(input).val().trim() == ''){
            return false;
        }
    //}
}

function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

document.addEventListener('DOMContentLoaded', function() {

    // 'Search Case' 입력 
    let searchInput = document.getElementById('searchCaseName');
    let searchResultsDiv = document.getElementById('searchResults');
    console.error("input", searchInput)
    console.error("result", searchResultsDiv)
    

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
            window.open(`${mainUrl}/casepage/${selectedCaseId}`, '_blank');
        } else {
            showValidate(searchInput);
            return;
        }
    });

});