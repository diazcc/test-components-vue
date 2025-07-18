const FormValidators = {
    /**
     * Validates the required fields within a specified container class. 
     * It checks for inputs and selects with the `required` attribute and verifies if they are not empty.
     * If any required field is empty, it adds an "empty" class to the element and returns `false`.
     * If all required fields are filled, it returns `true`.
     *
     * @param {string} className - The class name of the container that holds the form elements to be validated. 
     *                            The class name should be provided without the leading dot (`.`). 
     *                            For example, pass `"form-container"` instead of `".form-container"`.
     * @returns {boolean} Returns `true` if all required fields are filled; otherwise, returns `false`.
     * @throws {Error} Throws an error if the `className` starts with a dot (`"."`).
     * @throws {string} Throws a string error if the class does not exist in the DOM.
     
    */
    getValidationForm(className: string): boolean {
        /**
         * todo               STRUCTURE INFORMATION NECESSARY
         *
         *     todo  ---->  ul.className>li>input{required},select{required}
         */
        if (className[0] == ".") {
          throw new Error(
            'The property cannot start with " . ", just write the name without " . " ---  store.getValidationForm(property)'
          );
        }
        let state: boolean = true;
        const fieldsContainers = document.querySelectorAll("." + className);
        if (!fieldsContainers.length) {
          throw "The class name doesnt exist on DOM. by @getValidationForm on fomrValidators";
        }
        fieldsContainers.forEach((fieldsContainer: Element): void => {
          const inputsAndSelects = fieldsContainer.querySelectorAll(
            "input[required], select[required]"
          );
          console.log(inputsAndSelects);
          
          inputsAndSelects.forEach((field: any) => {
            field.classList.remove("empty");
            if (!field.value.trim()) {
              state = false;
              field.classList.add("empty");
            }
          });
        });
        return state;
    },
    /**
     * Removes the "disabled" property from all form elements (inputs and selects) inside the specified container.
     * 
     * This function takes a class name, finds all elements with that class, and removes the `disabled` 
     * attribute from any `input` or `select` elements within those containers. It also adds a temporary 
     * visual effect (light blue color) to indicate that the element has been enabled.
     * 
     * @param {string} className - The class name of the container element(s) that contain the form fields.
     * @returns {boolean} - Returns `true` if at least one element was found and modified, `false` otherwise.
     * 
     * @throws {Error} - Throws an error if the `className` starts with a dot ("."). 
     *                    The class name should be provided without the dot, e.g., `className: 'my-class'`.
    */
    removeDisabledFromForm(className: string): boolean {
        if (className[0] == ".") {
          throw new Error(
            'The property cannot start with " . ", just write the name without " . " --- store.removeDisabledFromForm(property)'
          );
        }
    
        const fieldsContainers = document.querySelectorAll("." + className);
        if (!fieldsContainers.length) {
          return false;
        }
    
        fieldsContainers.forEach((fieldsContainer: Element): void => {
          const inputsAndSelects = fieldsContainer.querySelectorAll(
            "input[disabled], select[disabled]"
          );
          inputsAndSelects.forEach((field: any) => {
            field.disabled = false;
            field.classList.add("appear-light-blue");
    
            setTimeout(() => {
              field.classList.remove("appear-light-blue");
            }, 400);
          });
        });
    
        return true;
    },

    trimInputField(event: Event, field: string, model: Record<string, any>) {
      const target = event.target as HTMLInputElement;
      let value = target.value.trimEnd();
  
      // Update the model and input value
      target.value = value;
      model[field] = value;  //  Form Object, Example : "dataCreateUserForm" "dataCreateDependenceForm
    },

    validateEmail(event: Event, field: string, model: Record<string, any>) {
      const target = event.target as HTMLInputElement;
      let value = target.value;

      value = value.toLocaleLowerCase();
      value = value.replace(/[^a-z0-9@\\/.:_-]/g, '');
      value = value.trim();

      target.value = value;
      model[field] = value;   //  Form Object, Example : "dataCreateUserForm" "dataCreateDependenceForm"
    },

    validateOnlyLetters(event: Event, field: string, model: Record<string, any>) {
      const target = event.target as HTMLInputElement;
      let value = target.value.toString();

      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      value = value.trimStart();

      target.value = value;
      model[field] = value;   

    },
    /**
     * Disables all form fields (input, select, option) inside the elements that match the specified class name. 
     * This function throws an error if the  provided class name starts with a period (`"."`).
     * 
     * @param {string} className - The class name of the container elements that  hold the form fields. The class 
     * 							   name should not start with a period (`"."`).
     * 
     * @returns {boolean} - Returns `true` if the fields were successfully disabled, or `false` if no matching 
     * 						elements were found.
     * 
     * @throws {Error} - Throws an error if the provided class name starts with a period (`"."`).
    */
    disableAllFields(className: string): boolean {
        if (className[0] == ".") {
          throw new Error(
            'The property cannot start with " . ", just write the name without " . " --- store.disableAllFields(property)'
          );
        }
    
        const fieldsContainers = document.querySelectorAll("." + className);
        if (!fieldsContainers.length) {
          return false;
        }
    
        fieldsContainers.forEach((fieldsContainer: Element): void => {
          const inputsAndSelects =
            fieldsContainer.querySelectorAll("input, select, option");
          inputsAndSelects.forEach((field: any) => {
            field.disabled = true;
          });
        });
    
        return true;
    },
    /**
     * Strips leading and trailing whitespace, newline, and carriage return characters from the provided text and 
     * replaces any multiple spaces within the text with a single space. The result is a cleaned-up version of the 
     * original text.
     * 
     * @param {string} text - The text string to be cleaned.
     * 
     * @returns {string} - Returns a new string with leading/trailing whitespace removed and any extra spaces 
     * 					   replaced with a single space.
    */
    stripText(text: string): string {
          return text.replace(/^[\n\r\s]+|[\n\r\s]+$|[\s]+/g, ' ').trim();
    },
}

export default FormValidators;