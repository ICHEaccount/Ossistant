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
    // 'Create Case' 버튼
    let createButton = document.getElementById('createCaseBtn');

    createButton.addEventListener('click', function(event) {
        event.preventDefault();  

        // let caseName = document.getElementById('caseName').value;
        // if (!caseName.trim()) {
        //     alert('Case Name cannot be empty');
        //     return; // 중단
        // }
            if(validate(caseName) == false){
                showValidate(caseName);
                console.error('hello')
                return;
            }

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
                window.open(`${mainUrl}/casepage/${data.case_id}`, '_blank');
            } else {
                throw new Error('Case ID not returned from server');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    });
});