import axios from "axios";
import { nextTick } from "vue";

const UtilsServices = {
    /**
     * Generates a gradient of colors between a start and an end color.
     * The number of colors generated is determined by the numColors parameter.
     *
     * @param {number} numColors - The number of colors to generate in the gradient.
     * @param {Array<number>} startColor - The starting color represented as an array of RGB values ([r, g, b]).
     * @param {Array<number>} endColor - The ending color represented as an array of RGB values ([r, g, b]).
     * 
     * @returns {Array<string>} An array of RGB color strings in the format 'rgb(r, g, b)'.
    */
    colorGenerator(numColors: any, startColor: any, endColor: any): any {
        
        let colors = [];
        for (let i = 0; i < numColors; i++) {
          const ratio = i / (numColors - 1);
          const r = Math.round(
            startColor[0] + (endColor[0] - startColor[0]) * ratio
          );
          const g = Math.round(
            startColor[1] + (endColor[1] - startColor[1]) * ratio
          );
          const b = Math.round(
            startColor[2] + (endColor[2] - startColor[2]) * ratio
          );
          colors.push(`rgb(${r}, ${g}, ${b})`);
        }
        return colors;
    },
    /**
     * Highlights the verb in a sentence based on the specified language structure.
     * It wraps the verb in a `<span>` element with custom styles and colors.
     * 
     * @param {Object} options - The options to configure the function.
     * @param {string} [options.inputString=''] - The sentence where the verb should be highlighted.
     * @param {string} [options.languageStructure='verb_at_second'] - Defines the sentence structure to locate the verb:
     *    - 'verb_at_second': Assumes the verb is the second word (subject verb predicate).
     *    - 'verb_at_end': Assumes the verb is the last word.
     *    - 'verb_with_auxiliar': Assumes the verb is the second word (subject auxiliary verb predicate).
     * @param {string} [options.color='red'] - The color to apply to the highlighted verb.
     * @param {string} [options.style='font-weight: bold;'] - Additional CSS styles to apply to the highlighted verb.
     * 
     * @returns {string} The input sentence with the verb highlighted in a `<span>` element.
    */
    highlightVerbForPastSentences({inputString = '', languageStructure = 'verb_at_second', color = 'red', style = 'font-weight: bold;'} = {}) { //Needs to find other form because the building of sentences is different for every language. Maybe add a format for phrases on BD and then just highlighted the verb
        let words: any = inputString.split(/(\s+|[.,!?])/);
        let size: any = words.length
        switch(languageStructure){
          case 'verb_at_second': // this type of structure is for languages where thes structure of a sentences is "subject verb predicated" 
            words[0] = `<span style="color: ${color}; ${style}">${words[0]}</span>`;
            break;
          case 'verb_at_end': 
            words[size-1] = `<span style="color: ${color}; ${style}">${words[size-1]}</span>`;
            break;
          case 'verb_with_auxiliar':
            words[1] = `<span style="color: ${color}; ${style}">${words[1]}</span>`;
            break
        }
        return words.join(" ");
    },
    /**
     * Determines a status color based on the percentage value and the status provided.
     * This function returns a color class name based on different conditions regarding
     * the percentage and the status.
     * 
     * @param {string} numberPercentage - The percentage value as a string (e.g., '50%', '75%').
     * @param {string} status - The status to check. Could be one of 'APPROVED', 'SIGNED', or other status values.
     * 
     * @returns {string|null} The corresponding color class based on the percentage and status:
     *    - 'status-green' for approved or signed statuses.
     *    - 'status-yellow' if percentage is not a number or is between 0 and 70 (excluding 70).
     *    - 'status-black' for 100% percentage with a status that is not 'APPROVED'.
     *    - 'status-red' for percentage between 70 and 100 (excluding 100).
     *    - `null` if no condition is met.
    */
    getColorByPercentage(numberPercentage: string, status: string) {
        let ans = null;
        const percentage = numberPercentage
          ? parseFloat(numberPercentage.replace("%", ""))
          : NaN;
        if (status === "APPROVED" || status === "SIGNED") {
          ans = "status-green";
        } else if (isNaN(percentage)) {
          ans = "status-yellow";
        } else if (percentage === 100 && status !== "APPROVED") {
          ans = "status-black";
        } else if (percentage >= 0 && percentage < 70) {
          ans = "status-yellow";
        } else if (percentage >= 70 && percentage < 100) {
          ans = "status-red";
        }
        return ans;
    },
    /**
     * Generates a sequence of colors forming a rainbow-like gradient starting from a given color.
     * The function works by adjusting the hue value of the starting color in HSL format to create a smooth color transition.
     * 
     * @param {string} startColor - The starting color in hexadecimal format (e.g., '#ff0000' for red).
     * @param {number} numColors - The number of colors to generate in the gradient.
     * 
     * @returns {Array<string>} An array of colors in HSL format, creating a rainbow-like gradient.
    */
    rainbowColorGenerator(startColor: string, numColors: any): any {
        const colors = [];
    
        // convert initial color to HSL
        const hsl = hexToHSL(startColor); // start color is asumed to be in hex format
    
        for (let i = 0; i < numColors; i++) {
          // new matriz calculation
          const hue = (hsl.h + i * (360 / numColors)) % 360;
          const color = `hsl(${hue}, ${hsl.s}%, ${hsl.l}%)`;
          colors.push(color);
        }
    
        return colors;
    },
    /**
     * Changes the CSS custom properties (CSS variables) in the document's root element (`:root`).
     * This function accepts an object where the keys represent the CSS custom property names
     * (using underscores instead of dashes), and the values represent the corresponding color values.
     * The function then updates the CSS variables on the `:root` element to reflect the new color values.
     * 
     * @param {Object} colorObject - An object containing key-value pairs representing CSS variables.
     *        The keys should be in the format with underscores (e.g., `primary_color`), and the values
     *        should be valid CSS color values (e.g., `#ff0000` for red).
    */
    changeColor(colorObject: any) {
        for (let key in colorObject) {
          let property = key.replace(/_/g, "-");
          document.documentElement.style.setProperty(property, colorObject[key]);
        }
    },
    /**
     * Handles a scroll event by iterating over a list of data results and setting the `isMenuOpen` 
     * property of each item to `false`.
     * This function is typically used to close menu items or reset their state when a scroll event occurs.
     * 
     * @param {Array} dataResults - An array of objects where each object represents a menu item or 
     *        a similar entity with an `isMenuOpen` property.
     *        The function will set `isMenuOpen` to `false` for every item in this array.
    */ 
    handleScroll(dataResults: any) {
        dataResults.forEach((data: any) => {
          data.isMenuOpen = false;
        })
    },
    /**
     * Toggles the `isMenuOpen` state of a specific menu item and ensures that only one menu is open at a time.
     * If any menu is already open in the `dataResults` array, it will close all other menus before toggling 
     * the selected item's state. It also emits custom events and checks for menu overflow after the toggle action.
     * 
     * @param {Object} item - The menu item that is being toggled. It should have an `isMenuOpen` property 
     *        and other necessary data such as `filings`.
     * @param {Event} event - The event object associated with the action that triggered the toggle (e.g., a click event).
     * @param {number} index - The index of the menu item in the `dataResults` array, used to check for overflow.
     * @param {Array} dataResults - An array of menu items where each item has an `isMenuOpen` property indicating 
     *        if the menu is currently open or closed.
    */
    toggleMenu(item: any, event: any, index: any, dataResults: any) {
        if (dataResults.some((data: any) => data.isMenuOpen)) {
          dataResults.forEach((data: any) => {
            data.isMenuOpen = false;
          })
        }
        item.isMenuOpen = true;
        // emits("codeFiling", item.filings[item.filings.length - 1].filing_code);
        // emits("filingSelectedMenu", item.filings[item.filings.length - 1]);
        event.stopPropagation();
        nextTick(() => {
          checkMenuOverflow(index);
        });
    },
    /**
     * Adjusts the height of a textarea based on its content, with a maximum height limit.
     * 
     * This function dynamically adjusts the height of a textarea element, increasing its height
     * to fit the content until a specified `maxHeight` is reached. Once the content height exceeds 
     * the maximum height, the textarea will stop growing and will be restricted to the given 
     * `maxHeight` value.
     * 
     * @param {Element} target - target textarea element.
     * @param {number} maxHeight - The maximum height (in pixels) that the textarea is allowed to grow.
     * @param {number} defaultSize - The defaultSize height (in pixels) that the textarea is allowed to grow.
     * 
     * @returns {number} The calculated height of the textarea after adjustment.
    */
    adjustHeight(target: any, maxHeight: any, defaultSize: any = null) {
      const textarea = target;
      textarea.style.height = 'auto';
      defaultSize = defaultSize ? defaultSize : textarea.scrollHeight;
      const height = Math.min(defaultSize, maxHeight);
      textarea.style.height = `100%`;
      return height
    },
    /**
     * Simulates a typing effect by gradually adding characters to the `objToChange.answer` property.
     * 
     * This function simulates typing by adding one character from the `message` string to the 
     * `objToChange.answer` property at a specified interval (`speed`). It continues until the 
     * entire message has been typed out. Once the message is fully displayed, the typing effect stops.
     * 
     * @param {string} message - The message string that will be "typed out".
     * @param {Object} objToChange - The object whose `answer` property will be updated with the typed characters.
     * @param {number} speed - The interval (in milliseconds) between each character being typed.
     * @param {string} chatContainerClass - The class of the elemet that contains the message for automatic scroll.
    */
    startTypingEffect(message: any, objToChange: any, speed: any, chatContainerClass: any = null) {
      let i: any = 0;
      objToChange.answer = "";
      const chatContainer: any = chatContainerClass ? document.querySelector(`.${chatContainerClass}`) : false;
      
      const interval = setInterval(() => {
        if (i < message.length) {
          objToChange.answer += message[i];
          i++;
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        } else {
          clearInterval(interval); 
        }
      }, speed);
    },
    sortArrayOfObjectsByProperty(array: any, property: any, order: any = 'asc') {
      array.sort((a: any, b: any) => {
        const valorA = getValue(a, property);
        const valorB = getValue(b, property);

        if (valorA === undefined) return 1;
        if (valorB === undefined) return -1;
      
        if (typeof valorA === 'string' && typeof valorB === 'string') {
          if (order === 'asc') return valorA.localeCompare(valorB); // Orden alfabético
          else return -valorA.localeCompare(valorB); // Orden alfabético
        }
        if (order === 'asc') return valorA - valorB; // Orden numérico
        return valorB - valorA; // Orden numérico
      })
      return array;
    },
    sortArrayOfObjectsByMultipleValuesFilteredByProperty(array: any, arrayForFiltering: any, property: any) {
      return array.filter((obj: any) => {
        let value: any = getValue(obj, property);
        return arrayForFiltering.includes(value)
      })
    },
    async creatingOptionsForFilters(array: any, property: any) {
      let ans: any = {};
      array.forEach((element: any) => {
        let value = getValue(element, property);
        ans[value] = ans[value] || true;
      })
      return await Object.keys(ans).map((value: any) => {
        return {
          text: value,
          value: value,
          checked: false
        }
      });
    },
    getConectionRender(){
      return axios.get('/check-connection')
      .then((response:any)=>{
          console.log("✅ Conexión exitosa con Render y Firestore",response);

      })
      .catch((error:any)=>{
          console.warn("⚠️ Backend responde, pero hay error en Firestore:", error);

      });

    },
    capitalizeFirstLetter(text: string): string {
      let ans: any = text;
      if (ans) {
       ans = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }
      return ans;
  }
};

