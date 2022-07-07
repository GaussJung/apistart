// Input Validation 
const getInputData = () => {

  const getId = document.getElementById("inputId").value;
  const getPhone =  document.getElementById("inputPhone").value; 
  const getName = document.getElementById("inputName").value;

  const idRole = /^[0-9]{4,8}$/gi;
  const phoneRole = /^[0-9]{10,11}$/gi;

  if ( idRole.test(getId) === false ) {
    alert("ID는 숫자 4자 ~ 8자까지 입니다.");
    return false;
  }
  else if ( parseInt(getId) < 1000 ) {
    alert("ID는 1000이상의 번호로 입력해 주세요!");
    return false;
  };

 
  if (getName.length > 30 || getName.length < 3) {
    alert("이름은3자 ~ 30자까지 입니다.");
    return false;
  };

  if ( phoneRole.test(getPhone) === false ) {
    alert("전화번호는 숫자만 10~11자로 입력해 주세요.");
    return false;
  };
 
  return {
    id: getId,
    phonenum: getPhone,
    name: getName
  };

};

