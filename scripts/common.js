// 웹주소 파라미터가져오기 (?&이 있을경우)
function getQueryParam(param) {
    // 인자시작 ?, 중간인자 &
	let result =  window.location.search.match(
	   new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
	);
	
	if (result) {
	    return result[3];
	}
	else {
	    return ""; 
	};
	 
};


// 웹주소 파라미터가져오기 (해시주소포함 #에 유의)
function getQueryHashParam(param) {
    let rx = new RegExp("[?&#]" + param + "=([^&]+).*$");
    let returnVal = window.location.href.match(rx);
    return returnVal === null ? "" : decodeURIComponent(returnVal[1].replace(/\+/g, " "));
};


// 토큰 초기화 이후에 홈으로 이동 
function  resetTokenAndGoHome() {
	localStorage.removeItem("id_token_decoded_value");
	localStorage.removeItem("access_Token_Value"); 
	// 메인화면 으로 이동 (접속토큰 삭제)
	location.replace("/");
}; 


// 메시지체크후 홈이동 
function checkMessageGoHome(paramResponse) {
	if ( paramResponse.statusText === "Unauthorized"   ) {
		// console.log("API-A1 status=" + paramResponse.status + " / statusText=" + paramResponse.statusText ); 
		alert("인증되지 않은 상태이거나 사용자 세션이 종료되었습니다.  초기화면으로 이동합니다!"); 
		resetTokenAndGoHome();
	}  
	else if ( paramResponse.statusText === "Forbidden"  ) {
		// console.log("API-A2 status=" + paramResponse.status + " / statusText=" + paramResponse.statusText ); 
		alert("접근이 불가합니다. 초기화면으로 이동합니다!"); 
		resetTokenAndGoHome();
	}
	else {
		// console.log("API-A3 status=" + paramResponse.status + " / statusText=" + paramResponse.statusText ); 
		alert("초기화면으로 이동합니다!"); 
		resetTokenAndGoHome();
	}; 
}; 