// Auxiliar functions

/**
 * Converts a color from hexadecimal (HEX) format to HSL (Hue, Saturation, Lightness) format.
 * The function extracts the red, green, and blue components from the HEX color and 
 * then calculates the hue, saturation, and lightness values.
 * 
 * @param {string} hex - The color in hexadecimal format (e.g., '#ff0000' for red).
 * 
 * @returns {Object} An object containing the HSL representation of the color:
 *    - `h`: The hue value (0 to 360 degrees).
 *    - `s`: The saturation value (0 to 100%).
 *    - `l`: The lightness value (0 to 100%).
*/
function hexToHSL(hex: any) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let s,
      l = (max + min) / 2;
    let h = (max + min) / 2;
    if (max === min) {
      h = s = 0; // Achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h = h / 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
};

/**
 * Checks if a menu (identified by its `index`) overflows beyond the bottom edge of a table container.
 * If the menu is overflowing, it adjusts the menu's position to ensure it remains fully visible within the table.
 * 
 * @param {number} index - The index of the menu within its container. Used to select the specific menu element
 *        in the DOM (identified by `table__row__cell__menu-{index}`).
*/ 
const checkMenuOverflow = (index: any) => {
    const elementMenu: any = document.getElementById(`table__row__cell__menu-${index}`);
    const flexTable: any = document.querySelector('.table');
  
    if (elementMenu && flexTable) {
      const menuRect = elementMenu.getBoundingClientRect();
      const flexTableRect = flexTable.getBoundingClientRect();
      
      if (menuRect.bottom > flexTableRect.bottom) {
        const overflowAmount = menuRect.bottom - flexTableRect.bottom;
        elementMenu.style.top = `calc(0% - ${overflowAmount + 10}px)`;
      }
    }
};

function getValue(obj: any, property: any) {
  return property.split('.').reduce((acc: any, part: any) => acc && acc[part], obj);
}




export default UtilsServices;