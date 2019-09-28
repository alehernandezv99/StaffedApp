let checkCriteria = (value, criteria, subject) => {
    let check = 0;
      let message = "";

      if(criteria){
      if(criteria.type === "text"){

        if(criteria.minLength){
        if(!(String(value).length >= criteria.minLength)){
          check = 1;
          message += ` The ${subject} is less than ${criteria.minLength} characters` 
        }
      }

      if(criteria.maxLength){
        if(!(String(value).length <= criteria.maxLength)){
          message += ` The ${subject} is greater than ${criteria.maxLength} characters`;
          check = 1;
        }
      }

      if(criteria.pattern){
        if(criteria.pattern.test(String(value)) === false){
          check = 1
          message += ` The ${subject} contain invalid characters`
        }
      }
    }

      

      if(criteria.type === "number"){
        if(criteria.min){
        if(!(Number(value) >= criteria.min)){
          check = 1;
          message += ` The ${subject} is less than ${criteria.min} dollars` 
        }
      }
      if(criteria.max){
        if(!(Number(value) <= criteria.max)){
          message += ` The ${subject} is greater than ${criteria.max} dollars`;
          check = 1;
        }
      }
      }

      if(criteria.type === "array"){
        if(criteria.min){
        if(!(value.length >= criteria.min)){
          check = 1;
          message += ` There are less than ${criteria.min} ${subject}`
        }

        if(criteria.max){
        if(!(value.length <= criteria.max)){
          check =1;
          message += ` There are more than ${criteria.max} ${subject}`;
        }
      }
      }
    }

  }

    if(check === 0){
      return {
        check:true,
        message:message,
      };
    }else {
      return {
        check:false,
        message:message,
      }
    }

}

export default checkCriteria;